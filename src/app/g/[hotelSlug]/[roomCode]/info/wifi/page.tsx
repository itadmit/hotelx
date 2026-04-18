import { notFound } from "next/navigation";
import { Wifi, KeyRound } from "lucide-react";
import prisma from "@/lib/prisma";
import { loadHotelInfoBundle } from "@/lib/hotel-info";
import { GuestInfoPageShell } from "@/components/guest/GuestInfoPageShell";

export default async function WifiPage({
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

  const wifiName = bundle.info?.wifiName ?? null;
  const wifiPassword = bundle.info?.wifiPassword ?? null;
  const wifiNotes = bundle.info?.wifiNotes ?? null;
  const ready = Boolean(wifiName || wifiPassword);

  return (
    <GuestInfoPageShell
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      eyebrow="Hotel info"
      title="Wi-Fi"
      intro="Stay connected during your stay."
    >
      {ready ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-emerald-soft/40 p-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-brand text-primary-foreground items-center justify-center">
              <Wifi className="h-4 w-4" strokeWidth={2} />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
                Network
              </p>
              <p className="font-display text-lg text-ink leading-tight mt-0.5">
                {wifiName ?? "—"}
              </p>
            </div>
          </div>

          {wifiPassword ? (
            <div className="mt-4 rounded-xl bg-background border border-[color:var(--border)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 flex items-center gap-1.5">
                <KeyRound className="h-3 w-3" />
                Password
              </p>
              <p className="mt-1 font-mono text-base text-ink select-all break-all">
                {wifiPassword}
              </p>
              <p className="text-[11px] text-foreground/55 mt-2">
                Tip — long-press the password above to copy.
              </p>
            </div>
          ) : null}

          {wifiNotes ? (
            <p className="text-[12.5px] text-foreground/70 mt-4 leading-relaxed">
              {wifiNotes}
            </p>
          ) : null}
        </div>
      ) : (
        <EmptyState message="Wi-Fi info hasn't been published yet. Please call reception." />
      )}
    </GuestInfoPageShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-card p-6 text-center">
      <p className="text-sm text-foreground/65">{message}</p>
    </div>
  );
}
