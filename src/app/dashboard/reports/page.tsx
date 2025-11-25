import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ReportsClient } from "@/components/dashboard/ReportsClient";

export default async function ReportsPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  const [
    totalRequests,
    completedRequests,
    topService
  ] = await Promise.all([
    prisma.request.count({ where: { hotelId } }),
    prisma.request.count({ 
      where: { 
        hotelId,
        status: "COMPLETED"
      }
    }),
    prisma.request.groupBy({
      by: ['serviceId'],
      where: { hotelId },
      _count: true,
      orderBy: {
        _count: {
          serviceId: 'desc'
        }
      },
      take: 1
    })
  ]);

  const completionRate = totalRequests > 0 
    ? Math.round((completedRequests / totalRequests) * 100)
    : 0;

  let topServiceName = "N/A";
  if (topService.length > 0) {
    const service = await prisma.service.findUnique({
      where: { id: topService[0].serviceId },
      select: { name: true }
    });
    topServiceName = service?.name || "N/A";
  }

  return (
    <ReportsClient 
      totalRequests={totalRequests}
      completionRate={completionRate}
      topServiceName={topServiceName}
      topServiceCount={topService.length > 0 ? topService[0]._count : 0}
    />
  );
}
