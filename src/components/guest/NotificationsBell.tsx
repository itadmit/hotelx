"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/components/notifications/useNotifications";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

type Props = {
  hotelSlug: string;
  roomCode: string;
};

export function GuestNotificationsBell({ hotelSlug, roomCode }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const endpoints = useMemo(() => {
    const qs = `hotelSlug=${encodeURIComponent(
      hotelSlug
    )}&roomCode=${encodeURIComponent(roomCode)}`;
    return {
      list: `/api/public/notifications?${qs}&take=30`,
      stream: `/api/public/notifications/stream?${qs}`,
      read: (id: string) => `/api/public/notifications/${id}/read?${qs}`,
      readAll: `/api/public/notifications/read-all?${qs}`,
    };
  }, [hotelSlug, roomCode]);

  const { items, unreadCount, loading, markRead, markAllRead, refresh } =
    useNotifications(endpoints);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          setOpen(true);
          void refresh();
        }}
        className="relative h-9 w-9 rounded-full border border-[color:var(--border)] flex items-center justify-center bg-background hover:bg-surface transition-colors"
      >
        <Bell className="h-4 w-4 text-ink" strokeWidth={2} />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-clay text-white text-[10px] font-semibold leading-none flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close notifications"
            className="absolute inset-0 z-0 bg-ink/40 backdrop-blur-sm cursor-default border-0 p-0 appearance-none"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            className="relative z-10 w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl bg-background border border-[color:var(--border)] shadow-[0_-12px_40px_-20px_rgba(31,41,28,0.35)] sm:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)] overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <span className="h-1 w-10 rounded-full bg-foreground/15" />
            </div>
            <NotificationsPanel
              items={items}
              loading={loading}
              variant="drawer"
              onMarkAllRead={markAllRead}
              onItemClick={(n) => {
                void markRead(n.id);
                setOpen(false);
                if (n.href) router.push(n.href);
              }}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-2.5 right-2.5 z-20 h-10 w-10 rounded-full bg-background/90 border border-[color:var(--border)] shadow-sm flex items-center justify-center text-foreground/70 hover:text-ink hover:bg-surface transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
