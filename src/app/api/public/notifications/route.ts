import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolveGuestScope } from "@/lib/notifications/guest-scope";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = await resolveGuestScope(
    searchParams.get("hotelSlug"),
    searchParams.get("roomCode")
  );

  if (!scope) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const unreadOnly = searchParams.get("unread") === "1";
  const take = Math.min(
    Math.max(Number(searchParams.get("take") ?? "30"), 1),
    100
  );

  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        hotelId: scope.hotelId,
        roomId: scope.roomId,
        audience: "GUEST",
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.notification.count({
      where: {
        hotelId: scope.hotelId,
        roomId: scope.roomId,
        audience: "GUEST",
        readAt: null,
      },
    }),
  ]);

  return NextResponse.json({ items, unreadCount });
}
