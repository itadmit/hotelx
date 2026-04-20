import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Code2, ShieldCheck, Zap, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "API Reference — HotelX",
  description:
    "Build on HotelX. REST API documentation, endpoints, authentication, and webhook reference.",
};

const endpoints = [
  {
    section: "Authentication",
    items: [{ method: "POST", path: "/auth/token" }],
  },
  {
    section: "Hotels",
    items: [
      { method: "GET", path: "/hotels" },
      { method: "GET", path: "/hotels/:id" },
    ],
  },
  {
    section: "Rooms",
    items: [
      { method: "GET", path: "/hotels/:id/rooms" },
      { method: "POST", path: "/hotels/:id/rooms" },
    ],
  },
  {
    section: "Services",
    items: [{ method: "GET", path: "/hotels/:id/services" }],
  },
  {
    section: "Requests",
    items: [
      { method: "GET", path: "/hotels/:id/requests" },
      { method: "POST", path: "/hotels/:id/requests" },
      { method: "PATCH", path: "/hotels/:id/requests/:id" },
    ],
  },
  {
    section: "Guests",
    items: [{ method: "GET", path: "/hotels/:id/guests" }],
  },
  {
    section: "Webhooks",
    items: [{ method: "POST", path: "/webhooks" }],
  },
];

function MethodBadge({ method }: { method: string }) {
  const colorMap: Record<string, string> = {
    GET: "bg-emerald-soft text-emerald-brand",
    POST: "bg-amber-soft text-amber-brand",
    PATCH: "bg-amber-soft/60 text-amber-brand",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-16 px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.1em] ${colorMap[method] ?? "bg-surface text-foreground/65"}`}
    >
      {method}
    </span>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-wash pointer-events-none" />
          <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-emerald-soft blur-3xl opacity-40 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <span className="eyebrow">API</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink max-w-3xl">
              Build on
              <br />
              <span className="display-italic text-emerald-brand">
                HotelX.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              RESTful API with JSON responses and Bearer token authentication.
              Integrate guest services, rooms, and requests into your own
              systems.
            </p>
          </div>
        </section>

        {/* Base URL */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <span className="eyebrow mb-4 block">Base URL</span>
            <div className="bg-ink text-[#f1ebde] rounded-xl p-5 font-mono text-sm">
              <span className="text-emerald-soft">GET</span>{" "}
              <span className="text-amber-soft">
                https://api.hotelx.app/v1
              </span>
            </div>
          </div>
        </section>

        {/* Auth Info */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="card-surface p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="font-medium text-ink text-[15px]">
                    Authentication
                  </p>
                  <p className="text-sm text-foreground/65 mt-1">
                    All requests require a{" "}
                    <span className="font-mono text-xs text-emerald-brand">
                      Bearer token
                    </span>{" "}
                    in the Authorization header. Generate API keys from your
                    Dashboard → Settings → API.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <span className="eyebrow">Endpoints</span>
            {endpoints.map((group) => (
              <div key={group.section} className="card-surface p-5 sm:p-6">
                <h3 className="font-display text-lg tracking-tight text-ink mb-4">
                  {group.section}
                </h3>
                <div className="space-y-2.5">
                  {group.items.map((ep, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 border-b border-[color:var(--border)] last:border-0"
                    >
                      <MethodBadge method={ep.method} />
                      <code className="font-mono text-sm text-foreground/75">
                        {ep.path}
                      </code>
                    </div>
                  ))}
                </div>
                {group.section === "Webhooks" && (
                  <div className="mt-4 pt-3 border-t border-[color:var(--border)]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55 mb-2">
                      Events
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "request.created",
                        "request.updated",
                        "feedback.submitted",
                      ].map((ev) => (
                        <span
                          key={ev}
                          className="pill text-[10px]"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="hairline" />
        </div>

        {/* Rate Limits */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="card-surface p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-medium text-ink text-[15px]">
                      Rate Limits
                    </p>
                    <p className="text-sm text-foreground/65 mt-1">
                      <span className="numeral">1,000</span> requests per minute
                      per API key.
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-surface p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0">
                    <Code2 className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-medium text-ink text-[15px]">
                      Response Format
                    </p>
                    <p className="text-sm text-foreground/65 mt-1">
                      All responses return JSON with standard HTTP status codes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Note */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="card-surface p-6 sm:p-8 inline-flex flex-col items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-brand" strokeWidth={2} />
              <p className="text-sm text-foreground/65 leading-relaxed max-w-md">
                Full API documentation coming soon. Contact{" "}
                <span className="font-mono text-emerald-brand text-xs">
                  api@hotelx.app
                </span>{" "}
                for early access.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
