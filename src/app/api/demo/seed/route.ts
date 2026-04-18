import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { demoCategories, demoRooms, demoServices } from "@/lib/demo-data"
import { encryptJson } from "@/lib/crypto"
import { RequestStatus } from "@prisma/client"

export async function POST() {
  try {
    const user = await requireSessionUser()
    const hotelId = user.hotelId!
    const hotelCodeSuffix = hotelId.slice(-6).toUpperCase()

    const result = await prisma.$transaction(async (tx) => {
      const buildUniqueRoomCode = async (baseCode: string) => {
        let candidate = `${baseCode}-${hotelCodeSuffix}`
        let attempt = 0

        while (attempt < 10) {
          const exists = await tx.room.findUnique({
            where: { code: candidate },
            select: { id: true },
          })

          if (!exists) {
            return candidate
          }

          attempt += 1
          candidate = `${baseCode}-${hotelCodeSuffix}-${attempt}`
        }

        throw new Error("Failed to create unique room code for demo seed")
      }

      const existingCategories = await tx.category.findMany({
        where: { hotelId },
        select: { id: true, slug: true },
      })

      const slugToCategory = new Map<string, string>()
      existingCategories.forEach((cat) => slugToCategory.set(cat.slug, cat.id))

      const roots = demoCategories.filter((c) => !c.parentSlug)
      const children = demoCategories.filter((c) => c.parentSlug)

      for (const category of roots) {
        if (!slugToCategory.has(category.slug)) {
          const created = await tx.category.create({
            data: {
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              order: category.order,
              hotelId,
              parentId: null,
            },
          })
          slugToCategory.set(created.slug, created.id)
        }
      }

      for (const category of children) {
        if (!slugToCategory.has(category.slug)) {
          const parentId = slugToCategory.get(category.parentSlug!)
          if (!parentId) continue
          const created = await tx.category.create({
            data: {
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              order: category.order,
              hotelId,
              parentId,
            },
          })
          slugToCategory.set(created.slug, created.id)
        }
      }

      const createdRooms = []
      for (const room of demoRooms) {
        const existing = await tx.room.findFirst({
          where: { hotelId, number: room.number },
          select: { id: true, code: true },
        })
        if (!existing) {
          const uniqueCode = await buildUniqueRoomCode(room.code)
          createdRooms.push(
            await tx.room.create({
              data: { ...room, code: uniqueCode, hotelId },
            })
          )
        }
      }

      const createdServices = []
      for (const service of demoServices) {
        const categoryId = slugToCategory.get(service.categorySlug)
        if (!categoryId) continue

        const existing = await tx.service.findFirst({
          where: { hotelId, name: service.name, categoryId },
          select: { id: true },
        })

        if (!existing) {
          createdServices.push(
            await tx.service.create({
              data: {
                name: service.name,
                description: service.description,
                price: service.price,
                estimatedTime: service.estimatedTime,
                requirePayment: service.requirePayment ?? false,
                image: service.image ?? null,
                categoryId,
                hotelId,
              },
            })
          )
        }
      }

      // Provision a MOCK payment provider so demo flows are end-to-end
      // without real keys. Also enable payments at the hotel level.
      const existingMock = await tx.paymentProvider.findFirst({
        where: { hotelId, type: "MOCK" },
        select: { id: true },
      })
      if (!existingMock) {
        await tx.paymentProvider.updateMany({
          where: { hotelId },
          data: { isDefault: false },
        })
        await tx.paymentProvider.create({
          data: {
            hotelId,
            type: "MOCK",
            displayName: "Demo processor",
            isActive: true,
            isDefault: true,
            publicConfig: {},
            secretConfig: encryptJson({}),
          },
        })
      }
      await tx.hotel.update({
        where: { id: hotelId },
        data: { paymentsEnabled: true },
      })

      const allRooms = await tx.room.findMany({ where: { hotelId }, take: 3 })
      const allServices = await tx.service.findMany({ where: { hotelId }, take: 3 })
      const createdRequests = []

      if (allRooms.length > 0 && allServices.length > 0) {
        const samples = [
          { room: allRooms[0], service: allServices[0], status: RequestStatus.NEW },
          {
            room: allRooms[Math.min(1, allRooms.length - 1)],
            service: allServices[Math.min(1, allServices.length - 1)],
            status: RequestStatus.IN_PROGRESS,
          },
          {
            room: allRooms[Math.min(2, allRooms.length - 1)],
            service: allServices[Math.min(2, allServices.length - 1)],
            status: RequestStatus.COMPLETED,
          },
        ]

        for (const sample of samples) {
          createdRequests.push(
            await tx.request.create({
              data: {
                hotelId,
                roomId: sample.room.id,
                serviceId: sample.service.id,
                status: sample.status,
                notes: "Demo request imported by seed action",
                completedAt:
                  sample.status === RequestStatus.COMPLETED ? new Date() : null,
              },
            })
          )
        }
      }

      return {
        categories: slugToCategory.size,
        newRooms: createdRooms.length,
        newServices: createdServices.length,
        newRequests: createdRequests.length,
      }
    })

    return NextResponse.json({
      message: "Demo data imported successfully",
      result,
    })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to import demo data" },
      { status: 500 }
    )
  }
}
