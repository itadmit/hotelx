import { Wifi, Building2, Compass, Sparkles, Brain } from "lucide-react";

const INFO_PAGES = [
  {
    icon: Wifi,
    title: "Wi-Fi",
    body: "One tap, password copied.",
  },
  {
    icon: Building2,
    title: "About the hotel",
    body: "Your story, address & contacts.",
  },
  {
    icon: Sparkles,
    title: "Amenities",
    body: "Pool, gym, spa, breakfast hours.",
  },
  {
    icon: Compass,
    title: "Helpful info",
    body: "Check-out, taxis, the small things.",
  },
];

export function GuestExperienceSection() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-surface border-y border-[color:var(--border)]">
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -right-20 h-[420px] w-[620px] bg-amber-soft/35 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Title — left */}
          <div className="lg:col-span-5">
            <span className="pill pill-amber">// in-room knowledge</span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
              Everything a guest asks reception,
              <br />
              <span className="display-italic text-emerald-brand">
                already in their pocket.
              </span>
            </h2>
            <p className="mt-5 text-foreground/70 max-w-md">
              Wi-Fi, amenities, your story, the things only locals know &mdash;
              your team writes once, the AI translates and re-orders the
              answers based on what each guest actually asks.
            </p>
            <p className="eyebrow flex items-center gap-2 mt-5">
              <Brain className="h-3.5 w-3.5 text-emerald-brand" />
              AI-translated &middot; learns from every question
            </p>
          </div>

          {/* Compact 2x2 info tile grid — right */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            {INFO_PAGES.map((p) => (
              <article
                key={p.title}
                className="card-surface p-4 sm:p-5 flex flex-col h-full hover:-translate-y-0.5 transition-transform"
              >
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand">
                  <p.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <h3 className="mt-3 font-display text-base sm:text-lg text-ink leading-snug">
                  {p.title}
                </h3>
                <p className="mt-1 text-[12.5px] sm:text-sm text-foreground/65 leading-relaxed">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
