import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { z } from "zod"

const updateHotelSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  logo: z.string().url().nullable().optional(),
  primaryColor: z.string().min(4).max(16).optional(),
  paymentsEnabled: z.boolean().optional(),
  defaultCurrency: z.string().min(3).max(8).optional(),
  feedbackEnabled: z.boolean().optional(),
  feedbackThreshold: z.number().int().min(2).max(5).optional(),
  googleReviewUrl: z.string().url().nullable().optional(),
  bookingReviewUrl: z.string().url().nullable().optional(),
  supportEmail: z.string().email().nullable().optional(),
  hotelInfoPosition: z.number().int().min(0).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()

    const hotel = await prisma.hotel.findUnique({
      where: { id: user.hotelId! },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        paymentsEnabled: true,
        defaultCurrency: true,
        feedbackEnabled: true,
        feedbackThreshold: true,
        googleReviewUrl: true,
        bookingReviewUrl: true,
        supportEmail: true,
        hotelInfoPosition: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to fetch hotel settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = updateHotelSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.update({
      where: { id: user.hotelId! },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        paymentsEnabled: true,
        defaultCurrency: true,
        feedbackEnabled: true,
        feedbackThreshold: true,
        googleReviewUrl: true,
        bookingReviewUrl: true,
        supportEmail: true,
        hotelInfoPosition: true,
      },
    })

    return NextResponse.json({ hotel })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update hotel settings" },
      { status: 500 }
    )
  }
}
