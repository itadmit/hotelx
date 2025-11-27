import { getGuestSession } from "@/lib/guestSession";
import { SettingsClient } from "@/components/guest/SettingsClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SettingsPageProps {
  params: Promise<{
    hotelSlug: string;
    roomCode: string;
  }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { hotelSlug, roomCode } = await params;

  // Get hotel
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    select: {
      id: true,
      name: true,
      language: true,
      currency: true,
    },
  });

  if (!hotel) {
    notFound();
  }

  // Get guest session
  const session = await getGuestSession(hotelSlug, roomCode);

  return (
    <SettingsClient
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      hotelName={hotel.name}
      defaultLanguage={hotel.language || "en"}
      defaultCurrency={hotel.currency || "USD"}
      guestSession={session ? {
        fullName: session.fullName,
        phoneNumber: session.phoneNumber,
        email: session.email,
        isGuestMode: session.isGuestMode,
      } : null}
    />
  );
}


