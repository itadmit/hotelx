import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { FeedbackStatus } from "@prisma/client";
import { z } from "zod";

const patchSchema = z.object({
  status: z.nativeEnum(FeedbackStatus).optional(),
  resolutionNote: z.string().max(500).optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { feedbackId } = await params;
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const existing = await prisma.feedback.findFirst({
      where: { id: feedbackId, hotelId: user.hotelId! },
      select: { id: true, status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    const data: {
      status?: FeedbackStatus;
      resolutionNote?: string | null;
      resolvedAt?: Date | null;
      resolvedById?: string | null;
    } = {};

    if (parsed.data.status !== undefined) {
      data.status = parsed.data.status;
      if (parsed.data.status === FeedbackStatus.RESOLVED) {
        data.resolvedAt = new Date();
        data.resolvedById = user.id;
      } else {
        data.resolvedAt = null;
        data.resolvedById = null;
      }
    }
    if (parsed.data.resolutionNote !== undefined) {
      data.resolutionNote = parsed.data.resolutionNote;
    }

    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data,
    });

    return NextResponse.json({ feedback: updated });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[feedback PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}
