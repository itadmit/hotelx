"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardPageLoading } from "@/components/dashboard/DashboardPageLoading";

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

  async function loadData(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) {
      setIsInitialLoading(true);
    }
    setLoading(true);
    try {
      const [analyticsRes, reqRes, roomsRes, servicesRes] = await Promise.all([
        fetch("/api/analytics/overview", { cache: "no-store" }),
        fetch("/api/requests", { cache: "no-store" }),
        fetch("/api/rooms", { cache: "no-store" }),
        fetch("/api/services", { cache: "no-store" }),
      ]);

      const analyticsData = await analyticsRes.json();
      const reqData = await reqRes.json();
      const roomData = await roomsRes.json();
      const serviceData = await servicesRes.json();

      setStats(analyticsData.stats ?? null);
      setRequests(reqData.requests ?? []);
      setRooms(roomData.rooms ?? []);
      setServices(serviceData.services ?? []);
    } finally {
      setLoading(false);
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }

  async function importDemoData() {
    await fetch("/api/demo/seed", { method: "POST" });
    await loadData();
  }

  async function resetHotelData() {
    await fetch("/api/demo/reset", { method: "POST" });
    await loadData();
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
            onClick={importDemoData}
            className="gap-2 h-9 text-xs"
          >
            <Database className="h-3.5 w-3.5" />
            Import demo
          </Button>
          <Button
            variant="outline"
            onClick={resetHotelData}
            className="gap-2 h-9 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
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
