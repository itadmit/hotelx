import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const updateHotelSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().url().nullable().optional(),
  primaryColor: z.string().min(4).max(16).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()

    const hotel = await prisma.hotel.findUnique({
      where: { id: user.hotelId! },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to fetch hotel settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = updateHotelSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.update({
      where: { id: user.hotelId! },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
      },
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update hotel settings" },
      { status: 500 }
    )
  }
}
