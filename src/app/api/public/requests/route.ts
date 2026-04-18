import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { RequestStatus } from "@prisma/client"
import { z } from "zod"
import { emitForBoth } from "@/lib/notifications/emit"

const createPublicRequestSchema = z.object({
  hotelSlug: z.string().min(1),
  roomCode: z.string().min(1),
  serviceId: z.string().min(1),
  notes: z.string().optional(),
})

async function getPublicService(
  hotelSlug: string,
  serviceId: string
): Promise<{ id: string; hotelId: string; requirePayment: boolean } | null> {
  try {
    return await prisma.service.findFirst({
      where: {
        id: serviceId,
        isActive: true,
        hotel: { slug: hotelSlug },
      },
      select: { id: true, hotelId: true, requirePayment: true },
    })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2022"
    ) {
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          isActive: true,
          hotel: { slug: hotelSlug },
        },
        select: { id: true, hotelId: true },
      })

      return service ? { ...service, requirePayment: false } : null
    }

    throw error
  }
}

async function getPublicHotel(slug: string) {
  try {
    return await prisma.hotel.findUnique({
      where: { slug },
      select: { id: true, paymentsEnabled: true },
    })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2022"
    ) {
      const hotel = await prisma.hotel.findUnique({
        where: { slug },
        select: { id: true },
      })

      return hotel ? { ...hotel, paymentsEnabled: false } : null
    }

    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createPublicRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const [room, service, hotel] = await Promise.all([
      prisma.room.findFirst({
        where: {
          code: parsed.data.roomCode,
          hotel: { slug: parsed.data.hotelSlug },
        },
        select: { id: true, hotelId: true },
      }),
      getPublicService(parsed.data.hotelSlug, parsed.data.serviceId),
      getPublicHotel(parsed.data.hotelSlug),
    ])

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    if (room.hotelId !== service.hotelId) {
      return NextResponse.json(
        { error: "Room and service do not belong to the same hotel" },
        { status: 400 }
      )
    }

    if (service.requirePayment && hotel?.paymentsEnabled) {
      return NextResponse.json(
        {
          error: "Payment is required for this service.",
          requiresPayment: true,
        },
        { status: 402 }
      )
    }

    const createdRequest = await prisma.request.create({
      data: {
        hotelId: room.hotelId,
        roomId: room.id,
        serviceId: service.id,
        status: RequestStatus.NEW,
        notes: parsed.data.notes ?? null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        room: { select: { number: true, code: true } },
        service: { select: { name: true } },
      },
    })

    void emitForBoth({
      hotelId: room.hotelId,
      type: "REQUEST_CREATED",
      roomId: room.id,
      requestId: createdRequest.id,
      context: {
        serviceName: createdRequest.service.name,
        roomNumber: createdRequest.room.number,
        hotelSlug: parsed.data.hotelSlug,
        roomCode: createdRequest.room.code,
        requestId: createdRequest.id,
      },
    })

    return NextResponse.json({ request: createdRequest }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create guest request" },
      { status: 500 }
    )
  }
}
