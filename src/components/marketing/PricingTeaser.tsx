import Link from "next/link";
import {
  Check,
  ArrowUpRight,
  Gift,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  FOUNDERS,
  LIST,
  firstYearSavings,
  formatUsd,
} from "@/lib/pricing";

const INCLUDED = [
  { label: "Onboarding", list: `$${LIST.onboarding}` },
  { label: "Staff training", list: `$${LIST.training}` },
  {
    label: "6 months concierge retainer",
    list: `$${LIST.retainerMonthly * LIST.retainerMonthsFree}`,
  },
  { label: "Transaction fees", list: "10\u201315%" },
  { label: "All 14 languages", list: "$190/mo add-on" },
  { label: "Unlimited staff seats", list: "$8/seat" },
];

const SAMPLE_ROOMS = 60;

export function PricingTeaser() {
  const yearSave = firstYearSavings(SAMPLE_ROOMS);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-soft/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-amber-soft/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">
            <Gift className="h-3 w-3 text-emerald-brand" />
            Pricing &middot; honest, simple
          </span>
          <h2
            id="pricing-heading"
            className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink"
          >
            ${FOUNDERS.base} a month, plus
            <br />
            <span className="display-italic text-emerald-brand">
              ${FOUNDERS.perRoom} per room.
            </span>
          </h2>
          <p className="mt-4 text-foreground/70">
            One formula for every hotel. Onboarding, training, support and{" "}
            <span className="text-ink font-medium">
              6 months of concierge retainer
            </span>{" "}
            &mdash; included for the founders cohort.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            <span className="line-through">
              Normally ${LIST.base} + ${LIST.perRoom}/room
            </span>
          </p>
        </div>

        <div className="mt-12 sm:mt-14 max-w-3xl mx-auto">
          <article className="card-elev p-7 sm:p-9 relative overflow-hidden">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-soft/60 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-soft/40 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-brand text-white font-mono text-[10px] uppercase tracking-[0.16em]">
                  <Gift className="h-3 w-3" />
                  Founders offer
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <Sparkles className="h-3 w-3" />
                  0% commission
                </span>
              </div>

              <div className="mt-5 grid sm:grid-cols-[auto_1fr] gap-x-6 gap-y-1 items-baseline">
                <div className="flex items-baseline gap-2">
                  <span className="numeral text-5xl sm:text-6xl text-ink">
                    ${FOUNDERS.base}
                  </span>
                  <span className="text-base text-foreground/60">
                    + ${FOUNDERS.perRoom}/room / month
                  </span>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/50 sm:text-right">
                  <span className="line-through">
                    Normally ${LIST.base} + ${LIST.perRoom}/room
                  </span>
                </p>
              </div>

              <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {INCLUDED.map((line) => (
                  <li
                    key={line.label}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="h-4 w-4 text-emerald-brand shrink-0 mt-0.5" />
                    <span className="text-ink leading-snug">
                      {line.label}
                      <span className="ml-2 text-[11px] font-mono text-foreground/45">
                        <span className="line-through">{line.list}</span>
                        <span className="ml-1 text-emerald-brand">free</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-xl bg-emerald-soft/50 border border-emerald-brand/20 px-5 py-4 flex items-center gap-3 flex-wrap">
                <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-brand text-primary-foreground items-center justify-center shrink-0">
                  <TrendingDown className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
                    First-year savings &middot; {SAMPLE_ROOMS}-room hotel
                  </p>
                  <p className="numeral text-2xl text-ink leading-none mt-1">
                    ~{formatUsd(yearSave)}
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-full bg-ink text-[#f1ebde] font-medium hover:bg-emerald-brand transition-colors text-sm"
                >
                  Pricing & calculator
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap text-center">
          <span className="eyebrow flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
            30 days free &middot; no card &middot; no commitment
          </span>
          <span className="hidden sm:inline text-foreground/30">&middot;</span>
          <span className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-brand" />
            Founders cohort still open
          </span>
        </div>
      </div>
    </section>
  );
}
