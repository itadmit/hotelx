import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hotelId = searchParams.get("hotelId");
    const categoryId = searchParams.get("categoryId");

    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const where: any = {
      hotelId,
      status: "NEW",
    };

    let categoryName = "All Departments";

    // If specific category, filter by it
    if (categoryId && categoryId !== "all") {
      where.service = {
        categoryId: categoryId,
      };

      // Get category name
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true },
      });

      if (category) {
        categoryName = category.name;
      }
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        room: {
          select: {
            number: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first (most urgent)
      },
    });

    return NextResponse.json({
      categoryName,
      requests: requests.map((req) => ({
        id: req.id,
        room: req.room.number,
        service: req.service.name,
        notes: req.notes,
        createdAt: req.createdAt.toISOString(),
        status: req.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching monitor requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}



