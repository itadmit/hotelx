import {
  Star,
  Heart,
  Mail,
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const WHY_IT_MATTERS = [
  {
    icon: TrendingUp,
    title: "A 0.5\u2011star lift is worth ~10\u201315% more bookings.",
    body: "Cornell research, 2017. Marketing managers who move the needle on Booking score directly move RevPAR.",
  },
  {
    icon: ShieldAlert,
    title: "Negative public reviews hit ranking and ADR.",
    body: "We catch the unhappy guest before they leave the property. The conversation stays private \u2014 the public score stays clean.",
  },
  {
    icon: Sparkles,
    title: "Your brand voice. Our infrastructure.",
    body: "Edit every email template inside the dashboard. Resend handles delivery, you keep the words.",
  },
];

export function ReviewsFlywheelSection() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative py-20 sm:py-28 overflow-hidden bg-surface border-y border-[color:var(--border)]"
    >
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-amber-soft/45 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-end mb-12">
          <div className="lg:col-span-7">
            <span className="pill pill-amber">
              <Star className="h-3 w-3 text-amber-brand" />
              The reputation flywheel
            </span>
            <h2
              id="reviews-heading"
              className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink"
            >
              Send public review links
              <br />
              <span className="display-italic text-emerald-brand">
                only to the happy ones.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-foreground/70">
              At check-out we ask one question: 1 to 5 stars. The answer
              decides the channel. Public review on Booking and Google &mdash;
              or a private apology that reaches your team, not the internet.
            </p>
          </div>
        </div>

        {/* The flow visual */}
        <div className="card-elev p-6 sm:p-8 relative overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-emerald-soft/50 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-amber-soft/50 blur-3xl"
          />

          <div className="relative grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-5 lg:gap-3">
            {/* Step 1 — the rating */}
            <FlowCard
              eyebrow="Step 1"
              icon={Star}
              tone="neutral"
              title="One question at check-out"
              body="A single email or in-app prompt: how was your stay, 1 to 5 stars?"
              chip="1-5 rating"
            />

            <Connector />

            {/* Step 2a — happy path */}
            <FlowCard
              eyebrow="Happy &middot; 4-5 stars"
              icon={Heart}
              tone="happy"
              title="Public review invitation"
              body="Auto-email with one-tap links to Booking and Google."
              chip="Score climbs"
            />

            <Connector />

            {/* Step 2b — unhappy path stacked */}
            <FlowCard
              eyebrow="Unhappy &middot; 1-3 stars"
              icon={ShieldAlert}
              tone="risk"
              title="Private apology, internal escalation"
              body="No public link. A real-time alert lands on the dashboard so you can save the relationship."
              chip="Reputation protected"
            />
          </div>

          {/* Mobile: vertical fallback shows the same chain */}
          <p className="lg:hidden mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            Both paths run automatically. You only edit the templates.
          </p>
        </div>

        {/* Why it matters - 3 reasons */}
        <div className="mt-10 grid md:grid-cols-3 gap-4 sm:gap-5">
          {WHY_IT_MATTERS.map((w) => (
            <article key={w.title} className="card-surface p-5 sm:p-6">
              <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                <w.icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-base sm:text-lg text-ink leading-snug">
                {w.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                {w.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  eyebrow,
  icon: Icon,
  tone,
  title,
  body,
  chip,
}: {
  eyebrow: string;
  icon: typeof Star;
  tone: "neutral" | "happy" | "risk";
  title: string;
  body: string;
  chip: string;
}) {
  const styles = {
    neutral: {
      ring: "border border-[color:var(--border)] bg-card",
      pill: "bg-surface text-foreground/65 border border-[color:var(--border)]",
      icon: "bg-surface text-ink",
      eyebrow: "text-foreground/55",
    },
    happy: {
      ring: "border border-emerald-brand/40 bg-emerald-soft/40",
      pill: "bg-emerald-brand text-primary-foreground",
      icon: "bg-emerald-brand text-primary-foreground",
      eyebrow: "text-emerald-brand",
    },
    risk: {
      ring: "border border-amber-brand/40 bg-amber-soft/40",
      pill: "bg-amber-brand text-white",
      icon: "bg-amber-brand text-white",
      eyebrow: "text-amber-brand",
    },
  }[tone];

  return (
    <div className={`relative rounded-xl p-5 flex flex-col h-full ${styles.ring}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${styles.eyebrow}`}>
          {eyebrow}
        </span>
        <span className={`inline-flex h-8 w-8 rounded-lg items-center justify-center ${styles.icon}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <h4 className="mt-3 font-display text-base text-ink leading-snug">
        {title}
      </h4>
      <p className="mt-1.5 text-sm text-foreground/65 leading-relaxed flex-1">
        {body}
      </p>
      <span
        className={`mt-4 self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] ${styles.pill}`}
      >
        <Mail className="h-3 w-3" />
        {chip}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <ArrowRight className="h-5 w-5 text-foreground/30" strokeWidth={2} />
    </div>
  );
}
