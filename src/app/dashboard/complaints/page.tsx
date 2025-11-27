import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ComplaintsClient } from "@/components/dashboard/ComplaintsClient";

export default async function ComplaintsPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  try {
    // Fetch complaints
    const complaints = await prisma.complaint.findMany({
      where: { hotelId },
      include: {
        room: true,
        request: {
          include: {
            service: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch staff for assignment
    const staff = await prisma.user.findMany({
      where: {
        hotelId,
        role: { in: ["STAFF", "MANAGER", "ADMIN"] },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return (
      <ComplaintsClient 
        initialComplaints={complaints.map(c => ({
          id: c.id,
          type: c.type,
          description: c.description,
          status: c.status,
          priority: c.priority,
          roomNumber: c.room.number,
          serviceName: c.request?.service?.name || null,
          createdAt: c.createdAt,
          resolvedAt: c.resolvedAt || null,
          assignee: c.assignee?.name || null,
          assigneeId: c.assignee?.id || null,
        }))}
        staff={staff}
        hotelId={hotelId}
      />
    );
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Complaints</h1>
        <p className="text-gray-600">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
      </div>
    );
  }

}

