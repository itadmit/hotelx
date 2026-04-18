import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const ONE_DAY = 60 * 60 * 24;

function guestCookieName(hotelSlug: string) {
  return `hotelx_guest_${hotelSlug.replace(/[^a-z0-9-]/gi, "_")}`;
}

export async function POST(request: Request) {
  let payload: {
    hotelSlug?: string;
    roomCode?: string;
    roomNumber?: string;
    guestName?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hotelSlug = payload.hotelSlug?.trim();
  const roomCodeRaw = payload.roomCode?.trim();
  const roomNumberRaw = payload.roomNumber?.trim();
  const guestName = payload.guestName?.trim() ?? "";

  if (!hotelSlug) {
    return NextResponse.json(
      { error: "Missing hotelSlug." },
      { status: 400 }
    );
  }

  let room: { code: string } | null = null;

  if (roomNumberRaw && roomCodeRaw) {
    const roomNumber = roomNumberRaw.toUpperCase().replace(/\s+/g, "");
    const roomCode = roomCodeRaw.toUpperCase().replace(/\s+/g, "");

    room = await prisma.room.findFirst({
      where: {
        hotel: { slug: hotelSlug },
        OR: [{ number: roomNumberRaw }, { number: roomNumber }],
      },
      select: { code: true },
    });

    const normalizedStoredCode = room?.code.toUpperCase().replace(/\s+/g, "");
    if (!room || normalizedStoredCode !== roomCode) {
      return NextResponse.json(
        { error: "Invalid room number or password." },
        { status: 401 }
      );
    }
  } else if (roomCodeRaw) {
    const roomCode = roomCodeRaw.toUpperCase().replace(/\s+/g, "");

    room = await prisma.room.findFirst({
      where: {
        hotel: { slug: hotelSlug },
        OR: [{ code: roomCode }, { number: roomCodeRaw }, { number: roomCode }],
      },
      select: { code: true },
    });
  } else {
    return NextResponse.json(
      { error: "Missing room credentials." },
      { status: 400 }
    );
  }

  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  if (guestName.length >= 2) {
    const safeName = guestName.slice(0, 80);
    const cookieStore = await cookies();
    cookieStore.set(guestCookieName(hotelSlug), safeName, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_DAY * 14,
      path: "/",
    });
  }

  return NextResponse.json({ roomCode: room.code });
}

// Keep GET for legacy callers (no name persisted)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelSlug = searchParams.get("hotelSlug")?.trim();
  const roomCodeRaw = searchParams.get("roomCode")?.trim();

  if (!hotelSlug || !roomCodeRaw) {
    return NextResponse.json(
      { error: "Missing hotelSlug or roomCode." },
      { status: 400 }
    );
  }

  const roomCode = roomCodeRaw.toUpperCase().replace(/\s+/g, "");

  const room = await prisma.room.findFirst({
    where: {
      hotel: { slug: hotelSlug },
      OR: [
        { code: roomCode },
        { number: roomCodeRaw },
        { number: roomCode },
      ],
    },
    select: { code: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  return NextResponse.json({ roomCode: room.code });
}
