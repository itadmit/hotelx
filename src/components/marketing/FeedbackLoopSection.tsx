import {
  Star,
  Heart,
  HeartCrack,
  ArrowRight,
  Mail,
  ShieldCheck,
  Sparkles,
  MessageSquareHeart,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const REVIEW_LIFT = [
  { label: "Avg. response", value: "3m 12s", tone: "emerald" as const },
  { label: "Recovery rate", value: "84%", tone: "amber" as const },
  { label: "5★ uplift", value: "+38%", tone: "emerald" as const },
];

export function FeedbackLoopSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] bg-emerald-soft/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="eyebrow flex items-center gap-2">
            <MessageSquareHeart className="h-3.5 w-3.5 text-emerald-brand" />
            Feedback &amp; reputation
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mt-3 leading-[1.05] tracking-tight text-ink">
            Turn every guest moment into a
            <br />
            <span className="display-italic text-emerald-brand">
              public five-star.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-2xl leading-relaxed">
            After every request, we ask one quiet question. Happy guests are
            invited to leave a Google or Booking review. Unhappy guests land
            silently on your recovery desk — with an apology already on its way.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr] items-stretch">
          {/* Left — phone-style preview of the rating moment */}
          <div className="card-elev p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-amber-soft/40 blur-2xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <p className="eyebrow flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-brand" />
                  Guest moment
                </p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                  live
                </span>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-[color:var(--border)]">
                  <p className="eyebrow flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-emerald-brand" />
                    How was it?
                  </p>
                  <h3 className="font-display text-xl text-ink mt-2 leading-snug">
                    Rate{" "}
                    <span className="text-emerald-brand">
                      Champagne &amp; strawberries
                    </span>
                  </h3>
                </div>
                <div className="px-5 py-5">
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="h-11 w-11 rounded-full flex items-center justify-center"
                      >
                        <Star
                          className={
                            n <= 5
                              ? "h-7 w-7 fill-amber-brand text-amber-brand"
                              : "h-7 w-7 text-foreground/25"
                          }
                          strokeWidth={1.5}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="h-10 rounded-md border border-[color:var(--border)] bg-surface flex items-center px-3 text-sm text-foreground/45">
                      Sarah Patel
                    </div>
                    <div className="h-10 rounded-md border border-[color:var(--border)] bg-surface flex items-center px-3 text-sm text-foreground/45">
                      sarah@example.com
                    </div>
                  </div>
                  <div className="mt-2 h-20 rounded-md border border-[color:var(--border)] bg-surface px-3 py-2 text-sm text-foreground/55 leading-relaxed">
                    The bubbles arrived perfectly chilled — and the strawberries
                    were a beautiful touch. Thank you!
                  </div>
                  <div className="mt-3 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium">
                    <Mail className="h-4 w-4" />
                    Send feedback
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — the routing logic */}
          <div className="space-y-4">
            <Outcome
              tone="positive"
              icon={Heart}
              eyebrow="Rating ≥ 4"
              title="A thank-you with the right link"
              body="The guest gets a Maison-styled thank-you email and a one-tap button to your Google or Booking review page."
              chips={["Google review", "Booking.com", "Branded reply-to"]}
            />
            <Outcome
              tone="warn"
              icon={HeartCrack}
              eyebrow="Rating ≤ 3"
              title="A private apology, an open ticket"
              body="The guest receives an apology from your hotel, and the recovery desk in your dashboard opens a task with full context for personal follow-up."
              chips={["Service recovery desk", "SLA-aware", "Resolution notes"]}
            />

            <div className="rounded-2xl border border-[color:var(--border)] bg-card p-5">
              <p className="eyebrow flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-brand" />
                Quiet by default
              </p>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                Negative ratings never reach a public review page. Positive
                ratings are routed to whichever platform you care about most —
                you choose per property.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {REVIEW_LIFT.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-[color:var(--border)] bg-surface px-3 py-2.5"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
                      {s.label}
                    </p>
                    <p
                      className={`numeral text-lg leading-none mt-1 ${
                        s.tone === "amber"
                          ? "text-amber-brand"
                          : "text-emerald-brand"
                      }`}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Email layer note */}
        <div className="mt-12 card-elev p-6 sm:p-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center relative overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-20 h-[360px] w-[520px] bg-emerald-soft/40 blur-3xl rounded-full"
          />
          <div className="relative">
            <p className="eyebrow flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-emerald-brand" />
              One email layer for everything
            </p>
            <h3 className="font-display text-2xl sm:text-3xl mt-3 leading-tight text-ink">
              Transactional, recovery and campaigns —
              <br />
              <span className="display-italic text-emerald-brand">
                from a single mailbox.
              </span>
            </h3>
            <p className="mt-3 text-sm text-foreground/70 max-w-xl leading-relaxed">
              Powered by Resend. Every message — feedback replies, password
              resets, team invites and your future newsletters — flows through
              one branded sender, one delivery log, one set of templates you
              can edit per property.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/email-templates"
                className="group inline-flex items-center gap-2 h-10 px-4 rounded-full bg-emerald-brand text-primary-foreground text-sm font-medium hover:bg-ink transition-colors"
              >
                Edit templates
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard/feedback"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[color:var(--border)] bg-card text-sm text-ink hover:bg-surface transition-colors"
              >
                Open recovery desk
              </Link>
            </div>
          </div>

          {/* Pipeline as a visual flow, not as code */}
          <div className="relative rounded-2xl border border-[color:var(--border)] bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                The flow, in plain words
              </p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                <Loader2 className="h-3 w-3 animate-spin" />
                99.98% delivered
              </span>
            </div>

            <ol className="space-y-2.5">
              <FlowStep
                step="01"
                title="Guest rates the request"
                body="One tap. 1–5 stars. Optional note."
                tone="emerald"
              />
              <FlowStep
                step="02"
                title="Sentiment is decided"
                body="4–5 stars → happy. 1–3 stars → service recovery."
                tone="amber"
              />
              <FlowStep
                step="03a"
                title="Happy guest gets a thank-you"
                body="Branded email with your Google or Booking review link."
                tone="emerald"
              />
              <FlowStep
                step="03b"
                title="Unhappy guest gets a private apology"
                body="Same beat. A task opens on your recovery desk with full context."
                tone="clay"
              />
            </ol>

            <p className="mt-4 text-[11.5px] text-foreground/55 leading-relaxed">
              All four messages — and every other system email — leave from the
              same Resend pipeline you control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Outcome({
  tone,
  icon: Icon,
  eyebrow,
  title,
  body,
  chips,
}: {
  tone: "positive" | "warn";
  icon: typeof Heart;
  eyebrow: string;
  title: string;
  body: string;
  chips: string[];
}) {
  const isPos = tone === "positive";
  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-10 w-10 rounded-lg items-center justify-center shrink-0 ${
            isPos
              ? "bg-emerald-soft text-emerald-brand"
              : "bg-amber-soft text-amber-brand"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
              isPos ? "text-emerald-brand" : "text-amber-brand"
            }`}
          >
            {eyebrow}
          </p>
          <h4 className="font-display text-lg text-ink mt-1 leading-tight">
            {title}
          </h4>
          <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
            {body}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((c) => (
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
  );
}

function FlowStep({
  step,
  title,
  body,
  tone,
}: {
  step: string;
  title: string;
  body: string;
  tone: "emerald" | "amber" | "clay";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-soft text-emerald-brand"
      : tone === "amber"
      ? "bg-amber-soft text-amber-brand"
      : "bg-[#f3d8cf] text-clay";
  return (
    <li className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-surface/60 p-3">
      <span
        className={`inline-flex items-center justify-center min-w-[40px] h-7 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] px-2 shrink-0 ${toneClass}`}
      >
        {step}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink leading-tight">{title}</p>
        <p className="text-[12.5px] text-foreground/65 mt-0.5 leading-relaxed">
          {body}
        </p>
      </div>
    </li>
  );
}
