import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "1";
    const take = Math.min(
      Math.max(Number(searchParams.get("take") ?? "30"), 1),
      100
    );

    const [items, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          hotelId: user.hotelId!,
          audience: "STAFF",
          ...(unreadOnly ? { readAt: null } : {}),
        },
        orderBy: { createdAt: "desc" },
        take,
      }),
      prisma.notification.count({
        where: {
          hotelId: user.hotelId!,
          audience: "STAFF",
          readAt: null,
        },
      }),
    ]);

    return NextResponse.json({ items, unreadCount });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[notifications.list] error", error);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
