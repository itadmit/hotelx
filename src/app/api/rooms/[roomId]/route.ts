import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RoomStatus } from "@prisma/client"
import { z } from "zod"

const updateRoomSchema = z.object({
  number: z.string().min(1).optional(),
  type: z.string().min(1).nullable().optional(),
  status: z.nativeEnum(RoomStatus).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { roomId } = await params

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hotelId: user.hotelId!,
      },
      include: {
        requests: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { service: true },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ room })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to load room" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { roomId } = await params
    const body = await request.json()
    const parsed = updateRoomSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const room = await prisma.room.updateMany({
      where: { id: roomId, hotelId: user.hotelId! },
      data: parsed.data,
    })

    if (room.count === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const updatedRoom = await prisma.room.findUnique({ where: { id: roomId } })
    return NextResponse.json({ room: updatedRoom })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { roomId } = await params

    const deleted = await prisma.room.deleteMany({
      where: { id: roomId, hotelId: user.hotelId! },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
