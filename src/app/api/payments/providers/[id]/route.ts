import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { decryptJson, encryptJson } from "@/lib/crypto";
import type { Prisma } from "@prisma/client";

const updateSchema = z.object({
  displayName: z.string().min(1).max(120).optional(),
  isActive: z.boolean().optional(),
  publicConfig: z.record(z.string(), z.string()).optional(),
  secretConfig: z.record(z.string(), z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const existing = await prisma.paymentProvider.findFirst({
      where: { id, hotelId: user.hotelId! },
    });
    if (!existing) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const update: Prisma.PaymentProviderUpdateInput = {};
    if (parsed.data.displayName !== undefined)
      update.displayName = parsed.data.displayName;
    if (parsed.data.isActive !== undefined)
      update.isActive = parsed.data.isActive;
    if (parsed.data.publicConfig !== undefined) {
      const merged = {
        ...((existing.publicConfig ?? {}) as Record<string, string>),
        ...parsed.data.publicConfig,
      };
      update.publicConfig = merged as Prisma.InputJsonValue;
    }
    if (parsed.data.secretConfig !== undefined) {
      const current = decryptJson<Record<string, string>>(existing.secretConfig);
      const merged: Record<string, string> = { ...current };
      for (const [k, v] of Object.entries(parsed.data.secretConfig)) {
        if (v && v.trim().length > 0) merged[k] = v;
      }
      update.secretConfig = encryptJson(merged);
    }

    const provider = await prisma.paymentProvider.update({
      where: { id },
      data: update,
    });
    return NextResponse.json({
      provider: {
        id: provider.id,
        type: provider.type,
        displayName: provider.displayName,
        isActive: provider.isActive,
        isDefault: provider.isDefault,
        publicConfig: provider.publicConfig,
        hasSecret: Boolean(provider.secretConfig),
      },
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const deleted = await prisma.paymentProvider.deleteMany({
      where: { id, hotelId: user.hotelId! },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
