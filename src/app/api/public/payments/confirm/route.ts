import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { loadAdapterFromRow } from "@/lib/payments/registry";
import { PaymentStatus, RequestStatus } from "@prisma/client";
import { emitForBoth, emitNotification } from "@/lib/notifications/emit";

const schema = z.object({
  paymentId: z.string().min(1),
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

    const payment = await prisma.payment.findUnique({
      where: { id: parsed.data.paymentId },
      include: {
        provider: true,
        service: { select: { id: true } },
        request: true,
      },
    });
    if (!payment || !payment.provider) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Already linked to a request? Idempotent return.
    if (payment.request) {
      return NextResponse.json({
        request: payment.request,
        status: payment.status,
      });
    }

    const adapter = loadAdapterFromRow(payment.provider);
    const result = await adapter.confirm({
      externalId: payment.externalId,
      paymentId: payment.id,
    });

    const finalStatus = result.status;
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: finalStatus,
        externalId: result.externalId ?? payment.externalId,
        errorMessage: result.errorMessage ?? null,
        paidAt: finalStatus === PaymentStatus.PAID ? new Date() : payment.paidAt,
      },
    });

    if (
      finalStatus !== PaymentStatus.PAID &&
      finalStatus !== PaymentStatus.AUTHORIZED
    ) {
      const [failContext, failRoom] = await Promise.all([
        prisma.payment.findUnique({
          where: { id: payment.id },
          select: {
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
          serviceName: failContext?.service?.name,
          roomNumber: failRoom?.number,
          hotelSlug: failContext?.hotel?.slug,
          roomCode: failRoom?.code,
          amount: Number(updated.amount),
          currency: updated.currency,
        },
      });

      return NextResponse.json(
        {
          error:
            result.errorMessage ?? "Payment was not completed.",
          status: finalStatus,
        },
        { status: 402 }
      );
    }

    const created = await prisma.request.create({
      data: {
        hotelId: payment.hotelId,
        roomId: payment.roomId,
        serviceId: payment.serviceId,
        notes: payment.notes ?? null,
        status: RequestStatus.NEW,
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

    return NextResponse.json({
      request: created,
      status: finalStatus,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Confirm failed",
      },
      { status: 500 }
    );
  }
}
