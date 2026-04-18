"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/components/notifications/useNotifications";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

const ENDPOINTS = {
  list: "/api/notifications?take=30",
  stream: "/api/notifications/stream",
  read: (id: string) => `/api/notifications/${id}/read`,
  readAll: "/api/notifications/read-all",
};

export function NotificationsBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { items, unreadCount, loading, markRead, markAllRead } =
    useNotifications(ENDPOINTS);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 rounded-md flex items-center justify-center hover:bg-surface text-foreground/70"
      >
        <Bell className="h-4.5 w-4.5" strokeWidth={2} />
        {unreadCount > 0 ? (
          <span className="absolute top-1.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-clay text-white text-[10px] font-semibold leading-none flex items-center justify-center ring-2 ring-background">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-lg bg-background border border-[color:var(--border)] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
          <NotificationsPanel
            items={items}
            loading={loading}
            onMarkAllRead={markAllRead}
            onItemClick={(n) => {
              void markRead(n.id);
              setOpen(false);
              if (n.href) router.push(n.href);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
