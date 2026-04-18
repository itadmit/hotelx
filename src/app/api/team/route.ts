import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { sendTemplatedEmail } from "@/lib/email/mailer"

const createTeamMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.nativeEnum(Role).optional(),
})

export async function GET() {
  try {
    const user = await requireSessionUser()
    const members = await prisma.user.findMany({
      where: { hotelId: user.hotelId! },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ members })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load team members" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const body = await request.json()
    const parsed = createTeamMemberSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      )
    }

    const tempPassword = Math.random().toString(36).slice(2, 10)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const member = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role ?? Role.STAFF,
        hotelId: user.hotelId!,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const hotel = await prisma.hotel.findUnique({
      where: { id: user.hotelId! },
      select: { name: true, supportEmail: true },
    })

    const origin =
      request.headers.get("origin") ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:3000"

    void sendTemplatedEmail({
      to: member.email,
      hotelId: user.hotelId!,
      template: "TEAM_INVITE",
      replyTo: hotel?.supportEmail ?? undefined,
      fromName: hotel?.name ?? undefined,
      variables: {
        guestName: member.name ?? "there",
        hotelName: hotel?.name ?? "your hotel",
        tempPassword,
        loginUrl: `${origin}/login`,
      },
    })

    return NextResponse.json(
      {
        member,
        temporaryPassword: tempPassword,
        message: "Member created. Share the temporary password securely.",
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    )
  }
}
