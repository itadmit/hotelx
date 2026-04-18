import {
  QrCode,
  Smartphone,
  LayoutDashboard,
  Globe,
  Users,
  Palette,
  ShieldCheck,
  BarChart3,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    accent: "bg-amber-soft text-amber-brand",
    kicker: "Guest web app",
    title: "No download. Pure delight.",
    description:
      "A whisper-quiet PWA, branded to your hotel — opens instantly from any QR scan.",
  },
  {
    icon: QrCode,
    accent: "bg-emerald-soft text-emerald-brand",
    kicker: "Smart QR",
    title: "One per room. Every story.",
    description:
      "Dynamic QR codes per room — re-route, rebrand, retire. Print-ready flyers in seconds.",
  },
  {
    icon: Globe,
    accent: "bg-[#f3d8cf] text-clay",
    kicker: "Multi-language engine",
    title: "Speak fluent guest.",
    description:
      "Auto-translates every menu, request, and reply into 14 languages. RTL & CJK ready.",
  },
  {
    icon: LayoutDashboard,
    accent: "bg-emerald-soft text-emerald-brand",
    kicker: "Staff dashboard",
    title: "A board that breathes.",
    description:
      "Kanban with SLAs, assignment, internal notes, and priority signals — for chaotic Saturdays.",
  },
  {
    icon: BarChart3,
    accent: "bg-amber-soft text-amber-brand",
    kicker: "Analytics",
    title: "Your house, in numbers.",
    description:
      "Response times, top services, peak hours, staff performance. Export to CSV & PDF.",
  },
  {
    icon: Users,
    accent: "bg-[#f3d8cf] text-clay",
    kicker: "Team",
    title: "Roles & rituals.",
    description:
      "Manager, reception, service. Invite by email, scoped permissions out of the box.",
  },
  {
    icon: Palette,
    accent: "bg-amber-soft text-amber-brand",
    kicker: "Branding",
    title: "Your name. Your colors.",
    description:
      "Logo, palette, typography. Pixel-perfect on every QR card and guest screen.",
  },
  {
    icon: Languages,
    accent: "bg-emerald-soft text-emerald-brand",
    kicker: "Localization",
    title: "Per-room defaults.",
    description:
      "Set language defaults per floor or per guest profile — fallbacks handled gracefully.",
  },
  {
    icon: ShieldCheck,
    accent: "bg-[#f3d8cf] text-clay",
    kicker: "Security",
    title: "Quiet, encrypted, audited.",
    description:
      "GDPR-ready. SSO available. Boring on purpose — so your operations can be exciting.",
  },
];

export function Features() {
  return (
    <section className="relative py-20 sm:py-28 bg-surface border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <span className="pill pill-amber">// the platform</span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
              One operating system,
              <br />
              <span className="display-italic text-emerald-brand">every touchpoint.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-foreground/70">
              From the moment a guest scans, to the moment your team takes a bow.
              Every feature designed with the precision of a Swiss watch and the
              warmth of a five-star greeting.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f) => (
            <article
              key={f.title}
              className="group card-surface p-7 flex flex-col h-full hover:shadow-[0_24px_48px_-28px_rgba(21,32,28,0.18)] hover:-translate-y-0.5 transition-all"
            >
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${f.accent}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-6 eyebrow">{f.kicker}</p>
              <h3 className="mt-2 font-display text-xl text-ink leading-snug">
                {f.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
