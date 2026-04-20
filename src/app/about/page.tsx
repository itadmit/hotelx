import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — HotelX",
  description:
    "The story behind HotelX: founded in Tel Aviv, built for hoteliers who refuse to settle for outdated tech.",
  openGraph: {
    title: "About — HotelX",
    description:
      "Founded in 2024 in Tel Aviv, HotelX gives every hotel enterprise-grade guest technology — without the enterprise price tag.",
  },
};

const values = [
  {
    icon: Sparkles,
    title: "Simplicity First",
    body: "If a feature needs a manual, it doesn\u2019t ship. Every screen earns its pixels.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by Design",
    body: "No guest data is sold, shared, or used for ads. GDPR & SOC 2 compliant from day one.",
  },
  {
    icon: Zap,
    title: "Speed Obsession",
    body: "Sub-second page loads. Real-time dashboards. Every millisecond matters when a guest is waiting.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality DNA",
    body: "Half our team has worked the front desk. We build for real operations, not demo day.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-emerald-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Our Story</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              Hospitality deserves
              <br />
              <span className="display-italic text-emerald-brand">
                better tools.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              HotelX was founded in 2024 in Tel Aviv, born from a decade of
              frustration with hotel tech that hadn&apos;t evolved since the fax
              machine.
            </p>
          </div>
        </section>

        {/* ── Origin story ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-6">
                <span className="eyebrow">The Beginning</span>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                  From consulting rooms
                  <br />
                  <span className="display-italic text-emerald-brand">
                    to product.
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-6 space-y-5 text-foreground/70 leading-relaxed">
                <p>
                  Yogev Avitan, founder of HotelX, spent years in hospitality
                  tech consulting — helping hotels stitch together five different
                  platforms just to handle room service, reviews, and guest
                  communication. The stack was always fragile, always expensive,
                  and always built for chain hotels with six-figure budgets.
                </p>
                <p>
                  In 2024, he decided to stop patching and start building. The
                  result is HotelX — a single platform that gives any hotel
                  everything it needs to deliver a five-star digital guest
                  experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* ── Mission & Vision ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="card-elev p-6 sm:p-8">
                <span className="eyebrow text-emerald-brand">Mission</span>
                <p className="mt-4 font-display text-xl sm:text-2xl tracking-tight leading-snug text-ink">
                  &ldquo;We believe every hotel — from a 20-room boutique in
                  Lisbon to a 500-room resort in Dubai — deserves
                  enterprise-grade guest technology, without the enterprise price
                  tag.&rdquo;
                </p>
              </div>
              <div className="card-elev p-6 sm:p-8">
                <span className="eyebrow text-amber-brand">Vision</span>
                <p className="mt-4 font-display text-xl sm:text-2xl tracking-tight leading-snug text-ink">
                  &ldquo;A world where no guest waits on hold, no request gets
                  lost, and every hotel can compete with the big chains on
                  experience.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* ── Values ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="eyebrow">What We Stand For</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                Four principles,
                <br />
                <span className="display-italic text-emerald-brand">
                  zero compromise.
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="card-surface p-5 sm:p-6">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h3 className="mt-4 font-display text-lg tracking-tight text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* ── Team ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow">The Team</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
              Small team,{" "}
              <span className="display-italic text-emerald-brand">
                big ambition.
              </span>
            </h2>
            <p className="mt-5 text-foreground/70 leading-relaxed max-w-xl mx-auto">
              A focused group of engineers, designers, and former hoteliers
              spread across Tel Aviv and Lisbon — building the tool we wished
              existed when we worked the front desk.
            </p>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-20 sm:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="pill">
              <HeartHandshake className="h-3 w-3" />
              Join us
            </span>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
              Backed by hoteliers,
              <br />
              <span className="display-italic text-emerald-brand">
                built by engineers.
              </span>
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Book a demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
