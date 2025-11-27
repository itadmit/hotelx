import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AboutHotelClient } from "@/components/guest/AboutHotelClient";
import { GuestHomeSkeleton } from "@/components/guest/skeletons/GuestHomeSkeleton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function AboutHotelContent({
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

  return (
    <AboutHotelClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      hotelName={hotel.name}
      hotelDescription={hotel.description}
      hotelLogo={hotel.logo}
      wifiName={hotel.wifiName}
      wifiPassword={hotel.wifiPassword}
      primaryColor={hotel.primaryColor}
      roomNumber={room.number}
    />
  );
}

export default async function AboutHotelPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  return (
    <Suspense fallback={<GuestHomeSkeleton />}>
      <AboutHotelContent hotelSlug={hotelSlug} roomCode={roomCode} />
    </Suspense>
  );
}



