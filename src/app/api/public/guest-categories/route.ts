import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"

const querySchema = z.object({
  hotelSlug: z.string().min(1),
  roomCode: z.string().min(1),
})

/**
 * Fresh root categories for the guest home (no-store).
 * Validates room belongs to the hotel so categories are not leaked cross-hotel.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      hotelSlug: searchParams.get("hotelSlug") ?? "",
      roomCode: searchParams.get("roomCode") ?? "",
    })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const { hotelSlug, roomCode } = parsed.data

    const room = await prisma.room.findFirst({
      where: {
        code: roomCode,
        hotel: { slug: hotelSlug },
      },
      select: { hotelId: true },
    })

    if (!room) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const categories = await prisma.category.findMany({
      where: { hotelId: room.hotelId, parentId: null },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        icon: true,
        slug: true,
      },
    })

    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    )
  }
}
