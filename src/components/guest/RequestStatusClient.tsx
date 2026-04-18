"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  ConciergeBell,
  CircleCheck,
  CircleDot,
  ArrowLeft,
  Star,
  Send,
  Heart,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type RequestStatusData = {
  id: string;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | string;
  createdAt?: string;
  notes?: string | null;
  service: {
    name: string;
    estimatedTime: string | null;
    price?: string | number | null;
  };
  room?: { number?: string };
};

const STATUS_FLOW = ["NEW", "IN_PROGRESS", "COMPLETED"] as const;

function statusLabel(s?: string): string {
  if (!s) return "Pending";
  if (s === "NEW") return "Received";
  if (s === "IN_PROGRESS") return "Preparing";
  if (s === "COMPLETED") return "Delivered";
  return s.replace(/_/g, " ").toLowerCase();
}

function statusColor(s?: string): {
  bg: string;
  text: string;
  ring: string;
  dot: string;
} {
  if (s === "COMPLETED") {
    return {
      bg: "bg-emerald-soft",
      text: "text-emerald-brand",
      ring: "ring-emerald-brand/20",
      dot: "bg-emerald-brand",
    };
  }
  if (s === "IN_PROGRESS") {
    return {
      bg: "bg-amber-soft",
      text: "text-amber-brand",
      ring: "ring-amber-brand/20",
      dot: "bg-amber-brand",
    };
  }
  return {
    bg: "bg-[#e3eadf]",
    text: "text-emerald-brand",
    ring: "ring-emerald-brand/20",
    dot: "bg-emerald-brand",
  };
}

type Props = {
  hotelSlug: string;
  roomCode: string;
  requestId: string;
  initialRequest: RequestStatusData;
};

