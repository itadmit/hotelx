import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hotelId = searchParams.get("hotelId");

    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { hotelId },
      include: {
        _count: {
          select: { services: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

