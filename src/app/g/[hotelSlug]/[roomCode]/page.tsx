import { Suspense } from "react";
import { GuestHomeSkeleton } from "@/components/guest/skeletons/GuestHomeSkeleton";
import { GuestHomeClient } from "@/components/guest/GuestHomeClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function GuestHomeContent({
  hotelSlug,
  roomCode,
}: {
  hotelSlug: string;
  roomCode: string;
}) {

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        where: { 
          isActive: true,
          parentId: null, // Only show main categories, not sub-categories
        },
        orderBy: { order: 'asc' },
      },
      services: {
        where: { isActive: true },
        take: 6,
      }
    }
  });

  if (!hotel) {
    return notFound();
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room || room.hotelId !== hotel.id) {
    return notFound();
  }

  return (
    <GuestHomeClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      hotelName={hotel.name}
      roomNumber={room.number}
      primaryColor={hotel.primaryColor}
      coverImage={hotel.coverImage}
      logo={hotel.logo}
      categories={hotel.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        customName: cat.customName,
        icon: cat.icon,
        emoji: cat.emoji,
        bgImage: cat.bgImage,
        slug: cat.slug,
      }))}
      services={hotel.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        estimatedTime: service.estimatedTime,
        isRecommended: service.isRecommended,
        isNew: service.isNew,
        isHot: service.isHot,
        isVegetarian: service.isVegetarian,
        isVegan: service.isVegan,
      }))}
    />
  );
}

export default async function GuestHome({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  return (
    <Suspense fallback={<GuestHomeSkeleton />}>
      <GuestHomeContent hotelSlug={hotelSlug} roomCode={roomCode} />
    </Suspense>
  );
}
