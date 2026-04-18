import Link from "next/link";
import {
  Check,
  ArrowUpRight,
  Gift,
  Headphones,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FREE_INCLUDES = [
  "Full Concierge OS · unlimited rooms",
  "Free initial setup & staff training",
  "0% transaction fees",
  "14-language guest engine",
  "Email & screen-share support",
];

const RETAINER_EXTRAS = [
  "A dedicated concierge engineer",
  "Monthly menu & translations refresh",
  "Seasonal offers & upsell ideas",
  "Branding tweaks handled by us",
];

export function PricingTeaser() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-soft/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-amber-soft/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">
            <Gift className="h-3 w-3 text-emerald-brand" />
            Pricing · honest, simple
          </span>
          <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
            Free for the hotel.
            <br />
            <span className="display-italic text-emerald-brand">
              A retainer if you&rsquo;d rather not.
            </span>
          </h2>
          <p className="mt-4 text-foreground/70">
            The product is yours, free, forever. Setup and training are on us.
            Add an optional monthly retainer if you want a dedicated person on
            your account — cancel any time.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch max-w-5xl mx-auto">
          {/* Free product */}
          <article className="card-surface p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
                Concierge OS
              </span>
              <span className="pill pill-amber">forever free</span>
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="numeral text-5xl text-ink">€0</span>
              <span className="text-sm text-foreground/60">/ month</span>
            </div>
            <p className="mt-2 text-sm text-foreground/65">
              The full product, your branding, your team — keep every euro.
            </p>

            <ul className="mt-6 space-y-2.5 flex-1">
              {FREE_INCLUDES.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-sm text-ink"
                >
                  <Check className="h-4 w-4 text-emerald-brand shrink-0 mt-0.5" />
                  <span className="leading-snug">{line}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="group mt-7 inline-flex items-center justify-center gap-1.5 h-11 rounded-full font-medium bg-emerald-brand text-primary-foreground hover:bg-ink transition-colors"
            >
              Start free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </article>

          {/* Optional retainer */}
          <article className="rounded-2xl bg-ink text-[#f1ebde] p-6 sm:p-8 flex flex-col h-full relative overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(14,82,64,0.45)]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-amber-brand/30 blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-soft inline-flex items-center gap-1.5">
                  <Headphones className="h-3 w-3" />
                  Concierge retainer
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-brand text-white font-mono text-[10px] uppercase tracking-[0.18em]">
                  optional
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="numeral text-5xl text-white">$39</span>
                <span className="text-sm text-white/60">
                  / month · cancel anytime
                </span>
              </div>
              <p className="mt-2 text-sm text-[#f1ebde]/75">
                Hand the day-to-day to a real person on your account.
              </p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {RETAINER_EXTRAS.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-sm text-[#f1ebde]/90"
                  >
                    <Check className="h-4 w-4 text-amber-soft shrink-0 mt-0.5" />
                    <span className="leading-snug">{line}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing#retainer"
                className="group mt-7 inline-flex items-center justify-center gap-1.5 h-11 rounded-full font-medium bg-amber-brand text-white hover:bg-clay transition-colors"
              >
                See the retainer
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap text-center">
          <span className="eyebrow flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
            No card · no commitment
          </span>
          <span className="hidden sm:inline text-foreground/30">·</span>
          <span className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-brand" />
            Free onboarding & training, always
          </span>
          <span className="hidden sm:inline text-foreground/30">·</span>
          <Link
            href="/pricing"
            className="text-sm text-emerald-brand hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            See full pricing details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
