"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, Plus, QrCode, Download, Trash2 } from "lucide-react";
import Link from "next/link";

export default function RoomsPage() {
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedQrRoomId, setSelectedQrRoomId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<
    Array<{
      id: string;
      number: string;
      type: string | null;
      status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
      code: string;
      _count: { requests: number };
    }>
  >([]);
  const [qrData, setQrData] = useState<{ dataUrl: string; guestUrl: string } | null>(
    null
  );
  const [newRoom, setNewRoom] = useState({ number: "", type: "Standard" });
  const [loading, setLoading] = useState(true);

  async function loadRooms() {
    setLoading(true);
    const response = await fetch("/api/rooms", { cache: "no-store" });
    const data = await response.json();
    setRooms(data.rooms ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function createRoom() {
    if (!newRoom.number) return;
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoom),
    });
    setNewRoom({ number: "", type: "Standard" });
    setIsAddRoomOpen(false);
    await loadRooms();
  }

  async function removeRoom(roomId: string) {
    await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
    await loadRooms();
  }

  async function openQr(roomId: string) {
    setSelectedQrRoomId(roomId);
    const response = await fetch(`/api/qr/room/${roomId}`);
    const data = await response.json();
    setQrData({ dataUrl: data.dataUrl, guestUrl: data.guestUrl });
  }

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((room) => room.number.toLowerCase().includes(q));
  }, [rooms, search]);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Hotel · inventory"
        title="Rooms"
        description="Room numbers, QR codes, and status — tied to your live database."
      >
        <Button
          onClick={() => setIsAddRoomOpen(true)}
          className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90 rounded-md"
        >
          <Plus className="h-3.5 w-3.5" />
          Add room
        </Button>
      </DashboardPageHeader>

      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add room</DialogTitle>
            <DialogDescription>Add a room to your hotel inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Room number</Label>
              <Input
                placeholder="e.g. 405"
                value={newRoom.number}
                onChange={(event) =>
                  setNewRoom((prev) => ({ ...prev, number: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Room type</Label>
              <Select
                value={newRoom.type}
                onChange={(event) =>
                  setNewRoom((prev) => ({ ...prev, type: event.target.value }))
                }
              >
                <option>Standard</option>
                <option>Single</option>
                <option>Double</option>
                <option>Suite</option>
                <option>Deluxe</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createRoom}>Add room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedQrRoomId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQrRoomId(null);
            setQrData(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Room QR code</DialogTitle>
            <DialogDescription>Scan to test or download for print.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            {qrData?.dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrData.dataUrl} alt="Room QR code" className="h-56 w-56 rounded-md border border-[color:var(--border)] p-2" />
            ) : (
              <QrCode className="h-20 w-20 text-foreground/40" />
            )}
          </div>
          <p className="text-xs text-foreground/55 break-all font-mono">{qrData?.guestUrl}</p>
          <DialogFooter className="sm:justify-center">
            <a href={qrData?.dataUrl ?? "#"} download="room-qr.png" className="w-full">
              <Button variant="outline" className="w-full" disabled={!qrData?.dataUrl}>
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-[color:var(--border)] flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search room number…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 bg-surface border border-[color:var(--border)] rounded-md focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>
          <div className="text-sm text-foreground/55 font-mono">
            {filteredRooms.length} rooms
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left">
            <thead className="bg-surface/80 text-foreground/50 font-mono text-[10px] uppercase tracking-[0.14em]">
              <tr>
                <th className="px-6 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Requests</th>
                <th className="px-4 py-3 font-medium">QR</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-foreground/55" colSpan={7}>
                    Loading rooms…
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-foreground/55" colSpan={7}>
                    No rooms found. Add one to get started.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-3">
                      <Link
                        href={`/dashboard/rooms/${room.id}`}
                        className="font-medium text-ink hover:text-primary"
                      >
                        {room.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground/80 bg-surface px-2 py-0.5 rounded-md border border-[color:var(--border)]">
                        {room.type ?? "Standard"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={room.status === "ACTIVE" ? "default" : "secondary"}>
                        {room.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/55 font-mono">
                      {room._count.requests}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 text-primary hover:bg-primary/10 rounded-md"
                        onClick={() => openQr(room.id)}
                      >
                        <QrCode className="h-4 w-4" /> View
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/45 font-mono text-xs">
                      {room.code}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground/40 hover:text-clay rounded-md"
                        onClick={() => removeRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
