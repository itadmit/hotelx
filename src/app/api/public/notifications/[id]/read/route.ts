import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolveGuestScope } from "@/lib/notifications/guest-scope";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const scope = await resolveGuestScope(
    searchParams.get("hotelSlug"),
    searchParams.get("roomCode")
  );

  if (!scope) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const markUnread = body?.read === false;

  const result = await prisma.notification.updateMany({
    where: {
      id,
      hotelId: scope.hotelId,
      roomId: scope.roomId,
      audience: "GUEST",
    },
    data: {
      readAt: markUnread ? null : new Date(),
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Notification not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
