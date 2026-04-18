import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import {
  demoAmenities,
  demoCategories,
  demoHotel,
  demoHotelInfo,
  demoRooms,
  demoServices,
} from "@/lib/demo-data"
import { encryptJson } from "@/lib/crypto"
import { RequestStatus } from "@prisma/client"
import { NextResponse } from "next/server"

/**
 * Streaming demo seed.
 *
 * The route streams an SSE-style line-delimited JSON feed so the dashboard
 * can render real-time progress (current step, totals, results) instead of
 * staring at a spinner. Each step is idempotent — a partial run can simply
 * be re-triggered.
 *
 * The body is a sequence of `event: ...\ndata: {json}\n\n` blocks. The
 * client consumes it via fetch + ReadableStream; we deliberately don't use
 * the EventSource API because we want POST + auth cookies + a one-shot
 * lifecycle.
 *
 * Wrapping all of this in a single $transaction blew past Prisma's 5s
 * window (P2028) on hosted Postgres, so each operation runs directly.
 */

const STEP_KEYS = [
  "identity",
  "categories",
  "rooms",
  "services",
  "info",
  "amenities",
  "payments",
  "samples",
] as const

type StepKey = (typeof STEP_KEYS)[number]

const STEP_LABELS: Record<StepKey, string> = {
  identity: "Renaming hotel to Plaza Hotel",
  categories: "Importing menu categories",
  rooms: "Provisioning rooms",
  services: "Loading services & menu items",
  info: "Saving Wi-Fi, About & helpful info",
  amenities: "Adding on-site amenities",
  payments: "Enabling demo payments",
  samples: "Generating sample requests",
}

