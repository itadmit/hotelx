import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GuestHomeMaison } from "@/components/guest-preview/GuestHomeMaison";

export default async function GuestPreviewPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        where: { parentId: null },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
      services: {
        where: { isActive: true },
        take: 12,
        orderBy: { name: "asc" },
      },
      rooms: {
        where: { code: roomCode },
        select: { id: true, number: true },
      },
    },
  });

  if (!hotel || hotel.rooms.length === 0) {
    notFound();
  }

  const room = hotel.rooms[0];
  const classicGuestPath = `/g/${hotelSlug}/${roomCode}`;

  return (
    <GuestHomeMaison
      hotelName={hotel.name}
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      roomNumber={room.number}
      categories={hotel.categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        slug: c.slug,
      }))}
      services={hotel.services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price != null ? String(s.price) : null,
        estimatedTime: s.estimatedTime,
      }))}
      classicGuestPath={classicGuestPath}
    />
  );
}
