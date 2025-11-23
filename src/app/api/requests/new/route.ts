import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lastChecked = searchParams.get("lastChecked");
    const hotelId = searchParams.get("hotelId");

    // אם אין hotelId, נחזיר רשימה ריקה (בעתיד נוסיף אימות משתמש)
    if (!hotelId) {
      return NextResponse.json({ requests: [] });
    }

    const where: any = {
      hotelId,
      status: "NEW",
    };

    // אם יש lastChecked, נבדוק רק הזמנות שנוצרו אחרי הזמן הזה
    if (lastChecked) {
      where.createdAt = {
        gt: new Date(lastChecked),
      };
    }

    const newRequests = await prisma.request.findMany({
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
        createdAt: "desc",
      },
      take: 10, // מקסימום 10 הזמנות חדשות
    });

    return NextResponse.json({
      requests: newRequests.map((req) => ({
        id: req.id,
        room: req.room.number,
        service: req.service.name,
        notes: req.notes,
        createdAt: req.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching new requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch new requests" },
      { status: 500 }
    );
  }
}

