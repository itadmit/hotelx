const greetings = [
  { lang: "EN", text: "Welcome" },
  { lang: "FR", text: "Bienvenue" },
  { lang: "ES", text: "Bienvenidos" },
  { lang: "IT", text: "Benvenuti" },
  { lang: "DE", text: "Willkommen" },
  { lang: "AR", text: "أهلاً وسهلاً" },
  { lang: "JP", text: "ようこそ" },
  { lang: "CN", text: "欢迎光临" },
  { lang: "RU", text: "Добро пожаловать" },
  { lang: "PT", text: "Bem-vindos" },
  { lang: "TR", text: "Hoş geldiniz" },
  { lang: "KR", text: "환영합니다" },
  { lang: "GR", text: "Καλώς ήρθατε" },
  { lang: "HE", text: "ברוכים הבאים" },
];

export function LanguagesMarquee() {
  const items = [...greetings, ...greetings];
  return (
    <section className="relative py-8 border-y border-[color:var(--border)] bg-surface overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10" />
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {items.map((g, i) => (
          <div key={i} className="flex items-center gap-3 sm:gap-4 px-5 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">
              {g.lang}
            </span>
            <span className="font-display text-xl sm:text-2xl md:text-3xl text-ink display-italic">
              {g.text}
            </span>
            <span className="text-foreground/20 text-xl">●</span>
          </div>
        ))}
      </div>
    </section>
  );
}
