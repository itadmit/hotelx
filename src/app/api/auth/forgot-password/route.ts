import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendTemplatedEmail } from "@/lib/email/mailer";

const schema = z.object({
  email: z.string().email(),
});

/**
 * Always returns 200 to avoid leaking which addresses are registered.
 * If the address belongs to a user we send a reset email; otherwise
 * we silently no-op.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }
  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, hotelId: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  // Stub token — the actual reset flow can plug in once we add a Token model.
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const resetUrl = `${origin}/reset-password?token=${token}`;

  void sendTemplatedEmail({
    to: email,
    hotelId: user.hotelId ?? null,
    template: "PASSWORD_RESET",
    variables: {
      email,
      resetUrl,
      guestName: user.name ?? "there",
    },
  });

  return NextResponse.json({ ok: true });
}
