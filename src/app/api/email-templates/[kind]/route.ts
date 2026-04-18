import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { EmailTemplateKind } from "@prisma/client";

const VALID_KINDS = new Set(Object.values(EmailTemplateKind));

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { kind } = await params;
    if (!VALID_KINDS.has(kind as EmailTemplateKind)) {
      return NextResponse.json({ error: "Invalid template kind" }, { status: 400 });
    }
    await prisma.hotelEmailTemplate.deleteMany({
      where: { hotelId: user.hotelId!, kind: kind as EmailTemplateKind },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[email-templates DELETE]", error);
    return NextResponse.json(
      { error: "Failed to reset template" },
      { status: 500 }
    );
  }
}
