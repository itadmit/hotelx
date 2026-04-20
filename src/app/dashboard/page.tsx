"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Database,
  RotateCcw,
  ClipboardList,
  CheckCircle2,
  BedDouble,
  Sparkles,
  ArrowUpRight,
  Clock,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardPageLoading } from "@/components/dashboard/DashboardPageLoading";
import { GuestInfoOnboarding } from "@/components/dashboard/GuestInfoOnboarding";
import { fetchDashboardBundle } from "@/lib/dashboard-bundle";
import type { GuestInfoCompletionStatus } from "@/lib/guest-info-completion";
import { FirstTimeWelcomeModal } from "@/components/dashboard/FirstTimeWelcomeModal";
import {
  DemoImportDialog,
  type ImportResult,
} from "@/components/dashboard/DemoImportDialog";

type RequestStatus = "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const STATUS_LABEL: Record<RequestStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<RequestStatus, string> = {
  NEW: "bg-primary/10 text-primary border-primary/20",
  IN_PROGRESS: "bg-amber-soft text-amber-brand border-[color:var(--amber)]/22",
  COMPLETED: "bg-[color:var(--surface-2)] text-foreground/70 border-[color:var(--border)]",
  CANCELLED: "bg-[#f3d8cf] text-clay border-[color:var(--clay)]/22",
};

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rooms, setRooms] = useState<Array<{ id: string; number: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      status: RequestStatus;
      createdAt: string;
      room: { number: string };
      service: { name: string };
    }>
  >([]);
  const [stats, setStats] = useState<{
    totalRequests: number;
    openRequests: number;
    completedRequests: number;
    roomsCount: number;
    servicesCount: number;
    avgResponseMinutes: number | null;
    topService: string | null;
  } | null>(null);
  const [form, setForm] = useState({ roomId: "", serviceId: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | "reset">(null);
  const [actionRunning, setActionRunning] = useState<null | "reset">(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [guestCompletion, setGuestCompletion] =
    useState<GuestInfoCompletionStatus | null>(null);
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    title: string;
    detail?: string;
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(payload: {
    tone: "success" | "error";
    title: string;
    detail?: string;
  }) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(payload);
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  async function loadData(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) {
      setIsInitialLoading(true);
    }
    setLoading(true);
    try {
      const bundle = await fetchDashboardBundle({
        reuseInitialPass: isInitial,
      });

      setStats(bundle.stats ?? null);
      setRequests(bundle.requests ?? []);
      setRooms(bundle.rooms ?? []);
      setServices(bundle.services ?? []);
      setGuestCompletion(bundle.guestCompletion);
    } finally {
      setLoading(false);
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }

  function handleImportSuccess(result: ImportResult | null) {
    const detailParts = [
      typeof result?.amenities === "number"
        ? `${result.amenities} amenities`
        : null,
      typeof result?.newServices === "number"
        ? `${result.newServices} new services`
        : null,
      typeof result?.newRooms === "number"
        ? `${result.newRooms} new rooms`
        : null,
    ].filter(Boolean);
    showToast({
      tone: "success",
      title: "Plaza Hotel demo imported",
      detail:
        detailParts.length > 0
          ? `${detailParts.join(" · ")}.`
          : "Your dashboard now shows real-looking data.",
    });
    loadData();
  }

  async function runResetHotelData() {
    setActionRunning("reset");
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast({
          tone: "error",
          title: "Could not reset hotel data",
          detail:
            data?.detail ??
            data?.error ??
            "Please try again in a moment.",
        });
        return;
      }
      const r = data?.result ?? {};
      const removed =
        (r.removedRequests ?? 0) +
        (r.removedServices ?? 0) +
        (r.removedCategories ?? 0) +
        (r.removedRooms ?? 0) +
        (r.removedAmenities ?? 0);
      showToast({
        tone: "success",
        title: "Hotel data reset",
        detail:
          removed > 0
            ? `${removed} records removed across rooms, services and categories.`
            : "Nothing to remove — your hotel was already empty.",
      });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("hotelx:welcome-dismissed");
        // After a reset the onboarding nudge becomes relevant again.
        try {
          window.sessionStorage.removeItem(
            "hotelx:guest-info-onboarding-dismissed"
          );
        } catch {
          // ignore
        }
      }
      await loadData();
    } catch {
      showToast({
        tone: "error",
        title: "Network error",
        detail: "Couldn't reach the server. Please try again.",
      });
    } finally {
      setActionRunning(null);
      setConfirmAction(null);
    }
  }

  async function createRequest() {
    if (!form.roomId || !form.serviceId) return;
    setSubmitting(true);
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setIsCreateOpen(false);
    setForm({ roomId: "", serviceId: "", notes: "" });
    await loadData();
  }

  useEffect(() => {
    loadData({ initial: true });
  }, []);

  const latestRequests = requests.slice(0, 8);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <DashboardPageLoading variant="overview" />
      ) : (
        <>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            {today} · live
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mt-2 tracking-tight">
            Good day at the front desk.
          </h1>
          <p className="text-sm text-foreground/60 mt-1.5">
            Real-time view of your operation — every request, room and service.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            disabled={actionRunning !== null || importDialogOpen}
            className="gap-2 h-9 text-xs"
          >
            <Database className="h-3.5 w-3.5" />
            Import demo
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmAction("reset")}
            disabled={actionRunning !== null}
            className="gap-2 h-9 text-xs"
          >
            {actionRunning === "reset" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            {actionRunning === "reset" ? "Resetting…" : "Reset"}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New request
          </Button>
        </div>
      </div>

      {/* Onboarding nudge — only renders if any of the 4 guest-info pieces are missing. */}
      <GuestInfoOnboarding completion={guestCompletion} loading={loading} />

      {/* KPI Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open requests"
          value={stats?.openRequests ?? 0}
          icon={ClipboardList}
          accent="emerald"
          delta={stats ? `${stats.totalRequests} total` : undefined}
          loading={loading}
        />
        <KpiCard
          label="Completed today"
          value={stats?.completedRequests ?? 0}
          icon={CheckCircle2}
          accent="sage"
          delta={
            stats?.avgResponseMinutes
              ? `~${stats.avgResponseMinutes}m avg`
              : undefined
          }
          loading={loading}
        />
        <KpiCard
          label="Active rooms"
          value={stats?.roomsCount ?? 0}
          icon={BedDouble}
          accent="amber"
          delta={
            stats ? `${stats.servicesCount} services` : undefined
          }
          loading={loading}
        />
        <KpiCard
          label="Top service"
          value={stats?.topService ?? "—"}
          icon={Sparkles}
          accent="clay"
          delta={stats?.topService ? "most requested" : undefined}
          loading={loading}
          isText
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent requests */}
        <section className="lg:col-span-2 card-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
            <div>
              <h2 className="text-base font-medium text-ink">Recent activity</h2>
              <p className="text-xs text-foreground/55 mt-0.5">
                Live updates from production data
              </p>
            </div>
            <a
              href="/dashboard/requests"
              className="group inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-all"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-sm text-foreground/55">
              Loading recent requests…
            </div>
          ) : latestRequests.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <ClipboardList className="h-5 w-5" />
              </div>
              <p className="text-sm text-foreground/70">No requests yet</p>
              <p className="text-xs text-foreground/50 mt-1">
                Import demo data to see how the board comes alive.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {latestRequests.map((request) => {
                const time = new Date(request.createdAt);
                return (
                  <li
                    key={request.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-background/60 transition-colors"
                  >
                    <div className="hidden sm:flex h-9 w-9 shrink-0 rounded-md bg-surface border border-[color:var(--border)] items-center justify-center font-mono text-[11px] text-foreground/70">
                      {request.room.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        <span className="sm:hidden text-foreground/55 font-mono text-[11px] mr-1.5">
                          {request.room.number}
                        </span>
                        {request.service.name}
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-foreground/50 mt-0.5 font-mono">
                        <Clock className="h-3 w-3" />
                        {time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <span className="text-foreground/30">·</span>
                        {time.toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.12em]",
                        STATUS_STYLES[request.status]
                      )}
                    >
                      {request.status === "NEW" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                      {STATUS_LABEL[request.status]}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Right column */}
        <aside className="space-y-4">
          <div className="card-surface border-white/15 bg-primary p-5 text-primary-foreground shadow-sm">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/75">
              <TrendingUp className="h-3 w-3" />
              Performance
            </div>
            <div className="mt-3">
              <p className="numeral text-5xl text-primary-foreground">
                {stats?.avgResponseMinutes ?? "—"}
                <span className="text-xl text-primary-foreground/65 ml-1">
                  min
                </span>
              </p>
              <p className="text-xs text-primary-foreground/75 mt-1">
                Average response time
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary-foreground/65">
                  Total
                </p>
                <p className="numeral text-2xl text-primary-foreground mt-1">
                  {stats?.totalRequests ?? 0}
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary-foreground/65">
                  Services
                </p>
                <p className="numeral text-2xl text-primary-foreground mt-1">
                  {stats?.servicesCount ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Quick actions
            </p>
            <div className="mt-3 space-y-2">
              <QuickAction
                href="/dashboard/rooms"
                icon={BedDouble}
                title="Manage rooms"
                desc="Add, edit, or remove guest rooms"
              />
              <QuickAction
                href="/dashboard/services"
                icon={Sparkles}
                title="Configure services"
                desc="Menus, amenities & pricing"
              />
              <QuickAction
                href="/dashboard/qr"
                icon={ClipboardList}
                title="Print QR codes"
                desc="Per-room access for guests"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Create dialog (kept) */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Request</DialogTitle>
            <DialogDescription>Open a request for a room.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Room</Label>
              <Select
                value={form.roomId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, roomId: event.target.value }))
                }
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.number}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Service</Label>
              <Select
                value={form.serviceId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, serviceId: event.target.value }))
                }
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Notes</Label>
              <Input
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
                placeholder="Optional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={submitting} onClick={createRequest}>
              {submitting ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmAction === "reset"}
        onOpenChange={(open) => {
          if (!open && actionRunning === null) setConfirmAction(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3d8cf] text-clay">
                <AlertTriangle className="h-4 w-4" />
              </span>
              Reset all hotel data?
            </DialogTitle>
            <DialogDescription className="pt-2 text-foreground/70">
              This will permanently delete <strong>all rooms, services,
              categories, amenities, hotel info and requests</strong> for your
              hotel. Guests scanning your QR codes will see an empty menu until
              you add new content. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
              disabled={actionRunning !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={runResetHotelData}
              disabled={actionRunning !== null}
              className="gap-2 bg-clay text-white hover:bg-clay/90"
            >
              {actionRunning === "reset" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {actionRunning === "reset" ? "Resetting…" : "Yes, reset everything"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DemoImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={handleImportSuccess}
      />

      <FirstTimeWelcomeModal
        hotelIsEmpty={
          !isInitialLoading &&
          rooms.length === 0 &&
          services.length === 0
        }
        onRequestImport={() => setImportDialogOpen(true)}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[80] w-[min(360px,calc(100vw-2rem))] animate-[fadeInUp_0.18s_ease-out]"
        >
          <div
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg",
              toast.tone === "success"
                ? "border-primary/25"
                : "border-clay/30"
            )}
          >
            <span
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                toast.tone === "success"
                  ? "bg-primary/10 text-primary"
                  : "bg-[#f3d8cf] text-clay"
              )}
            >
              {toast.tone === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              {toast.detail && (
                <p className="mt-0.5 text-xs text-foreground/70">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xs text-foreground/50 hover:text-ink transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

/* ----- KPI Card ----- */

const ACCENT_STYLES = {
  emerald: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    bar: "bg-primary",
  },
  amber: {
    iconBg: "bg-amber-soft",
    iconText: "text-amber-brand",
    bar: "bg-amber-brand",
  },
  clay: {
    iconBg: "bg-[#f3d8cf]",
    iconText: "text-clay",
    bar: "bg-clay",
  },
  sage: {
    iconBg: "bg-[color:var(--surface-2)]",
    iconText: "text-sage",
    bar: "bg-sage",
  },
} as const;

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  delta,
  loading,
  isText = false,
}: {
  label: string;
  value: number | string;
  icon: typeof ClipboardList;
  accent: keyof typeof ACCENT_STYLES;
  delta?: string;
  loading?: boolean;
  isText?: boolean;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="card-surface p-4 sm:p-5 relative overflow-hidden">
      <span
        className={cn(
          "absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full",
          a.bar
        )}
      />
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
          {label}
        </p>
        <div
          className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center",
            a.iconBg,
            a.iconText
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-20 rounded bg-[color:var(--surface-2)] animate-pulse" />
        ) : isText ? (
          <p className="font-display text-xl sm:text-2xl text-ink leading-tight truncate">
            {value}
          </p>
        ) : (
          <p className="numeral text-3xl sm:text-4xl text-ink leading-none">
            {value}
          </p>
        )}
      </div>
      {delta && !loading && (
        <p className="text-[11px] text-foreground/50 mt-2 font-mono">{delta}</p>
      )}
    </div>
  );
}

/* ----- Quick Action ----- */

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof ClipboardList;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 p-2.5 -mx-1 rounded-md hover:bg-background/70 transition-colors"
    >
      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{title}</p>
        <p className="text-[11px] text-foreground/50 truncate">{desc}</p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
    </a>
  );
}
