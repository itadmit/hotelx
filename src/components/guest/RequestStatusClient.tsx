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
