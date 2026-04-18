import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolveGuestScope } from "@/lib/notifications/guest-scope";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = await resolveGuestScope(
    searchParams.get("hotelSlug"),
    searchParams.get("roomCode")
  );

  if (!scope) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  await prisma.notification.updateMany({
    where: {
      hotelId: scope.hotelId,
      roomId: scope.roomId,
      audience: "GUEST",
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
