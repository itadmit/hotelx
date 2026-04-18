import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RequestStatus } from "@prisma/client"
import { z } from "zod"
import { emitForBoth } from "@/lib/notifications/emit"

const createRequestSchema = z.object({
  roomId: z.string().min(1),
  serviceId: z.string().min(1),
  notes: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as RequestStatus | null

    const requests = await prisma.request.findMany({
      where: {
        hotelId: user.hotelId!,
        status: status ?? undefined,
      },
      select: {
        id: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
        room: {
          select: {
            id: true,
            number: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    return NextResponse.json({ requests })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load requests" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const [room, service] = await Promise.all([
      prisma.room.findFirst({
        where: { id: parsed.data.roomId, hotelId: user.hotelId! },
      }),
      prisma.service.findFirst({
        where: { id: parsed.data.serviceId, hotelId: user.hotelId! },
      }),
    ])

    if (!room || !service) {
      return NextResponse.json(
        { error: "Room or service not found for your hotel" },
        { status: 404 }
      )
    }

    const createdRequest = await prisma.request.create({
      data: {
        hotelId: user.hotelId!,
        roomId: room.id,
        serviceId: service.id,
        notes: parsed.data.notes ?? null,
        status: RequestStatus.NEW,
      },
      include: {
        room: true,
        service: true,
        assignee: true,
        hotel: { select: { slug: true } },
      },
    })

    void emitForBoth({
      hotelId: user.hotelId!,
      type: "REQUEST_CREATED",
      roomId: createdRequest.roomId,
      requestId: createdRequest.id,
      context: {
        serviceName: createdRequest.service.name,
        roomNumber: createdRequest.room.number,
        hotelSlug: createdRequest.hotel.slug,
        roomCode: createdRequest.room.code,
        requestId: createdRequest.id,
      },
    })

    return NextResponse.json({ request: createdRequest }, { status: 201 })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    )
  }
}
