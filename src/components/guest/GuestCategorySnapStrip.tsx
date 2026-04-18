"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { guestCategoryIcon } from "@/lib/guest-category-icons";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export type SnapCategoryItem = {
  id: string;
  name: string;
  icon: string | null;
  slug?: string | null;
};

function defaultGuestCardBody(item: SnapCategoryItem): string {
  return item.slug === "room-service"
    ? "בוקר, מנה ראשונה, עיקרית, קינוחים ושתייה — נכנסים לתפריט המלא."
    : "Tap to browse everything in this department.";
}

const categoryAccents = [
  "bg-amber-soft text-amber-brand",
  "bg-emerald-soft text-emerald-brand",
  "bg-[#f3d8cf] text-clay",
  "bg-[#e3eadf] text-emerald-brand",
  "bg-amber-soft/80 text-amber-brand",
  "bg-emerald-soft/80 text-emerald-brand",
] as const;

type Props = {
  items: SnapCategoryItem[];
  hotelSlug: string;
  roomCode: string;
  /** Second line under the title on each card (client-only callback) */
  getDescription?: (item: SnapCategoryItem, index: number) => string;
  /** Server-safe copy per category `slug` */
  descriptionsBySlug?: Record<string, string>;
  /** Shown above dots when more than one page */
  pageLabel?: string;
};

export function GuestCategorySnapStrip({
  items,
  hotelSlug,
  roomCode,
  getDescription,
  descriptionsBySlug,
  pageLabel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

  const syncPage = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth || 1;
    const idx = Math.round(el.scrollLeft / w);
    setPage(Math.min(Math.max(0, idx), Math.max(0, items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    syncPage();
    window.addEventListener("resize", syncPage);
    return () => window.removeEventListener("resize", syncPage);
  }, [syncPage, items.length]);

  function describe(item: SnapCategoryItem, index: number) {
    if (getDescription) return getDescription(item, index);
    const slug = item.slug ?? "";
    if (descriptionsBySlug && slug && descriptionsBySlug[slug]) {
      return descriptionsBySlug[slug];
    }
    return defaultGuestCardBody(item);
  }

  if (items.length === 0) return null;

  return (
    <div>
      <div className="-mx-5 px-5">
        <div
          ref={scrollRef}
          onScroll={syncPage}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none gap-0 pb-1 scroll-smooth"
        >
          {items.map((category, index) => {
            const Icon = guestCategoryIcon(category.icon);
            const accent = categoryAccents[index % categoryAccents.length];
            return (
              <Link
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.id}`}
                prefetch={index < 3}
                className="snap-start shrink-0 grow-0 basis-full min-w-full max-w-full box-border rounded-2xl p-4 border border-[color:var(--border)] bg-card active:scale-[0.99] transition-transform group shadow-[0_8px_30px_-18px_rgba(31,41,28,0.12)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${accent}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors shrink-0" />
                </div>
                <p className="mt-3.5 font-display text-lg text-ink leading-tight tracking-tight">
                  {category.name}
                </p>
                <p className="text-[11px] text-foreground/50 mt-1.5 leading-snug line-clamp-3">
                  {describe(category, index)}
                </p>
                <p className="text-[10px] text-foreground/40 mt-3 font-mono uppercase tracking-[0.12em]">
                  Browse
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      {items.length > 1 ? (
        <div
          className="flex justify-center items-center gap-2 mt-3 px-5"
          role="tablist"
          aria-label={pageLabel ?? "Category pages"}
        >
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === page}
              aria-label={`Page ${index + 1}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const w = el.offsetWidth;
                el.scrollTo({ left: index * w, behavior: "smooth" });
                setPage(index);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                index === page
                  ? "h-2 w-7 bg-emerald-brand"
                  : "h-2 w-2 bg-foreground/20 hover:bg-foreground/35"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
