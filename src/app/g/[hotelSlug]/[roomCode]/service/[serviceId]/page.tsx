import Link from "next/link";
import { ChevronLeft, Clock, Sparkles, Wallet, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ServiceRequestForm from "@/components/guest/ServiceRequestForm";

async function getServiceForGuest(hotelSlug: string, serviceId: string) {
  try {
    return await prisma.service.findFirst({
      where: {
        id: serviceId,
        isActive: true,
        hotel: { slug: hotelSlug },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        estimatedTime: true,
        image: true,
        hotelId: true,
        requirePayment: true,
        category: { select: { name: true } },
      },
    });
  } catch (error) {
    // Backward compatibility for databases that did not run payment schema sync yet.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2022"
    ) {
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          isActive: true,
          hotel: { slug: hotelSlug },
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          estimatedTime: true,
          image: true,
          hotelId: true,
          category: { select: { name: true } },
        },
      });

      return service ? { ...service, requirePayment: false } : null;
    }

    throw error;
  }
}

async function getHotelPaymentsEnabled(hotelSlug: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { slug: hotelSlug },
      select: { paymentsEnabled: true },
    });

    return Boolean(hotel?.paymentsEnabled);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2022"
    ) {
      return false;
    }

    throw error;
  }
}

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
  const [room, service, paymentsEnabled] = await Promise.all([
    prisma.room.findFirst({
      where: {
        code: roomCode,
        hotel: { slug: hotelSlug },
      },
      select: { number: true, hotelId: true },
    }),
    getServiceForGuest(hotelSlug, serviceId),
    getHotelPaymentsEnabled(hotelSlug),
  ]);

  if (!room || !service || room.hotelId !== service.hotelId) {
    notFound();
  }

  const priceLabel = formatPrice(service.price);
  const showsPayment = service.requirePayment && paymentsEnabled;

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-x-hidden">
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
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

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
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
          {service.category?.name ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-soft">
              {service.category.name}
            </p>
          ) : null}
          <h1
            className="font-display text-3xl sm:text-4xl mt-1 leading-tight tracking-tight"
            style={{ color: "#ffffff" }}
          >
            {service.name}
          </h1>
          {showsPayment ? (
            <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur font-mono text-[10px] uppercase tracking-[0.16em] text-white [text-shadow:none]">
              <ShieldCheck className="h-3 w-3" />
              Payment required · Secured
            </span>
          ) : null}
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
            requirePayment={service.requirePayment}
            paymentsEnabled={paymentsEnabled}
          />
        </div>
      </div>
    </main>
  );
}
