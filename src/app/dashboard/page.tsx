import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimeRangeToggle, type TimeRange } from "@/components/ui/time-range-toggle";
import { 
  ArrowUpRight, 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  CalendarRange,
  Clock,
  Utensils
} from "lucide-react";
import prisma from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  // Fetch real data
  const [
    totalRooms,
    activeRooms,
    totalRequests,
    recentRequests,
    requestsWithServices
  ] = await Promise.all([
    prisma.room.count({
      where: { hotelId }
    }),
    prisma.room.count({
      where: { 
        hotelId,
        status: "ACTIVE"
      }
    }),
    prisma.request.count({
      where: { hotelId }
    }),
    prisma.request.findMany({
      where: { hotelId },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        service: true,
        assignee: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.request.findMany({
      where: { hotelId },
      include: {
        service: {
          select: {
            price: true
          }
        }
      }
    })
  ]);

  // Calculate stats
  const occupancyRate = totalRooms > 0 ? Math.round((activeRooms / totalRooms) * 100) : 0;
  const activeRequests = await prisma.request.count({
    where: {
      hotelId,
      status: { in: ["NEW", "IN_PROGRESS"] }
    }
  });

  // Calculate total revenue from requests
  const revenue = requestsWithServices.reduce((sum, req) => {
    return sum + (req.service.price ? Number(req.service.price) : 0);
  }, 0);

  // Calculate monthly revenue for the last 12 months
  const monthlyRevenue = calculateMonthlyRevenue(requestsWithServices);

  // Format recent requests
  const formattedRequests = recentRequests.map(req => ({
    id: req.id,
    room: req.room.number,
    service: req.service.name,
    status: req.status,
    time: formatTimeAgo(req.createdAt),
    assignee: req.assignee?.name || "Unassigned"
  }));

  return (
    <DashboardClient 
      stats={{
        revenue: revenue,
        occupancy: occupancyRate,
        guests: activeRooms, // Using active rooms as proxy
        requests: activeRequests
      }}
      recentRequests={formattedRequests}
      monthlyRevenue={monthlyRevenue}
    />
  );
}

function calculateMonthlyRevenue(requests: Array<{ createdAt: Date; service: { price: any } }>): number[] {
  const now = new Date();
  const monthlyData: { [key: string]: number } = {};
  const monthKeys: string[] = [];
  
  // Initialize last 12 months in order
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = date.getMonth().toString().padStart(2, '0');
    const key = `${date.getFullYear()}-${monthStr}`;
    monthlyData[key] = 0;
    monthKeys.push(key);
  }

  // Calculate revenue per month
  requests.forEach(req => {
    const date = new Date(req.createdAt);
    const monthStr = date.getMonth().toString().padStart(2, '0');
    const key = `${date.getFullYear()}-${monthStr}`;
    if (monthlyData.hasOwnProperty(key)) {
      monthlyData[key] += req.service.price ? Number(req.service.price) : 0;
    }
  });

  // Convert to array in correct order and normalize to percentages (0-100)
  const values = monthKeys.map(key => monthlyData[key]);
  const maxValue = Math.max(...values, 1); // Avoid division by zero
  
  return values.map(val => Math.round((val / maxValue) * 100));
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
