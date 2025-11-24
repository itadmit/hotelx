import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { HotelSettingsClient } from "@/components/dashboard/HotelSettingsClient";

export default async function HotelSettingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;
  
  if (!hotelId || typeof hotelId !== 'string') {
    // User doesn't have a hotel assigned - redirect to onboarding to complete setup
    redirect("/onboarding");
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: {
      id: true,
      name: true,
      logo: true,
      primaryColor: true,
      wifiName: true,
      language: true,
      currency: true,
    }
  });

  if (!hotel) {
    // Hotel doesn't exist - user needs to complete registration
    console.error(`Hotel with ID ${hotelId} not found for user ${session.user.email}`);
    redirect("/signup");
  }

  return <HotelSettingsClient hotel={hotel} />;
}
