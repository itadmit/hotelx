import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RoomStatus } from "@prisma/client"
import { z } from "zod"

const createRoomSchema = z.object({
  number: z.string().min(1),
  type: z.string().min(1).optional(),
  status: z.nativeEnum(RoomStatus).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()

    const rooms = await prisma.room.findMany({
      where: { hotelId: user.hotelId! },
      orderBy: { number: "asc" },
      include: {
        _count: {
          select: { requests: true },
        },
      },
    })

    return NextResponse.json({ rooms })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to load rooms" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createRoomSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    // Clean default: letter "R" + the room number (e.g. 101 → "R101").
    // Strip non-alphanumerics from the number so odd input like "10-1A" still
    // yields a valid code. If a collision exists within the hotel we append a
    // short numeric suffix until we find a free slot.
    const safeNumber = parsed.data.number.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    const baseCode = `R${safeNumber}`
    let code = baseCode
    for (let attempt = 1; attempt < 20; attempt++) {
      const clash = await prisma.room.findFirst({
        where: { hotelId: user.hotelId!, code },
        select: { id: true },
      })
      if (!clash) break
      code = `${baseCode}-${attempt}`
    }

    const room = await prisma.room.create({
      data: {
        number: parsed.data.number,
        type: parsed.data.type ?? "Standard",
        status: parsed.data.status ?? RoomStatus.ACTIVE,
        code,
        hotelId: user.hotelId!,
      },
    })

    return NextResponse.json({ room }, { status: 201 })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
