import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { RequestsClient } from "@/components/dashboard/RequestsClient";

export default async function RequestsPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  // Fetch staff members for assignment
  const staff = await prisma.user.findMany({
    where: { 
      hotelId,
      role: { in: ['STAFF', 'MANAGER'] }
    },
    select: {
      id: true,
      name: true,
    },
  });

  const requests = await prisma.request.findMany({
    where: { hotelId },
    include: {
      room: {
        select: {
          number: true
        }
      },
      service: {
        select: {
          name: true,
          customFields: true
        }
      },
      assignee: {
        select: {
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch rooms and services for create/edit forms
  const rooms = await prisma.room.findMany({
    where: { hotelId },
    select: {
      id: true,
      number: true,
    },
    orderBy: { number: 'asc' },
  });

  const services = await prisma.service.findMany({
    where: { hotelId },
    select: {
      id: true,
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const formattedRequests = requests.map(req => ({
    id: req.id,
    room: req.room.number,
    service: req.service.name,
    serviceId: req.serviceId,
    roomId: req.roomId,
    status: req.status,
    time: formatTimeAgo(req.createdAt),
    assignee: req.assignee?.name || "Unassigned",
    priority: "Normal" as const, // You can add priority field to schema later
    quantity: req.quantity,
    customFieldsData: req.customFieldsData,
    customFields: req.service.customFields,
    guestName: req.guestName,
    guestPhone: req.guestPhone,
    guestEmail: req.guestEmail,
    notes: req.notes
  }));

  return <RequestsClient 
    initialRequests={formattedRequests} 
    staff={staff}
    rooms={rooms}
    services={services}
    hotelId={hotelId}
  />;
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
