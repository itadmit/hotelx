import {
  Gift,
  UserCog,
  CalendarRange,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const INCLUDED = [
  {
    icon: CalendarRange,
    title: "Six months on the house",
    body: "Free for half a year. No credit card during sign-up — only when (and if) you decide to keep going.",
  },
  {
    icon: UserCog,
    title: "Your own concierge engineer",
    body: "A real person, on WhatsApp & email, available for menu changes, branding tweaks and integrations during the entire onboarding window.",
  },
  {
    icon: Sparkles,
    title: "Free monthly content care",
    body: "We refresh your menu copy, translations and seasonal offers every month — without you lifting a finger.",
  },
  {
    icon: ShieldCheck,
    title: "No lock-in, ever",
    body: "Cancel any time. Export your guest data, your menus and your QR codes in one click — they're yours, not ours.",
  },
];

export function OfferSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-amber-soft/70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-soft/70 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pill">
                <Gift className="h-3 w-3" />
                Founders offer
              </span>
              <span className="pill pill-amber">
                6 months · free
              </span>
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
              The kind of partnership
              <br />
              <span className="display-italic text-emerald-brand">
                hotels rarely get.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-md">
              We open with six months of complete care — software, updates and a
              dedicated person to your account. After that, keep it for{" "}
              <span className="text-ink font-medium">$39 / month</span>, or walk
              away. Either way, your data leaves with you.
            </p>

            <div className="mt-8 space-y-4">
              {INCLUDED.map((p) => {
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
          </div>

          {/* Offer card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-emerald-brand text-[#f1ebde] p-6 sm:p-10 overflow-hidden shadow-[0_30px_80px_-30px_rgba(14,82,64,0.55)]">
              {/* Color washes inside the dark card */}
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-brand/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-clay/30 blur-3xl" />
              {/* Subtle grid */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "64px 64px",
                }}
              />

              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] bg-white/10 border border-white/20 text-amber-soft">
                  // launch retainer · limited cohort
                </span>

                {/* Two-phase price strip */}
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-soft">
                      Months 1 — 6
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="numeral text-5xl text-white">€0</span>
                      <span className="text-white/60 text-sm">/ month</span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      Full Concierge OS, dedicated rep, monthly content care.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-brand/40 bg-amber-brand/[0.18] p-5 relative">
                    <span className="absolute -top-2.5 left-5 px-2 py-0.5 rounded-full bg-amber-brand text-white font-mono text-[9px] uppercase tracking-[0.18em]">
                      then, optionally
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-soft">
                      Month 7 onwards
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="numeral text-5xl text-white">$39</span>
                      <span className="text-white/60 text-sm">/ month</span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      Or cancel — no questions, no clawback, no charge.
                    </p>
                  </div>
                </div>

                {/* Inclusions list (mirror of the side copy, reinforced visually) */}
                <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    "Full guest QR app",
                    "Staff dashboard & analytics",
                    "Multi-language engine (14)",
                    "0% transaction fees",
                    "Personal account engineer",
                    "Monthly menu & translations refresh",
                    "Cancel any time",
                    "Export your data, always",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2 text-sm text-white/85"
                    >
                      <Check className="h-4 w-4 text-amber-soft shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-amber-brand text-white font-medium hover:bg-clay transition-colors"
                  >
                    Claim the 6-month offer
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="#support"
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    Talk to a rep
                  </Link>
                </div>

                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  No card · no commitment · your account engineer reaches out within 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
