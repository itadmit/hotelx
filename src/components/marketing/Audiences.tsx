import { Sparkles, Bell, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const audiences = [
  {
    icon: Sparkles,
    badge: "For Guests",
    accent: "bg-amber-soft text-amber-brand",
    pillClass: "pill-amber",
    title: "Effortless luxury, in their language.",
    points: [
      "Scan in-suite. Order in seconds.",
      "Auto-translation in 14 languages.",
      "Live status updates on every request.",
    ],
    cta: "See guest experience",
    href: "/features",
  },
  {
    icon: Bell,
    badge: "For Staff",
    accent: "bg-emerald-soft text-emerald-brand",
    pillClass: "",
    title: "Calm, when the lobby is loud.",
    points: [
      "Realtime board with priority signals.",
      "One-tap assign and internal notes.",
      "Push notifications, no walkie-talkie.",
    ],
    cta: "Tour the dashboard",
    href: "/features",
  },
  {
    icon: TrendingUp,
    badge: "For Managers",
    accent: "bg-[#f3d8cf] text-clay",
    pillClass: "pill-clay",
    title: "Run the house on data.",
    points: [
      "KPIs: response time, CSAT signals, peaks.",
      "Top services & staff performance.",
      "Export & schedule reports.",
    ],
    cta: "Explore analytics",
    href: "/features",
  },
];

export function Audiences() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <span className="pill">// guests · staff · managers</span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] max-w-2xl text-ink">
              Crafted for everyone <br />
              who <span className="display-italic text-emerald-brand">touches the room.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-foreground/70 max-w-md">
              Three roles. One coherent platform. Each surface designed for the
              context it lives in.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {audiences.map((a) => (
            <article
              key={a.badge}
              className="group card-surface p-7 flex flex-col h-full"
            >
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${a.accent}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <span className={`mt-6 pill ${a.pillClass}`}>{a.badge}</span>
              <h3 className="mt-4 font-display text-2xl leading-tight text-ink">
                {a.title}
              </h3>
              <ul className="mt-5 space-y-3 flex-1">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/70">
                    <span className="mt-2 h-px w-4 bg-foreground/30 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={a.href}
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-brand hover:text-ink transition-colors"
              >
                {a.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
