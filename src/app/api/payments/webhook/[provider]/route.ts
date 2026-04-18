import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loadAdapterFromRow } from "@/lib/payments/registry";
import { PaymentStatus, RequestStatus } from "@prisma/client";
import { emitForBoth, emitNotification } from "@/lib/notifications/emit";

const PROVIDER_MAP: Record<string, "STRIPE" | "PAYPAL" | "CUSTOM" | "MOCK"> = {
  stripe: "STRIPE",
  paypal: "PAYPAL",
  custom: "CUSTOM",
  mock: "MOCK",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const type = PROVIDER_MAP[provider.toLowerCase()];
  if (!type) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }
  const rawBody = await request.text();

  // We can't know which hotel up-front; pick the first active provider of
  // that type whose adapter accepts the webhook signature. For Stripe in
  // production you'd route by webhook secret per hotel.
  const candidates = await prisma.paymentProvider.findMany({
    where: { type, isActive: true },
  });

  for (const row of candidates) {
    try {
      const adapter = loadAdapterFromRow(row);
      const event = await adapter.handleWebhook(rawBody, request.headers);
      if (!event.externalId) continue;

      const payment = await prisma.payment.findFirst({
        where: { externalId: event.externalId, providerId: row.id },
        include: { request: true },
      });
      if (!payment) continue;

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: event.status,
          paidAt:
            event.status === PaymentStatus.PAID && !payment.paidAt
              ? new Date()
              : payment.paidAt,
        },
      });

      const paidLike =
        event.status === PaymentStatus.PAID ||
        event.status === PaymentStatus.AUTHORIZED;
      const failedLike =
        event.status === PaymentStatus.FAILED ||
        event.status === PaymentStatus.CANCELLED;

      if (failedLike && !paidLike) {
        const [ctx, failRoom] = await Promise.all([
          prisma.payment.findUnique({
            where: { id: payment.id },
            select: {
              amount: true,
              currency: true,
              service: { select: { name: true } },
              hotel: { select: { slug: true } },
            },
          }),
          prisma.room.findUnique({
            where: { id: payment.roomId },
            select: { number: true, code: true },
          }),
        ]);
        void emitNotification({
          hotelId: payment.hotelId,
          audience: "STAFF",
          type: "PAYMENT_FAILED",
          roomId: payment.roomId,
          context: {
            serviceName: ctx?.service?.name,
            roomNumber: failRoom?.number,
            hotelSlug: ctx?.hotel?.slug,
            roomCode: failRoom?.code,
            amount: ctx ? Number(ctx.amount) : Number(updated.amount),
            currency: ctx?.currency ?? updated.currency,
          },
        });
      }

      if (paidLike && !payment.request) {
        const created = await prisma.request.create({
          data: {
            hotelId: payment.hotelId,
            roomId: payment.roomId,
            serviceId: payment.serviceId,
            status: RequestStatus.NEW,
            notes: payment.notes ?? null,
            paymentId: updated.id,
          },
          include: {
            service: { select: { name: true } },
            room: { select: { number: true, code: true } },
            hotel: { select: { slug: true } },
          },
        });

        void emitNotification({
          hotelId: payment.hotelId,
          audience: "STAFF",
          type: "PAYMENT_PAID",
          roomId: payment.roomId,
          requestId: created.id,
          context: {
            serviceName: created.service.name,
            roomNumber: created.room.number,
            hotelSlug: created.hotel.slug,
            roomCode: created.room.code,
            amount: Number(updated.amount),
            currency: updated.currency,
            requestId: created.id,
          },
        });

        void emitForBoth({
          hotelId: payment.hotelId,
          type: "REQUEST_CREATED",
          roomId: payment.roomId,
          requestId: created.id,
          context: {
            serviceName: created.service.name,
            roomNumber: created.room.number,
            hotelSlug: created.hotel.slug,
            roomCode: created.room.code,
            requestId: created.id,
          },
        });
      }

      return NextResponse.json({ ok: true });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ ok: true, matched: false });
}
