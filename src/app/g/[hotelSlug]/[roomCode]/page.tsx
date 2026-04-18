import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GuestHome } from "@/components/guest/GuestHome";

export default async function GuestHomePage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        take: 5,
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

  return (
    <GuestHome
      hotelName={hotel.name}
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      roomNumber={room.number}
      categories={hotel.categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
      }))}
      services={hotel.services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price != null ? String(s.price) : null,
        estimatedTime: s.estimatedTime,
      }))}
    />
  );
}
