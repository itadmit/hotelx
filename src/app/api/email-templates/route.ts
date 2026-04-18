import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { EmailTemplateKind } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_TEMPLATES } from "@/lib/email/defaults";

const upsertSchema = z.object({
  kind: z.nativeEnum(EmailTemplateKind),
  subject: z.string().min(2).max(200),
  heading: z.string().min(2).max(200),
  body: z.string().min(2).max(5000),
  ctaLabel: z.string().max(60).nullable().optional(),
  ctaUrl: z.string().max(500).nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await requireSessionUser();
    const overrides = await prisma.hotelEmailTemplate.findMany({
      where: { hotelId: user.hotelId! },
    });
    const map = new Map(overrides.map((t) => [t.kind, t]));

    const templates = (Object.keys(DEFAULT_TEMPLATES) as EmailTemplateKind[]).map(
      (kind) => {
        const override = map.get(kind);
        const def = DEFAULT_TEMPLATES[kind];
        return {
          kind,
          isOverride: Boolean(override),
          isActive: override?.isActive ?? true,
          subject: override?.subject ?? def.subject,
          heading: override?.heading ?? def.heading,
          body: override?.body ?? def.body,
          ctaLabel: override?.ctaLabel ?? def.ctaLabel ?? null,
          ctaUrl: override?.ctaUrl ?? def.ctaUrl ?? null,
        };
      }
    );

    return NextResponse.json({ templates });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[email-templates GET]", error);
    return NextResponse.json(
      { error: "Failed to load email templates" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await req.json();
    const parsed = upsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const upserted = await prisma.hotelEmailTemplate.upsert({
      where: { hotelId_kind: { hotelId: user.hotelId!, kind: data.kind } },
      create: {
        hotelId: user.hotelId!,
        kind: data.kind,
        subject: data.subject,
        heading: data.heading,
        body: data.body,
        ctaLabel: data.ctaLabel ?? null,
        ctaUrl: data.ctaUrl ?? null,
        isActive: data.isActive ?? true,
      },
      update: {
        subject: data.subject,
        heading: data.heading,
        body: data.body,
        ctaLabel: data.ctaLabel ?? null,
        ctaUrl: data.ctaUrl ?? null,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ template: upserted });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[email-templates PUT]", error);
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}
