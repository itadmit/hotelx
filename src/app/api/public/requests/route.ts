import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { RequestStatus } from "@prisma/client"
import { z } from "zod"

const createPublicRequestSchema = z.object({
  hotelSlug: z.string().min(1),
  roomCode: z.string().min(1),
  serviceId: z.string().min(1),
  notes: z.string().optional(),
})

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

    const hotel = await prisma.hotel.findUnique({
      where: { slug: parsed.data.hotelSlug },
      select: { id: true },
    })

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    const room = await prisma.room.findFirst({
      where: { code: parsed.data.roomCode, hotelId: hotel.id },
      select: { id: true },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const service = await prisma.service.findFirst({
      where: {
        id: parsed.data.serviceId,
        hotelId: hotel.id,
        isActive: true,
      },
      select: { id: true },
    })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const createdRequest = await prisma.request.create({
      data: {
        hotelId: hotel.id,
        roomId: room.id,
        serviceId: service.id,
        status: RequestStatus.NEW,
        notes: parsed.data.notes ?? null,
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
