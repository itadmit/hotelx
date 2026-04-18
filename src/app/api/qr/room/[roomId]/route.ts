import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import QRCode from "qrcode"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { roomId } = await params
    const room = await prisma.room.findFirst({
      where: { id: roomId, hotelId: user.hotelId! },
      include: { hotel: true },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const { origin } = new URL(request.url)
    const guestUrl = `${origin}/g/${room.hotel.slug}/${room.code}`
    const dataUrl = await QRCode.toDataURL(guestUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
    })

    return NextResponse.json({
      room: {
        id: room.id,
        number: room.number,
        code: room.code,
      },
      guestUrl,
      dataUrl,
    })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}
