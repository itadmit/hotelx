import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { loadHotelInfoBundle } from "@/lib/hotel-info";
import { GuestInfoPageShell } from "@/components/guest/GuestInfoPageShell";

export default async function AboutPage({
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

  const about = bundle.info?.about ?? null;

  return (
    <GuestInfoPageShell
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      eyebrow={bundle.hotelName}
      title="About the hotel"
    >
      {about ? (
        <article className="rounded-2xl border border-[color:var(--border)] bg-card p-5">
          <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center mb-3">
            <BookOpen className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="text-[14px] text-foreground/80 leading-relaxed whitespace-pre-line">
            {about}
          </p>
        </article>
      ) : (
        <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-card p-6 text-center">
          <p className="text-sm text-foreground/65">
            The hotel hasn&apos;t published an About text yet.
          </p>
        </div>
      )}
    </GuestInfoPageShell>
  );
}
