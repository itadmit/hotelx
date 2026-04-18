"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  Loader2,
  MessageSquareHeart,
  RefreshCcw,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { cn } from "@/lib/utils";

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

export function FeedbackDeskClient() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("NEGATIVE_OPEN");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback?limit=200", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items ?? []);
      setSummary(data.summary ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
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
    const csat = total > 0 ? Math.round((positive / total) * 100) : null;
    return { total, positive, negative, open, csat };
  }, [summary]);

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

  return (
    <div className="space-y-7 pb-12">
      <DashboardPageHeader
        eyebrow="Guest experience · feedback"
        title="Service recovery desk"
        description="Every rating from your guests, with negative responses queued for personal follow-up."
      >
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[color:var(--border)] bg-card text-xs text-ink hover:bg-surface transition-colors"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </DashboardPageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={MessageSquareHeart}
          label="Total responses"
          value={counters.total}
          tone="neutral"
        />
        <SummaryCard
          icon={ThumbsUp}
          label="Happy guests"
          value={counters.positive}
          tone="positive"
        />
        <SummaryCard
          icon={ThumbsDown}
          label="Recovery needed"
          value={counters.negative}
          tone="warn"
          hint={`${counters.open} still open`}
        />
        <SummaryCard
          icon={Heart}
          label="CSAT"
          value={counters.csat == null ? "—" : `${counters.csat}%`}
          tone="positive"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--border)] -mx-2 px-2 pb-1.5 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                active
                  ? "bg-ink text-primary-foreground"
                  : "text-foreground/65 hover:text-ink hover:bg-surface"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {loading && items.length === 0 ? (
        <div className="card-surface p-10 flex items-center justify-center text-foreground/50 text-sm">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading feedback…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <FeedbackRow
              key={item.id}
              item={item}
              onPatch={patchFeedback}
              isSaving={savingId === item.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: typeof Star;
  label: string;
  value: number | string;
  tone: "neutral" | "positive" | "warn";
  hint?: string;
}) {
  const toneStyle =
    tone === "positive"
      ? "bg-emerald-soft text-emerald-brand"
      : tone === "warn"
        ? "bg-amber-soft text-amber-brand"
        : "bg-surface text-foreground/55";
  return (
    <div className="card-surface p-4 flex items-start gap-3">
      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", toneStyle)}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
          {label}
        </p>
        <p className="numeral text-2xl text-ink leading-none mt-1.5">{value}</p>
        {hint ? (
          <p className="text-[11px] text-foreground/55 mt-1">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const message =
    tab === "NEGATIVE_OPEN"
      ? "No service recoveries waiting. Beautiful."
      : tab === "POSITIVE"
        ? "No positive ratings yet. They'll show up here."
        : tab === "RESOLVED"
          ? "Nothing has been resolved yet."
          : "No feedback collected yet.";
  return (
    <div className="card-surface p-10 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-soft text-emerald-brand mx-auto">
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <p className="font-display text-lg text-ink mt-3">{message}</p>
      <p className="text-sm text-foreground/55 mt-1">
        Guests can rate any completed request from their phone.
      </p>
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
  const negative = item.sentiment === "NEGATIVE";

  return (
    <li
      className={cn(
        "card-surface p-5 border-l-4",
        negative
          ? item.status === "RESOLVED"
            ? "border-emerald-brand/60"
            : "border-clay/70"
          : "border-emerald-brand/40"
      )}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.16em]",
                negative
                  ? "bg-clay/10 text-clay"
                  : "bg-emerald-soft text-emerald-brand"
              )}
            >
              {negative ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Heart className="h-3 w-3" />
              )}
              {negative ? "Recovery" : "Praise"}
            </span>
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-3.5 w-3.5",
                    n <= item.rating
                      ? "fill-amber-brand text-amber-brand"
                      : "text-foreground/20"
                  )}
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="mt-2 text-sm text-ink">
            <span className="font-medium">{item.request.service.name}</span>
            <span className="text-foreground/50">
              {" "}
              · Room {item.request.room.number}
            </span>
            {item.guestName ? (
              <span className="text-foreground/50">
                {" "}
                · from {item.guestName}
              </span>
            ) : null}
          </p>

          {item.comment ? (
            <p className="mt-2 text-sm text-foreground/75 leading-relaxed border-l-2 border-[color:var(--border)] pl-3 italic">
              &ldquo;{item.comment}&rdquo;
            </p>
          ) : null}

          {item.guestEmail ? (
            <a
              href={`mailto:${item.guestEmail}`}
              className="inline-block mt-2 text-xs text-emerald-brand underline underline-offset-2"
            >
              {item.guestEmail}
            </a>
          ) : null}
        </div>

        <div className="shrink-0 flex flex-col gap-2 min-w-[180px]">
          <StatusPill status={item.status} />
          {item.status !== "RESOLVED" ? (
            <>
              {item.status === "NEW" ? (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => onPatch(item.id, { status: "IN_REVIEW" })}
                  className="h-8 px-3 rounded-md border border-[color:var(--border)] bg-card text-xs text-ink hover:bg-surface transition-colors disabled:opacity-60"
                >
                  Mark as in review
                </button>
              ) : null}
              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  onPatch(item.id, {
                    status: "RESOLVED",
                    resolutionNote: note.trim() || undefined,
                  })
                }
                className="h-8 px-3 rounded-md bg-emerald-brand text-primary-foreground text-xs font-medium hover:bg-ink transition-colors disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Mark resolved"}
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onPatch(item.id, { status: "IN_REVIEW" })}
              className="h-8 px-3 rounded-md border border-[color:var(--border)] bg-card text-xs text-foreground/65 hover:bg-surface transition-colors disabled:opacity-60"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

      {negative && item.status !== "RESOLVED" ? (
        <div className="mt-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Resolution note — what did you do to make it right?"
            rows={2}
            className="w-full px-3 py-2 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink placeholder:text-foreground/40 resize-none focus:outline-none focus:border-emerald-brand/40"
          />
        </div>
      ) : null}

      {item.status === "RESOLVED" && item.resolutionNote ? (
        <div className="mt-3 rounded-md bg-emerald-soft/40 px-3 py-2 text-xs text-emerald-brand">
          Resolution: {item.resolutionNote}
        </div>
      ) : null}
    </li>
  );
}

function StatusPill({ status }: { status: "NEW" | "IN_REVIEW" | "RESOLVED" }) {
  const cfg =
    status === "RESOLVED"
      ? { bg: "bg-emerald-soft", text: "text-emerald-brand", label: "Resolved" }
      : status === "IN_REVIEW"
        ? { bg: "bg-amber-soft", text: "text-amber-brand", label: "In review" }
        : { bg: "bg-clay/10", text: "text-clay", label: "New" };
  return (
    <span
      className={cn(
        "self-end inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.16em]",
        cfg.bg,
        cfg.text
      )}
    >
      {cfg.label}
    </span>
  );
}
