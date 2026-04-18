import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { FeedbackSentiment, FeedbackStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await requireSessionUser();
    const { searchParams } = new URL(req.url);
    const sentimentParam = searchParams.get("sentiment");
    const statusParam = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 200);

    const sentiment =
      sentimentParam === "POSITIVE" || sentimentParam === "NEGATIVE"
        ? (sentimentParam as FeedbackSentiment)
        : undefined;
    const status =
      statusParam === "NEW" ||
      statusParam === "IN_REVIEW" ||
      statusParam === "RESOLVED"
        ? (statusParam as FeedbackStatus)
        : undefined;

    const items = await prisma.feedback.findMany({
      where: {
        hotelId: user.hotelId!,
        sentiment,
        status,
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        request: {
          select: {
            id: true,
            createdAt: true,
            completedAt: true,
            service: { select: { id: true, name: true } },
            room: { select: { id: true, number: true } },
          },
        },
      },
    });

    const summary = await prisma.feedback.groupBy({
      by: ["sentiment", "status"],
      where: { hotelId: user.hotelId! },
      _count: { _all: true },
    });

    return NextResponse.json({ items, summary });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[feedback GET]", error);
    return NextResponse.json(
      { error: "Failed to load feedback" },
      { status: 500 }
    );
  }
}
