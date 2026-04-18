"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Heart,
  HeartCrack,
  Loader2,
  MessageSquareHeart,
  RefreshCcw,
  Settings,
  Star,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FeedbackDeskSkeleton } from "./FeedbackDeskSkeleton";

type FeedbackItem = {
  id: string;
  rating: number;
  comment: string | null;
  guestName: string | null;
  guestEmail: string | null;
  sentiment: "POSITIVE" | "NEGATIVE";
  status: "NEW" | "IN_REVIEW" | "RESOLVED";
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  request: {
    id: string;
    service: { id: string; name: string };
    room: { id: string; number: string };
  };
};

type SummaryRow = {
  sentiment: "POSITIVE" | "NEGATIVE";
  status: "NEW" | "IN_REVIEW" | "RESOLVED";
  _count: { _all: number };
};

type FilterTab = "ALL" | "NEGATIVE_OPEN" | "POSITIVE" | "RESOLVED";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "NEGATIVE_OPEN", label: "Recovery queue" },
  { id: "POSITIVE", label: "Happy guests" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "ALL", label: "All" },
];

const STATUS_LABEL: Record<FeedbackItem["status"], string> = {
  NEW: "New",
  IN_REVIEW: "In review",
  RESOLVED: "Resolved",
};

const STATUS_STYLES: Record<FeedbackItem["status"], string> = {
  NEW: "bg-[#f3d8cf] text-clay border-[color:var(--clay)]/22",
  IN_REVIEW: "bg-amber-soft text-amber-brand border-[color:var(--amber)]/22",
  RESOLVED: "bg-primary/10 text-primary border-primary/20",
};

