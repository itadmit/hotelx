import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { RoomsClient } from "@/components/dashboard/RoomsClient";

export default async function RoomsPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { slug: true }
  });

  const rooms = await prisma.room.findMany({
    where: { hotelId },
    orderBy: { number: 'asc' },
    include: {
      requests: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: {
          createdAt: true
        }
      }
    }
  });

  const formattedRooms = rooms.map(room => ({
    id: room.id,
    number: room.number,
    type: room.type || "Standard",
    status: room.status,
    code: room.code,
    lastActivity: room.requests[0] 
      ? formatTimeAgo(room.requests[0].createdAt)
      : "No activity"
  }));

  return <RoomsClient rooms={formattedRooms} hotelSlug={hotel?.slug || ""} />;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
