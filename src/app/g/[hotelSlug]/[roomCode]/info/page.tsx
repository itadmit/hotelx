import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Wifi,
  BookOpen,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { loadHotelInfoBundle } from "@/lib/hotel-info";
import { GuestInfoPageShell } from "@/components/guest/GuestInfoPageShell";

const TILES = [
  {
    key: "wifi",
    title: "Wi-Fi",
    blurb: "Network name & password.",
    Icon: Wifi,
    accent: "bg-emerald-soft text-emerald-brand",
  },
  {
    key: "about",
    title: "About the hotel",
    blurb: "A short story about the property.",
    Icon: BookOpen,
    accent: "bg-amber-soft text-amber-brand",
  },
  {
    key: "amenities",
    title: "Amenities",
    blurb: "Pool, gym, spa & more.",
    Icon: Sparkles,
    accent: "bg-[#e3eadf] text-emerald-brand",
  },
  {
    key: "helpful",
    title: "Helpful info",
    blurb: "Check-in, parking, breakfast hours.",
    Icon: Info,
    accent: "bg-[#f3d8cf] text-clay",
  },
] as const;

export default async function HotelInfoIndex({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  const room = await prisma.room.findFirst({
    where: { code: roomCode, hotel: { slug: hotelSlug } },
    select: { id: true },
  });
  if (!room) notFound();

  const bundle = await loadHotelInfoBundle(hotelSlug);
  if (!bundle) notFound();

  const counts = {
    wifi: Boolean(bundle.info?.wifiName || bundle.info?.wifiPassword),
    about: Boolean(bundle.info?.about),
    amenities: bundle.amenities.length,
    helpful: Boolean(bundle.info?.helpfulInfo),
  };

  return (
    <GuestInfoPageShell
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      eyebrow={bundle.hotelName}
      title="Hotel info"
      intro="Everything you need to know about your stay — at a glance."
      backTo="home"
    >
      <div className="grid grid-cols-1 gap-2.5">
        {TILES.map((tile) => {
          const ready =
            tile.key === "amenities"
              ? counts.amenities > 0
              : counts[tile.key as "wifi" | "about" | "helpful"];
          return (
            <Link
              key={tile.key}
              href={`/g/${hotelSlug}/${roomCode}/info/${tile.key}`}
              className="group flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-card p-3.5 active:scale-[0.99] transition-transform"
            >
              <div
                className={`inline-flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${tile.accent}`}
              >
                <tile.Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">
                  {tile.title}
                </p>
                <p className="text-[11.5px] text-foreground/55 mt-0.5 truncate">
                  {ready
                    ? tile.blurb
                    : "Not configured yet — check back later."}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors" />
            </Link>
          );
        })}
      </div>
    </GuestInfoPageShell>
  );
}
