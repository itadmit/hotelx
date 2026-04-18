import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { GuestHome } from "@/components/guest/GuestHome";

function guestCookieName(hotelSlug: string) {
  return `hotelx_guest_${hotelSlug.replace(/[^a-z0-9-]/gi, "_")}`;
}

function firstName(full: string | null | undefined): string | null {
  if (!full) return null;
  const trimmed = full.trim();
  if (!trimmed) return null;
  const first = trimmed.split(/\s+/)[0] ?? "";
  if (!first) return null;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default async function GuestHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { hotelSlug, roomCode } = await params;
  const sp = (await searchParams) ?? {};
  const isDemo = sp.demo === "1" || sp.demo === "true";

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    select: {
      id: true,
      name: true,
      categories: {
        where: { parentId: null },
        select: {
          id: true,
          name: true,
          icon: true,
          slug: true,
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
      services: {
        select: {
          id: true,
          name: true,
          price: true,
          estimatedTime: true,
        },
        where: { isActive: true },
        orderBy: { name: "asc" },
        take: 12,
      },
      rooms: {
        where: { code: roomCode },
        select: { id: true, number: true },
      },
    },
  });

  if (!hotel || hotel.rooms.length === 0) {
    notFound();
  }

  const room = hotel.rooms[0];

  // Pick the most premium paid service as "tonight's offer" — falls back to most
  // expensive service of any kind, then to the first one alphabetically.
  const featuredCandidate = await prisma.service.findFirst({
    where: {
      hotelId: hotel.id,
      isActive: true,
      price: { not: null, gt: 0 },
    },
    select: {
      id: true,
      name: true,
      price: true,
      estimatedTime: true,
    },
    orderBy: [{ price: "desc" }, { name: "asc" }],
  });

  const featured = featuredCandidate ?? hotel.services[0] ?? null;

  // Grid services: skip the featured one so it doesn't show up twice.
  const gridServices = hotel.services.filter((s) => s.id !== featured?.id);

  const orderedServices = [
    ...(featured ? [featured] : []),
    ...gridServices,
  ].slice(0, 10);

  const displayName = isDemo ? "Plaza Hotel" : hotel.name;
  const logoLetter = isDemo ? "H" : undefined;

  const cookieStore = await cookies();
  const guestCookie = cookieStore.get(guestCookieName(hotelSlug));
  const guestFirstName = firstName(guestCookie?.value);

  return (
    <GuestHome
      hotelName={displayName}
      logoLetter={logoLetter}
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      roomNumber={room.number}
      guestFirstName={guestFirstName}
      categories={hotel.categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        slug: c.slug,
      }))}
      services={orderedServices.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price != null ? String(s.price) : null,
        estimatedTime: s.estimatedTime,
      }))}
    />
  );
}
