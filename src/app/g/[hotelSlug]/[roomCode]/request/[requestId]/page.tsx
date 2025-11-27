import { Suspense } from "react";
import { RequestStatusSkeleton } from "@/components/guest/skeletons/RequestStatusSkeleton";
import { RequestStatusClient } from "@/components/guest/RequestStatusClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function RequestStatusContent({
  hotelSlug,
  roomCode,
  requestId,
}: {
  hotelSlug: string;
  roomCode: string;
  requestId: string;
}) {

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      service: true,
      hotel: true,
      room: true,
    },
  });

  if (!request || request.hotel.slug !== hotelSlug) {
    return notFound();
  }

  return (
    <RequestStatusClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      hotelName={request.hotel.name}
      requestId={request.id}
      status={request.status}
      serviceName={request.service.name}
      roomNumber={request.room.number}
      price={request.service.price ? String(request.service.price) : null}
      currency={request.service.currency}
      estimatedTime={request.service.estimatedTime}
      createdAt={request.createdAt}
      guestName={request.guestName}
      guestPhone={request.guestPhone}
      guestEmail={request.guestEmail}
      notes={request.notes}
    />
  );
}

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; requestId: string }>;
}) {
  const { hotelSlug, roomCode, requestId } = await params;

  return (
    <Suspense fallback={<RequestStatusSkeleton />}>
      <RequestStatusContent hotelSlug={hotelSlug} roomCode={roomCode} requestId={requestId} />
    </Suspense>
  );
}
