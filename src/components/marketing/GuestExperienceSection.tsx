import {
  Wifi,
  Building2,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PencilLine,
  BookOpen,
  Coffee,
  Waves,
  Dumbbell,
  Wine,
} from "lucide-react";
import Link from "next/link";

const INFO_PAGES = [
  {
    icon: Wifi,
    title: "Wi-Fi",
    body: "One tap, password copied. No more dialing reception at midnight.",
    chip: "auto-localized",
  },
  {
    icon: Building2,
    title: "About the hotel",
    body: "Your story, address and contact details — beautifully laid out.",
    chip: "rich text",
  },
  {
    icon: Sparkles,
    title: "Amenities",
    body: "Pool hours, gym, spa, breakfast windows. Iconography handled for you.",
    chip: "icon library",
  },
  {
    icon: Compass,
    title: "Helpful info",
    body: "Check-out times, late check-in, taxi numbers, things you wish guests asked.",
    chip: "free-form",
  },
];

const AMENITIES = [
  { icon: Waves, label: "Heated pool" },
  { icon: Coffee, label: "Espresso bar" },
  { icon: Dumbbell, label: "24h gym" },
  { icon: Wine, label: "Rooftop wine cellar" },
];

export function GuestExperienceSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-surface border-y border-[color:var(--border)]">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-20 h-[420px] w-[620px] bg-amber-soft/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <span className="pill pill-amber">// in-room knowledge</span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
              Everything a guest asks reception,
              <br />
              <span className="display-italic text-emerald-brand">
                already in their pocket.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-foreground/70">
              Wi-Fi, amenities, your story, the things only locals know — your
              team writes once, every guest gets it in their language. No
              clipboards. No phone calls at 3 AM.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.05fr_1fr] items-start">
          {/* Left — info pages grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {INFO_PAGES.map((p) => (
              <article
                key={p.title}
                className="card-surface p-5 sm:p-6 flex flex-col h-full hover:-translate-y-0.5 transition-transform"
              >
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-emerald-soft text-emerald-brand">
                  <p.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-xl text-ink leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                  {p.body}
                </p>
                <span className="mt-4 self-start inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-[color:var(--border)] font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">
                  {p.chip}
                </span>
              </article>
            ))}
          </div>

          {/* Right — phone-style info preview + onboarding nudge */}
          <div className="space-y-4">
            <div className="card-elev p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-soft/40 blur-2xl rounded-full pointer-events-none" />

              <div className="relative">
                <p className="eyebrow flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-brand" />
                  Guest view · Amenities
                </p>

                <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
                  <div className="px-5 pt-5 pb-3 border-b border-[color:var(--border)]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                      Plaza Hotel · Milan
                    </p>
                    <h3 className="font-display text-2xl text-ink mt-2 leading-tight">
                      What&apos;s on the house
                    </h3>
                  </div>
                  <ul className="divide-y divide-[color:var(--border)]">
                    {AMENITIES.map((a) => (
                      <li
                        key={a.label}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-soft text-emerald-brand shrink-0">
                          <a.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-ink flex-1">{a.label}</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-brand/70" />
                      </li>
                    ))}
                  </ul>
                  <div className="px-5 py-3 border-t border-[color:var(--border)] bg-surface/60 flex items-center gap-2 text-[11px] text-foreground/55 font-mono uppercase tracking-[0.16em]">
                    <Wifi className="h-3 w-3 text-emerald-brand" />
                    Wi-Fi · PlazaGuest · 1 tap to copy
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding nudge mock */}
            <div className="card-surface p-5 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 rounded-lg items-center justify-center bg-amber-soft text-amber-brand shrink-0">
                  <PencilLine className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-brand">
                    Onboarding nudge
                  </p>
                  <h4 className="font-display text-lg text-ink mt-1 leading-tight">
                    The dashboard tells you what&apos;s missing.
                  </h4>
                  <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
                    On first login, a quiet banner walks your team through
                    Wi-Fi, About, Amenities and Helpful info. One-click import
                    of demo data ships you live in minutes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      "Wi-Fi",
                      "About",
                      "Amenities",
                      "Helpful",
                      "Import demo",
                    ].map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-[color:var(--border)] font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/65"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
          <p className="eyebrow flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-emerald-brand" />
            Your knowledge base · auto-translated · always current
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[color:var(--border)] bg-card text-ink text-sm hover:bg-surface transition-colors"
          >
            Explore the dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
