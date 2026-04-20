import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides — HotelX",
  description:
    "Learn from hoteliers like you. Step-by-step guides for revenue growth, operations, reviews, and setup.",
};

const guides = [
  {
    title: "How to increase in-room revenue by €18/night",
    body: "A step-by-step guide to setting up room service, spa bookings, and upsells via QR.",
    tag: "Revenue",
    tagColor: "bg-emerald-soft text-emerald-brand",
    readTime: "8 min",
  },
  {
    title: "Reduce reception calls by 40% in one week",
    body: "Configure info pages, Wi-Fi instructions, and FAQ to handle the top 10 guest questions automatically.",
    tag: "Operations",
    tagColor: "bg-amber-soft text-amber-brand",
    readTime: "5 min",
  },
  {
    title: "Boost your Booking.com score with smart review routing",
    body: "How to route happy guests to public reviews and catch unhappy ones before they post.",
    tag: "Reviews",
    tagColor: "bg-emerald-soft text-emerald-brand",
    readTime: "6 min",
  },
  {
    title: "Setting up multilingual menus for international guests",
    body: "Support 14 languages with automatic translation and cultural customization.",
    tag: "Setup",
    tagColor: "bg-amber-soft text-amber-brand",
    readTime: "4 min",
  },
  {
    title: "From onboarding to fully live in 48 hours",
    body: "The complete checklist: rooms, services, QR codes, team, and launch.",
    tag: "Getting Started",
    tagColor: "bg-emerald-soft text-emerald-brand",
    readTime: "10 min",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-amber-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Guides</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              Learn from hoteliers
              <br />
              <span className="display-italic text-emerald-brand">
                like you.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              Practical, actionable guides written by hotel operators — not
              marketers. Real results from real properties.
            </p>
          </div>
        </section>

        {/* Guide Cards */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
            {guides.map((guide, i) => (
              <article key={i} className="card-elev p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] ${guide.tagColor}`}
                  >
                    {guide.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl tracking-tight leading-snug text-ink">
                  {guide.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/65 leading-relaxed">
                  {guide.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Note */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="card-surface p-6 sm:p-8 inline-flex flex-col items-center gap-3">
              <BookOpen
                className="h-5 w-5 text-emerald-brand"
                strokeWidth={2}
              />
              <p className="text-sm text-foreground/65 leading-relaxed max-w-md">
                New guides published monthly. Have a topic request? Write to{" "}
                <span className="font-mono text-emerald-brand text-xs">
                  guides@hotelx.app
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
