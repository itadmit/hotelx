import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";

const plans = [
  {
    name: "Boutique",
    price: "€89",
    suffix: "/mo",
    description: "Up to 30 rooms. Everything to launch beautifully.",
    features: [
      "Guest QR app",
      "Staff dashboard",
      "5 staff seats",
      "Bring any payment provider · 0% fee",
      "Email support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Signature",
    price: "€249",
    suffix: "/mo",
    description: "Up to 120 rooms. The full Concierge OS, unlocked.",
    features: [
      "Everything in Boutique",
      "Multi-language engine",
      "Analytics & reports",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Estate",
    price: "Custom",
    suffix: "",
    description: "Multi-property, SSO, dedicated success manager.",
    features: [
      "Everything in Signature",
      "Unlimited rooms & staff",
      "SSO & audit logs",
      "Dedicated SLA",
    ],
    cta: "Talk to sales",
    href: "/demo",
    highlight: false,
  },
];

export function PricingTeaser() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill pill-amber">// pricing · per property</span>
          <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
            Plans that scale with{" "}
            <span className="display-italic text-emerald-brand">your suites.</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            Honest pricing. No per-request fees.{" "}
            <span className="text-ink font-medium">0% transaction fees</span>{" "}
            during launch. Cancel anytime.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 grid md:grid-cols-3 gap-5 md:gap-5">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-2xl p-7 flex flex-col h-full ${
                p.highlight
                  ? "bg-emerald-brand text-[#f1ebde] shadow-[0_30px_80px_-30px_rgba(14,82,64,0.5)]"
                  : "card-surface"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-brand text-[#fff] text-[10px] font-mono uppercase tracking-[0.18em]">
                  Most chosen
                </span>
              )}
              <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${p.highlight ? "text-amber-soft" : "text-emerald-brand"}`}>
                {p.name}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`numeral text-5xl ${p.highlight ? "text-white" : "text-ink"}`}>{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-white/60" : "text-foreground/60"}`}>{p.suffix}</span>
              </div>
              <p className={`mt-3 text-sm ${p.highlight ? "text-white/70" : "text-foreground/70"}`}>{p.description}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={`h-4 w-4 shrink-0 ${p.highlight ? "text-amber-soft" : "text-emerald-brand"}`} />
                    <span className={p.highlight ? "text-white/90" : "text-ink"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`mt-7 inline-flex items-center justify-center gap-1.5 h-11 rounded-full font-medium transition-all ${
                  p.highlight
                    ? "bg-amber-brand text-white hover:bg-amber-brand/90"
                    : "bg-ink text-[#f1ebde] hover:bg-emerald-brand"
                }`}
              >
                {p.cta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center eyebrow">
          14-day free trial · No credit card required
        </p>
      </div>
    </section>
  );
}
