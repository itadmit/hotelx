import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { resolveDefaultAdapter } from "@/lib/payments/resolver";
import type { Prisma } from "@prisma/client";

const schema = z.object({
  hotelSlug: z.string().min(1),
  roomCode: z.string().min(1),
  serviceId: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const hotel = await prisma.hotel.findUnique({
      where: { slug: parsed.data.hotelSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        defaultCurrency: true,
        paymentsEnabled: true,
      },
    });
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    if (!hotel.paymentsEnabled) {
      return NextResponse.json(
        { error: "This hotel is not accepting payments." },
        { status: 400 }
      );
    }

    const room = await prisma.room.findFirst({
      where: { code: parsed.data.roomCode, hotelId: hotel.id },
      select: { id: true },
    });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const service = await prisma.service.findFirst({
      where: { id: parsed.data.serviceId, hotelId: hotel.id, isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        requirePayment: true,
      },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    if (!service.requirePayment) {
      return NextResponse.json(
        { error: "This service does not require payment." },
        { status: 400 }
      );
    }

    const amount = Number(service.price ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Service has no price set." },
        { status: 400 }
      );
    }

    const resolved = await resolveDefaultAdapter(hotel.id);
    if (!resolved) {
      return NextResponse.json(
        { error: "No payment provider is connected for this hotel." },
        { status: 503 }
      );
    }
    const { row: providerRow, adapter } = resolved;

    const currency = (service.currency ?? hotel.defaultCurrency ?? "USD").toUpperCase();
    const idempotencyKey = randomBytes(16).toString("hex");

    const payment = await prisma.payment.create({
      data: {
        hotelId: hotel.id,
        serviceId: service.id,
        roomId: room.id,
        providerId: providerRow.id,
        providerType: providerRow.type,
        amount,
        currency,
        notes: parsed.data.notes ?? null,
        metadata: { idempotencyKey } as Prisma.InputJsonValue,
      },
    });

    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;

    let intent;
    try {
      intent = await adapter.createIntent({
        amount,
        currency,
        hotelSlug: hotel.slug,
        hotelName: hotel.name,
        roomCode: parsed.data.roomCode,
        serviceId: service.id,
        serviceName: service.name,
        notes: parsed.data.notes,
        paymentId: payment.id,
        idempotencyKey,
        origin,
      });
    } catch (e) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          errorMessage: e instanceof Error ? e.message : "createIntent failed",
        },
      });
      return NextResponse.json(
        {
          error:
            e instanceof Error ? e.message : "Failed to start payment",
        },
        { status: 502 }
      );
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        externalId: intent.externalId,
        status: intent.status,
        metadata: {
          ...((payment.metadata ?? {}) as Record<string, unknown>),
          ...(intent.metadata ?? {}),
        } as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      providerType: providerRow.type,
      providerKind: adapter.kind,
      clientToken: intent.clientToken ?? null,
      redirectUrl: intent.redirectUrl ?? null,
      publicConfig: intent.publicConfig ?? {},
      amount,
      currency,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to start payment",
      },
      { status: 500 }
    );
  }
}
