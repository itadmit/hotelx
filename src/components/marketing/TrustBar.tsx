import { Quote, Star, Globe } from "lucide-react";

const HOTELS = [
  "Plaza Hotel \u2022 Milan",
  "Maison Lione \u2022 Lisbon",
  "Aether Resort \u2022 Athens",
  "Vela Bay \u2022 Limassol",
  "The Sundial \u2022 Tel Aviv",
  "Casa Vinea \u2022 Paphos",
];

const LANGS = [
  "EN",
  "FR",
  "ES",
  "IT",
  "DE",
  "AR",
  "JP",
  "CN",
  "RU",
  "PT",
  "TR",
  "KR",
  "GR",
  "HE",
];

export function TrustBar() {
  return (
    <section
      aria-label="Trusted by hotels across Europe and the Mediterranean"
      className="relative border-y border-[color:var(--border)] bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Hotel logos / names */}
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2 mb-4">
              <Star className="h-3 w-3 text-amber-brand" />
              In rooms across Europe & the Mediterranean
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5">
              {HOTELS.map((h) => (
                <span
                  key={h}
                  className="font-display text-base sm:text-lg text-foreground/55 hover:text-ink transition-colors"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="lg:col-span-5">
            <div className="card-surface p-5 sm:p-6 relative">
              <Quote className="absolute -top-3 left-5 h-6 w-6 text-emerald-brand bg-card rounded-full p-1 border border-[color:var(--border)]" />
              <p className="text-ink text-base leading-relaxed">
                "Our Booking score went from 8.4 to 8.9 in three months. The
                review loop alone paid for the platform."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-brand text-primary-foreground flex items-center justify-center font-mono text-[11px]">
                  EM
                </div>
                <div>
                  <p className="text-sm text-ink leading-none font-medium">
                    Elena Marchetti
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 mt-1">
                    Marketing manager &middot; Plaza Hotel, Milan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages strip */}
        <div className="mt-8 pt-6 border-t border-[color:var(--border)] flex items-center gap-4 flex-wrap">
          <span className="eyebrow flex items-center gap-2">
            <Globe className="h-3 w-3 text-emerald-brand" />
            14 guest languages
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {LANGS.map((l) => (
              <span
                key={l}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
