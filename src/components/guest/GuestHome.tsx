"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Wine,
  LogOut,
  KeyRound,
  Info,
  Sparkles,
} from "lucide-react";
import { GuestNotificationsBell } from "@/components/guest/NotificationsBell";
import { ActiveRequestsStrip } from "@/components/guest/ActiveRequestsStrip";
import { resolveCategoryIcon } from "@/lib/category-icons";
import { trackGuestScan } from "@/lib/gtag";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  featuredServiceIds?: string[];
  activeServiceIds?: string[];
  logoLetter?: string;
  guestFirstName?: string | null;
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
  featuredServiceIds = [],
  activeServiceIds = [],
  logoLetter,
  guestFirstName,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    trackGuestScan(hotelSlug);
  }, [hotelSlug]);

  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Pick the featured service:
  // 1. Prefer something the hotel explicitly starred…
  // 2. …unless the guest already has an active request for it (smart hide).
  // 3. If multiple candidates remain, rotate randomly each visit.
  // 4. Fall back to whatever the server marked as services[0].
  const eligibleFeatured = useMemo(() => {
    const idSet = new Set(featuredServiceIds);
    const activeSet = new Set(activeServiceIds);
    return services.filter(
      (s) => idSet.has(s.id) && !activeSet.has(s.id)
    );
  }, [services, featuredServiceIds, activeServiceIds]);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  useEffect(() => {
    if (eligibleFeatured.length > 1) {
      setFeaturedIndex(Math.floor(Math.random() * eligibleFeatured.length));
    } else {
      setFeaturedIndex(0);
    }
  }, [eligibleFeatured.length]);

  const featuredService =
    eligibleFeatured[featuredIndex] ?? eligibleFeatured[0] ?? services[0];
  // Don't repeat the featured service in the "Popular now" list below.
  const restServices = services
    .filter((s) => s.id !== featuredService?.id)
    .slice(0, 4);
  const initials = (logoLetter ?? hotelName.slice(0, 1)).toUpperCase();
  const greetingTarget = guestFirstName ?? "our guest";
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmRoomCode, setConfirmRoomCode] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const canLogout = useMemo(
    () =>
      confirmChecked &&
      confirmRoomCode.trim().toUpperCase() === roomCode.trim().toUpperCase(),
    [confirmChecked, confirmRoomCode, roomCode]
  );

  async function logoutGuest() {
    if (!canLogout) return;
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await fetch("/api/public/check-in/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelSlug }),
      });
      try {
        window.localStorage.removeItem(`hotelx:guest:${hotelSlug}`);
      } catch {
        // Ignore localStorage issues (private mode / restricted browsers).
      }
      router.push(`/g/${hotelSlug}`);
    } catch {
      setLogoutError("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden">
      {/* Sticky brand header */}
      <header className="sticky top-0 z-30 px-5 pt-6 pb-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative h-9 w-9 rounded-md bg-emerald-brand flex items-center justify-center shrink-0">
            <span className="font-display text-base leading-none text-primary-foreground">
              {initials}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand border-2 border-background" />
            </span>
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
        <div className="flex items-center gap-2">
          <Link
            href={`/g/${hotelSlug}/${roomCode}/info`}
            aria-label="Hotel info"
            prefetch={false}
            className="h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors text-foreground/75"
          >
            <Info className="h-4 w-4" />
          </Link>
          <GuestNotificationsBell hotelSlug={hotelSlug} roomCode={roomCode} />
          <button
            type="button"
            onClick={() => {
              setConfirmChecked(false);
              setConfirmRoomCode("");
              setLogoutError(null);
              setIsLogoutOpen(true);
            }}
            aria-label="Log out"
            className="h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors text-foreground/75"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
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
          <span className="text-emerald-brand display-italic">
            {greetingTarget}.
          </span>
        </h1>
        <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs">
          How may we make today unforgettable?
        </p>
      </section>

      {/* Active requests — anything still NEW or IN_PROGRESS for this room */}
      <ActiveRequestsStrip hotelSlug={hotelSlug} roomCode={roomCode} />

      {/* Featured offer */}
      {featuredService ? (
        <Link
          href={`/g/${hotelSlug}/${roomCode}/service/${featuredService.id}`}
          prefetch={true}
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

      {/* Categories — root departments (grid).
          The first tile is the built-in "Hotel info" hub (Wi-Fi, About, etc.) */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Concierge</p>
          <span className="font-mono text-[10px] text-foreground/40">
            {categories.length + 1} categories
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link
            href={`/g/${hotelSlug}/${roomCode}/info`}
            prefetch={true}
            className="group rounded-xl p-3.5 border border-emerald-brand/25 bg-emerald-soft/40 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-brand text-primary-foreground">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-brand/60 group-hover:text-emerald-brand transition-colors" />
            </div>
            <p className="mt-3 text-sm font-medium text-ink leading-tight">
              Hotel info
            </p>
            <p className="text-[10px] text-emerald-brand mt-0.5 font-mono uppercase tracking-[0.1em]">
              Wi-Fi · about · amenities
            </p>
          </Link>

          {categories.map((category, index) => {
            const Icon = resolveCategoryIcon(category.icon);
            const accent = categoryAccents[index % categoryAccents.length];
            return (
              <Link
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.id}`}
                prefetch={index < 2}
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
                prefetch={false}
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

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out from this room?</DialogTitle>
            <DialogDescription>
              Double verification is required before logout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
              />
              <span>I understand I will need to sign in again.</span>
            </label>

            <div className="rounded-xl border border-[color:var(--border)] bg-surface/70 p-3 space-y-1.5">
              <p className="text-xs font-medium text-ink flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-brand" />
                Need help with your room code?
              </p>
              <p className="text-xs text-foreground/70">
                The code appears on the card in your room.
              </p>
              <p className="text-xs text-foreground/70">
                Not sure what it is? Call reception and ask.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="logout-room-code"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55"
              >
                Confirm room code
              </label>
              <input
                id="logout-room-code"
                value={confirmRoomCode}
                onChange={(e) => setConfirmRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="w-full h-10 px-3 rounded-md bg-surface border border-[color:var(--border)] text-ink text-sm"
              />
              <p className="text-[11px] text-foreground/55">
                Room code appears on the card in your room. Not sure what it is?
                Call reception.
              </p>
            </div>

            {logoutError ? (
              <p className="text-xs text-clay" role="alert">
                {logoutError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsLogoutOpen(false)}
              className="h-9 px-4 rounded-md text-sm text-ink hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={logoutGuest}
              disabled={!canLogout || isLoggingOut}
              className="h-9 px-4 rounded-md bg-clay text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
