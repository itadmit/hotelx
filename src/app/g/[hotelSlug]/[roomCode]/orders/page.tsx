import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AllOrdersClient } from "@/components/guest/AllOrdersClient";
import { GuestHomeSkeleton } from "@/components/guest/skeletons/GuestHomeSkeleton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function AllOrdersContent({
  hotelSlug,
  roomCode,
}: {
  hotelSlug: string;
  roomCode: string;
}) {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
  });

  if (!hotel) {
    return notFound();
  }

  const room = await prisma.room.findFirst({
    where: { 
      number: roomCode,
      hotelId: hotel.id
    },
  });

  if (!room) {
    return notFound();
  }

  // Fetch ALL requests for this room (not just recent ones)
  const allRequests = await prisma.request.findMany({
    where: {
      hotelId: hotel.id,
      roomId: room.id,
    },
    include: {
      service: true
    },
    orderBy: {
      createdAt: 'desc'
    },
  });

  return (
    <AllOrdersClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      hotelName={hotel.name}
      roomNumber={room.number}
      requests={allRequests}
      primaryColor={hotel.primaryColor}
    />
  );
}

export default async function AllOrdersPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  return (
    <Suspense fallback={<GuestHomeSkeleton />}>
      <AllOrdersContent hotelSlug={hotelSlug} roomCode={roomCode} />
    </Suspense>
  );
}



