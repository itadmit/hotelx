import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const upsertSchema = z.object({
  wifiName: z.string().max(120).nullable().optional(),
  wifiPassword: z.string().max(120).nullable().optional(),
  wifiNotes: z.string().max(500).nullable().optional(),
  about: z.string().max(4000).nullable().optional(),
  helpfulInfo: z.string().max(4000).nullable().optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const info = await prisma.hotelInfo.findUnique({
      where: { hotelId: user.hotelId! },
    })
    return NextResponse.json({ info })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load hotel info" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = upsertSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }
    const data = parsed.data
    const info = await prisma.hotelInfo.upsert({
      where: { hotelId: user.hotelId! },
      update: data,
      create: { hotelId: user.hotelId!, ...data },
    })
    return NextResponse.json({ info })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update hotel info" },
      { status: 500 }
    )
  }
}
