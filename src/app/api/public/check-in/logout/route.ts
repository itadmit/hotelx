import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function guestCookieName(hotelSlug: string) {
  return `hotelx_guest_${hotelSlug.replace(/[^a-z0-9-]/gi, "_")}`;
}

export async function POST(request: Request) {
  let payload: { hotelSlug?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hotelSlug = payload.hotelSlug?.trim();
  if (!hotelSlug) {
    return NextResponse.json({ error: "Missing hotelSlug." }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(guestCookieName(hotelSlug), "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
