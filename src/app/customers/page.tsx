import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Star,
  BedDouble,
  Quote,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customers — HotelX",
  description:
    "See how 120+ hotels use HotelX to lift revenue, cut reception calls, and delight their guests.",
  openGraph: {
    title: "Customers — HotelX",
    description:
      "Case studies from Plaza Hotel Milan, Riad Fes, and The Strand Dubai — real results, real hoteliers.",
  },
};

const caseStudies = [
  {
    hotel: "Plaza Hotel Milan",
    city: "Milan, Italy",
    stars: 4,
    rooms: 85,
    person: "Elena Marchetti",
    role: "Marketing Manager",
    quote:
      "The review routing alone paid for the platform within the first month.",
    stats: [
      { label: "Revenue lift", value: "+\u20AC18/room/night" },
      { label: "Reception calls", value: "\u221243%" },
      { label: "Booking score", value: "+0.4" },
    ],
  },
  {
    hotel: "Riad Fes",
    city: "Fes, Morocco",
    stars: 0,
    rooms: 28,
    tier: "boutique",
    person: "Karim Benali",
    role: "Owner",
    quote:
      "Our guests now order hammam sessions and rooftop dinners from their room. Revenue per guest doubled.",
    stats: [
      { label: "Revenue / guest", value: "2\u00D7" },
      { label: "In-room orders", value: "+180%" },
      { label: "Guest satisfaction", value: "9.4/10" },
    ],
  },
  {
    hotel: "The Strand Hotel",
    city: "Dubai, UAE",
    stars: 5,
    rooms: 220,
    person: "Sarah Al-Rashid",
    role: "Operations Director",
    quote:
      "Reception calls dropped by 45% in the first week. My team can finally focus on real hospitality.",
    stats: [
      { label: "Call reduction", value: "\u221245%" },
      { label: "Staff reallocation", value: "3 FTEs" },
      { label: "NPS score", value: "+22 pts" },
    ],
  },
];

export default function CustomersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-amber-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow">Customers</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl mx-auto">
              Trusted by hoteliers who care
              <br />
              <span className="display-italic text-emerald-brand">
                about their guests.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto">
              From Moroccan riads to Dubai five-stars — real stories from hotels
              that switched to HotelX and never looked back.
            </p>
          </div>
        </section>

        {/* ── Case studies ── */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <div key={cs.hotel} className="card-elev p-6 sm:p-8 flex flex-col">
                  {/* Hotel meta */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-ink">
                        {cs.hotel}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-foreground/65">
                        <MapPin className="h-3.5 w-3.5" />
                        {cs.city}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {cs.stars > 0 ? (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: cs.stars }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 text-amber-brand fill-amber-brand"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="pill pill-amber text-[9px]">Boutique</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-foreground/55 font-mono">
                        <BedDouble className="h-3 w-3" />
                        {cs.rooms} rooms
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex-1 mb-6">
                    <Quote className="h-5 w-5 text-emerald-brand/40 mb-2" />
                    <blockquote className="font-display text-lg tracking-tight leading-snug text-ink">
                      &ldquo;{cs.quote}&rdquo;
                    </blockquote>
                    <p className="mt-3 text-sm text-foreground/65">
                      {cs.person},{" "}
                      <span className="text-foreground/55">{cs.role}</span>
                    </p>
                  </div>

                  {/* Stat chips */}
                  <div className="grid grid-cols-3 gap-2">
                    {cs.stats.map((s) => (
                      <div
                        key={s.label}
                        className="card-surface p-3 text-center"
                      >
                        <p className="numeral text-lg text-ink leading-none">
                          {s.value}
                        </p>
                        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/55">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-20 sm:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="pill">
              <BedDouble className="h-3 w-3" />
              120+ hotels
            </span>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
              Join 120+ hotels already
              <br />
              <span className="display-italic text-emerald-brand">
                using HotelX.
              </span>
            </h2>
            <p className="mt-4 text-foreground/70 max-w-md mx-auto">
              See what HotelX can do for your property. Start a free trial
              today — no credit card, no contract.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
