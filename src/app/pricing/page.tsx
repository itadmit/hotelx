import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Headphones,
  Wrench,
  ScreenShare,
  Mail,
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  Gift,
  Calendar,
  Languages,
  TrendingDown,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { PricingCalculator } from "@/components/marketing/PricingCalculator";
import {
  FOUNDERS,
  LIST,
  foundersMonthly,
  listMonthly,
  firstYearSavings,
  listFirstYearTotal,
  foundersFirstYearTotal,
  formatUsd,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — HotelX | $29 + $6/room, everything included",
  description:
    "Simple, founders-friendly pricing for hotels: $29/month base + $6 per room. Free onboarding, training, support and 6 months of concierge retainer.",
};

const ONBOARDING_STEPS = [
  {
    icon: Calendar,
    title: "Kickoff call",
    body: "We map your menus, your team and your QR placements together.",
    badge: "30 min",
  },
  {
    icon: Wrench,
    title: "Initial setup",
    body: "Branding, languages, payment processor and your starting menu \u2014 done with you.",
    badge: "1\u20133 days",
  },
  {
    icon: Headphones,
    title: "Live training",
    body: "Reception, housekeeping and managers walked through the dashboard.",
    badge: "1 session",
  },
  {
    icon: Sparkles,
    title: "Go-live day",
    body: "We sit on standby on launch day. Anything wobbly, we fix in real time.",
    badge: "stand-by",
  },
];

const RETAINER_INCLUDES = [
  "A dedicated concierge engineer on WhatsApp & email",
  "Monthly menu, copy & translation refresh",
  "Seasonal offers and upsell ideas",
  "Branding tweaks and visual updates",
  "Support for new processors / integrations",
  "Quarterly reputation review",
];

const SAMPLE_HOTELS = [
  { rooms: 20, label: "Boutique inn" },
  { rooms: 60, label: "Mid-size independent" },
  { rooms: 150, label: "Large hotel" },
];