export function RequestStatusClient({
  hotelSlug,
  roomCode,
  requestId,
  initialRequest,
}: Props) {
  const [request, setRequest] = useState<RequestStatusData>(initialRequest);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadRequest() {
      try {
        setIsPolling(true);
        const response = await fetch(`/api/public/requests/${requestId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!cancelled && data.request) {
          setRequest(data.request);
        }
      } finally {
        if (!cancelled) {
          setIsPolling(false);
        }
      }
    }

    let interval: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (interval) return;
      interval = setInterval(loadRequest, 12000);
    };
    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      start();
    }

    const onVisibility = () => {
      if (typeof document === "undefined") return;
      if (document.visibilityState === "visible") {
        loadRequest();
        start();
      } else {
        stop();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelled = true;
      stop();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, [requestId]);

  const currentStepIndex = useMemo(() => {
    const idx = STATUS_FLOW.indexOf(
      (request?.status as (typeof STATUS_FLOW)[number]) ?? "NEW"
    );
    return idx === -1 ? 0 : idx;
  }, [request?.status]);

  const colors = statusColor(request?.status);

  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden">
      <header className="sticky top-0 z-30 px-4 py-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]/60 flex items-center gap-2">
        <Link
          href={`/g/${hotelSlug}/${roomCode}`}
          className="h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4 text-ink" />
        </Link>
        <div className="leading-tight">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
            Request · {requestId.slice(0, 6)}
          </p>
          <p className="text-sm font-medium text-ink">Live status</p>
        </div>
      </header>

      <section className="px-5 pt-8 text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-soft text-emerald-brand">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-5 leading-tight tracking-tight text-ink">
          Request received
          <span className="display-italic text-emerald-brand">.</span>
        </h1>
        <p className="mt-2.5 text-sm text-foreground/65 leading-snug max-w-xs mx-auto">
          We&apos;re preparing{" "}
          <span className="font-medium text-ink">{request.service.name}</span> for
          you.
        </p>
      </section>

      <section className="mx-5 mt-7 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[color:var(--border)] flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-brand" />
            Order status
          </p>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
          >
            {isPolling ? (
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
            ) : (
              <span className={`h-1 w-1 rounded-full ${colors.dot}`} />
            )}
            {statusLabel(request.status)}
          </span>
        </div>

        <ol className="px-4 py-4 space-y-3.5">
          {STATUS_FLOW.map((step, i) => {
            const isDone = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            const Icon = isDone ? CircleCheck : isActive ? CircleDot : Clock;
            return (
              <li key={step} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    isDone
                      ? "bg-emerald-brand text-primary-foreground"
                      : isActive
                        ? "bg-amber-soft text-amber-brand"
                        : "bg-surface text-foreground/40 border border-[color:var(--border)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <div className="leading-tight">
                  <p
                    className={`text-sm font-medium ${
                      isDone || isActive ? "text-ink" : "text-foreground/45"
                    }`}
                  >
                    {statusLabel(step)}
                  </p>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    {step === "NEW"
                      ? "Concierge has been notified"
                      : step === "IN_PROGRESS"
                        ? "Staff is preparing your request"
                        : "Service has been delivered"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="px-4 py-3 border-t border-[color:var(--border)] grid grid-cols-2 gap-3 bg-surface/50">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
              ETA
            </p>
            <p className="text-sm font-medium text-ink mt-0.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-foreground/50" />
              {request.service.estimatedTime ?? "On request"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
              Concierge
            </p>
            <p className="text-sm font-medium text-ink mt-0.5 flex items-center gap-1.5">
              <ConciergeBell className="h-3.5 w-3.5 text-foreground/50" />
              On the line
            </p>
          </div>
        </div>
      </section>

      {request.notes ? (
        <section className="mx-5 mt-4 rounded-xl border border-dashed border-[color:var(--border)] bg-surface/40 px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
            Your note
          </p>
          <p className="mt-1 text-sm text-ink leading-snug">
            &ldquo;{request.notes}&rdquo;
          </p>
        </section>
      ) : null}

      {request.status === "COMPLETED" ? (
        <FeedbackPanel
          requestId={requestId}
          serviceName={request.service.name}
        />
      ) : null}

      <div className="mt-auto pt-10 px-5">
        <Link
          href={`/g/${hotelSlug}/${roomCode}`}
          className="group w-full inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
        >
          Back to concierge
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          Updates every 8 seconds
        </p>
      </div>
    </main>
  );
}

type FeedbackPhase = "rate" | "details" | "submitting" | "thanks-positive" | "thanks-negative";

function FeedbackPanel({
  requestId,
  serviceName,
}: {
  requestId: string;
  serviceName: string;
}) {
  const STORAGE_KEY = `hotelx:feedback:${requestId}`;
  const [phase, setPhase] = useState<FeedbackPhase>("rate");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reviewLinks, setReviewLinks] = useState<{
    google: string | null;
    booking: string | null;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        phase: FeedbackPhase;
        rating?: number;
        reviewLinks?: { google: string | null; booking: string | null } | null;
      };
      if (parsed.phase === "thanks-positive" || parsed.phase === "thanks-negative") {
        setPhase(parsed.phase);
        setRating(parsed.rating ?? 0);
        setReviewLinks(parsed.reviewLinks ?? null);
      }
    } catch {
      /* ignore */
    }
  }, [STORAGE_KEY]);

  function persist(next: {
    phase: FeedbackPhase;
    rating?: number;
    reviewLinks?: { google: string | null; booking: string | null } | null;
  }) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function submit() {
    if (rating < 1) {
      setError("Pick a rating first");
      return;
    }
    setError(null);
    setPhase("submitting");
    try {
      const res = await fetch("/api/public/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          rating,
          comment: comment.trim() || null,
          guestName: name.trim() || null,
          guestEmail: email.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not save feedback");
      }
      const sentiment = data?.feedback?.sentiment as
        | "POSITIVE"
        | "NEGATIVE"
        | undefined;
      const nextPhase: FeedbackPhase =
        sentiment === "POSITIVE" ? "thanks-positive" : "thanks-negative";
      const links = data?.reviewLinks ?? null;
      setReviewLinks(links);
      setPhase(nextPhase);
      persist({ phase: nextPhase, rating, reviewLinks: links });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("details");
    }
  }

  if (phase === "thanks-positive") {
    const hasLinks = reviewLinks?.google || reviewLinks?.booking;
    return (
      <section className="mx-5 mt-6 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
        <div className="px-5 py-5 bg-emerald-soft/60">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-brand text-primary-foreground">
              <Heart className="h-4 w-4" />
            </span>
            <p className="eyebrow text-emerald-brand">Thank you</p>
          </div>
          <h2 className="font-display text-xl text-ink mt-3 leading-snug">
            We&apos;re so glad you enjoyed it
            <span className="display-italic text-emerald-brand">.</span>
          </h2>
          <p className="text-sm text-foreground/70 mt-1.5">
            A short public review helps fellow travellers — and our team — more
            than you&apos;d think.
          </p>
        </div>
        {hasLinks ? (
          <div className="px-5 py-4 grid gap-2.5">
            {reviewLinks?.google ? (
              <a
                href={reviewLinks.google}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center justify-between gap-2 h-12 px-4 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4" /> Review on Google
                </span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : null}
            {reviewLinks?.booking ? (
              <a
                href={reviewLinks.booking}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center justify-between gap-2 h-12 px-4 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-emerald-brand" /> Review on Booking.com
                </span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="text-sm text-foreground/65">
              Your kind words have been forwarded to the team.
            </p>
          </div>
        )}
      </section>
    );
  }

  if (phase === "thanks-negative") {
    return (
      <section className="mx-5 mt-6 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
        <div className="px-5 py-5 bg-amber-soft/50">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-brand text-primary-foreground">
              <Heart className="h-4 w-4" />
            </span>
            <p className="eyebrow text-amber-brand">We&apos;re on it</p>
          </div>
          <h2 className="font-display text-xl text-ink mt-3 leading-snug">
            Thank you for telling us
            <span className="display-italic text-amber-brand">.</span>
          </h2>
          <p className="text-sm text-foreground/70 mt-1.5">
            Our concierge has been notified and someone will personally reach out
            to make this right.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-5 mt-6 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-[color:var(--border)]">
        <p className="eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-brand" />
          How was it?
        </p>
        <h2 className="font-display text-xl text-ink mt-2 leading-snug">
          Rate <span className="text-emerald-brand">{serviceName}</span>
        </h2>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div
          className="flex items-center justify-center gap-1.5"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hoverRating || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onClick={() => {
                  setRating(n);
                  if (phase === "rate") setPhase("details");
                }}
                aria-label={`Rate ${n} out of 5`}
                className="h-11 w-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    filled
                      ? "fill-amber-brand text-amber-brand"
                      : "text-foreground/25"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>

        {phase !== "rate" ? (
          <div className="space-y-3 pt-1">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink placeholder:text-foreground/40 focus:outline-none focus:border-emerald-brand/40"
              />
              <input
                type="email"
                placeholder="Email for a reply (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink placeholder:text-foreground/40 focus:outline-none focus:border-emerald-brand/40"
              />
            </div>
            <textarea
              placeholder={
                rating > 0 && rating < 4
                  ? "Tell us what we can do better"
                  : "Anything you'd like to add?"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink placeholder:text-foreground/40 resize-none focus:outline-none focus:border-emerald-brand/40"
            />
            {error ? (
              <p className="text-xs text-clay">{error}</p>
            ) : null}
            <button
              type="button"
              onClick={submit}
              disabled={phase === "submitting" || rating < 1}
              className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {phase === "submitting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {phase === "submitting" ? "Sending…" : "Send feedback"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
