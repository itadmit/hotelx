import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { loadHotelInfoBundle } from "@/lib/hotel-info";
import { amenityIcon } from "@/lib/amenity-icons";
import { GuestInfoPageShell } from "@/components/guest/GuestInfoPageShell";

export default async function AmenitiesPage({
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

  const amenities = bundle.amenities;

  return (
    <GuestInfoPageShell
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      eyebrow={bundle.hotelName}
      title="Amenities"
      intro="Everything available on-site during your stay."
    >
      {amenities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-card p-6 text-center">
          <p className="text-sm text-foreground/65">
            No amenities have been published yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {amenities.map((amenity) => {
            const Icon = amenityIcon(amenity.icon);
            return (
              <article
                key={amenity.id}
                className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-card p-4"
              >
                <span className="inline-flex h-10 w-10 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink leading-tight">
                    {amenity.name}
                  </p>
                  {amenity.description ? (
                    <p className="text-[12.5px] text-foreground/70 mt-1 leading-snug">
                      {amenity.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {amenity.hours ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-[color:var(--border)] font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/65">
                        {amenity.hours}
                      </span>
                    ) : null}
                    {amenity.location ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-[0.12em]">
                        {amenity.location}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </GuestInfoPageShell>
  );
}
