import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const categories = await prisma.category.findMany({
      where: { hotelId: user.hotelId! },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })

    return NextResponse.json({ categories })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        ...parsed.data,
        hotelId: user.hotelId!,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
