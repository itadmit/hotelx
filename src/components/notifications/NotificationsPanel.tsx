"use client";

import {
  Bell,
  CheckCheck,
  CircleDollarSign,
  CircleAlert,
  ConciergeBell,
  Sparkles,
  UserCheck,
  Inbox,
} from "lucide-react";
import { relativeTime, type NotificationItem } from "./useNotifications";

const TYPE_ICON: Record<string, typeof Bell> = {
  REQUEST_CREATED: ConciergeBell,
  REQUEST_STATUS_CHANGED: Sparkles,
  REQUEST_ASSIGNED: UserCheck,
  REQUEST_COMPLETED: CheckCheck,
  PAYMENT_PAID: CircleDollarSign,
  PAYMENT_FAILED: CircleAlert,
};

type Props = {
  items: NotificationItem[];
  loading: boolean;
  onItemClick: (n: NotificationItem) => void;
  onMarkAllRead: () => void;
  variant?: "popover" | "drawer";
};

export function NotificationsPanel({
  items,
  loading,
  onItemClick,
  onMarkAllRead,
  variant = "popover",
}: Props) {
  const hasUnread = items.some((i) => !i.readAt);

  return (
    <div
      className={
        variant === "drawer"
          ? "flex flex-col h-full"
          : "flex flex-col max-h-[28rem]"
      }
    >
      {/* Header — extra right padding in drawer so absolute close button stays tappable */}
      <div
        className={
          "flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)] " +
          (variant === "drawer" ? "pr-14" : "")
        }
      >
        <div>
          <p className="font-display text-base text-ink leading-none">
            Notifications
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50 mt-1">
            {items.length === 0
              ? "all caught up"
              : `${items.length} item${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {hasUnread ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[12px] text-foreground/70 hover:text-ink underline-offset-4 hover:underline transition-colors"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-foreground/55">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="inline-flex h-12 w-12 rounded-full bg-surface items-center justify-center mb-3">
              <Inbox className="h-5 w-5 text-foreground/40" strokeWidth={1.6} />
            </span>
            <p className="text-sm text-ink">You&apos;re all caught up.</p>
            <p className="text-xs text-foreground/55 mt-1">
              New activity will land here in real time.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--border)]/70">
            {items.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              const isUnread = !n.readAt;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => onItemClick(n)}
                    className="w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-surface/70 transition-colors"
                  >
                    <span
                      className={
                        "shrink-0 mt-0.5 h-8 w-8 rounded-full flex items-center justify-center " +
                        (isUnread
                          ? "bg-primary/12 text-primary"
                          : "bg-surface text-foreground/55")
                      }
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-start gap-2">
                        <span
                          className={
                            "block text-sm leading-snug " +
                            (isUnread
                              ? "text-ink font-medium"
                              : "text-foreground/75")
                          }
                        >
                          {n.title}
                        </span>
                        {isUnread ? (
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-clay shrink-0" />
                        ) : null}
                      </span>
                      {n.body ? (
                        <span className="block text-xs text-foreground/55 mt-0.5 line-clamp-2">
                          {n.body}
                        </span>
                      ) : null}
                      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/45 mt-1">
                        {relativeTime(n.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
