import {
  Bell,
  Radio,
  Activity,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Wine,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";

const PULSE_BARS = [
  { label: "Connection", value: "99.98%", tone: "emerald" as const },
  { label: "Latency", value: "< 120ms", tone: "amber" as const },
  { label: "Reconnect", value: "auto", tone: "emerald" as const },
];

export function RealtimeSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-20 h-[420px] w-[620px] bg-emerald-soft/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <span className="pill">
              <Radio className="h-3 w-3 text-emerald-brand" />
              real-time, both ways
            </span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
              The room and the desk,
              <br />
              <span className="display-italic text-emerald-brand">
                breathing in sync.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-foreground/70">
              Every request, every status change, every escalation arrives the
              instant it happens — to the right phone, the right channel, on
              both sides of the door. No polling. No refresh.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-7 lg:grid-cols-2 items-stretch">
          {/* Left — staff side */}
          <div className="card-elev p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-soft/40 blur-2xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="eyebrow flex items-center gap-1.5">
                  <Bell className="h-3 w-3 text-emerald-brand" />
                  Staff side · Notification feed
                </p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                  3 new
                </span>
              </div>

              <ul className="rounded-2xl border border-[color:var(--border)] bg-card divide-y divide-[color:var(--border)] overflow-hidden">
                <NotifRow
                  badge={<Coffee className="h-4 w-4" />}
                  badgeTone="emerald"
                  title="New request · Espresso for two"
                  meta="Room 412 · just now"
                  isNew
                />
                <NotifRow
                  badge={<Wine className="h-4 w-4" />}
                  badgeTone="amber"
                  title="Status: in progress · Champagne"
                  meta="Room 305 · 30s ago"
                  isNew
                />
                <NotifRow
                  badge={<CheckCircle2 className="h-4 w-4" />}
                  badgeTone="emerald"
                  title="Completed · Late checkout"
                  meta="Room 118 · 1m ago"
                />
                <NotifRow
                  badge={<Zap className="h-4 w-4" />}
                  badgeTone="clay"
                  title="Escalation · Negative rating"
                  meta="Room 207 · 2m ago · SLA 30m"
                />
              </ul>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {PULSE_BARS.map((p) => (
                  <div
                    key={p.label}
                    className="rounded-lg border border-[color:var(--border)] bg-surface px-3 py-2"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
                      {p.label}
                    </p>
                    <p
                      className={`numeral text-base leading-none mt-1 ${
                        p.tone === "amber"
                          ? "text-amber-brand"
                          : "text-emerald-brand"
                      }`}
                    >
                      {p.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — guest side */}
          <div className="card-elev p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-32 w-32 bg-amber-soft/40 blur-2xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="eyebrow flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-amber-brand" />
                  Guest side · Active request
                </p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-brand animate-pulse" />
                  on the way
                </span>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-[color:var(--border)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                    Room 412 · order #A41
                  </p>
                  <h3 className="font-display text-xl text-ink mt-2 leading-snug">
                    Champagne &amp; strawberries
                  </h3>
                </div>

                {/* Timeline */}
                <ol className="px-5 py-5 space-y-3">
                  <TimelineStep
                    label="Received"
                    time="21:42"
                    state="done"
                  />
                  <TimelineStep
                    label="Confirmed by reception"
                    time="21:43"
                    state="done"
                  />
                  <TimelineStep
                    label="Preparing in the kitchen"
                    time="21:44"
                    state="active"
                  />
                  <TimelineStep
                    label="On the way to your room"
                    time="—"
                    state="pending"
                  />
                </ol>

                <div className="px-5 py-3 border-t border-[color:var(--border)] bg-surface/60 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-foreground/55">
                  <Clock className="h-3 w-3 text-amber-brand" />
                  ETA · 6–8 minutes
                </div>
              </div>

              <p className="mt-4 text-xs text-foreground/55">
                Guests see live updates from the homepage of their app — no
                refresh, no notifications app. Their phone stays calm.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
          <p className="eyebrow flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-brand" />
            Server-Sent Events · auto-reconnect · per-hotel scoping
          </p>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 h-10 px-4 rounded-full bg-emerald-brand text-primary-foreground text-sm font-medium hover:bg-ink transition-colors"
          >
            See it in motion
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function NotifRow({
  badge,
  badgeTone,
  title,
  meta,
  isNew,
}: {
  badge: React.ReactNode;
  badgeTone: "emerald" | "amber" | "clay";
  title: string;
  meta: string;
  isNew?: boolean;
}) {
  const toneClass =
    badgeTone === "emerald"
      ? "bg-emerald-soft text-emerald-brand"
      : badgeTone === "amber"
      ? "bg-amber-soft text-amber-brand"
      : "bg-[#f3d8cf] text-clay";
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span
        className={`inline-flex h-9 w-9 rounded-lg items-center justify-center shrink-0 ${toneClass}`}
      >
        {badge}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink truncate">{title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50 mt-0.5">
          {meta}
        </p>
      </div>
      {isNew ? (
        <span className="h-2 w-2 rounded-full bg-emerald-brand shrink-0" />
      ) : null}
    </li>
  );
}

function TimelineStep({
  label,
  time,
  state,
}: {
  label: string;
  time: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="relative flex items-center justify-center shrink-0">
        {state === "done" ? (
          <span className="h-5 w-5 rounded-full bg-emerald-soft text-emerald-brand inline-flex items-center justify-center">
            <CheckCircle2 className="h-3 w-3" />
          </span>
        ) : state === "active" ? (
          <>
            <span className="absolute h-5 w-5 rounded-full bg-amber-brand/30 animate-ping" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-amber-brand" />
          </>
        ) : (
          <span className="h-2.5 w-2.5 rounded-full border border-[color:var(--border)] bg-surface" />
        )}
      </span>
      <p
        className={`text-sm flex-1 ${
          state === "pending" ? "text-foreground/45" : "text-ink"
        }`}
      >
        {label}
      </p>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50">
        {time}
      </span>
    </li>
  );
}
