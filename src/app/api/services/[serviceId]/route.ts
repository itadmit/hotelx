import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  categoryId: z.string().min(1).optional(),
  price: z.number().nonnegative().nullable().optional(),
  estimatedTime: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  requirePayment: z.boolean().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { serviceId } = await params

    const service = await prisma.service.findFirst({
      where: { id: serviceId, hotelId: user.hotelId! },
      include: { category: true },
    })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load service" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { serviceId } = await params
    const body = await request.json()
    const parsed = updateServiceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const result = await prisma.service.updateMany({
      where: { id: serviceId, hotelId: user.hotelId! },
      data: parsed.data,
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    })

    return NextResponse.json({ service })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { serviceId } = await params

    const deleted = await prisma.service.deleteMany({
      where: { id: serviceId, hotelId: user.hotelId! },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
