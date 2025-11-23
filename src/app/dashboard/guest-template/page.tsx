import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GuestTemplateClient } from "@/components/dashboard/GuestTemplateClient";

export default async function GuestTemplatePage() {
  const session = await auth();
  
  const hotelId = session?.user?.hotelId;
  
  if (!hotelId || typeof hotelId !== 'string') {
    redirect("/onboarding");
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      categories: {
        where: {
          parentId: null, // Only show main categories in template editor
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!hotel) {
    redirect("/onboarding");
  }

  return <GuestTemplateClient hotel={hotel} />;
}

