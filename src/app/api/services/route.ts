import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  price: z.number().nonnegative().nullable().optional(),
  estimatedTime: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  requirePayment: z.boolean().optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const services = await prisma.service.findMany({
      where: { hotelId: user.hotelId! },
      include: { category: true, _count: { select: { requests: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ services })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createServiceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const category = await prisma.category.findFirst({
      where: {
        id: parsed.data.categoryId,
        hotelId: user.hotelId!,
      },
      select: {
        id: true,
        _count: { select: { children: true } },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "Please choose a subcategory (leaf category)." },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        ...parsed.data,
        categoryId: category.id,
        price: parsed.data.price ?? null,
        hotelId: user.hotelId!,
      },
      include: { category: true },
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}
