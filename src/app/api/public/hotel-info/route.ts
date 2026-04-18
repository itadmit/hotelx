import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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
      select: {
        id: true,
        name: true,
        info: {
          select: {
            wifiName: true,
            wifiPassword: true,
            wifiNotes: true,
            about: true,
            helpfulInfo: true,
            updatedAt: true,
          },
        },
        amenities: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            hours: true,
            location: true,
            order: true,
          },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
      },
    })
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }
    return NextResponse.json({
      hotel: { id: hotel.id, name: hotel.name },
      info: hotel.info ?? null,
      amenities: hotel.amenities,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to load hotel info" },
      { status: 500 }
    )
  }
}
