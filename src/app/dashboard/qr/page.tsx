"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Download, Copy } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export default function QRPage() {
  const [rooms, setRooms] = useState<Array<{ id: string; number: string; code: string }>>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [qr, setQr] = useState<{ dataUrl: string; guestUrl: string } | null>(null);

  useEffect(() => {
    async function loadRooms() {
      const response = await fetch("/api/rooms", { cache: "no-store" });
      const data = await response.json();
      const roomList = data.rooms ?? [];
      setRooms(roomList);
      if (roomList[0]?.id) {
        setSelectedRoomId(roomList[0].id);
      }
    }
    loadRooms();
  }, []);

  useEffect(() => {
    async function loadQr() {
      if (!selectedRoomId) return;
      const response = await fetch(`/api/qr/room/${selectedRoomId}`);
      const data = await response.json();
      setQr({ dataUrl: data.dataUrl, guestUrl: data.guestUrl });
    }
    loadQr();
  }, [selectedRoomId]);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Hotel · access"
        title="QR codes"
        description="Generate printable QR codes that open the guest experience for each room."
      />

      <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Room
          </h3>
          <Select value={selectedRoomId} onChange={(event) => setSelectedRoomId(event.target.value)}>
            <option value="">Select room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.number} ({room.code})
              </option>
            ))}
          </Select>

          <div className="space-y-2 pt-2">
            <a href={qr?.dataUrl ?? "#"} download="room-qr.png" className="block">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={!qr?.dataUrl}>
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
            </a>
            <Button
              className="w-full gap-2"
              variant="outline"
              disabled={!qr?.guestUrl}
              onClick={() => {
                if (qr?.guestUrl) {
                  navigator.clipboard.writeText(qr.guestUrl);
                }
              }}
            >
              <Copy className="h-4 w-4" />
              Copy guest link
            </Button>
          </div>
        </div>

        <div className="card-surface p-8 min-h-[480px] flex flex-col items-center justify-center gap-4">
          {qr?.dataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.dataUrl}
                alt="Room QR code"
                className="h-72 w-72 rounded-xl border border-[color:var(--border)] p-3 bg-background"
              />
              <p className="text-xs text-foreground/55 break-all text-center max-w-xl font-mono">
                {qr.guestUrl}
              </p>
            </>
          ) : (
            <p className="text-foreground/50 text-sm">Select a room to generate a QR code.</p>
          )}
        </div>
      </div>
    </div>
  );
}
