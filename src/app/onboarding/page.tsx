import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OnboardingClient } from "@/components/dashboard/OnboardingClient";

export default async function OnboardingPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;
  
  // If user already has a hotel, redirect to dashboard
  if (hotelId && typeof hotelId === 'string') {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { id: true }
    });
    
    if (hotel) {
      redirect("/dashboard");
    }
  }

  return <OnboardingClient userEmail={session.user.email || ""} />;
}



