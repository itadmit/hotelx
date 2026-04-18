import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().min(1).nullable().optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const categories = await prisma.category.findMany({
      where: { hotelId: user.hotelId! },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        order: true,
        parentId: true,
      },
      orderBy: [{ parentId: "asc" }, { order: "asc" }, { name: "asc" }],
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

    const normalizedSlug = parsed.data.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")

    if (!normalizedSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }

    let parentId: string | null = parsed.data.parentId ?? null
    if (parentId) {
      const parent = await prisma.category.findFirst({
        where: {
          id: parentId,
          hotelId: user.hotelId!,
        },
        select: { id: true },
      })
      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found in your hotel" },
          { status: 400 }
        )
      }
      parentId = parent.id
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name.trim(),
        slug: normalizedSlug,
        icon: parsed.data.icon,
        order: parsed.data.order ?? 0,
        parentId,
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
