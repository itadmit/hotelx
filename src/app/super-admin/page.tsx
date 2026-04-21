"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Building2,
  DoorOpen,
  MessageSquare,
  Send,
  Loader2,
  Hotel,
  CalendarDays,
  CheckCircle,
  LogIn,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { IMPERSONATE_LOGIN_EMAIL } from "@/lib/impersonation-constants";

type Stats = {
  users: number;
  hotels: number;
  rooms: number;
  requests: number;
  feedbacks: number;
  emailLogs: number;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  hotel: {
    id: string;
    name: string;
    slug: string;
    _count: { rooms: number; categories: number; requests: number };
  } | null;
};

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [viewingAs, setViewingAs] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [statsRes, usersRes] = await Promise.all([
      fetch("/api/super-admin/stats"),
      fetch("/api/super-admin/users"),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function sendWelcome(userId: string) {
    setSending(userId);
    try {
      const res = await fetch("/api/super-admin/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setSentIds((prev) => new Set(prev).add(userId));
      }
    } finally {
      setSending(null);
    }
  }

  async function viewAsUser(userId: string) {
    setViewingAs(userId);
    try {
      const res = await fetch("/api/super-admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { token?: string };
      if (!data.token) return;
      await signIn("credentials", {
        email: IMPERSONATE_LOGIN_EMAIL,
        password: data.token,
        callbackUrl: "/dashboard",
      });
    } finally {
      setViewingAs(null);
    }
  }

  const statCards = stats
    ? [
        { label: "Users", value: stats.users, icon: Users },
        { label: "Hotels", value: stats.hotels, icon: Building2 },
        { label: "Rooms", value: stats.rooms, icon: DoorOpen },
        { label: "Requests", value: stats.requests, icon: MessageSquare },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-tight text-ink">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          All users, hotels, and activity across HotelX.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card-surface p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="numeral text-2xl text-ink">{s.value}</span>
                </div>
                <p className="mt-3 text-xs text-foreground/55 font-mono uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Users table */}
      <div className="card-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-[color:var(--border)]">
          <h2 className="font-display text-lg text-ink">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-surface/50">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  User
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Hotel
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Activity
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Registered
                </th>
                <th className="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[color:var(--border)] last:border-0 hover:bg-surface/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 rounded-full bg-emerald-soft text-emerald-brand items-center justify-center text-xs font-medium">
                        {(u.name ?? u.email)[0].toUpperCase()}
                      </span>
                      <div>
                        <p className="text-ink font-medium">
                          {u.name ?? "—"}
                        </p>
                        <p className="text-foreground/50 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.hotel ? (
                      <div className="flex items-center gap-2">
                        <Hotel className="h-3.5 w-3.5 text-foreground/40" />
                        <div>
                          <p className="text-ink">{u.hotel.name}</p>
                          <p className="text-foreground/40 font-mono text-[10px]">
                            {u.hotel.slug}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.hotel ? (
                      <div className="flex items-center gap-3 text-xs text-foreground/55">
                        <span>{u.hotel._count.rooms} rooms</span>
                        <span className="text-foreground/25">·</span>
                        <span>{u.hotel._count.categories} categories</span>
                        <span className="text-foreground/25">·</span>
                        <span>{u.hotel._count.requests} requests</span>
                      </div>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-foreground/55 text-xs">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(u.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                      {u.hotel ? (
                        <button
                          type="button"
                          onClick={() => viewAsUser(u.id)}
                          disabled={viewingAs === u.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[color:var(--border)] bg-card text-ink text-xs font-medium hover:bg-surface transition-colors disabled:opacity-50"
                        >
                          {viewingAs === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <LogIn className="h-3 w-3" />
                          )}
                          Open as user
                        </button>
                      ) : null}
                      {sentIds.has(u.id) ? (
                        <span className="inline-flex items-center gap-1 text-emerald-brand text-xs">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Welcome sent
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendWelcome(u.id)}
                          disabled={sending === u.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-brand text-primary-foreground text-xs font-medium hover:bg-ink transition-colors disabled:opacity-50"
                        >
                          {sending === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Send Welcome
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-foreground/40"
                  >
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
