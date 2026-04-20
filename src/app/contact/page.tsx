import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Mail,
  LifeBuoy,
  Newspaper,
  MapPin,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — HotelX",
  description:
    "Get in touch with HotelX — sales, support, or press. Based in Tel Aviv, serving hoteliers worldwide.",
  openGraph: {
    title: "Contact — HotelX",
    description:
      "Reach our sales, support, or press team. Tel Aviv HQ, global reach.",
  },
};

const channels = [
  {
    icon: Mail,
    title: "Sales",
    description:
      "Interested in HotelX for your property? Let\u2019s talk pricing, onboarding, and integrations.",
    email: "sales@hotelx.app",
    accent: "bg-emerald-soft text-emerald-brand",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    description:
      "Already a customer? Our support team responds within 2 hours, 7 days a week.",
    email: "support@hotelx.app",
    accent: "bg-amber-soft text-amber-brand",
  },
  {
    icon: Newspaper,
    title: "Press",
    description:
      "Journalists and analysts — brand assets, facts, and interview requests.",
    email: "press@hotelx.app",
    accent: "bg-emerald-soft text-emerald-brand",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-amber-soft blur-3xl opacity-40 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow">Contact</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink">
              Let&apos;s{" "}
              <span className="display-italic text-emerald-brand">talk.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto">
              Whether you&apos;re exploring HotelX for your hotel, need help
              with your account, or covering us in the press — we&apos;d love to
              hear from you.
            </p>
          </div>
        </section>

        {/* ── Contact cards ── */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-5">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.title}
                    className="card-elev p-6 sm:p-8 flex flex-col"
                  >
                    <span
                      className={`inline-flex h-11 w-11 rounded-xl items-center justify-center ${ch.accent}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 font-display text-xl tracking-tight text-ink">
                      {ch.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/65 leading-relaxed flex-1">
                      {ch.description}
                    </p>
                    <a
                      href={`mailto:${ch.email}`}
                      className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-emerald-brand hover:text-ink transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {ch.email}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* ── Office location ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="eyebrow">Headquarters</span>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                  Built in{" "}
                  <span className="display-italic text-emerald-brand">
                    Tel Aviv.
                  </span>
                </h2>
                <p className="mt-4 text-foreground/70 leading-relaxed max-w-md">
                  Our engineering and product team is based in Tel Aviv, Israel —
                  with team members in Lisbon supporting European operations.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Tel Aviv, Israel</p>
                    <p className="text-xs text-foreground/55 font-mono">
                      GMT+2 · Sun–Thu
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="card-elev p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center">
                      <CalendarCheck className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h3 className="font-display text-lg tracking-tight text-ink">
                      Prefer a live conversation?
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/65 leading-relaxed mb-6">
                    Book a 20-minute demo with our team. We&apos;ll walk you
                    through the guest experience, the dashboard, and answer any
                    question you have — no commitment, no pressure.
                  </p>
                  <Link
                    href="/demo"
                    className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
                  >
                    Book a demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
