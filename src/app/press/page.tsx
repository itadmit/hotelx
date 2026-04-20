import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Newspaper,
  Palette,
  Building2,
  Globe,
  Users,
  MessageCircle,
  Mail,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Press Kit — HotelX",
  description:
    "Brand assets, company facts, and boilerplate for journalists covering HotelX.",
  openGraph: {
    title: "Press Kit — HotelX",
    description:
      "Everything journalists need: logos, brand colors, company facts, and media contact.",
  },
};

const facts = [
  { icon: Building2, label: "Founded", value: "2024" },
  { icon: Globe, label: "HQ", value: "Tel Aviv" },
  { icon: Users, label: "Hotels", value: "120+" },
  { icon: MessageCircle, label: "Languages", value: "14" },
  { icon: Newspaper, label: "Guest interactions", value: "50,000+" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-32 right-1/3 h-72 w-72 rounded-full bg-emerald-soft blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">Press</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              HotelX{" "}
              <span className="display-italic text-emerald-brand">
                in the media.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              Logos, brand guidelines, company facts, and everything journalists
              need to cover HotelX accurately.
            </p>
          </div>
        </section>

        {/* ── Brand assets ── */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5">
                <span className="eyebrow">Brand Assets</span>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                  Visual{" "}
                  <span className="display-italic text-emerald-brand">
                    identity.
                  </span>
                </h2>
                <p className="mt-4 text-foreground/70 leading-relaxed max-w-md">
                  Please use the assets below when referencing HotelX in
                  articles, blog posts, or broadcasts.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-5">
                {/* Logo */}
                <div className="card-elev p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                      <Download className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h3 className="font-display text-lg tracking-tight text-ink">
                      Logo
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/65 leading-relaxed">
                    The HotelX logotype uses{" "}
                    <span className="font-mono text-emerald-brand">
                      Fraunces
                    </span>{" "}
                    for the wordmark with a rounded emerald badge. Available in
                    SVG and PNG at 1× / 2× / 3×. Use on light backgrounds only;
                    a reversed version is available for dark contexts.
                  </p>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="card-surface px-8 py-6 flex items-center justify-center">
                      <span className="font-display text-2xl tracking-tight text-ink">
                        Hotel
                        <span className="text-emerald-brand">X</span>
                      </span>
                    </div>
                    <div className="bg-ink px-8 py-6 rounded-xl flex items-center justify-center">
                      <span className="font-display text-2xl tracking-tight text-amber-soft">
                        Hotel
                        <span className="text-emerald-soft">X</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Colors & Fonts */}
                <div className="card-elev p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center">
                      <Palette className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h3 className="font-display text-lg tracking-tight text-ink">
                      Colors &amp; Typography
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-lg bg-emerald-brand shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          Deep Emerald
                        </p>
                        <p className="font-mono text-xs text-foreground/55">
                          #0e5240
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-lg bg-background border border-[color:var(--border)] shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          Warm Bone
                        </p>
                        <p className="font-mono text-xs text-foreground/55">
                          #f7f3ec
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/65 leading-relaxed">
                    Display headings set in{" "}
                    <span className="font-display">Fraunces</span> (serif). Body
                    copy in{" "}
                    <span className="font-medium">Manrope</span> (sans-serif).
                    Labels and numerals in{" "}
                    <span className="font-mono">JetBrains Mono</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* ── Company facts ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="eyebrow">Company Facts</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                At a{" "}
                <span className="display-italic text-emerald-brand">
                  glance.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {facts.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="card-surface p-5 text-center"
                  >
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center mx-auto">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <p className="mt-3 numeral text-2xl text-ink">{f.value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">
                      {f.label}
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

        {/* ── Boilerplate ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="eyebrow">Boilerplate</span>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
                  For{" "}
                  <span className="display-italic text-emerald-brand">
                    journalists.
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-7">
                <div className="card-surface p-6 sm:p-8">
                  <p className="text-foreground/70 leading-relaxed">
                    HotelX is a QR-first guest experience platform that helps
                    hotels modernize concierge operations, increase in-room
                    spend, and improve review scores. Founded in 2024 in Tel
                    Aviv, HotelX is used by more than 120 hotels across 14
                    languages, serving over 50,000 guest interactions. The
                    platform replaces scattered PDF menus, slow phone calls, and
                    disconnected review tools with a single, mobile-native guest
                    experience — live in under 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="py-20 sm:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex h-12 w-12 rounded-xl bg-emerald-soft text-emerald-brand items-center justify-center mx-auto">
              <Mail className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl tracking-tight leading-[1.1] text-ink">
              Media inquiries
            </h2>
            <p className="mt-4 text-foreground/70 max-w-md mx-auto">
              For press inquiries, interviews, or high-resolution assets, reach
              out to our media team.
            </p>
            <a
              href="mailto:press@hotelx.app"
              className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-emerald-brand hover:text-ink transition-colors"
            >
              <Mail className="h-4 w-4" />
              press@hotelx.app
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
