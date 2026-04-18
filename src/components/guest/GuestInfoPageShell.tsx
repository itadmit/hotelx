import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  hotelSlug: string;
  roomCode: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  /**
   * Where the back arrow leads. Defaults to the hotel-info index
   * (`/g/[slug]/[room]/info`) so sub-pages return to the menu. The index
   * page itself should pass `home` so the arrow returns the guest to
   * their room home (`/g/[slug]/[room]`).
   */
  backTo?: "info" | "home";
  children: ReactNode;
};

/**
 * Shared chrome for /g/[hotelSlug]/[roomCode]/info pages — keeps the same
 * full-bleed phone-style layout the guest is used to, with a simple back link
 * and Maison styling.
 */
export function GuestInfoPageShell({
  hotelSlug,
  roomCode,
  eyebrow,
  title,
  intro,
  backTo = "info",
  children,
}: Props) {
  const backHref =
    backTo === "home"
      ? `/g/${hotelSlug}/${roomCode}`
      : `/g/${hotelSlug}/${roomCode}/info`;
  const backLabel =
    backTo === "home" ? "Back to your room" : "Back to hotel info";

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]/60 flex items-center gap-3">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors text-foreground/75"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          {eyebrow ? (
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55 leading-none mb-1">
              {eyebrow}
            </p>
          ) : null}
          <p className="font-display text-base tracking-tight text-ink leading-tight truncate">
            {title}
          </p>
        </div>
      </header>

      <section className="px-5 pt-6">
        <h1 className="font-display text-3xl leading-[1.05] text-ink tracking-tight">
          {title}
        </h1>
        {intro ? (
          <p className="mt-2 text-sm text-foreground/65 leading-snug">
            {intro}
          </p>
        ) : null}
      </section>

      <div className="px-5 mt-6 space-y-4">{children}</div>

      <footer className="mt-auto pt-10 px-5 pb-2 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/40">
          Hotel info · powered by HotelX
        </p>
      </footer>
    </main>
  );
}
