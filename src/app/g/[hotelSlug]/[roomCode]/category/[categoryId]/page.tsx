import Link from "next/link";
import { ChevronLeft, Clock, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { guestCategoryIcon } from "@/lib/guest-category-icons";
import { GuestCategorySnapStrip } from "@/components/guest/GuestCategorySnapStrip";
import { roomServiceSubcategoryCopy } from "@/lib/room-service-category-copy";

function formatPrice(price: unknown): string {
  if (price === null || price === undefined) return "—";
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  if (n === 0) return "Included";
  return `$${n}`;
}

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  image: string | null;
  estimatedTime: string | null;
  categoryId: string;
};

function ServiceCard({
  service,
  hotelSlug,
  roomCode,
}: {
  service: Omit<ServiceRow, "categoryId">;
  hotelSlug: string;
  roomCode: string;
}) {
  return (
    <Link
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
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; categoryId: string }>;
}) {
  const { hotelSlug, roomCode, categoryId } = await params;
  const [room, category] = await Promise.all([
    prisma.room.findFirst({
      where: {
        code: roomCode,
        hotel: { slug: hotelSlug },
      },
      select: { number: true, hotelId: true },
    }),
    prisma.category.findFirst({
      where: {
        id: categoryId,
        hotel: { slug: hotelSlug },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        hotelId: true,
        children: {
          orderBy: [{ order: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            icon: true,
            slug: true,
          },
        },
        services: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            estimatedTime: true,
          },
        },
      },
    }),
  ]);

  if (!room || !category || room.hotelId !== category.hotelId) {
    notFound();
  }

  const leafServices = category.services;
  const hasChildren = category.children.length > 0;
  /** Horizontal subcategory strip + one menu list — only for room service hub */
  const isRoomServiceHub = hasChildren && category.slug === "room-service";

  let roomMenuServices: ServiceRow[] = [];
  if (isRoomServiceHub) {
    const childIds = category.children.map((c) => c.id);
    const orderIdx = new Map(
      category.children.map((c, i) => [c.id, i] as const)
    );
    const rows = await prisma.service.findMany({
      where: {
        hotelId: category.hotelId,
        categoryId: { in: childIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        estimatedTime: true,
        categoryId: true,
      },
    });
    roomMenuServices = rows.sort((a, b) => {
      const ai = orderIdx.get(a.categoryId) ?? 0;
      const bi = orderIdx.get(b.categoryId) ?? 0;
      if (ai !== bi) return ai - bi;
      return a.name.localeCompare(b.name);
    });
  }

  const servicesToRender = isRoomServiceHub ? roomMenuServices : leafServices;
  const showServices = !hasChildren || isRoomServiceHub;

  const Icon = guestCategoryIcon(category.icon);
  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden">
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

      <section className="px-5 pt-7">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-soft text-emerald-brand">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <h1 className="font-display text-[2rem] sm:text-4xl mt-4 leading-[1.05] text-ink tracking-tight">
          {category.name}
          <span className="display-italic text-emerald-brand">.</span>
        </h1>
        {isRoomServiceHub ? (
          <>
            <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-sm">
              Browse subcategories in the strip below, then order from the menu.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
              {servicesToRender.length}{" "}
              {servicesToRender.length === 1 ? "dish" : "dishes"} ·{" "}
              {category.children.length} sections
            </p>
          </>
        ) : hasChildren ? (
          <>
            <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs">
              Choose a section below.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
              {category.children.length}{" "}
              {category.children.length === 1 ? "section" : "sections"}
            </p>
          </>
        ) : (
          <>
            <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs">
              Curated for tonight. Tap any service to request it instantly.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
              {leafServices.length}{" "}
              {leafServices.length === 1 ? "service" : "services"}
            </p>
          </>
        )}
      </section>

      {isRoomServiceHub ? (
        <section className="mt-5">
          <GuestCategorySnapStrip
            items={category.children}
            hotelSlug={hotelSlug}
            roomCode={roomCode}
            variant="compact"
            descriptionsBySlug={roomServiceSubcategoryCopy}
            pageLabel="Room service subcategories"
          />
        </section>
      ) : null}

      {hasChildren && !isRoomServiceHub ? (
        <section className="px-5 mt-6 grid grid-cols-2 gap-2.5">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/g/${hotelSlug}/${roomCode}/category/${child.id}`}
              className="rounded-xl p-3.5 border border-[color:var(--border)] bg-card text-sm font-medium text-ink hover:border-emerald-brand/30 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </section>
      ) : null}

      {showServices ? (
        <section className="px-5 mt-6 space-y-3">
          {servicesToRender.length === 0 ? (
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

          {servicesToRender.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              hotelSlug={hotelSlug}
              roomCode={roomCode}
            />
          ))}
        </section>
      ) : null}

      <div className="mt-auto pt-10" />
    </main>
  );
}
