import {
  Headphones,
  ScreenShare,
  Plane,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Clock4,
} from "lucide-react";
import Link from "next/link";

const CHANNELS = [
  {
    icon: ScreenShare,
    eyebrow: "Remote, instant",
    title: "Live screen-share support",
    body: "We jump on a secure session with your manager, take a look, fix it together. No 4-day ticket queues.",
    badge: "avg. 6 min response",
  },
  {
    icon: Plane,
    eyebrow: "On-site, when it matters",
    title: "We come to your hotel",
    body: "For launch and staff training in selected destinations: Tel Aviv, Milan, Lisbon, Athens, Limassol, Paphos.",
    badge: "5 cities · expanding",
  },
  {
    icon: Headphones,
    eyebrow: "24/7 escalation",
    title: "Always-on for service hours",
    body: "Front desk hits a wall at 2am? Your dedicated channel pings the on-call engineer in under a minute.",
    badge: "1-min escalation",
  },
];

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+972 50 000 0000",
    href: "https://wa.me/972500000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@hotelx.app",
    href: "mailto:support@hotelx.app",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+972 3 000 0000",
    href: "tel:+97230000000",
  },
];

const ON_SITE_CITIES = [
  "Tel Aviv",
  "Milan",
  "Lisbon",
  "Athens",
  "Limassol",
  "Paphos",
];

export function SupportSection() {
  return (
    <section
      id="support"
      className="relative py-20 sm:py-28 bg-surface border-y border-[color:var(--border)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-emerald-soft/70 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="pill">
              <Headphones className="h-3 w-3" />
              Support
            </span>
            <span className="pill pill-amber">
              <Plane className="h-3 w-3" />
              On-site in 5 cities
            </span>
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
            A team you can actually
            <br />
            <span className="display-italic text-emerald-brand">reach.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed">
            From a quick remote screen-share to a flight-and-train visit at your
            property, our team meets you where the problem is.{" "}
            <span className="text-ink font-medium">
              No bots. No tier-1 scripts. Real engineers who know your hotel.
            </span>
          </p>
        </div>

        {/* Channels grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="card-elev p-6 flex flex-col h-full"
              >
                <span className="inline-flex h-10 w-10 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
                  {c.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-xl text-ink leading-tight tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/65 flex-1">
                  {c.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-[0.16em] self-start">
                  <Clock4 className="h-3 w-3" />
                  {c.badge}
                </span>
              </article>
            );
          })}
        </div>

        {/* Contact + on-site cities */}
        <div className="mt-12 grid lg:grid-cols-12 gap-5">
          {/* Contact channels */}
          <div className="lg:col-span-7 card-elev p-6 sm:p-8">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  Reach a human
                </p>
                <p className="font-display text-2xl text-ink mt-1 tracking-tight">
                  Pick the channel you like.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                online now
              </span>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {CONTACT_OPTIONS.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="group rounded-xl border border-[color:var(--border)] bg-card p-4 hover:border-emerald-brand/35 hover:bg-surface transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                      {c.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink truncate">
                      {c.value}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-brand opacity-0 group-hover:opacity-100 transition-opacity">
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 card-surface p-5 sm:p-6">
              <p className="eyebrow flex items-center gap-1.5">
                <Clock4 className="h-3 w-3 text-emerald-brand" />
                What happens after you reach out
              </p>
              <ol className="mt-4 space-y-3">
                {[
                  {
                    badge: "06:00",
                    title: "We acknowledge",
                    body: "Average response time is six minutes — even on weekends.",
                  },
                  {
                    badge: "Remote",
                    title: "We try to resolve from here",
                    body: "Secure screen-share, live walk-through, fix together.",
                  },
                  {
                    badge: "On-site",
                    title: "If it really needs us, we come",
                    body: "Selected destinations included in your plan.",
                  },
                ].map((s) => (
                  <li
                    key={s.title}
                    className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-card p-3"
                  >
                    <span className="inline-flex items-center justify-center min-w-[64px] h-7 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em] px-2 shrink-0">
                      {s.badge}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink leading-tight">
                        {s.title}
                      </p>
                      <p className="text-[12.5px] text-foreground/65 mt-1 leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* On-site cities */}
          <div className="lg:col-span-5 card-elev p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center">
                <MapPin className="h-4 w-4" strokeWidth={2} />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-brand">
                On-site visits
              </p>
            </div>
            <p className="mt-4 font-display text-2xl text-ink tracking-tight leading-tight">
              We&rsquo;ll come to your{" "}
              <span className="display-italic text-emerald-brand">lobby.</span>
            </p>
            <p className="mt-2 text-sm text-foreground/65">
              Launch day, staff training, hardware setup — included for hotels in
              these cities. Other regions on request.
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-1.5">
              {ON_SITE_CITIES.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-surface/60 px-3 py-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand" />
                  <span className="text-sm text-ink">{city}</span>
                </li>
              ))}
            </ul>

            <Link
              href="mailto:support@hotelx.app?subject=On-site visit request"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-brand hover:text-ink transition-colors"
            >
              Request a visit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
