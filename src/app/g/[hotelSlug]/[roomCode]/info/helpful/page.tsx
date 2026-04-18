import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import prisma from "@/lib/prisma";
import { loadHotelInfoBundle } from "@/lib/hotel-info";
import { GuestInfoPageShell } from "@/components/guest/GuestInfoPageShell";

export default async function HelpfulPage({
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

  const helpful = bundle.info?.helpfulInfo ?? null;
  // Each line in the textarea becomes its own row, so the staff can compose a
  // tidy list without learning markdown.
  const lines = helpful
    ? helpful
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
    : [];

  return (
    <GuestInfoPageShell
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      eyebrow={bundle.hotelName}
      title="Helpful info"
      intro="Quick answers to the most common questions."
    >
      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-card p-6 text-center">
          <p className="text-sm text-foreground/65">
            Helpful info hasn&apos;t been published yet.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[color:var(--border)] bg-card divide-y divide-[color:var(--border)] overflow-hidden">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start gap-3 p-4">
              <span className="inline-flex h-7 w-7 rounded-md bg-[#e3eadf] text-emerald-brand items-center justify-center shrink-0 mt-0.5">
                <Info className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <p className="text-[13.5px] text-foreground/80 leading-snug">
                {line}
              </p>
            </div>
          ))}
        </div>
      )}
    </GuestInfoPageShell>
  );
}
