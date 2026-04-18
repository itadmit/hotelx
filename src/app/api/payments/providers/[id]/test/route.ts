import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { loadAdapterFromRow } from "@/lib/payments/registry";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const provider = await prisma.paymentProvider.findFirst({
      where: { id, hotelId: user.hotelId! },
    });
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    const adapter = loadAdapterFromRow(provider);
    const result = await adapter.test();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Test failed",
      },
      { status: 500 }
    );
  }
}
