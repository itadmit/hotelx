import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TeamClient } from "@/components/dashboard/TeamClient";

export default async function TeamPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  const users = await prisma.user.findMany({
    where: { hotelId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedMembers = users.map(user => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email,
    role: user.role,
    status: "Active" as const, // You can add lastActive tracking later
    lastActive: formatTimeAgo(user.updatedAt),
    avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "U",
    color: getColorForUser(user.role)
  }));

  return <TeamClient members={formattedMembers} />;
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
  if (diffDays < 7) return `${diffDays}d ago`;
  return "Long time ago";
}

function getColorForUser(role: string): string {
  const colorMap: Record<string, string> = {
    "ADMIN": "bg-indigo-100 text-indigo-700",
    "MANAGER": "bg-pink-100 text-pink-700",
    "STAFF": "bg-blue-100 text-blue-700",
  };
  return colorMap[role] || "bg-gray-100 text-gray-700";
}
