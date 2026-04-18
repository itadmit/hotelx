import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";

export async function POST() {
  try {
    const user = await requireSessionUser();

    await prisma.notification.updateMany({
      where: {
        hotelId: user.hotelId!,
        audience: "STAFF",
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[notifications.readAll] error", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
