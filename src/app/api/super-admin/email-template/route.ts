import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/server-auth";
import { renderTemplate, type EmailVariables } from "@/lib/email/render";
import { resolveTemplate } from "@/lib/email/mailer";
import { z } from "zod";

export async function GET() {
  try {
    await requireSuperAdmin();

    const override = await prisma.hotelEmailTemplate.findFirst({
      where: { hotelId: null, kind: "WELCOME", isActive: true },
    });

    const resolved = await resolveTemplate(null, "WELCOME");

    const sampleVars: EmailVariables = {
      guestName: "John Doe",
      hotelName: "Plaza Hotel",
      email: "john@example.com",
      dashboardUrl: "https://hotelx.app/dashboard",
    };
    const preview = renderTemplate(resolved, sampleVars);

    return NextResponse.json({
      template: {
        subject: resolved.subject,
        heading: resolved.heading,
        body: resolved.body,
        ctaLabel: resolved.ctaLabel ?? "",
        ctaUrl: resolved.ctaUrl ?? "",
      },
      hasOverride: !!override,
      previewHtml: preview.html,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const updateSchema = z.object({
  subject: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().optional().default(""),
  ctaUrl: z.string().optional().default(""),
});

export async function PUT(request: Request) {
  try {
    await requireSuperAdmin();

    const raw = await request.json();
    const data = updateSchema.parse(raw);

    const existing = await prisma.hotelEmailTemplate.findFirst({
      where: { hotelId: null, kind: "WELCOME" },
    });

    if (existing) {
      await prisma.hotelEmailTemplate.update({
        where: { id: existing.id },
        data: {
          subject: data.subject,
          heading: data.heading,
          body: data.body,
          ctaLabel: data.ctaLabel || null,
          ctaUrl: data.ctaUrl || null,
          isActive: true,
        },
      });
    } else {
      await prisma.hotelEmailTemplate.create({
        data: {
          hotelId: null,
          kind: "WELCOME",
          subject: data.subject,
          heading: data.heading,
          body: data.body,
          ctaLabel: data.ctaLabel || null,
          ctaUrl: data.ctaUrl || null,
          isActive: true,
        },
      });
    }

    const resolved = await resolveTemplate(null, "WELCOME");
    const sampleVars: EmailVariables = {
      guestName: "John Doe",
      hotelName: "Plaza Hotel",
      email: "john@example.com",
      dashboardUrl: "https://hotelx.app/dashboard",
    };
    const preview = renderTemplate(resolved, sampleVars);

    return NextResponse.json({ ok: true, previewHtml: preview.html });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    await requireSuperAdmin();

    await prisma.hotelEmailTemplate.deleteMany({
      where: { hotelId: null, kind: "WELCOME" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
