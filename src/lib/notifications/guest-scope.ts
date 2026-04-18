import prisma from "@/lib/prisma";

export type GuestScope = {
  hotelId: string;
  roomId: string;
  hotelSlug: string;
  roomCode: string;
};

export async function resolveGuestScope(
  hotelSlugRaw: string | null,
  roomCodeRaw: string | null
): Promise<GuestScope | null> {
  const hotelSlug = hotelSlugRaw?.trim();
  const roomInput = roomCodeRaw?.trim();
  if (!hotelSlug || !roomInput) return null;

  const normalized = roomInput.toUpperCase().replace(/\s+/g, "");

  const room = await prisma.room.findFirst({
    where: {
      hotel: { slug: hotelSlug },
      OR: [
        { code: normalized },
        { number: roomInput },
        { number: normalized },
      ],
    },
    select: {
      id: true,
      code: true,
      hotel: { select: { id: true, slug: true } },
    },
  });

  if (!room) return null;

  return {
    hotelId: room.hotel.id,
    roomId: room.id,
    hotelSlug: room.hotel.slug,
    roomCode: room.code,
  };
}
