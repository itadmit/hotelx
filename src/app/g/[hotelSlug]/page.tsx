import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { HotelCheckInForm } from "@/components/guest/HotelCheckInForm";

export default async function HotelLandingPage({
  params,
}: {
  params: Promise<{ hotelSlug: string }>;
}) {
  const { hotelSlug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    select: {
      name: true,
      _count: { select: { rooms: true } },
    },
  });

  if (!hotel) {
    notFound();
  }

  const initials = hotel.name.slice(0, 1).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col px-5 pt-10 pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden">
      {/* Brand block */}
      <div className="flex items-center gap-3">
        <span className="relative h-12 w-12 rounded-xl bg-emerald-brand flex items-center justify-center text-primary-foreground shrink-0">
          <span className="font-display text-xl leading-none">{initials}</span>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-brand border-2 border-background" />
          </span>
        </span>
        <div className="leading-tight min-w-0">
          <p className="font-display text-xl tracking-tight text-ink truncate">
            {hotel.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mt-0.5">
            Concierge · powered by HotelX
          </p>
        </div>
      </div>

      {/* Welcome */}
      <section className="mt-10">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-[0.16em]">
          <Sparkles className="h-3 w-3" />
          Welcome
        </span>
        <h1 className="mt-3 font-display text-[2rem] sm:text-[2.4rem] leading-[1.05] tracking-tight text-ink">
          Hello,
          <br />
          <span className="text-emerald-brand display-italic">
            who&apos;s staying with us?
          </span>
        </h1>
        <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed max-w-[36ch]">
          Tell us your name and your room number to unlock the full concierge
          experience for your suite.
        </p>
      </section>

      {/* Form */}
      <HotelCheckInForm hotelSlug={hotelSlug} />

      <div className="mt-auto pt-8">
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/40">
          {hotel.name} · {hotel._count.rooms} suites
        </p>
      </div>
    </main>
  );
}
