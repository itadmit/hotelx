import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  ChevronRight,
  ConciergeBell,
  Utensils,
  Sparkles,
  Car,
  Info,
  Wrench,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const iconMap: Record<string, typeof Utensils> = {
  Utensils,
  Sparkles,
  ConciergeBell,
  Car,
  Wrench,
  Info,
};

function formatPrice(price: unknown): string {
  if (price === null || price === undefined) return "—";
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  if (n === 0) return "Included";
  return `$${n}`;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; categoryId: string }>;
}) {
  const { hotelSlug, roomCode, categoryId } = await params;
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      rooms: {
        where: { code: roomCode },
        select: { id: true, number: true },
      },
    },
  });

  if (!hotel || hotel.rooms.length === 0) {
    notFound();
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, hotelId: hotel.id },
  });

  if (!category) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: { categoryId: category.id, hotelId: hotel.id, isActive: true },
    orderBy: { name: "asc" },
  });

  const Icon = iconMap[category.icon ?? "Info"] ?? Info;
  const room = hotel.rooms[0];

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen bg-background text-ink flex flex-col pb-12">
      {/* Sticky back-bar */}
      <header className="sticky top-0 z-30 px-4 py-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]/60 flex items-center gap-2">
        <Link
          href={`/g/${hotelSlug}/${roomCode}`}
          className="h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-4 w-4 text-ink" />
        </Link>
        <div className="leading-tight">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
            Suite · {room.number}
          </p>
          <p className="text-sm font-medium text-ink truncate">
            {category.name}
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pt-7">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-soft text-emerald-brand">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <h1 className="font-display text-[2rem] sm:text-4xl mt-4 leading-[1.05] text-ink tracking-tight">
          {category.name}
          <span className="display-italic text-emerald-brand">.</span>
        </h1>
        <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs">
          Curated for tonight. Tap any service to request it instantly.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          {services.length} {services.length === 1 ? "service" : "services"}
        </p>
      </section>

      {/* Services list */}
      <section className="px-5 mt-6 space-y-3">
        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] p-6 text-center">
            <p className="text-sm text-foreground/60">
              No services in this category yet.
            </p>
            <Link
              href={`/g/${hotelSlug}/${roomCode}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-brand font-medium"
            >
              Back to home
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}

        {services.map((service) => (
          <Link
            key={service.id}
            href={`/g/${hotelSlug}/${roomCode}/service/${service.id}`}
            className="group block rounded-2xl overflow-hidden border border-[color:var(--border)] bg-card hover:border-emerald-brand/30 transition-colors"
          >
            <div className="flex">
              <div className="relative w-28 sm:w-32 h-28 sm:h-32 shrink-0 bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    service.image ??
                    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=320&q=80"
                  }
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/0" />
              </div>

              <div className="flex-1 p-4 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base text-ink leading-tight tracking-tight truncate">
                    {service.name}
                  </h3>
                  <span className="numeral text-base text-ink shrink-0">
                    {formatPrice(service.price)}
                  </span>
                </div>

                {service.description ? (
                  <p className="mt-1 text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                ) : null}

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-foreground/50 font-mono">
                    <Clock className="h-3 w-3" />
                    {service.estimatedTime ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-brand font-medium group-hover:gap-1.5 transition-all">
                    Order
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-auto pt-10" />
    </main>
  );
}
