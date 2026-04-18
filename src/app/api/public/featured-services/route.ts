import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

/**
 * Public list of featured services for a hotel. The guest home screen uses this
 * to randomly rotate the green "Today's recommendation" upsell. We sort by
 * createdAt so the random pick on the client is reproducible enough to feel
 * stable across short page transitions but still varied between sessions.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("hotelSlug")?.trim()
    if (!slug) {
      return NextResponse.json(
        { error: "hotelSlug is required" },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!hotel) {
      return NextResponse.json({ services: [] })
    }

    const services = await prisma.service.findMany({
      where: {
        hotelId: hotel.id,
        isActive: true,
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        estimatedTime: true,
        image: true,
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      take: 24,
    })

    return NextResponse.json({
      services: services.map((s) => ({
        ...s,
        price: s.price != null ? String(s.price) : null,
      })),
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to load featured services" },
      { status: 500 }
    )
  }
}
