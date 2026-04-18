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
  ShieldCheck,
  Calendar,
  Languages,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const PRODUCT_INCLUDES = [
  "Unlimited rooms & QR codes",
  "Full guest web app · branded",
  "Staff dashboard, requests board & analytics",
  "Multi-language engine (14 languages)",
  "Hotel info, amenities, helpful info",
  "Real-time notifications · Server-Sent Events",
  "Bring any payment processor · 0% transaction fees",
  "Service recovery desk · feedback loop",
  "Editable email templates · Resend layer",
  "Export your data, always",
];

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
    body: "Branding, languages, payment processor and your starting menu — done with you.",
    badge: "1–3 days",
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

const FAQ = [
  {
    q: "Is the product really free forever?",
    a: "Yes. The Concierge OS itself, every QR code, every guest, every team seat — free. We make money only if you choose the optional monthly retainer.",
  },
  {
    q: "Are there transaction fees?",
    a: "Zero from us. You bring your own payment processor; their fees are theirs. We never take a cut of your in-room sales.",
  },
  {
    q: "What does 'free onboarding' include?",
    a: "A kickoff call, initial setup with you, live staff training, and on-call support on launch day. No card, no contract.",
  },
  {
    q: "Can I cancel the retainer anytime?",
    a: "Yes — cancel any time, no clawback, no exit fees. Your data, menus and QR codes stay with you.",
  },
  {
    q: "Do you take on-site visits?",
    a: "In selected destinations (Tel Aviv, Milan, Lisbon, Athens, Limassol, Paphos) on-site is included once during onboarding. Outside those, we work remotely.",
  },
  {
    q: "Will my data leave with me?",
    a: "Always. One-click export of guests, menus, requests, QR codes — in standard formats. Yours, not ours.",
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

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-12 sm:pt-28 sm:pb-16 text-center">
            <span className="pill">
              <Gift className="h-3 w-3 text-emerald-brand" />
              Free for the hotel · founders cohort
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.04] text-ink">
              The product is yours.
              <br />
              <span className="display-italic text-emerald-brand">
                The retainer is optional.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Run the entire Concierge OS by yourself — no monthly fee, ever.
              Initial setup and staff training are on us. If you want a
              dedicated person handling the day-to-day, add the optional
              retainer.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start your hotel · free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <a
                href="#retainer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                See the retainer
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 eyebrow">
              No card · cancel anytime · your data leaves with you
            </p>
          </div>
        </section>

        {/* TWO PLANS */}
        <section className="relative py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
              {/* Plan A — Free product */}
              <article className="card-elev p-7 sm:p-9 flex flex-col h-full relative overflow-hidden">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-emerald-soft/60 blur-3xl"
                />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="pill">
                      <ShieldCheck className="h-3 w-3 text-emerald-brand" />
                      Concierge OS
                    </span>
                    <span className="pill pill-amber">forever free</span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-ink">
                    Run it yourself,
                    <br />
                    <span className="display-italic text-emerald-brand">
                      keep every euro.
                    </span>
                  </h2>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="numeral text-6xl text-ink">€0</span>
                    <span className="text-sm text-foreground/60">
                      / month, every month
                    </span>
                  </div>
                  <p className="mt-3 text-foreground/65 max-w-md">
                    The full product. Your hotel, your menus, your branding,
                    your team. We don&apos;t take a cut of in-room sales.
                  </p>

                  <ul className="mt-6 grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {PRODUCT_INCLUDES.map((line) => (
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
                    className="group mt-7 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors w-full sm:w-auto"
                  >
                    Start free
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>
                </div>
              </article>

              {/* Plan B — Optional retainer */}
              <article
                id="retainer"
                className="card-elev p-7 sm:p-9 flex flex-col h-full relative overflow-hidden bg-ink text-[#f1ebde] border-white/10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-brand/30 blur-3xl"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-brand/30 blur-3xl"
                />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-soft font-mono text-[10px] uppercase tracking-[0.18em]">
                      <Headphones className="h-3 w-3" />
                      Concierge retainer
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-brand text-white font-mono text-[10px] uppercase tracking-[0.18em]">
                      optional
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-[#f7f3ec]">
                    Or hand it to us
                    <br />
                    <span className="display-italic text-emerald-soft">
                      and exhale.
                    </span>
                  </h2>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="numeral text-6xl text-white">$39</span>
                    <span className="text-sm text-white/60">
                      / month · cancel anytime
                    </span>
                  </div>
                  <p className="mt-3 text-[#f1ebde]/75 max-w-md">
                    A real person on your account. Menus, translations, seasonal
                    offers, branding tweaks — handled monthly without you
                    lifting a finger.
                  </p>

                  <ul className="mt-6 space-y-2.5">
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

                  <Link
                    href="/demo"
                    className="group mt-7 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-amber-brand text-white font-medium hover:bg-clay transition-colors w-full sm:w-auto"
                  >
                    Talk to a rep
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                    add or cancel anytime · no clawback
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FREE ONBOARDING & TRAINING */}
        <section className="relative py-20 sm:py-24 bg-surface border-y border-[color:var(--border)] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
          <div className="absolute -top-32 right-1/3 h-72 w-72 rounded-full bg-emerald-soft/50 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10">
              <div className="lg:col-span-7">
                <span className="pill">
                  <Sparkles className="h-3 w-3 text-emerald-brand" />
                  Always included · always free
                </span>
                <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
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
                  Whether you take the retainer or not, we walk you through the
                  first set-up and train your staff — at no cost. Because
                  software only matters if your team actually uses it.
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
                title="Worldwide, 14 languages"
                body="Translations included for every menu and message."
              />
            </div>
          </div>
        </section>

        {/* COMPARISON ROW */}
        <section className="relative py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="pill pill-amber">// at a glance</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-ink">
                Free or with a retainer.
                <br />
                <span className="display-italic text-emerald-brand">
                  You pick.
                </span>
              </h2>
            </div>

            <div className="card-surface overflow-hidden">
              <ComparisonRow
                feature="Full Concierge OS"
                free
                retainer
                head
              />
              <ComparisonRow feature="Onboarding & training" free retainer />
              <ComparisonRow feature="0% transaction fees" free retainer />
              <ComparisonRow
                feature="14-language guest engine"
                free
                retainer
              />
              <ComparisonRow
                feature="Email, WhatsApp & screen-share support"
                free
                retainer
              />
              <ComparisonRow
                feature="Dedicated concierge engineer"
                free={false}
                retainer
              />
              <ComparisonRow
                feature="Monthly menu & translation refresh"
                free={false}
                retainer
              />
              <ComparisonRow
                feature="Seasonal offers & upsell ideas"
                free={false}
                retainer
              />
              <ComparisonRow
                feature="Branding tweaks handled by us"
                free={false}
                retainer
                last
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-16 sm:py-20 bg-surface border-y border-[color:var(--border)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="pill">
                <HelpCircle className="h-3 w-3 text-emerald-brand" />
                Honest answers
              </span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-ink">
                The questions hoteliers
                <br />
                <span className="display-italic text-emerald-brand">
                  always ask first.
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {FAQ.map((f) => (
                <article
                  key={f.q}
                  className="card-surface p-5 sm:p-6"
                >
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
              Sign up in two minutes. Setup, training and your launch day are on
              us — whether you take the retainer or not.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start your hotel
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

function ComparisonRow({
  feature,
  free,
  retainer,
  head = false,
  last = false,
}: {
  feature: string;
  free: boolean;
  retainer: boolean;
  head?: boolean;
  last?: boolean;
}) {
  return (
    <>
      {head ? (
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 sm:gap-8 items-center px-5 sm:px-6 py-3 bg-surface/60 border-b border-[color:var(--border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
            What you get
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand text-center min-w-[60px]">
            Free
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-brand text-center min-w-[80px]">
            + Retainer
          </p>
        </div>
      ) : null}
      <div
        className={`grid grid-cols-[1fr_auto_auto] gap-4 sm:gap-8 items-center px-5 sm:px-6 py-3.5 ${
          last ? "" : "border-b border-[color:var(--border)]"
        }`}
      >
        <p className="text-sm text-ink">{feature}</p>
        <div className="text-center min-w-[60px]">
          {free ? (
            <Check className="h-4 w-4 text-emerald-brand mx-auto" />
          ) : (
            <span className="text-foreground/30">—</span>
          )}
        </div>
        <div className="text-center min-w-[80px]">
          {retainer ? (
            <Check className="h-4 w-4 text-amber-brand mx-auto" />
          ) : (
            <span className="text-foreground/30">—</span>
          )}
        </div>
      </div>
    </>
  );
}
