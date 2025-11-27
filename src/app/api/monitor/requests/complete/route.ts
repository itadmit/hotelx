import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    await prisma.request.update({
      where: { id: requestId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete request" },
      { status: 500 }
    );
  }
}