const FAQ = [
  {
    q: "How exactly does the price work?",
    a: `A flat $${FOUNDERS.base}/month base plus $${FOUNDERS.perRoom} per room. So a 20-room boutique pays $${foundersMonthly(20)}/mo; a 60-room hotel pays $${foundersMonthly(60)}/mo. No tiers, no surprises.`,
  },
  {
    q: "What's the 'normal' price you keep crossing out?",
    a: `Our list price after the founders cohort closes is $${LIST.base}/month base + $${LIST.perRoom} per room, plus a one-time $${LIST.onboarding} onboarding and $${LIST.training} training. The 6-month concierge retainer becomes $${LIST.retainerMonthly}/month. The founders cohort waives all of that.`,
  },
  {
    q: "Are there transaction fees on top?",
    a: "Zero from us. You bring your own payment processor; their fees are theirs. We never take a cut of in-room sales.",
  },
  {
    q: "What does 'free onboarding' include?",
    a: "A kickoff call, initial setup with you, live staff training, and on-call support on launch day. No card, no contract, no hidden fee.",
  },
  {
    q: "What happens after the 6 free retainer months?",
    a: `Two options. Keep the dedicated concierge engineer for $${LIST.retainerMonthly}/month \u2014 cancel anytime. Or stop the retainer and keep using the platform; the $${FOUNDERS.base} + $${FOUNDERS.perRoom}/room never changes.`,
  },
  {
    q: "Will the founders price change later?",
    a: `For your hotel, no. Once you're in, your $${FOUNDERS.base} + $${FOUNDERS.perRoom}/room is locked in. The list price applies only to hotels that join after the founders cohort closes.`,
  },
  {
    q: "Do you take on-site visits?",
    a: "In selected destinations (Tel Aviv, Milan, Lisbon, Athens, Limassol, Paphos) on-site is included once during onboarding. Outside those, we work remotely.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* HERO */}
        <section className="relative overflow-hidden bg-wash">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-soft/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-amber-soft/60 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-10 sm:pt-28 sm:pb-12 text-center">
            <span className="pill">
              <Gift className="h-3 w-3 text-emerald-brand" />
              Founders cohort &middot; everything included
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.04] text-ink">
              ${FOUNDERS.base} a month, plus
              <br />
              <span className="display-italic text-emerald-brand">
                ${FOUNDERS.perRoom} per room.
              </span>
            </h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              <span className="line-through">
                Normally ${LIST.base} + ${LIST.perRoom}/room
              </span>
            </p>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              One simple formula for every hotel. Onboarding, training and the
              first 6 months of dedicated concierge retainer &mdash; all on the
              house for the founders cohort.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start free trial
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                See the calculator
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 eyebrow">
              14-day trial &middot; no card &middot; cancel anytime
            </p>
          </div>
        </section>

        {/* CALCULATOR */}
        <section
          id="calculator"
          aria-labelledby="calc-heading"
          className="relative py-12 sm:py-16"
        >
          <h2 id="calc-heading" className="sr-only">
            Pricing calculator
          </h2>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <PricingCalculator />
          </div>
        </section>

        {/* WHAT'S INCLUDED — with strike-through anchors */}
        <section
          aria-labelledby="included-heading"
          className="relative py-16 sm:py-20 bg-surface border-y border-[color:var(--border)]"
        >
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10">
              <div className="lg:col-span-6">
                <span className="pill">
                  <Check className="h-3 w-3 text-emerald-brand" />
                  Everything included
                </span>
                <h2
                  id="included-heading"
                  className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink"
                >
                  No add-ons.
                  <br />
                  <span className="display-italic text-emerald-brand">
                    No surprise invoices.
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-6 lg:flex lg:items-end">
                <p className="text-foreground/70">
                  Other vendors charge separately for setup, training, languages,
                  seats, even commissions. We don&rsquo;t. Here&rsquo;s the full
                  list, with what you&rsquo;d normally pay elsewhere &mdash;
                  struck through.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <IncludedRow
                label="Onboarding"
                listPrice={`$${LIST.onboarding} one-time`}
                note="We set the menus, branding, languages, payments &mdash; with you."
              />
              <IncludedRow
                label="Live staff training"
                listPrice={`$${LIST.training} one-time`}
                note="Reception, housekeeping, managers &mdash; trained in one session."
              />
              <IncludedRow
                label="Concierge retainer (6 months)"
                listPrice={`$${LIST.retainerMonthly * LIST.retainerMonthsFree} value`}
                note="A dedicated person on your account. Then $39/mo or cancel."
              />
              <IncludedRow
                label="Transaction fees"
                listPrice="10\u201315% elsewhere"
                note="Bring your own processor. We never touch the rev share."
              />
              <IncludedRow
                label="14 guest languages"
                listPrice="$190/mo add-on"
                note="Auto-translated menus, messages and reviews."
              />
              <IncludedRow
                label="Unlimited staff seats"
                listPrice="$8/seat elsewhere"
                note="Add the whole team. We don&rsquo;t penalize growth."
              />
              <IncludedRow
                label="Smart review loop"
                listPrice="$120/mo elsewhere"
                note="Public links to happy guests. Private apology to unhappy ones."
              />
              <IncludedRow
                label="Email infrastructure"
                listPrice="$45/mo per domain"
                note="Resend integration, deliverability, templates &mdash; ready."
              />
              <IncludedRow
                label="All future features"
                listPrice="upgrade fees"
                note="As we ship, you get it. No 'pro' tier wall later."
              />
            </div>
          </div>
        </section>

        {/* SAMPLE HOTELS — anchored */}
        <section
          aria-labelledby="examples-heading"
          className="relative py-16 sm:py-20"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="pill pill-amber">// real-world math</span>
              <h2
                id="examples-heading"
                className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-ink"
              >
                Three hotels.
                <br />
                <span className="display-italic text-emerald-brand">
                  Same product, different rooms.
                </span>
              </h2>
            </div>

            <div className="space-y-3">
              {SAMPLE_HOTELS.map((h) => (
                <SampleRow key={h.rooms} rooms={h.rooms} label={h.label} />
              ))}
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 text-center">
              All examples include onboarding, training, 6mo retainer, and 0%
              transaction fees
            </p>
          </div>
        </section>

        {/* FREE ONBOARDING & TRAINING */}
        <section
          aria-labelledby="onboarding-heading"
          className="relative py-20 sm:py-24 overflow-hidden bg-surface border-y border-[color:var(--border)]"
        >
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute -top-32 right-1/3 h-72 w-72 rounded-full bg-emerald-soft/45 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10">
              <div className="lg:col-span-7">
                <span className="pill">
                  <Sparkles className="h-3 w-3 text-emerald-brand" />
                  How we get you live
                </span>
                <h2
                  id="onboarding-heading"
                  className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink"
                >
                  Free onboarding.
                  <br />
                  <span className="display-italic text-emerald-brand">
                    Free training.
                  </span>{" "}
                  Truly.
                </h2>
              </div>
              <div className="lg:col-span-5 lg:flex lg:items-end">
                <p className="text-foreground/70">
                  We don&rsquo;t hand you a SaaS login and wave goodbye. We sit
                  with your team, set everything up, and stand by on launch
                  day. At zero extra cost.
                </p>
              </div>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {ONBOARDING_STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="card-surface p-5 sm:p-6 relative overflow-hidden"
                >
                  <span className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">
                    step {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-emerald-soft text-emerald-brand">
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-ink leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                    {s.body}
                  </p>
                  <span className="mt-4 inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-[color:var(--border)] font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/65">
                    {s.badge}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid sm:grid-cols-3 gap-3">
              <SupportPill
                icon={ScreenShare}
                title="Live screen-share"
                body="When something needs us, we&rsquo;re on within 6 minutes."
              />
              <SupportPill
                icon={Mail}
                title="Email & WhatsApp"
                body="A real human, not a ticket queue."
              />
              <SupportPill
                icon={Languages}
                title="14 languages out of the box"
                body="Translations included for every menu and message."
              />
            </div>
          </div>
        </section>

        {/* OPTIONAL RETAINER (after 6 months) */}
        <section
          aria-labelledby="retainer-heading"
          className="relative py-16 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="card-elev p-7 sm:p-9 relative overflow-hidden bg-ink text-[#f1ebde] border-white/10">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-brand/30 blur-3xl"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-brand/30 blur-3xl"
              />
              <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-soft font-mono text-[10px] uppercase tracking-[0.18em]">
                      <Headphones className="h-3 w-3" />
                      After your free 6 months
                    </span>
                  </div>
                  <h2
                    id="retainer-heading"
                    className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-[#f7f3ec]"
                  >
                    Keep the concierge,
                    <br />
                    <span className="display-italic text-emerald-soft">
                      or fly solo.
                    </span>
                  </h2>
                  <p className="mt-4 text-white/70 max-w-md">
                    After the 6 founders months, you choose: keep your
                    dedicated concierge engineer for ${LIST.retainerMonthly}
                    /month (cancel any time), or just keep using the platform.
                    Your $${FOUNDERS.base} + $${FOUNDERS.perRoom}/room never
                    changes.
                  </p>
                </div>
                <ul className="grid sm:grid-cols-1 gap-2.5">
                  {RETAINER_INCLUDES.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm text-[#f1ebde]/90"
                    >
                      <Check className="h-4 w-4 text-amber-soft shrink-0 mt-0.5" />
                      <span className="leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="relative py-16 sm:py-20 bg-surface border-y border-[color:var(--border)]"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="pill">
                <HelpCircle className="h-3 w-3 text-emerald-brand" />
                Honest answers
              </span>
              <h2
                id="faq-heading"
                className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-ink"
              >
                The questions hoteliers
                <br />
                <span className="display-italic text-emerald-brand">
                  always ask first.
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {FAQ.map((f) => (
                <article key={f.q} className="card-surface p-5 sm:p-6">
                  <h3 className="font-display text-lg text-ink leading-snug">
                    {f.q}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    {f.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
          <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-emerald-soft/60 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="pill">
              <Sparkles className="h-3 w-3 text-emerald-brand" />
              Founders cohort still open
            </span>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
              Open the doors.
              <br />
              <span className="display-italic text-emerald-brand">
                We&rsquo;ll handle the welcome.
              </span>
            </h2>
            <p className="mt-5 text-foreground/70">
              Sign up in two minutes. Setup, training and your first 6 months
              of concierge retainer are on us.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start free trial
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                Try the demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function IncludedRow({
  label,
  listPrice,
  note,
}: {
  label: string;
  listPrice: string;
  note: string;
}) {
  return (
    <article className="card-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base text-ink leading-snug">
          {label}
        </h3>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.14em] shrink-0">
          Free
        </span>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
        <span className="line-through">{listPrice}</span>
      </p>
      <p
        className="mt-2 text-[12.5px] text-foreground/65 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: note }}
      />
    </article>
  );
}

function SupportPill({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="card-surface p-4 flex items-start gap-3">
      <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center shrink-0">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p
          className="text-[12.5px] text-foreground/65 mt-0.5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  );
}

function SampleRow({ rooms, label }: { rooms: number; label: string }) {
  const founders = foundersMonthly(rooms);
  const list = listMonthly(rooms);
  const listYear = listFirstYearTotal(rooms);
  const foundersYear = foundersFirstYearTotal(rooms);
  const save = firstYearSavings(rooms);

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-4 sm:gap-6 items-center">
        <div>
          <p className="text-base font-medium text-ink">{label}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 mt-1">
            {rooms} rooms
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
            <span className="line-through">Normally {formatUsd(list)}/mo</span>
          </p>
          <p className="numeral text-2xl text-ink leading-none mt-1">
            {formatUsd(founders)}
            <span className="text-sm text-foreground/55 ml-1">/mo</span>
          </p>
        </div>

        <div className="rounded-lg bg-emerald-soft/50 border border-emerald-brand/20 px-3 py-2 text-left sm:text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-brand flex items-center gap-1 sm:justify-end">
            <TrendingDown className="h-3 w-3" />
            Year-1 savings
          </p>
          <p className="numeral text-lg text-emerald-brand leading-none mt-1">
            {formatUsd(save)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/45 mt-1">
            {formatUsd(foundersYear)} vs {formatUsd(listYear)}
          </p>
        </div>
      </div>
    </div>
  );
}
