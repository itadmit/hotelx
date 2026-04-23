import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { GuestHome } from "@/components/guest/GuestHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  await connection();

  // Hotel + services + room in one query; root categories loaded separately so
  // nested relation limits / stale bundling never truncate the home grid.
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    select: {
      id: true,
      name: true,
      services: {
        select: {
          id: true,
          name: true,
          price: true,
          estimatedTime: true,
          isFeatured: true,
        },
        where: { isActive: true },
        orderBy: [{ price: "desc" }, { name: "asc" }],
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

  const rootCategories = await prisma.category.findMany({
    where: { hotelId: hotel.id, parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      icon: true,
      slug: true,
    },
  });

  // Pull out the explicit "featured" upsells the hotel starred. If none are
  // starred we gracefully fall back to the legacy heuristic (priciest paid
  // service first) so existing demos keep working.
  const explicitlyFeatured = hotel.services.filter((s) => s.isFeatured);
  const fallbackFeatured =
    hotel.services.find((s) => s.price != null && Number(s.price) > 0) ??
    hotel.services[0] ??
    null;
  const featuredCandidates = explicitlyFeatured.length
    ? explicitlyFeatured
    : fallbackFeatured
      ? [fallbackFeatured]
      : [];

  // Grid services: skip *all* candidates so we don't show duplicates with the
  // hero card. We keep the rest in price-desc order.
  const candidateIds = new Set(featuredCandidates.map((s) => s.id));
  const gridServices = hotel.services.filter((s) => !candidateIds.has(s.id));

  const orderedServices = [...featuredCandidates, ...gridServices].slice(0, 10);

  // Smart hide: if the guest already has an active request for one of the
  // featured services we'll suppress it on the client and rotate to another
  // candidate. Pull the IDs once here so the client doesn't need its own query.
  const activeRequests = await prisma.request.findMany({
    where: {
      roomId: room.id,
      status: { in: ["NEW", "IN_PROGRESS"] },
    },
    select: { serviceId: true },
  });
  const activeServiceIds = activeRequests.map((r) => r.serviceId);

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
      categories={rootCategories.map((c) => ({
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
      featuredServiceIds={featuredCandidates.map((s) => s.id)}
      activeServiceIds={activeServiceIds}
    />
  );
}
