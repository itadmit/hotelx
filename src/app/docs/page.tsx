import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Rocket,
  QrCode,
  LayoutDashboard,
  ShoppingBag,
  Star,
  Webhook,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — HotelX",
  description:
    "Everything you need to get started with HotelX. Guides, API references, and integration docs for the Concierge OS.",
};

const categories = [
  {
    icon: Rocket,
    title: "Getting Started",
    body: "Set up your first room in under 30 minutes. Print QR codes, configure services, go live.",
  },
  {
    icon: QrCode,
    title: "QR Codes & Rooms",
    body: "Generate, customize, and manage QR codes. Room mapping, multi-property support.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    body: "Real-time request board, analytics, team management, and hotel settings.",
  },
  {
    icon: ShoppingBag,
    title: "Services & Menu",
    body: "Create service categories, set prices, configure availability windows and photos.",
  },
  {
    icon: Star,
    title: "Reviews & Feedback",
    body: "Smart review routing, guest satisfaction tracking, Booking.com score optimization.",
  },
  {
    icon: Webhook,
    title: "API & Integrations",
    body: "REST API, webhooks, PMS integration guides, payment provider setup.",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-emerald-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Docs</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              Everything you need
              <br />
              <span className="display-italic text-emerald-brand">
                to get started.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              Explore guides, references, and tutorials to integrate HotelX into
              your property — from first QR scan to advanced API workflows.
            </p>
          </div>
        </section>

        {/* Category Grid */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="card-surface p-5 sm:p-6">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h3 className="mt-4 font-display text-lg tracking-tight text-ink">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                      {cat.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Note */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="card-surface p-6 sm:p-8 inline-flex flex-col items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-brand" strokeWidth={2} />
              <p className="text-sm text-foreground/65 leading-relaxed max-w-md">
                Documentation is continuously updated. Need help? Contact{" "}
                <span className="font-mono text-emerald-brand text-xs">
                  support@hotelx.app
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
