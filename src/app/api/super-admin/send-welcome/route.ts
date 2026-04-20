import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/server-auth";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await requireSuperAdmin();

    const body = await request.json();
    const { userId } = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        hotel: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hotelx.app";

    const result = await sendTemplatedEmail({
      to: user.email,
      hotelId: user.hotel?.id ?? null,
      template: "WELCOME",
      variables: {
        guestName: user.name ?? "there",
        hotelName: user.hotel?.name ?? "your hotel",
        email: user.email,
        dashboardUrl: `${siteUrl}/dashboard`,
      },
      replyTo: "yogev@tadmit.co.il",
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      simulated: result.simulated ?? false,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
