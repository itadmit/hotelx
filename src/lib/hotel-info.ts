import "server-only";
import prisma from "@/lib/prisma";

export type HotelInfoBundle = {
  hotelId: string;
  hotelName: string;
  info: {
    wifiName: string | null;
    wifiPassword: string | null;
    wifiNotes: string | null;
    about: string | null;
    helpfulInfo: string | null;
  } | null;
  amenities: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    hours: string | null;
    location: string | null;
  }>;
};

/**
 * Server-side helper used by every /g/[hotelSlug]/[roomCode]/info/* page.
 * Fetches the hotel info row and amenities in a single round-trip.
 */
export async function loadHotelInfoBundle(
  hotelSlug: string
): Promise<HotelInfoBundle | null> {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    select: {
      id: true,
      name: true,
      info: {
        select: {
          wifiName: true,
          wifiPassword: true,
          wifiNotes: true,
          about: true,
          helpfulInfo: true,
        },
      },
      amenities: {
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          hours: true,
          location: true,
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
    },
  });
  if (!hotel) return null;
  return {
    hotelId: hotel.id,
    hotelName: hotel.name,
    info: hotel.info ?? null,
    amenities: hotel.amenities,
  };
}
