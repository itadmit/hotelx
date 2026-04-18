import {
  TrendingUp,
  Star,
  PhoneOff,
  ArrowUpRight,
  Wallet,
  Globe,
} from "lucide-react";

const OUTCOMES = [
  {
    eyebrow: "Revenue per room",
    icon: TrendingUp,
    metric: "+\u20ac18",
    metricUnit: "/ room / night",
    headline: "Every tap is an upsell.",
    body: "Guests scan, browse, order. Champagne, late check-out, room-service, spa slots — all live in their pocket, in their language.",
    chips: [
      { icon: Wallet, label: "0% commission" },
      { icon: Globe, label: "14 languages" },
    ],
    accent: "emerald",
  },
  {
    eyebrow: "Booking & Google score",
    icon: Star,
    metric: "+0.4",
    metricUnit: "stars in 90 days",
    headline: "We only invite happy guests to review you publicly.",
    body: "Unhappy ones reach you privately, before they vent on Booking. The smart review loop quietly lifts your public score and protects your ranking.",
    chips: [
      { icon: Star, label: "More 5-star reviews" },
      { icon: PhoneOff, label: "Fewer 1-stars" },
    ],
    accent: "amber",
  },
  {
    eyebrow: "Reception load",
    icon: PhoneOff,
    metric: "\u221243%",
    metricUnit: "calls to reception",
    headline: "Reception stops being a switchboard.",
    body: "Wi-Fi, breakfast hours, taxis, towels — every guest question is one tap away, auto-translated. Your team gets back to hospitality.",
    chips: [
      { icon: Globe, label: "Auto-translated" },
      { icon: TrendingUp, label: "Faster response" },
    ],
    accent: "ink",
  },
] as const;

export function OutcomesSection() {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-soft/45 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-amber-soft/45 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="pill">
            <TrendingUp className="h-3 w-3 text-emerald-brand" />
            Outcomes, not features
          </span>
          <h2
            id="outcomes-heading"
            className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink"
          >
            Three numbers your GM
            <br />
            <span className="display-italic text-emerald-brand">
              actually cares about.
            </span>
          </h2>
          <p className="mt-5 text-foreground/70 max-w-xl">
            Forget feature lists. HotelX is bought because of three lines on
            your monthly report &mdash; revenue per room, your Booking score,
            and the volume of calls to reception.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {OUTCOMES.map((o) => (
            <article
              key={o.eyebrow}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col h-full overflow-hidden ${
                o.accent === "ink"
                  ? "bg-ink text-[#f1ebde] border border-white/10 shadow-[0_30px_80px_-30px_rgba(15,32,28,0.6)]"
                  : "card-elev"
              }`}
            >
              {/* Decorative blob */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl ${
                  o.accent === "emerald"
                    ? "bg-emerald-soft/60"
                    : o.accent === "amber"
                    ? "bg-amber-soft/60"
                    : "bg-emerald-brand/30"
                }`}
              />

              <div className="relative flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${
                    o.accent === "emerald"
                      ? "bg-emerald-soft text-emerald-brand"
                      : o.accent === "amber"
                      ? "bg-amber-soft text-amber-brand"
                      : "bg-white/10 text-amber-soft"
                  }`}
                >
                  <o.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    o.accent === "ink" ? "text-amber-soft" : "text-emerald-brand"
                  }`}
                >
                  {o.eyebrow}
                </span>
              </div>

              <div className="relative mt-6 flex items-baseline gap-2">
                <span
                  className={`numeral text-5xl sm:text-6xl leading-none ${
                    o.accent === "ink" ? "text-white" : "text-ink"
                  }`}
                >
                  {o.metric}
                </span>
                <span
                  className={`text-xs font-mono uppercase tracking-[0.16em] ${
                    o.accent === "ink"
                      ? "text-white/60"
                      : "text-foreground/55"
                  }`}
                >
                  {o.metricUnit}
                </span>
              </div>

              <h3
                className={`relative mt-5 font-display text-xl leading-snug ${
                  o.accent === "ink" ? "text-[#f7f3ec]" : "text-ink"
                }`}
              >
                {o.headline}
              </h3>
              <p
                className={`relative mt-2 text-sm leading-relaxed flex-1 ${
                  o.accent === "ink"
                    ? "text-[#f1ebde]/70"
                    : "text-foreground/65"
                }`}
              >
                {o.body}
              </p>

              <div className="relative mt-5 flex flex-wrap gap-2">
                {o.chips.map((c) => (
                  <span
                    key={c.label}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] ${
                      o.accent === "ink"
                        ? "bg-white/10 border border-white/15 text-amber-soft"
                        : o.accent === "emerald"
                        ? "bg-surface border border-[color:var(--border)] text-emerald-brand"
                        : "bg-surface border border-[color:var(--border)] text-amber-brand"
                    }`}
                  >
                    <c.icon className="h-3 w-3" strokeWidth={2} />
                    {c.label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            Founders cohort averages, Q3 2026
          </p>
          <a
            href="#pricing"
            className="text-sm text-emerald-brand hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            See what it costs
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
