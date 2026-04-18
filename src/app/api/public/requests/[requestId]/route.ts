import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        room: { select: { number: true, code: true } },
        service: { select: { name: true, estimatedTime: true } },
        hotel: { select: { name: true, slug: true } },
      },
    })

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ request })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load request status" },
      { status: 500 }
    )
  }
}
