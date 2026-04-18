import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"

export async function POST() {
  try {
    const user = await requireSessionUser()
    const hotelId = user.hotelId!

    await prisma.$transaction(async (tx) => {
      await tx.request.deleteMany({ where: { hotelId } })
      await tx.service.deleteMany({ where: { hotelId } })
      await tx.category.deleteMany({ where: { hotelId } })
      await tx.room.deleteMany({ where: { hotelId } })
    })

    return NextResponse.json({
      message: "Hotel data reset completed",
    })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to reset data" }, { status: 500 })
  }
}
