"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ConciergeBell,
  Loader2,
  CircleCheck,
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

export function ActiveRequestsStrip({ hotelSlug, roomCode }: Props) {
  const [items, setItems] = useState<ActiveRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  const url = useMemo(
    () =>
      `/api/public/requests?hotelSlug=${encodeURIComponent(
        hotelSlug
      )}&roomCode=${encodeURIComponent(roomCode)}`,
    [hotelSlug, roomCode]
  );

  // Subscribe to the same SSE stream the bell uses so the strip updates the
  // moment a request is created or its status changes — no extra polling.
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
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setItems((data.requests as ActiveRequest[]) ?? []);
      } catch {
        // ignore aborts / network errors
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
      } catch {
        // ignore
      }
    };

    source.addEventListener("notification", () => {
      void refetch();
    });

    return () => {
      source.close();
    };
  }, [streamUrl, url]);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="px-5 mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="eyebrow">Your activity</p>
        <span className="font-mono text-[10px] text-foreground/45">
          {items.length} open
        </span>
      </div>
      <div className="space-y-2">
        {items.map((req) => {
          const meta = statusMeta(req.status);
          const { Icon } = meta;
          return (
            <Link
              key={req.id}
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
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink truncate">
                    {req.service.name}
                  </p>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-foreground/55">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono uppercase tracking-[0.12em] text-[9px] ${meta.pillClass}`}
                  >
                    {meta.label}
                  </span>
                  <span className="font-mono">
                    {shortRelativeTime(req.createdAt)}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-brand transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
