import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const target = await prisma.paymentProvider.findFirst({
      where: { id, hotelId: user.hotelId! },
    });
    if (!target) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    await prisma.$transaction(async (tx) => {
      await tx.paymentProvider.updateMany({
        where: { hotelId: user.hotelId! },
        data: { isDefault: false },
      });
      await tx.paymentProvider.update({
        where: { id },
        data: { isDefault: true, isActive: true },
      });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to set default" },
      { status: 500 }
    );
  }
}
