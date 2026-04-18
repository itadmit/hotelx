import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { encryptJson } from "@/lib/crypto";
import type { Prisma } from "@prisma/client";

const providerTypes = ["STRIPE", "PAYPAL", "CUSTOM", "MOCK"] as const;

const createProviderSchema = z.object({
  type: z.enum(providerTypes),
  displayName: z.string().min(1).max(120),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  publicConfig: z.record(z.string(), z.string()).optional(),
  secretConfig: z.record(z.string(), z.string()).optional(),
});

function publicShape(row: {
  id: string;
  type: string;
  displayName: string;
  isActive: boolean;
  isDefault: boolean;
  publicConfig: unknown;
  secretConfig: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    type: row.type,
    displayName: row.displayName,
    isActive: row.isActive,
    isDefault: row.isDefault,
    publicConfig: (row.publicConfig ?? {}) as Record<string, string>,
    hasSecret: Boolean(row.secretConfig),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function GET() {
  try {
    const user = await requireSessionUser();
    const providers = await prisma.paymentProvider.findMany({
      where: { hotelId: user.hotelId! },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    const hotel = await prisma.hotel.findUnique({
      where: { id: user.hotelId! },
      select: {
        paymentsEnabled: true,
        defaultCurrency: true,
      },
    });
    return NextResponse.json({
      providers: providers.map(publicShape),
      hotel: hotel ?? { paymentsEnabled: false, defaultCurrency: "USD" },
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to load payment providers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const body = await request.json();
    const parsed = createProviderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const created = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.paymentProvider.updateMany({
          where: { hotelId: user.hotelId! },
          data: { isDefault: false },
        });
      }
      return tx.paymentProvider.create({
        data: {
          hotelId: user.hotelId!,
          type: data.type,
          displayName: data.displayName,
          isActive: data.isActive ?? true,
          isDefault: data.isDefault ?? false,
          publicConfig: (data.publicConfig ?? {}) as Prisma.InputJsonValue,
          secretConfig: encryptJson(data.secretConfig ?? {}),
        },
      });
    });

    return NextResponse.json({ provider: publicShape(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to create payment provider" },
      { status: 500 }
    );
  }
}
