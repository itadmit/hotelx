import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  icon: z.string().max(60).nullable().optional(),
  hours: z.string().max(120).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  order: z.number().int().min(0).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { id } = await params
    const existing = await prisma.hotelAmenity.findFirst({
      where: { id, hotelId: user.hotelId! },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }
    const amenity = await prisma.hotelAmenity.update({
      where: { id },
      data: parsed.data,
    })
    return NextResponse.json({ amenity })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update amenity" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { id } = await params
    const existing = await prisma.hotelAmenity.findFirst({
      where: { id, hotelId: user.hotelId! },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await prisma.hotelAmenity.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to delete amenity" },
      { status: 500 }
    )
  }
}