export async function POST() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(
            `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
          ),
        )
      }

      const sendStep = (
        key: StepKey,
        status: "running" | "done" | "error",
        extra: Record<string, unknown> = {},
      ) => {
        send("step", {
          key,
          label: STEP_LABELS[key],
          status,
          ...extra,
        })
      }

      try {
        const user = await requireSessionUser()
        const hotelId = user.hotelId!
        const hotelCodeSuffix = hotelId.slice(-6).toUpperCase()

        send("init", {
          steps: STEP_KEYS.map((key) => ({
            key,
            label: STEP_LABELS[key],
          })),
          hotelName: demoHotel.name,
        })

        const buildUniqueRoomCode = async (baseCode: string) => {
          let candidate = `${baseCode}-${hotelCodeSuffix}`
          let attempt = 0
          while (attempt < 10) {
            const exists = await prisma.room.findUnique({
              where: { code: candidate },
              select: { id: true },
            })
            if (!exists) return candidate
            attempt += 1
            candidate = `${baseCode}-${hotelCodeSuffix}-${attempt}`
          }
          throw new Error("Failed to create unique room code for demo seed")
        }

        // ----- 1. Hotel identity (rename to Plaza Hotel) + payments enabled.
        sendStep("identity", "running")
        await prisma.hotel.update({
          where: { id: hotelId },
          data: {
            name: demoHotel.name,
            primaryColor: demoHotel.primaryColor,
            defaultCurrency: demoHotel.defaultCurrency,
            paymentsEnabled: true,
          },
        })
        sendStep("identity", "done", { detail: demoHotel.name })

        // ----- 2. Categories: roots first, then children.
        sendStep("categories", "running", {
          total: demoCategories.length,
          done: 0,
        })
        const existingCategories = await prisma.category.findMany({
          where: { hotelId },
          select: { id: true, slug: true },
        })
        const slugToCategory = new Map<string, string>()
        existingCategories.forEach((cat) =>
          slugToCategory.set(cat.slug, cat.id),
        )

        const roots = demoCategories.filter((c) => !c.parentSlug)
        const children = demoCategories.filter((c) => c.parentSlug)
        let catCounter = 0

        for (const category of roots) {
          const upserted = await prisma.category.upsert({
            where: { hotelId_slug: { hotelId, slug: category.slug } },
            update: {
              name: category.name,
              icon: category.icon,
              order: category.order,
              parentId: null,
            },
            create: {
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              order: category.order,
              hotelId,
              parentId: null,
            },
          })
          slugToCategory.set(upserted.slug, upserted.id)
          catCounter += 1
          sendStep("categories", "running", {
            total: demoCategories.length,
            done: catCounter,
            current: category.name,
          })
        }

        for (const category of children) {
          const parentId = slugToCategory.get(category.parentSlug!)
          if (!parentId) continue
          const upserted = await prisma.category.upsert({
            where: { hotelId_slug: { hotelId, slug: category.slug } },
            update: {
              name: category.name,
              icon: category.icon,
              order: category.order,
              parentId,
            },
            create: {
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              order: category.order,
              hotelId,
              parentId,
            },
          })
          slugToCategory.set(upserted.slug, upserted.id)
          catCounter += 1
          sendStep("categories", "running", {
            total: demoCategories.length,
            done: catCounter,
            current: category.name,
          })
        }
        sendStep("categories", "done", { detail: `${slugToCategory.size} ready` })

        // ----- 3. Rooms.
        sendStep("rooms", "running", { total: demoRooms.length, done: 0 })
        let createdRooms = 0
        for (const [index, room] of demoRooms.entries()) {
          const existing = await prisma.room.findFirst({
            where: { hotelId, number: room.number },
            select: { id: true },
          })
          if (!existing) {
            const uniqueCode = await buildUniqueRoomCode(room.code)
            await prisma.room.create({
              data: { ...room, code: uniqueCode, hotelId },
            })
            createdRooms += 1
          }
          sendStep("rooms", "running", {
            total: demoRooms.length,
            done: index + 1,
            current: `Room ${room.number}`,
          })
        }
        sendStep("rooms", "done", {
          detail: `${createdRooms} new · ${demoRooms.length} total`,
        })

        // ----- 4. Services.
        sendStep("services", "running", {
          total: demoServices.length,
          done: 0,
        })
        let createdServices = 0
        for (const [index, service] of demoServices.entries()) {
          const categoryId = slugToCategory.get(service.categorySlug)
          if (!categoryId) continue

          const existing = await prisma.service.findFirst({
            where: { hotelId, name: service.name },
            select: { id: true },
          })

          if (existing) {
            await prisma.service.update({
              where: { id: existing.id },
              data: {
                description: service.description,
                price: service.price,
                estimatedTime: service.estimatedTime,
                requirePayment: service.requirePayment ?? false,
                isFeatured: service.isFeatured ?? false,
                image: service.image ?? null,
                categoryId,
              },
            })
          } else {
            await prisma.service.create({
              data: {
                name: service.name,
                description: service.description,
                price: service.price,
                estimatedTime: service.estimatedTime,
                requirePayment: service.requirePayment ?? false,
                isFeatured: service.isFeatured ?? false,
                image: service.image ?? null,
                categoryId,
                hotelId,
              },
            })
            createdServices += 1
          }
          sendStep("services", "running", {
            total: demoServices.length,
            done: index + 1,
            current: service.name,
          })
        }
        sendStep("services", "done", {
          detail: `${createdServices} new · ${demoServices.length} total`,
        })

        // ----- 5. Hotel info.
        sendStep("info", "running")
        await prisma.hotelInfo.upsert({
          where: { hotelId },
          update: { ...demoHotelInfo },
          create: { hotelId, ...demoHotelInfo },
        })
        sendStep("info", "done", { detail: "Wi-Fi, About, Helpful info" })

        // ----- 6. Amenities — wipe & reseed.
        sendStep("amenities", "running", {
          total: demoAmenities.length,
          done: 0,
        })
        await prisma.hotelAmenity.deleteMany({ where: { hotelId } })
        if (demoAmenities.length > 0) {
          await prisma.hotelAmenity.createMany({
            data: demoAmenities.map((amenity, index) => ({
              hotelId,
              name: amenity.name,
              description: amenity.description,
              icon: amenity.icon,
              hours: amenity.hours,
              location: amenity.location,
              order: index,
            })),
          })
        }
        sendStep("amenities", "done", {
          detail: `${demoAmenities.length} on-site amenities`,
        })

        // ----- 7. Provision a MOCK payment provider so demo flows are end-to-end.
        sendStep("payments", "running")
        const existingMock = await prisma.paymentProvider.findFirst({
          where: { hotelId, type: "MOCK" },
          select: { id: true },
        })
        if (!existingMock) {
          await prisma.paymentProvider.updateMany({
            where: { hotelId },
            data: { isDefault: false },
          })
          await prisma.paymentProvider.create({
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
        sendStep("payments", "done", { detail: "Mock processor ready" })

        // ----- 8. Sample requests so the dashboard shows movement immediately.
        sendStep("samples", "running")
        const allRooms = await prisma.room.findMany({
          where: { hotelId },
          take: 3,
        })
        const allServices = await prisma.service.findMany({
          where: { hotelId },
          take: 3,
        })
        let createdRequests = 0
        if (allRooms.length > 0 && allServices.length > 0) {
          const samples = [
            {
              room: allRooms[0],
              service: allServices[0],
              status: RequestStatus.NEW,
            },
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
            await prisma.request.create({
              data: {
                hotelId,
                roomId: sample.room.id,
                serviceId: sample.service.id,
                status: sample.status,
                notes: "Demo request imported by seed action",
                completedAt:
                  sample.status === RequestStatus.COMPLETED
                    ? new Date()
                    : null,
              },
            })
            createdRequests += 1
          }
        }
        sendStep("samples", "done", { detail: `${createdRequests} sample requests` })

        send("done", {
          message: "Demo data imported successfully",
          result: {
            categories: slugToCategory.size,
            newRooms: createdRooms,
            newServices: createdServices,
            newRequests: createdRequests,
            amenities: demoAmenities.length,
            hotelName: demoHotel.name,
          },
        })
        controller.close()
      } catch (error) {
        if (error instanceof ApiAuthError) {
          send("error", { error: error.message, status: 401 })
          controller.close()
          return
        }
        console.error("[demo/seed] failed:", error)
        const detail =
          error instanceof Error ? error.message : "Unknown server error"
        send("error", { error: "Failed to import demo data", detail })
        controller.close()
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
