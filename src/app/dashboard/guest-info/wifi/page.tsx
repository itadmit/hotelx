"use client";

import { useEffect, useState } from "react";
import { Wifi, Save, KeyRound } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { GuestInfoTabs } from "@/components/dashboard/GuestInfoTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WifiPage() {
  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiNotes, setWifiNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/hotel/info", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        const info = data.info ?? {};
        setWifiName(info.wifiName ?? "");
        setWifiPassword(info.wifiPassword ?? "");
        setWifiNotes(info.wifiNotes ?? "");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/hotel/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wifiName: wifiName || null,
          wifiPassword: wifiPassword || null,
          wifiNotes: wifiNotes || null,
        }),
      });
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Guest info · concierge basics"
        title="Wi-Fi credentials"
        description="What guests see when they tap “Wi-Fi” on their room screen."
      >
        <GuestInfoTabs />
      </DashboardPageHeader>

      <div className="grid lg:grid-cols-[1fr_22rem] gap-6 items-start">
        <div className="card-surface p-5 sm:p-6 space-y-5">
          <div className="grid gap-2">
            <Label>Network name (SSID)</Label>
            <Input
              placeholder="e.g. Plaza-Guest"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              placeholder="e.g. welcome2024"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Notes (optional)</Label>
            <textarea
              rows={3}
              placeholder="e.g. The network resets every 24h, accept the captive page on first connect."
              value={wifiNotes}
              onChange={(e) => setWifiNotes(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 rounded-md bg-surface border border-[color:var(--border)] text-sm text-ink placeholder:text-foreground/45 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[color:var(--border)]">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-foreground/45">
              {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Not saved yet"}
            </p>
            <Button
              onClick={save}
              disabled={saving || loading}
              className="gap-2 h-9 rounded-md bg-primary hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save Wi-Fi"}
            </Button>
          </div>
        </div>

        <aside className="card-surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
              <Wifi className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="font-display text-base text-ink">Guest preview</p>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] bg-card p-4 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Network
            </p>
            <p className="text-sm font-medium text-ink">
              {wifiName || "—"}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 pt-2 flex items-center gap-1.5">
              <KeyRound className="h-3 w-3" /> Password
            </p>
            <p className="text-sm font-medium text-ink break-all">
              {wifiPassword || "—"}
            </p>
            {wifiNotes ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 pt-2">
                  Note
                </p>
                <p className="text-[12px] text-foreground/70 leading-relaxed">
                  {wifiNotes}
                </p>
              </>
            ) : null}
          </div>
          <p className="text-[11px] text-foreground/55 leading-relaxed">
            Tip — keep the password short and memorable. Guests can copy it with
            a single tap from their in-room screen.
          </p>
        </aside>
      </div>
    </>
  );
}
