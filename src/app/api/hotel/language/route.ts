import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.hotelId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotelId = session.user.hotelId as string;
    
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      select: {
        language: true,
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ language: hotel.language || "en" });
  } catch (error) {
    console.error("Error fetching hotel language:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



