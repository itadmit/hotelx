import {
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Tag,
  Globe2,
  ChartLine,
  Crown,
  Languages,
} from "lucide-react";
import Link from "next/link";

const TOP_SERVICES = [
  {
    name: "Champagne & strawberries",
    requests: 142,
    revenue: "€6,816",
    trend: "up" as const,
    note: "Order it on every Friday night. Push.",
    tone: "promote" as const,
  },
  {
    name: "Late-night truffle pasta",
    requests: 96,
    revenue: "€2,688",
    trend: "up" as const,
    note: "Demand exceeds price. Try +€4.",
    tone: "raise" as const,
  },
  {
    name: "Spa · 60min massage",
    requests: 71,
    revenue: "€7,810",
    trend: "up" as const,
    note: "Featured upsell candidate.",
    tone: "promote" as const,
  },
  {
    name: "Continental breakfast",
    requests: 58,
    revenue: "€1,392",
    trend: "down" as const,
    note: "Test a free coffee bundle.",
    tone: "bundle" as const,
  },
];

const TONE_STYLES: Record<
  "promote" | "raise" | "bundle",
  { pill: string; label: string }
> = {
  promote: {
    pill: "bg-emerald-soft text-emerald-brand",
    label: "Promote",
  },
  raise: {
    pill: "bg-amber-soft text-amber-brand",
    label: "Raise price",
  },
  bundle: {
    pill: "bg-[#f3d8cf] text-clay",
    label: "Bundle",
  },
};

const POINTS = [
  {
    icon: Crown,
    title: "Know your hero services",
    body: "Every month we surface the items guests actually fight for — by request count, conversion and revenue per room-night.",
  },
  {
    icon: Tag,
    title: "Smart price suggestions",
    body: "When demand outruns price, we flag it. Real numbers, not guesses: 'Truffle pasta sells out by 23:00, +€4 leaves no slack.'",
  },
  {
    icon: Sparkles,
    title: "What to push next month",
    body: "Pin underused gems as Featured upsells on the guest home — one toggle, instant uplift.",
  },
  {
    icon: Languages,
    title: "Reach every guest, in their language",
    body: "All services auto-translated to 14 languages. A Tokyo guest reads the menu in 日本語 — no extra setup, no extra menu cards.",
  },
];

export function InsightsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-emerald-soft/70 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Visual: insights board */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative card-elev p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                    Insights · last 30 days
                  </p>
                  <p className="font-display text-xl text-ink mt-1">
                    What guests really want
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                  live data
                </span>
              </div>

              {/* Top services list */}
              <ul className="mt-6 divide-y divide-[color:var(--border)] rounded-xl border border-[color:var(--border)] bg-surface/60 overflow-hidden">
                {TOP_SERVICES.map((s, i) => {
                  const tone = TONE_STYLES[s.tone];
                  return (
                    <li
                      key={s.name}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-card/60 transition-colors"
                    >
                      <span className="numeral text-foreground/40 text-sm w-5 text-right pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-ink truncate">
                            {s.name}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-[0.16em] ${tone.pill}`}
                          >
                            {tone.label}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[11.5px] text-foreground/60">
                          <span>
                            <span className="numeral text-ink">
                              {s.requests}
                            </span>{" "}
                            requests
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[color:var(--border)]" />
                          <span>
                            <span className="numeral text-ink">{s.revenue}</span>{" "}
                            revenue
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 ml-auto ${
                              s.trend === "up"
                                ? "text-emerald-brand"
                                : "text-clay"
                            }`}
                          >
                            {s.trend === "up" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            <span className="font-mono text-[10px]">
                              {s.trend === "up" ? "trending" : "softening"}
                            </span>
                          </span>
                        </div>
                        <p className="mt-1 text-[11.5px] text-foreground/65 italic">
                          {s.note}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Weekly digest — narrative, not code */}
              <div className="mt-5 card-surface p-5 sm:p-6 relative overflow-hidden">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-soft/50 blur-2xl"
                />
                <div className="relative flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 rounded-lg bg-amber-soft text-amber-brand items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-brand">
                      Weekly suggestion
                    </p>
                    <p className="font-display text-lg sm:text-xl text-ink mt-1.5 leading-snug">
                      Try{" "}
                      <span className="text-emerald-brand">+€4</span> on the
                      truffle pasta
                    </p>
                    <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
                      It sold out by 23:14 on the last 4 Fridays. Demand is
                      ahead of price — guests will still order.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand" />
                      projected uplift · +€312 / week
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer chips */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-soft/60 px-3 py-2 border border-emerald-brand/25">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-brand">
                    Avg response
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">3 min</p>
                </div>
                <div className="rounded-lg bg-amber-soft/60 px-3 py-2 border border-amber-brand/25">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-brand">
                    Upsell uplift
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">+18%</p>
                </div>
                <div className="rounded-lg bg-surface px-3 py-2 border border-[color:var(--border)]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
                    Languages
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">14</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pill">
                <ChartLine className="h-3 w-3" />
                Insights
              </span>
              <span className="pill pill-amber">
                <Globe2 className="h-3 w-3" />
                14 languages, native
              </span>
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
              After a month, your hotel
              <br />
              <span className="display-italic text-emerald-brand">
                tells you what to do.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-md">
              We don&apos;t hand you another dashboard to babysit. Once your data is
              warm, HotelX writes a short, opinionated digest:{" "}
              <span className="text-ink font-medium">
                what&apos;s working, what to push, and what&apos;s priced too low.
              </span>
            </p>

            <div className="mt-8 space-y-4">
              {POINTS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div className="leading-snug">
                      <p className="font-medium text-ink text-[15px]">
                        {p.title}
                      </p>
                      <p className="text-sm text-foreground/65 mt-1 max-w-md">
                        {p.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                See it after 30 days
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Tour the data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
