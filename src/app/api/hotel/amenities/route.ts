import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
  icon: z.string().max(60).nullable().optional(),
  hours: z.string().max(120).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  order: z.number().int().min(0).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const amenities = await prisma.hotelAmenity.findMany({
      where: { hotelId: user.hotelId! },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })
    return NextResponse.json({ amenities })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load amenities" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }
    const amenity = await prisma.hotelAmenity.create({
      data: { hotelId: user.hotelId!, ...parsed.data },
    })
    return NextResponse.json({ amenity }, { status: 201 })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create amenity" },
      { status: 500 }
    )
  }
}
