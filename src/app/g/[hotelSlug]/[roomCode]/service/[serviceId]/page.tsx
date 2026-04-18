import Link from "next/link";
import { ChevronLeft, Clock, Sparkles, Wallet } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ServiceRequestForm from "@/components/guest/ServiceRequestForm";

function formatPrice(price: unknown): string {
  if (price === null || price === undefined) return "Included";
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  if (n === 0) return "Included";
  return `$${n}`;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; serviceId: string }>;
}) {
  const { hotelSlug, roomCode, serviceId } = await params;
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

  const service = await prisma.service.findFirst({
    where: { id: serviceId, hotelId: hotel.id, isActive: true },
    include: { category: { select: { name: true } } },
  });

  if (!service) {
    notFound();
  }

  const priceLabel = formatPrice(service.price);
  const room = hotel.rooms[0];

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen bg-background text-ink flex flex-col">
      {/* Image hero */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            service.image ??
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80"
          }
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        {/* Back */}
        <Link
          href={`/g/${hotelSlug}/${roomCode}`}
          className="absolute top-4 left-4 h-10 w-10 rounded-full bg-background/85 backdrop-blur-md flex items-center justify-center hover:bg-background transition-colors shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5 text-ink" />
        </Link>

        {/* Room chip */}
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-md font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
          <span className="h-1 w-1 rounded-full bg-emerald-brand" />
          Suite · {room.number}
        </span>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {service.category?.name ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-soft">
              {service.category.name}
            </p>
          ) : null}
          <h1 className="font-display text-3xl sm:text-4xl mt-1 leading-tight tracking-tight">
            {service.name}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-[color:var(--border)] bg-card p-3 flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
              <Wallet className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
                Price
              </p>
              <p className="numeral text-base text-ink">{priceLabel}</p>
            </div>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] bg-card p-3 flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center">
              <Clock className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
                ETA
              </p>
              <p className="text-sm font-medium text-ink">
                {service.estimatedTime ?? "On request"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {service.description ? (
          <div className="mt-6">
            <p className="eyebrow flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-brand" />
              About this service
            </p>
            <p className="mt-2 text-[15px] text-foreground/75 leading-relaxed">
              {service.description}
            </p>
          </div>
        ) : null}

        {/* Form */}
        <div className="mt-8 flex-1 flex flex-col">
          <ServiceRequestForm
            hotelSlug={hotelSlug}
            roomCode={roomCode}
            serviceId={service.id}
            servicePriceLabel={priceLabel}
          />
        </div>
      </div>
    </main>
  );
}
