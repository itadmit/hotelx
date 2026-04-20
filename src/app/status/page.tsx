import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Smartphone,
  LayoutDashboard,
  Server,
  Mail,
  CreditCard,
  Globe,
  Bell,
} from "lucide-react";

export const metadata: Metadata = {
  title: "System Status — HotelX",
  description:
    "Real-time system status for HotelX. Monitor uptime, incidents, and service health.",
};

const services = [
  { icon: Smartphone, name: "Guest App (QR)", status: "Operational" },
  { icon: LayoutDashboard, name: "Dashboard", status: "Operational" },
  { icon: Server, name: "API", status: "Operational" },
  { icon: Mail, name: "Email Delivery", status: "Operational" },
  { icon: CreditCard, name: "Payment Processing", status: "Operational" },
  { icon: Globe, name: "CDN & Assets", status: "Operational" },
];

export default function StatusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-emerald-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Status</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              System status.
              <br />
              <span className="display-italic text-emerald-brand">
                All systems operational.
              </span>
            </h1>
          </div>
        </section>

        {/* Current Status Banner */}
        <section className="pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="card-elev p-6 sm:p-8 flex items-center justify-center">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-soft text-emerald-brand font-mono text-sm uppercase tracking-[0.12em]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand" />
                </span>
                All Systems Operational
              </span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.name}
                    className="card-surface p-4 sm:p-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="text-sm font-medium text-ink">
                        {svc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-brand" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-brand">
                        {svc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* Uptime Stats */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow">Uptime</span>
            <p className="mt-4 font-display text-3xl sm:text-4xl tracking-tight text-ink">
              <span className="numeral">99.98%</span>
            </p>
            <p className="mt-2 text-sm text-foreground/65">
              uptime over the last 90 days
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* Recent Incidents */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Recent Incidents</span>
            <div className="mt-6 card-surface p-6 sm:p-8 text-center">
              <p className="text-sm text-foreground/55">
                No incidents reported in the last 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="card-surface p-6 sm:p-8 inline-flex flex-col items-center gap-3 max-w-md">
              <Bell className="h-5 w-5 text-emerald-brand" strokeWidth={2} />
              <p className="text-sm text-foreground/65 leading-relaxed">
                Get notified of incidents via email:{" "}
                <span className="font-mono text-emerald-brand text-xs">
                  status@hotelx.app
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
