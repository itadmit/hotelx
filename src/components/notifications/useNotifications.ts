"use client";

import { useCallback, useEffect, useState } from "react";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
  metadata?: unknown;
};

type Endpoints = {
  list: string;
  stream: string;
  read: (id: string) => string;
  readAll: string;
};

export function useNotifications(endpoints: Endpoints, enabled = true) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = await fetch(endpoints.list, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  }, [enabled, endpoints.list]);

  useEffect(() => {
    if (!enabled) return;
    void refresh();
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const source = new EventSource(endpoints.stream);

    source.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as NotificationItem;
        setItems((prev) => {
          if (prev.some((p) => p.id === data.id)) return prev;
          return [data, ...prev].slice(0, 50);
        });
        if (!data.readAt) {
          setUnreadCount((c) => c + 1);
        }
      } catch {
        // ignore malformed payloads
      }
    });

    source.onerror = () => {
      // EventSource auto-reconnects; nothing to do here.
    };

    return () => {
      source.close();
    };
  }, [enabled, endpoints.stream]);

  const markRead = useCallback(
    async (id: string) => {
      let decrementUnread = false;
      setItems((prev) => {
        const target = prev.find((p) => p.id === id);
        decrementUnread = Boolean(target && !target.readAt);
        return prev.map((p) =>
          p.id === id && !p.readAt
            ? { ...p, readAt: new Date().toISOString() }
            : p
        );
      });
      if (decrementUnread) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      try {
        await fetch(endpoints.read(id), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
      } catch {
        // optimistic; refresh on next focus
      }
    },
    [endpoints]
  );

  const markAllRead = useCallback(async () => {
    setItems((prev) =>
      prev.map((p) =>
        p.readAt ? p : { ...p, readAt: new Date().toISOString() }
      )
    );
    setUnreadCount(0);
    try {
      await fetch(endpoints.readAll, { method: "POST" });
    } catch {
      // optimistic
    }
  }, [endpoints.readAll]);

  return { items, unreadCount, loading, refresh, markRead, markAllRead };
}

export function relativeTime(input: string): string {
  const then = new Date(input).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.round(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(input).toLocaleDateString();
}