export function FeedbackDeskClient() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("NEGATIVE_OPEN");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) setIsInitialLoading(true);
    setLoading(true);
    try {
      const res = await fetch("/api/feedback?limit=200", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items ?? []);
      setSummary(data.summary ?? []);
    } finally {
      setLoading(false);
      if (isInitial) setIsInitialLoading(false);
    }
  }

  useEffect(() => {
    load({ initial: true });
  }, []);

  const filtered = useMemo(() => {
    switch (tab) {
      case "NEGATIVE_OPEN":
        return items.filter(
          (i) => i.sentiment === "NEGATIVE" && i.status !== "RESOLVED"
        );
      case "POSITIVE":
        return items.filter((i) => i.sentiment === "POSITIVE");
      case "RESOLVED":
        return items.filter((i) => i.status === "RESOLVED");
      default:
        return items;
    }
  }, [items, tab]);

  const counters = useMemo(() => {
    const get = (
      sentiment: "POSITIVE" | "NEGATIVE",
      status?: "NEW" | "IN_REVIEW" | "RESOLVED"
    ) =>
      summary
        .filter(
          (r) =>
            r.sentiment === sentiment &&
            (status === undefined || r.status === status)
        )
        .reduce((acc, r) => acc + r._count._all, 0);

    const total = summary.reduce((acc, r) => acc + r._count._all, 0);
    const positive = get("POSITIVE");
    const negative = get("NEGATIVE");
    const open = get("NEGATIVE", "NEW") + get("NEGATIVE", "IN_REVIEW");
    const resolved = get("NEGATIVE", "RESOLVED");
    const csat = total > 0 ? Math.round((positive / total) * 100) : null;
    const avgRating =
      items.length > 0
        ? Number(
            (
              items.reduce((acc, i) => acc + i.rating, 0) / items.length
            ).toFixed(1)
          )
        : null;
    return { total, positive, negative, open, resolved, csat, avgRating };
  }, [summary, items]);

  async function patchFeedback(
    id: string,
    payload: { status?: "NEW" | "IN_REVIEW" | "RESOLVED"; resolutionNote?: string }
  ) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await load();
      }
    } finally {
      setSavingId(null);
    }
  }

  const latest = filtered.slice(0, 8);

  if (isInitialLoading) {
    return <FeedbackDeskSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Guest experience · feedback"
        title="Service recovery desk"
        description="Every rating from your guests, with negative responses queued for personal follow-up."
      >
        <Button
          variant="outline"
          onClick={() => load()}
          disabled={loading}
          className="gap-2 h-9 text-xs"
        >
          <RefreshCcw
            className={cn("h-3.5 w-3.5", loading && "animate-spin")}
          />
          Refresh
        </Button>
        <a
          href="/dashboard/email-templates"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Edit emails
        </a>
      </DashboardPageHeader>

      {/* KPI Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total responses"
          value={counters.total}
          icon={MessageSquareHeart}
          accent="emerald"
          delta={
            counters.avgRating != null
              ? `${counters.avgRating} avg rating`
              : "Awaiting first reply"
          }
          loading={loading}
        />
        <KpiCard
          label="Happy guests"
          value={counters.positive}
          icon={ThumbsUp}
          accent="sage"
          delta={
            counters.total > 0
              ? `${Math.round((counters.positive / counters.total) * 100)}% of all`
              : undefined
          }
          loading={loading}
        />
        <KpiCard
          label="Recovery needed"
          value={counters.negative}
          icon={HeartCrack}
          accent="amber"
          delta={
            counters.negative > 0
              ? `${counters.open} still open`
              : "All clear"
          }
          loading={loading}
        />
        <KpiCard
          label="CSAT"
          value={counters.csat == null ? "—" : `${counters.csat}%`}
          icon={Heart}
          accent="clay"
          delta={
            counters.csat != null
              ? counters.csat >= 80
                ? "above benchmark"
                : "growing"
              : "no data yet"
          }
          loading={loading}
          isText
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium transition-colors whitespace-nowrap inline-flex items-center gap-2",
                active
                  ? "bg-ink text-primary-foreground"
                  : "card-surface text-foreground/65 hover:text-ink"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.12em]",
                  active ? "text-primary-foreground/65" : "text-foreground/40"
                )}
              >
                {t.id === "NEGATIVE_OPEN"
                  ? counters.open
                  : t.id === "POSITIVE"
                    ? counters.positive
                    : t.id === "RESOLVED"
                      ? counters.resolved
                      : counters.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Feedback list */}
        <section className="lg:col-span-2 card-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
            <div>
              <h2 className="text-base font-medium text-ink">
                {tab === "NEGATIVE_OPEN"
                  ? "Open recoveries"
                  : tab === "POSITIVE"
                    ? "Happy moments"
                    : tab === "RESOLVED"
                      ? "Resolved"
                      : "Recent feedback"}
              </h2>
              <p className="text-xs text-foreground/55 mt-0.5">
                {filtered.length === 0
                  ? "Nothing to show in this view"
                  : `${filtered.length} ${
                      filtered.length === 1 ? "response" : "responses"
                    }`}
              </p>
            </div>
            <a
              href="/dashboard/requests"
              className="group inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-all"
            >
              View requests
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {loading && items.length === 0 ? (
            <div className="px-5 py-8 text-sm text-foreground/55 inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading feedback…
            </div>
          ) : latest.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {latest.map((item) => (
                <FeedbackRow
                  key={item.id}
                  item={item}
                  onPatch={patchFeedback}
                  isSaving={savingId === item.id}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Right column */}
        <aside className="space-y-4">
          {/* Reputation card — light variant, sibling of Performance */}
          <div className="card-surface p-5 relative overflow-hidden">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-soft/60 blur-2xl"
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                <TrendingUp className="h-3 w-3 text-emerald-brand" />
                Reputation
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[9px] uppercase tracking-[0.16em]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
                live
              </span>
            </div>

            <div className="relative mt-4 flex items-end gap-4">
              <CsatRing value={counters.csat} />
              <div className="pb-1">
                <p className="text-xs text-foreground/65">
                  Guest satisfaction score
                </p>
                <p className="text-[11px] text-foreground/45 mt-0.5">
                  Based on {counters.positive + counters.open + counters.resolved}{" "}
                  rating
                  {counters.positive + counters.open + counters.resolved === 1
                    ? ""
                    : "s"}
                </p>
              </div>
            </div>

            <div className="relative mt-5 pt-4 border-t border-[color:var(--border)] grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
                  Happy
                </p>
                <p className="numeral text-2xl text-ink mt-1">
                  {counters.positive}
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
                  Open
                </p>
                <p className="numeral text-2xl text-ink mt-1">
                  {counters.open}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Quick actions
            </p>
            <div className="mt-3 space-y-2">
              <QuickAction
                href="/dashboard/email-templates"
                icon={MessageSquareHeart}
                title="Edit guest emails"
                desc="Thank-you, apology & invites"
              />
              <QuickAction
                href="/dashboard/hotel-settings#feedback"
                icon={Settings}
                title="Feedback settings"
                desc="Threshold · Google · Booking"
              />
              <QuickAction
                href="/dashboard/requests"
                icon={ClipboardList}
                title="Open requests board"
                desc="Cross-reference each rating"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CsatRing({ value }: { value: number | null }) {
  const size = 72;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = value ?? 0;
  const dash = (circumference * pct) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-emerald-brand"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="numeral text-xl text-ink leading-none">
          {value ?? "—"}
        </span>
        {value != null ? (
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-foreground/55 mt-0.5">
            csat
          </span>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const message =
    tab === "NEGATIVE_OPEN"
      ? "No service recoveries waiting"
      : tab === "POSITIVE"
        ? "No positive ratings yet"
        : tab === "RESOLVED"
          ? "Nothing has been resolved yet"
          : "No feedback collected yet";
  const detail =
    tab === "NEGATIVE_OPEN"
      ? "Beautiful. The desk is clear."
      : "Guests can rate any completed request from their phone.";
  return (
    <div className="px-5 py-12 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <p className="text-sm text-foreground/70">{message}</p>
      <p className="text-xs text-foreground/50 mt-1">{detail}</p>
    </div>
  );
}

function FeedbackRow({
  item,
  onPatch,
  isSaving,
}: {
  item: FeedbackItem;
  onPatch: (
    id: string,
    payload: { status?: "NEW" | "IN_REVIEW" | "RESOLVED"; resolutionNote?: string }
  ) => Promise<void>;
  isSaving: boolean;
}) {
  const [note, setNote] = useState(item.resolutionNote ?? "");
  const [open, setOpen] = useState(false);
  const negative = item.sentiment === "NEGATIVE";
  const time = new Date(item.createdAt);

  return (
    <li className="px-5 py-3.5 hover:bg-background/60 transition-colors">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex h-9 w-9 shrink-0 rounded-md bg-surface border border-[color:var(--border)] items-center justify-center font-mono text-[11px] text-foreground/70">
          {item.request.room.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">
            <span className="sm:hidden text-foreground/55 font-mono text-[11px] mr-1.5">
              {item.request.room.number}
            </span>
            {item.request.service.name}
            {item.guestName ? (
              <span className="text-foreground/45 font-normal">
                {" "}
                · {item.guestName}
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-3 w-3",
                    n <= item.rating
                      ? "fill-amber-brand text-amber-brand"
                      : "text-foreground/20"
                  )}
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <span className="font-mono text-[11px] text-foreground/50">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <span className="text-foreground/30 mx-1.5">·</span>
              {time.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.12em]",
            STATUS_STYLES[item.status]
          )}
        >
          {item.status === "NEW" && (
            <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
          )}
          {STATUS_LABEL[item.status]}
        </span>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="shrink-0 h-8 w-8 rounded-md border border-[color:var(--border)] bg-card text-foreground/60 hover:text-ink hover:bg-surface transition-colors flex items-center justify-center"
          aria-label={open ? "Collapse" : "Expand"}
        >
          <ArrowUpRight
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              open ? "rotate-90" : "rotate-0"
            )}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-3 ml-0 sm:ml-13 pl-0 sm:pl-1 space-y-3">
          {item.comment ? (
            <p className="text-sm text-foreground/75 leading-relaxed border-l-2 border-[color:var(--border)] pl-3 italic">
              &ldquo;{item.comment}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-foreground/45 italic">
              No comment was left.
            </p>
          )}
          {item.guestEmail ? (
            <a
              href={`mailto:${item.guestEmail}`}
              className="inline-block text-xs text-primary underline underline-offset-2"
            >
              {item.guestEmail}
            </a>
          ) : null}

          {negative && item.status !== "RESOLVED" ? (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Resolution note — what did you do to make it right?"
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink placeholder:text-foreground/40 resize-none focus:outline-none focus:border-primary/40"
            />
          ) : null}

          {item.status === "RESOLVED" && item.resolutionNote ? (
            <div className="rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
              Resolution: {item.resolutionNote}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {item.status !== "RESOLVED" ? (
              <>
                {item.status === "NEW" ? (
                  <Button
                    variant="outline"
                    onClick={() => onPatch(item.id, { status: "IN_REVIEW" })}
                    disabled={isSaving}
                    className="h-8 text-xs"
                  >
                    Mark as in review
                  </Button>
                ) : null}
                <Button
                  onClick={() =>
                    onPatch(item.id, {
                      status: "RESOLVED",
                      resolutionNote: note.trim() || undefined,
                    })
                  }
                  disabled={isSaving}
                  className="h-8 text-xs bg-primary hover:bg-primary/90 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {isSaving ? "Saving…" : "Mark resolved"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => onPatch(item.id, { status: "IN_REVIEW" })}
                disabled={isSaving}
                className="h-8 text-xs"
              >
                Reopen
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </li>
  );
}

/* ----- KPI Card (1:1 with the Overview page) ----- */

const ACCENT_STYLES = {
  emerald: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    bar: "bg-primary",
  },
  amber: {
    iconBg: "bg-amber-soft",
    iconText: "text-amber-brand",
    bar: "bg-amber-brand",
  },
  clay: {
    iconBg: "bg-[#f3d8cf]",
    iconText: "text-clay",
    bar: "bg-clay",
  },
  sage: {
    iconBg: "bg-[color:var(--surface-2)]",
    iconText: "text-sage",
    bar: "bg-sage",
  },
} as const;

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  delta,
  loading,
  isText = false,
}: {
  label: string;
  value: number | string;
  icon: typeof ClipboardList;
  accent: keyof typeof ACCENT_STYLES;
  delta?: string;
  loading?: boolean;
  isText?: boolean;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="card-surface p-4 sm:p-5 relative overflow-hidden">
      <span
        className={cn(
          "absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full",
          a.bar
        )}
      />
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
          {label}
        </p>
        <div
          className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center",
            a.iconBg,
            a.iconText
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-20 rounded bg-[color:var(--surface-2)] animate-pulse" />
        ) : isText ? (
          <p className="font-display text-xl sm:text-2xl text-ink leading-tight truncate">
            {value}
          </p>
        ) : (
          <p className="numeral text-3xl sm:text-4xl text-ink leading-none">
            {value}
          </p>
        )}
      </div>
      {delta && !loading && (
        <p className="text-[11px] text-foreground/50 mt-2 font-mono">{delta}</p>
      )}
    </div>
  );
}

/* ----- Quick Action ----- */

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof ClipboardList;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 p-2.5 -mx-1 rounded-md hover:bg-background/70 transition-colors"
    >
      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{title}</p>
        <p className="text-[11px] text-foreground/50 truncate">{desc}</p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
    </a>
  );
}
