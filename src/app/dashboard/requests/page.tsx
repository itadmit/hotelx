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
import { Search, MoreHorizontal, Clock, Plus, ArrowDownToLine } from "lucide-react";

export default function RequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      notes: string | null;
      createdAt: string;
      room: { id: string; number: string };
      service: { id: string; name: string };
      assignee: { id: string; name: string | null } | null;
    }>
  >([]);
  const [rooms, setRooms] = useState<Array<{ id: string; number: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({ roomId: "", serviceId: "", notes: "" });
  const [search, setSearch] = useState("");

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
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
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

  const filteredRequests = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return requests;
    return requests.filter(
      (request) =>
        request.room.number.toLowerCase().includes(text) ||
        request.service.name.toLowerCase().includes(text)
    );
  }, [requests, search]);

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
          <Button variant="ghost" size="sm" className="h-8 text-xs rounded-md bg-background font-medium">
            Board
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs rounded-md text-foreground/50">
            List
          </Button>
        </div>
      </div>

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
                  {filteredRequests.filter((request) => request.status === col.status).length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/40">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredRequests
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
    </div>
  );
}
