import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — HotelX",
  description:
    "What's new in HotelX. Release notes, new features, and improvements to the Concierge OS.",
};

const releases = [
  {
    date: "April 2026",
    version: "v2.4",
    title: "Email Templates & Multilingual Feedback",
    features: [
      "Custom email templates per hotel",
      "Feedback emails in 14 languages",
      "Resend integration for delivery tracking",
    ],
  },
  {
    date: "March 2026",
    version: "v2.3",
    title: "Smart Review Routing",
    features: [
      "Automatic routing: 4-5 stars → Booking/Google review links, 1-3 stars → private feedback",
      "Booking.com score tracking dashboard",
    ],
  },
  {
    date: "February 2026",
    version: "v2.2",
    title: "Payment Integration",
    features: [
      "Stripe, PayPal, and custom payment provider support",
      "In-room checkout flow for services",
    ],
  },
  {
    date: "January 2026",
    version: "v2.1",
    title: "Team Management",
    features: [
      "Role-based access (Admin, Manager, Staff)",
      "Team invitations via email",
      "Activity audit log",
    ],
  },
  {
    date: "December 2025",
    version: "v2.0",
    title: "Complete Redesign",
    features: [
      "New Maison design system",
      "Real-time Kanban request board",
      "Mobile-optimized dashboard",
    ],
  },
  {
    date: "October 2025",
    version: "v1.0",
    title: "Launch",
    features: [
      "QR-based guest concierge",
      "Room service ordering",
      "14 language support",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 left-1/2 h-80 w-80 rounded-full bg-amber-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Changelog</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              What&apos;s new in
              <br />
              <span className="display-italic text-emerald-brand">
                HotelX.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              Every release, every feature, every improvement — logged and
              transparent.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[color:var(--border)] hidden sm:block" />

              <div className="space-y-8">
                {releases.map((release, i) => (
                  <div key={i} className="relative sm:pl-14">
                    {/* Timeline dot */}
                    <div className="absolute left-[13px] top-7 h-3.5 w-3.5 rounded-full border-2 border-emerald-brand bg-background hidden sm:block" />

                    <div className="card-surface p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface font-mono text-[11px] tracking-[0.1em] text-foreground/65">
                          {release.date}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[11px] tracking-[0.1em]">
                          <Sparkles className="h-3 w-3" strokeWidth={2} />
                          {release.version}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl tracking-tight leading-snug text-ink">
                        {release.title}
                      </h3>
                      <ul className="mt-4 space-y-2">
                        {release.features.map((feat, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-foreground/65 leading-relaxed"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-brand shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
