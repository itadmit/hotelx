import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireSuperAdmin();

    const [users, hotels, rooms, requests, feedbacks, emailLogs] =
      await Promise.all([
        prisma.user.count(),
        prisma.hotel.count(),
        prisma.room.count(),
        prisma.request.count(),
        prisma.feedback.count(),
        prisma.emailLog.count(),
      ]);

    return NextResponse.json({
      users,
      hotels,
      rooms,
      requests,
      feedbacks,
      emailLogs,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
