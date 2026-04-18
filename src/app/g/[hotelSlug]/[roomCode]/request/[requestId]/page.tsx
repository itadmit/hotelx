import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  RequestStatusClient,
  type RequestStatusData,
} from "@/components/guest/RequestStatusClient";

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; requestId: string }>;
}) {
  const { hotelSlug, roomCode, requestId } = await params;
  const request = await prisma.request.findFirst({
    where: {
      id: requestId,
      hotel: { slug: hotelSlug },
      room: { code: roomCode },
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      notes: true,
      service: {
        select: {
          name: true,
          estimatedTime: true,
          price: true,
        },
      },
      room: {
        select: {
          number: true,
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  const initialRequest: RequestStatusData = {
    id: request.id,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    notes: request.notes,
    service: {
      name: request.service.name,
      estimatedTime: request.service.estimatedTime,
      price: request.service.price ? String(request.service.price) : null,
    },
    room: {
      number: request.room.number,
    },
  };

  return (
    <RequestStatusClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      requestId={requestId}
      initialRequest={initialRequest}
    />
  );
}
