"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ConciergeBell,
  Loader2,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

type ActiveRequest = {
  id: string;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | string;
  createdAt: string;
  service: { name: string; estimatedTime: string | null };
};

type Props = {
  hotelSlug: string;
  roomCode: string;
};

function statusMeta(status: string) {
  if (status === "IN_PROGRESS") {
    return {
      label: "Preparing",
      pillClass: "bg-amber-soft text-amber-brand",
      Icon: Loader2,
      iconSpin: true,
    };
  }
  if (status === "COMPLETED") {
    return {
      label: "Delivered",
      pillClass: "bg-emerald-soft text-emerald-brand",
      Icon: CircleCheck,
      iconSpin: false,
    };
  }
  return {
    label: "Received",
    pillClass: "bg-[#e3eadf] text-emerald-brand",
    Icon: ConciergeBell,
    iconSpin: false,
  };
}

function shortRelativeTime(input: string): string {
  const then = new Date(input).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.round((now - then) / 1000));
  if (diffSec < 60) return "just now";
  const min = Math.round(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

function RequestRow({
  req,
  hotelSlug,
  roomCode,
}: {
  req: ActiveRequest;
  hotelSlug: string;
  roomCode: string;
}) {
  const meta = statusMeta(req.status);
  const { Icon } = meta;
  return (
    <Link
      href={`/g/${hotelSlug}/${roomCode}/request/${req.id}`}
      prefetch={false}
      className="group flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[color:var(--border)] bg-card hover:border-emerald-brand/25 transition-colors"
    >
      <span
        className={`shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg ${meta.pillClass}`}
      >
        <Icon
          className={`h-4 w-4 ${meta.iconSpin ? "animate-spin" : ""}`}
          strokeWidth={2}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{req.service.name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-foreground/55">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono uppercase tracking-[0.12em] text-[9px] ${meta.pillClass}`}
          >
            {meta.label}
          </span>
          <span className="font-mono">{shortRelativeTime(req.createdAt)}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors shrink-0" />
    </Link>
  );
}

function StripShell({ children }: { children: React.ReactNode }) {
  return <section className="px-5 mt-6">{children}</section>;
}

export function ActiveRequestsStrip({ hotelSlug, roomCode }: Props) {
  const [items, setItems] = useState<ActiveRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const url = useMemo(
    () =>
      `/api/public/requests?hotelSlug=${encodeURIComponent(
        hotelSlug
      )}&roomCode=${encodeURIComponent(roomCode)}`,
    [hotelSlug, roomCode]
  );

  const streamUrl = useMemo(
    () =>
      `/api/public/notifications/stream?hotelSlug=${encodeURIComponent(
        hotelSlug
      )}&roomCode=${encodeURIComponent(roomCode)}`,
    [hotelSlug, roomCode]
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          if (!cancelled) setLoadError(true);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setItems((data.requests as ActiveRequest[]) ?? []);
        setLoadError(false);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const source = new EventSource(streamUrl);

    const refetch = async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setItems((data.requests as ActiveRequest[]) ?? []);
        setLoadError(false);
      } catch {
        // Silent: SSE refetch failures will be reconciled on next refresh.
      }
    };

    source.addEventListener("notification", () => {
      void refetch();
    });

    return () => {
      source.close();
    };
  }, [streamUrl, url]);

  async function retry() {
    setLoaded(false);
    setLoadError(false);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        setLoadError(true);
        return;
      }
      const data = await res.json();
      setItems((data.requests as ActiveRequest[]) ?? []);
    } catch {
      setLoadError(true);
    } finally {
      setLoaded(true);
    }
  }

  // Skeleton — reserves vertical space so the rest of the home grid
  // doesn't jump down when requests arrive.
  if (!loaded) {
    return (
      <StripShell>
        <div className="flex items-center justify-between mb-2">
          <p className="eyebrow">Your activity</p>
        </div>
        <div className="h-16 rounded-xl border border-[color:var(--border)] bg-card animate-pulse" />
      </StripShell>
    );
  }

  if (loadError && items.length === 0) {
    return (
      <StripShell>
        <div className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-[color:var(--border)] bg-surface text-foreground/70">
          <span className="flex items-center gap-2 text-xs">
            <AlertCircle className="h-3.5 w-3.5 text-clay shrink-0" />
            Couldn&rsquo;t load your recent requests.
          </span>
          <button
            type="button"
            onClick={() => void retry()}
            className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </StripShell>
    );
  }

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <StripShell>
        <div className="flex items-center justify-between mb-2">
          <p className="eyebrow">Your activity</p>
          <span className="font-mono text-[10px] text-foreground/45">1 open</span>
        </div>
        <RequestRow req={items[0]} hotelSlug={hotelSlug} roomCode={roomCode} />
      </StripShell>
    );
  }

  // 2+ requests — collapsible so long lists don't dominate the home.
  const preview = items[0];
  const previewMeta = statusMeta(preview.status);
  const { Icon: PreviewIcon } = previewMeta;

  return (
    <StripShell>
      <div className="flex items-center justify-between mb-2">
        <p className="eyebrow">Your activity</p>
        <span className="font-mono text-[10px] text-foreground/45">
          {items.length} open
        </span>
      </div>
      <div className="rounded-xl border border-[color:var(--border)] bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-background/40 transition-colors text-left"
        >
          <span
            className={`shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg ${previewMeta.pillClass}`}
          >
            <PreviewIcon
              className={`h-4 w-4 ${previewMeta.iconSpin ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink truncate">
              {items.length} ongoing requests
            </p>
            <p className="mt-0.5 text-[11px] text-foreground/55 truncate">
              Latest: {preview.service.name} · {shortRelativeTime(preview.createdAt)}
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-foreground/40 shrink-0 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </button>
        {expanded ? (
          <div className="border-t border-[color:var(--border)] p-2 space-y-2">
            {items.map((req) => (
              <RequestRow
                key={req.id}
                req={req}
                hotelSlug={hotelSlug}
                roomCode={roomCode}
              />
            ))}
          </div>
        ) : null}
      </div>
    </StripShell>
  );
}
