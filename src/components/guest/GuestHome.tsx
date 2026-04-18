import Link from "next/link";
import {
  ConciergeBell,
  Utensils,
  Sparkles,
  Car,
  Info,
  Wrench,
  ChevronRight,
  Clock,
  Wine,
  Bell,
} from "lucide-react";

const iconMap: Record<string, typeof Utensils> = {
  Utensils,
  Sparkles,
  ConciergeBell,
  Car,
  Wrench,
  Info,
};

const categoryAccents = [
  "bg-amber-soft text-amber-brand",
  "bg-emerald-soft text-emerald-brand",
  "bg-[#f3d8cf] text-clay",
  "bg-[#e3eadf] text-emerald-brand",
  "bg-amber-soft/80 text-amber-brand",
  "bg-emerald-soft/80 text-emerald-brand",
] as const;

type Category = { id: string; name: string; icon: string | null };
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
};

function formatPrice(price: string | null): string {
  if (price === null) return "—";
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  if (n === 0) return "Included";
  return `$${n}`;
}

export function GuestHome({
  hotelName,
  hotelSlug,
  roomCode,
  roomNumber,
  categories,
  services,
}: Props) {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const featuredService = services[0];
  const restServices = services.slice(1, 5);
  const initials = hotelName.slice(0, 1).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen bg-background text-ink flex flex-col pb-12">
      {/* Sticky brand header */}
      <header className="sticky top-0 z-30 px-5 pt-6 pb-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative h-9 w-9 rounded-md bg-emerald-brand flex items-center justify-center shrink-0">
            <span className="font-display text-base leading-none text-primary-foreground">
              {initials}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-brand border-2 border-background" />
          </span>
          <div className="leading-tight min-w-0">
            <p className="font-display text-base tracking-tight text-ink truncate">
              {hotelName}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
              Suite · {roomNumber}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors"
        >
          <Bell className="h-4 w-4 text-ink" strokeWidth={2} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-clay" />
        </button>
      </header>

      {/* Greeting */}
      <section className="px-5 pt-7">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="h-1 w-1 rounded-full bg-emerald-brand" />
          Live concierge
        </span>
        <h1 className="font-display text-[2.25rem] sm:text-4xl mt-3 leading-[1.05] text-ink tracking-tight">
          {greet},
          <br />
          <span className="text-emerald-brand display-italic">our guest.</span>
        </h1>
        <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs">
          How may we make today unforgettable?
        </p>
      </section>

      {/* Featured offer */}
      {featuredService ? (
        <Link
          href={`/g/${hotelSlug}/${roomCode}/service/${featuredService.id}`}
          className="mx-5 mt-6 relative overflow-hidden rounded-2xl bg-emerald-brand text-primary-foreground p-4 active:scale-[0.99] transition-transform group"
        >
          <div className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-amber-brand/30 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-amber-brand flex items-center justify-center shrink-0">
              <Wine className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-soft">
                Featured for you
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
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Concierge</p>
          <span className="font-mono text-[10px] text-foreground/40">
            {categories.length} categories
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon ?? "Info"] ?? Info;
            const accent = categoryAccents[index % categoryAccents.length];
            return (
              <Link
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.id}`}
                className="group rounded-xl p-3.5 border border-[color:var(--border)] bg-card active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${accent}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors" />
                </div>
                <p className="mt-3 text-sm font-medium text-ink leading-tight">
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

      {/* Popular services */}
      {restServices.length > 0 ? (
        <section className="px-5 mt-7">
          <div className="flex items-end justify-between gap-2 mb-3">
            <div>
              <p className="eyebrow">Popular now</p>
              <p className="text-[11px] text-foreground/45 mt-0.5">
                Guest favorites
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {restServices.map((item) => (
              <Link
                key={item.id}
                href={`/g/${hotelSlug}/${roomCode}/service/${item.id}`}
                className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-[color:var(--border)] bg-card hover:border-emerald-brand/25 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink text-sm truncate">
                    {item.name}
                  </p>
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

      {/* Live status row */}
      <section className="mx-5 mt-6 flex items-center justify-between rounded-xl bg-surface px-3.5 py-3 border border-[color:var(--border)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inset-0 rounded-full bg-emerald-brand pulse-ring" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-brand" />
          </span>
          <p className="text-xs text-ink leading-none truncate">
            Concierge is online
          </p>
        </div>
        <span className="font-mono text-[10px] text-foreground/55 shrink-0">
          ~ 3 min reply
        </span>
      </section>

      {/* Footer / signature */}
      <footer className="mt-auto pt-10 px-5 pb-2 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/40">
          {hotelName} · powered by HotelX
        </p>
      </footer>
    </main>
  );
}
