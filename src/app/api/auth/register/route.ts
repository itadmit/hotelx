import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { ResendEmailProvider } from "@/lib/email/resend-provider";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hotelName: z.string().min(2, "Hotel name must be at least 2 characters"),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
    const rate = checkRateLimit(`register:${ip}`, RATE_LIMITS.register);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, hotelName } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Hotel slug
    const baseSlug = hotelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

    // Create Hotel and User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotel.create({
        data: {
          name: hotelName,
          slug: slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "MANAGER", // First user is Manager
          hotelId: hotel.id,
        },
      });

      return { user, hotel };
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hotelx.app";

    sendTemplatedEmail({
      to: email,
      hotelId: result.hotel.id,
      template: "WELCOME",
      variables: {
        guestName: name,
        hotelName,
        email,
        dashboardUrl: `${siteUrl}/dashboard`,
      },
      replyTo: "yogev@tadmit.co.il",
    }).catch((err) => console.error("[register] welcome email failed:", err));

    notifyAdminOfSignup({
      name,
      email,
      hotelName,
      hotelSlug: result.hotel.slug,
      siteUrl,
    }).catch((err) => console.error("[register] admin notification failed:", err));

    return NextResponse.json(
      { 
        message: "User registered successfully",
        userId: result.user.id,
        hotelSlug: result.hotel.slug
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}

async function notifyAdminOfSignup({
  name,
  email,
  hotelName,
  hotelSlug,
  siteUrl,
}: {
  name: string;
  email: string;
  hotelName: string;
  hotelSlug: string;
  siteUrl: string;
}) {
  const to = process.env.ADMIN_ALERT_EMAIL ?? "itadmit@gmail.com";
  const provider = new ResendEmailProvider();
  const superAdminUrl = `${siteUrl}/super-admin`;
  const when = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <p style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; margin: 0 0 8px;">HotelX · New signup</p>
      <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">${escape(name)} just registered ${escape(hotelName)}</h1>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0 24px;">
        <tr><td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Name</td><td style="padding: 6px 0; font-size: 14px;">${escape(name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 6px 0; font-size: 14px;">${escape(email)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280; font-size: 13px;">Hotel</td><td style="padding: 6px 0; font-size: 14px;">${escape(hotelName)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280; font-size: 13px;">Slug</td><td style="padding: 6px 0; font-size: 14px; font-family: monospace;">${escape(hotelSlug)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280; font-size: 13px;">When</td><td style="padding: 6px 0; font-size: 14px;">${escape(when)} (IL)</td></tr>
      </table>
      <a href="${superAdminUrl}" style="display: inline-block; padding: 10px 16px; background: #0e5240; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Open super-admin</a>
    </div>
  `;

  const text = [
    `New signup — ${name} registered ${hotelName}`,
    "",
    `Name:  ${name}`,
    `Email: ${email}`,
    `Hotel: ${hotelName}`,
    `Slug:  ${hotelSlug}`,
    `When:  ${when} (IL)`,
    "",
    `Super-admin: ${superAdminUrl}`,
  ].join("\n");

  const result = await provider.send({
    to,
    subject: `[HotelX] New signup — ${hotelName}`,
    html,
    text,
    replyTo: email,
  });
  if (!result.ok && !result.simulated) {
    console.error("[register] admin notify send failed:", result.error);
  }
}

