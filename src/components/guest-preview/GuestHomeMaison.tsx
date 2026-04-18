import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Wine,
  Bell,
  Home,
  MessageCircle,
  Sparkles,
  User,
  Wifi,
} from "lucide-react";
import { guestCategoryIcon } from "@/lib/guest-category-icons";

/** Rotating accent surfaces — same palette as Hero mockup categories */
const categoryAccents = [
  "bg-amber-soft text-amber-brand",
  "bg-emerald-soft text-emerald-brand",
  "bg-[#f3d8cf] text-clay",
  "bg-[#e3eadf] text-emerald-brand",
  "bg-amber-soft/80 text-amber-brand",
  "bg-emerald-soft/80 text-emerald-brand",
] as const;

type Category = { id: string; name: string; icon: string | null; slug?: string | null };
type Service = {
  id: string;
  name: string;
  price: string | null;
  estimatedTime: string | null;
};

type Props = {
  hotelName: string;
  hotelSlug: string;
  roomCode: string;
  roomNumber: string;
  categories: Category[];
  services: Service[];
  classicGuestPath: string;
};

function formatPrice(price: string | null): string {
  if (price === null) return "—";
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  if (n === 0) return "Included";
  return `$${n}`;
}

export function GuestHomeMaison({
  hotelName,
  hotelSlug,
  roomCode,
  roomNumber,
  categories,
  services,
  classicGuestPath,
}: Props) {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const featuredService = services[0];
  const restServices = services.slice(1, 4);
  const initials = hotelName.slice(0, 1).toUpperCase();

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Faux iOS status bar — sets the editorial frame */}
      <div className="h-9 px-6 flex items-center justify-between bg-background">
        <span className="font-mono text-[12px] text-ink font-medium tabular-nums">9:41</span>
        <div className="flex items-center gap-1.5 text-ink">
          <span className="flex items-end gap-[2px] h-2.5">
            <span className="w-[2px] h-1 rounded-sm bg-ink" />
            <span className="w-[2px] h-1.5 rounded-sm bg-ink" />
            <span className="w-[2px] h-2 rounded-sm bg-ink" />
            <span className="w-[2px] h-2.5 rounded-sm bg-ink" />
          </span>
          <Wifi className="h-3 w-3" strokeWidth={2.5} />
          <span className="ml-0.5 relative inline-flex items-center">
            <span className="h-2.5 w-5 rounded-[3px] border border-ink relative">
              <span className="absolute inset-[1px] rounded-[1px] bg-ink w-[80%]" />
            </span>
            <span className="ml-px h-1.5 w-[2px] rounded-r-sm bg-ink" />
          </span>
        </div>
      </div>

      {/* Top bar — brand + bell + avatar */}
      <header className="px-5 pt-2 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative h-8 w-8 rounded-md bg-emerald-brand flex items-center justify-center shrink-0">
            <span className="font-display text-base leading-none text-primary-foreground">
              {initials}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand border-2 border-background" />
            </span>
          </span>
          <span className="font-display text-lg tracking-tight text-ink truncate">
            {hotelName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative h-8 w-8 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background">
            <Bell className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-clay" />
          </span>
          <span className="h-8 w-8 rounded-full bg-emerald-brand flex items-center justify-center text-[10px] font-mono text-primary-foreground">
            MS
          </span>
        </div>
      </header>

      {/* Greeting block */}
      <section className="px-5">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="h-1 w-1 rounded-full bg-emerald-brand" />
          Suite · {roomNumber}
        </span>
        <h1 className="font-display text-[2rem] mt-3 leading-[1.05] text-ink tracking-tight">
          {greet},
          <br />
          <span className="text-emerald-brand display-italic">our guest.</span>
        </h1>
        <p className="mt-2 text-sm text-foreground/60 leading-snug max-w-xs">
          How may we make tonight unforgettable?
        </p>
      </section>

      {/* Featured offer */}
      {featuredService ? (
        <Link
          href={`/g/${hotelSlug}/${roomCode}/service/${featuredService.id}`}
          prefetch={true}
          className="mx-5 mt-5 relative overflow-hidden rounded-2xl bg-emerald-brand text-primary-foreground p-4 active:scale-[0.99] transition-transform group"
        >
          <div className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-amber-brand/30 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-amber-brand flex items-center justify-center shrink-0">
              <Wine className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-soft">
                Tonight&apos;s offer
              </p>
              <p className="font-display text-base leading-tight mt-0.5 truncate">
                {featuredService.name}
              </p>
            </div>
            <span className="numeral text-2xl leading-none">
              {formatPrice(featuredService.price)}
            </span>
          </div>
        </Link>
      ) : null}

      {/* Categories */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Concierge</p>
          <span className="font-mono text-[10px] text-foreground/40">
            {categories.length} categories
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {categories.map((category, index) => {
            const Icon = guestCategoryIcon(category.icon);
            const accent = categoryAccents[index % categoryAccents.length];
            return (
              <Link
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.id}`}
                prefetch={index < 2}
                className="group rounded-xl p-3 border border-[color:var(--border)] bg-card active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${accent}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors" />
                </div>
                <p className="mt-2.5 text-sm font-medium text-ink leading-tight">
                  {category.name}
                </p>
                <p className="text-[10px] text-foreground/45 mt-0.5 font-mono uppercase tracking-[0.1em]">
                  Browse
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular requests */}
      {restServices.length > 0 ? (
        <section className="px-5 mt-6">
          <div className="flex items-end justify-between gap-2 mb-3">
            <div>
              <p className="eyebrow">Popular now</p>
              <p className="text-[11px] text-foreground/45 mt-0.5">Guest favorites</p>
            </div>
          </div>
          <div className="space-y-2">
            {restServices.map((item) => (
              <Link
                key={item.id}
                href={`/g/${hotelSlug}/${roomCode}/service/${item.id}`}
                prefetch={false}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-[color:var(--border)] bg-card hover:border-emerald-brand/25 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink text-sm truncate">{item.name}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-foreground/45 mt-0.5 font-mono">
                    <Clock className="h-3 w-3 shrink-0" />
                    {item.estimatedTime ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-ink tabular-nums">
                    {formatPrice(item.price)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Live status — pulse ring like the Hero mockup */}
      <section className="mx-5 mt-5 flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 border border-[color:var(--border)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inset-0 rounded-full bg-emerald-brand pulse-ring" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-brand" />
          </span>
          <p className="text-xs text-ink leading-none truncate">Towels on the way</p>
        </div>
        <span className="font-mono text-[10px] text-foreground/55 shrink-0">3 min</span>
      </section>

      {/* Filler so footer looks like a tab bar */}
      <div className="flex-1 min-h-6" />

      {/* iOS-style bottom tab bar */}
      <nav className="px-3 pt-3 pb-2 border-t border-[color:var(--border)] bg-background/95 backdrop-blur-sm flex items-center justify-around">
        {[
          { icon: Home, active: true, label: "Home" },
          { icon: Sparkles, active: false, label: "Services" },
          { icon: MessageCircle, active: false, label: "Chat" },
          { icon: User, active: false, label: "Stay" },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <t.icon
              className={`h-4 w-4 ${t.active ? "text-emerald-brand" : "text-foreground/40"}`}
              strokeWidth={2}
            />
            <span
              className={`text-[10px] font-medium ${
                t.active ? "text-emerald-brand" : "text-foreground/40"
              }`}
            >
              {t.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Home indicator */}
      <div className="pb-2 pt-1 flex justify-center">
        <span className="h-[4px] w-[110px] rounded-full bg-ink/35" />
      </div>

      {/* Compare strip — outside iOS chrome to keep it editorial */}
      <div className="px-4 py-3 border-t border-dashed border-[color:var(--border)] bg-surface/40">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-brand">
          Preview · Maison · {roomCode}
        </p>
        <p className="text-[11px] text-foreground/55 mt-0.5">
          New guest design.{" "}
          <Link
            href={classicGuestPath}
            className="text-emerald-brand font-medium hover:underline underline-offset-2"
          >
            Open classic view ↗
          </Link>
        </p>
      </div>
    </div>
  );
}
