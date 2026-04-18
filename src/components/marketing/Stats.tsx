const stats = [
  { value: "3 min", label: "Average response", note: "↓ 42% vs analog ops", accent: "text-emerald-brand" },
  { value: "14", label: "Languages, automatic", note: "RTL & CJK ready", accent: "text-amber-brand" },
  { value: "0", label: "Apps to install", note: "PWA over QR", accent: "text-clay" },
  { value: "99.98%", label: "Uptime SLA", note: "Edge & multi-region", accent: "text-emerald-brand" },
];

export function Stats() {
  return (
    <section className="relative py-16 sm:py-20 bg-surface border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--border)] rounded-2xl overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="px-4 sm:px-6 py-8 sm:py-10 bg-surface text-center">
              <div className={`numeral text-4xl sm:text-5xl md:text-6xl leading-none ${s.accent}`}>
                {s.value}
              </div>
              <p className="mt-3 sm:mt-4 text-sm text-ink">{s.label}</p>
              <p className="mt-1 eyebrow">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
