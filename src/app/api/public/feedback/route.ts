import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  FeedbackSentiment,
  FeedbackStatus,
  RequestStatus,
} from "@prisma/client";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { emitNotification } from "@/lib/notifications/emit";

const feedbackSchema = z.object({
  requestId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
  guestName: z.string().max(120).optional().nullable(),
  guestEmail: z.string().email().optional().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }

  const { requestId, rating, comment, guestName, guestEmail } = parsed.data;

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      hotel: {
        select: {
          id: true,
          name: true,
          slug: true,
          feedbackEnabled: true,
          feedbackThreshold: true,
          googleReviewUrl: true,
          bookingReviewUrl: true,
          supportEmail: true,
        },
      },
      service: { select: { name: true } },
      room: { select: { id: true, number: true, code: true } },
      feedback: { select: { id: true } },
    },
  });

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  if (!request.hotel.feedbackEnabled) {
    return NextResponse.json(
      { error: "Feedback is disabled for this property" },
      { status: 403 }
    );
  }
  if (request.feedback) {
    return NextResponse.json(
      { error: "Feedback was already submitted for this request" },
      { status: 409 }
    );
  }
  if (request.status !== RequestStatus.COMPLETED) {
    return NextResponse.json(
      { error: "Feedback can only be left after the request is completed" },
      { status: 400 }
    );
  }

  const threshold = request.hotel.feedbackThreshold ?? 4;
  const sentiment: FeedbackSentiment =
    rating >= threshold ? FeedbackSentiment.POSITIVE : FeedbackSentiment.NEGATIVE;

  const feedback = await prisma.feedback.create({
    data: {
      hotelId: request.hotel.id,
      requestId: request.id,
      rating,
      comment: comment ?? null,
      guestName: guestName ?? null,
      guestEmail: guestEmail ?? null,
      sentiment,
      status: FeedbackStatus.NEW,
    },
  });

  const baseCtx = {
    serviceName: request.service.name,
    roomNumber: request.room.number,
    hotelSlug: request.hotel.slug,
    roomCode: request.room.code,
    requestId: request.id,
  };

  if (sentiment === FeedbackSentiment.NEGATIVE) {
    void emitNotification({
      hotelId: request.hotel.id,
      audience: "STAFF",
      type: "FEEDBACK_ESCALATION",
      roomId: request.room.id,
      requestId: request.id,
      context: baseCtx,
      metadata: { feedbackId: feedback.id, rating },
    });
  } else {
    void emitNotification({
      hotelId: request.hotel.id,
      audience: "STAFF",
      type: "FEEDBACK_RECEIVED",
      roomId: request.room.id,
      requestId: request.id,
      context: baseCtx,
      metadata: { feedbackId: feedback.id, rating },
    });
  }

  if (guestEmail) {
    const primaryReviewUrl =
      request.hotel.googleReviewUrl ?? request.hotel.bookingReviewUrl ?? "";
    void sendTemplatedEmail({
      to: guestEmail,
      hotelId: request.hotel.id,
      template:
        sentiment === FeedbackSentiment.POSITIVE
          ? "FEEDBACK_THANKS"
          : "FEEDBACK_APOLOGY",
      replyTo: request.hotel.supportEmail ?? undefined,
      fromName: request.hotel.name,
      variables: {
        guestName: guestName ?? "guest",
        hotelName: request.hotel.name,
        serviceName: request.service.name,
        roomNumber: request.room.number,
        rating,
        primaryReviewUrl,
        googleReviewUrl: request.hotel.googleReviewUrl ?? "",
        bookingReviewUrl: request.hotel.bookingReviewUrl ?? "",
      },
    });
  }

  return NextResponse.json({
    feedback: {
      id: feedback.id,
      sentiment: feedback.sentiment,
      rating: feedback.rating,
    },
    reviewLinks:
      sentiment === FeedbackSentiment.POSITIVE
        ? {
            google: request.hotel.googleReviewUrl ?? null,
            booking: request.hotel.bookingReviewUrl ?? null,
          }
        : null,
  });
}
