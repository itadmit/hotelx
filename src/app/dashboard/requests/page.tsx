"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { RequestsBoardSkeleton } from "@/components/dashboard/RequestsBoardSkeleton";
import { Search, MoreHorizontal, Clock, Plus, ArrowDownToLine } from "lucide-react";

export default function RequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      notes: string | null;
      createdAt: string;
      room: { id: string; number: string };
      service: {
        id: string;
        name: string;
        category?: { id: string; name: string } | null;
      };
      assignee: { id: string; name: string | null } | null;
    }>
  >([]);
  const [rooms, setRooms] = useState<Array<{ id: string; number: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({ roomId: "", serviceId: "", notes: "" });
  const [search, setSearch] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const columns: Array<{
    title: string;
    status: "NEW" | "IN_PROGRESS" | "COMPLETED";
    dotClass: string;
  }> = [
    { title: "New", status: "NEW", dotClass: "bg-primary" },
    { title: "In progress", status: "IN_PROGRESS", dotClass: "bg-amber-brand" },
    { title: "Completed", status: "COMPLETED", dotClass: "bg-sage" },
  ];

  async function loadData() {
    try {
      const [requestsRes, roomsRes, servicesRes] = await Promise.all([
        fetch("/api/requests", { cache: "no-store" }),
        fetch("/api/rooms", { cache: "no-store" }),
        fetch("/api/services", { cache: "no-store" }),
      ]);
      const requestsData = await requestsRes.json();
      const roomsData = await roomsRes.json();
      const servicesData = await servicesRes.json();
      setRequests(requestsData.requests ?? []);
      setRooms(roomsData.rooms ?? []);
      setServices(servicesData.services ?? []);
    } finally {
      setIsInitialLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(loadData, 15000);
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
      if (document.visibilityState === "visible") {
        loadData();
        start();
      } else {
        stop();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  async function createRequest() {
    if (!form.roomId || !form.serviceId) return;
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ roomId: "", serviceId: "", notes: "" });
    setIsCreateOpen(false);
    await loadData();
  }

  async function updateStatus(requestId: string, status: "NEW" | "IN_PROGRESS" | "COMPLETED") {
    await fetch(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadData();
  }

  const searchedRequests = useMemo(() => {
    const text = search.trim().toLowerCase();
    return requests.filter((request) => {
      const departmentName = request.service.category?.name ?? "General";
      if (!text) return true;
      return (
        request.room.number.toLowerCase().includes(text) ||
        request.service.name.toLowerCase().includes(text) ||
        departmentName.toLowerCase().includes(text)
      );
    });
  }, [requests, search]);

  const departmentTabs = useMemo(() => {
    const unique = new Set<string>();
    for (const request of requests) {
      unique.add(request.service.category?.name ?? "General");
    }
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [requests]);

  const activeDepartmentRequests = useMemo(() => {
    if (selectedDepartment === "all") return searchedRequests;
    return searchedRequests.filter(
      (request) =>
        (request.service.category?.name ?? "General") === selectedDepartment
    );
  }, [searchedRequests, selectedDepartment]);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Workspace · live"
        title="Requests board"
        description="Drag cards between columns to update status — synced with your database."
      >
        <Button variant="outline" className="gap-2 h-9 text-xs rounded-md">
          <ArrowDownToLine className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90 rounded-md"
        >
          <Plus className="h-3.5 w-3.5" />
          Create request
        </Button>
      </DashboardPageHeader>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create request</DialogTitle>
            <DialogDescription>Add a new request to the board.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room">Room</Label>
              <Select
                value={form.roomId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, roomId: event.target.value }))
                }
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.number}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service">Service</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
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
            <Button onClick={createRequest}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isInitialLoading ? (
        <RequestsBoardSkeleton />
      ) : (
        <>
      <div className="card-surface p-2 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <Input
            placeholder="Search by room or service…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10 border-transparent bg-transparent rounded-md focus:bg-background"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <div className="hidden md:block h-6 w-px bg-[color:var(--border)] mx-1" />
          <span className="text-xs text-foreground/50 font-mono uppercase tracking-wider">View</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("board")}
            className={`h-8 text-xs rounded-md ${viewMode === "board" ? "bg-background font-medium text-ink" : "text-foreground/50"}`}
          >
            Board
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-8 text-xs rounded-md ${viewMode === "list" ? "bg-background font-medium text-ink" : "text-foreground/50"}`}
          >
            List
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {departmentTabs.map((department) => {
          const isActive = selectedDepartment === department;
          const label = department === "all" ? "All Departments" : department;
          const count =
            department === "all"
              ? searchedRequests.length
              : searchedRequests.filter(
                  (request) =>
                    (request.service.category?.name ?? "General") === department
                ).length;

          return (
            <Button
              key={department}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDepartment(department)}
              className="h-8 rounded-full text-xs"
            >
              {label}
              <span className="ml-2 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {viewMode === "board" ? (
        <div className="grid md:grid-cols-3 gap-6 h-full items-start">
          {columns.map((col) => (
            <div
              key={col.title}
              className="flex flex-col gap-4"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const requestId = event.dataTransfer.getData("requestId");
                if (requestId) {
                  updateStatus(requestId, col.status);
                }
              }}
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.dotClass}`} />
                  <h3 className="font-medium text-sm text-ink">{col.title}</h3>
                  <span className="bg-surface text-foreground/60 text-[11px] px-2 py-0.5 rounded-full font-mono">
                    {
                      activeDepartmentRequests.filter(
                        (request) => request.status === col.status
                      ).length
                    }
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/40">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {activeDepartmentRequests
                  .filter((request) => request.status === col.status)
                  .map((req) => (
                    <div
                      key={req.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("requestId", req.id)}
                      className="group card-surface p-4 cursor-pointer border border-[color:var(--border)] hover:border-primary/25 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-surface text-ink text-[11px] font-mono px-2 py-1 rounded-md border border-[color:var(--border)]">
                          Room {req.room.number}
                        </div>
                        {req.status === "NEW" && (
                          <div className="bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md">
                            New
                          </div>
                        )}
                      </div>

                      <h4 className="font-medium text-ink mb-1">{req.service.name}</h4>
                      <p className="text-[11px] text-foreground/55 mb-2">
                        {req.service.category?.name ?? "General"}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-foreground/50 mb-4 font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(req.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border)]">
                        <div className="flex items-center gap-2">
                          {!req.assignee ? (
                            <div className="h-6 w-6 rounded-full bg-surface border border-[color:var(--border)] flex items-center justify-center text-foreground/40">
                              <span className="sr-only">Unassigned</span>
                              <Plus className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-primary/15 text-primary border border-[color:var(--border)] flex items-center justify-center text-[10px] font-semibold">
                              {req.assignee.name?.charAt(0) ?? "S"}
                            </div>
                          )}
                          <span className="text-xs text-foreground/55">
                            {req.assignee?.name ?? "Unassigned"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="w-full py-3 rounded-md border border-dashed border-[color:var(--border)] text-sm text-foreground/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add card
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface/80 text-foreground/50 font-mono text-[10px] uppercase tracking-[0.14em]">
                <tr>
                  <th className="px-4 py-3 font-medium">Room</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Assignee</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--border)]">
                {activeDepartmentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{req.room.number}</td>
                    <td className="px-4 py-3 text-sm text-ink">{req.service.name}</td>
                    <td className="px-4 py-3 text-xs text-foreground/60">
                      {req.service.category?.name ?? "General"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{req.status}</td>
                    <td className="px-4 py-3 text-xs text-foreground/60">
                      {req.assignee?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/60">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
