import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"

/**
 * Wipes all hotel data the manager owns, in a foreign-key safe order.
 * Like the seed route, this runs WITHOUT prisma.$transaction so we never
 * hit the 5s P2028 transaction window on heavier hotels.
 */
export async function POST() {
  try {
    const user = await requireSessionUser()
    const hotelId = user.hotelId!

    const removedRequests = await prisma.request.deleteMany({ where: { hotelId } })
    const removedServices = await prisma.service.deleteMany({ where: { hotelId } })
    const removedCategories = await prisma.category.deleteMany({ where: { hotelId } })
    const removedRooms = await prisma.room.deleteMany({ where: { hotelId } })
    const removedAmenities = await prisma.hotelAmenity.deleteMany({ where: { hotelId } })
    await prisma.hotelInfo.deleteMany({ where: { hotelId } })

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { demoSeedAt: null },
    })

    return NextResponse.json({
      message: "Hotel data reset completed",
      result: {
        removedRequests: removedRequests.count,
        removedServices: removedServices.count,
        removedCategories: removedCategories.count,
        removedRooms: removedRooms.count,
        removedAmenities: removedAmenities.count,
      },
    })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("[demo/reset] failed:", error)
    const detail =
      error instanceof Error ? error.message : "Unknown server error"
    return NextResponse.json(
      { error: "Failed to reset data", detail },
      { status: 500 }
    )
  }
}
