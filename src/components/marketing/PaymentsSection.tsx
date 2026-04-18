import {
  CreditCard,
  Wallet,
  Globe,
  ShieldCheck,
  ArrowRight,
  Plug,
  Sparkles,
  KeyRound,
  PercentCircle,
} from "lucide-react";
import Link from "next/link";

const PROCESSORS = [
  { name: "Stripe", icon: CreditCard },
  { name: "PayPal", icon: Wallet },
  { name: "Adyen", icon: Plug },
  { name: "Square", icon: KeyRound },
  { name: "+ Custom", icon: Globe },
];

const POINTS = [
  {
    icon: PercentCircle,
    title: "0% transaction fees — launch promo",
    body: "We don't take a cut of your guests' spend. You only ever pay your processor's standard rate; HotelX adds nothing on top. Locked for early customers.",
  },
  {
    icon: Plug,
    title: "Adapter pattern, not vendor lock-in",
    body: "One PaymentProvider interface, swappable adapters. Add a processor in minutes — Stripe, PayPal, your bank, your in-house gateway.",
  },
  {
    icon: ShieldCheck,
    title: "We build the integration",
    body: "Even if your processor doesn't have a developer program, our team writes the bridge. Two webhooks, HMAC-signed, no buy-in needed.",
  },
  {
    icon: Sparkles,
    title: "Per-service toggle",
    body: "Mark which services need payment up-front: champagne, spa, late checkout. Free items (towels, info) stay one-tap.",
  },
];

export function PaymentsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 right-1/3 h-72 w-72 rounded-full bg-amber-soft blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pill">
                <CreditCard className="h-3 w-3" />
                Payments
              </span>
              <span className="pill pill-amber">
                <PercentCircle className="h-3 w-3" />
                0% fee · launch promo
              </span>
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
              Connect any
              <br />
              <span className="display-italic text-emerald-brand">
                payment processor.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-md">
              Our Payments API is processor-agnostic. Stripe, PayPal, or
              something the rest of the industry hasn&apos;t heard of — we
              build the integration so the processor doesn&apos;t even need
              to know we exist. <span className="text-ink font-medium">And we never take a cut.</span>
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
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Try the checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard/payments"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                View admin
              </Link>
            </div>
          </div>

          {/* Visual: processor stack */}
          <div className="lg:col-span-7">
            <div className="relative card-elev p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                    PaymentProvider · interface
                  </p>
                  <p className="font-display text-xl text-ink mt-1">
                    Connected processors
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                  live
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROCESSORS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.name}
                      className="rounded-xl border border-[color:var(--border)] bg-surface/60 p-4 flex flex-col items-start gap-3 hover:border-emerald-brand/30 transition-colors"
                    >
                      <span className="inline-flex h-9 w-9 rounded-lg bg-card text-ink items-center justify-center border border-[color:var(--border)]">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-brand">
                        adapter ready
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl bg-ink text-[#f1ebde] p-5 font-mono text-[12px] leading-relaxed overflow-hidden">
                <p className="text-foreground/40">
                  <span className="text-amber-soft">// one interface, any processor</span>
                </p>
                <p>
                  <span className="text-amber-soft">interface</span>{" "}
                  <span className="text-emerald-soft">PaymentProvider</span>{" "}
                  &#123;
                </p>
                <p className="pl-3">
                  createIntent(input):{" "}
                  <span className="text-emerald-soft">Promise&lt;Intent&gt;</span>;
                </p>
                <p className="pl-3">
                  confirm(input):{" "}
                  <span className="text-emerald-soft">Promise&lt;Result&gt;</span>;
                </p>
                <p className="pl-3">
                  handleWebhook(body, headers):{" "}
                  <span className="text-emerald-soft">Promise&lt;Event&gt;</span>;
                </p>
                <p>&#125;</p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-amber-soft/60 px-3 py-2 border border-amber-brand/25">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-brand">
                    HotelX fee
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">0%</p>
                </div>
                <div className="rounded-lg bg-surface px-3 py-2 border border-[color:var(--border)]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
                    Latency
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">~120 ms</p>
                </div>
                <div className="rounded-lg bg-surface px-3 py-2 border border-[color:var(--border)]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
                    Encryption
                  </p>
                  <p className="numeral text-sm text-ink mt-0.5">AES-256</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
