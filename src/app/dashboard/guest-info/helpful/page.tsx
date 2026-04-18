"use client";

import { useEffect, useState } from "react";
import { Save, Info } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { GuestInfoTabs } from "@/components/dashboard/GuestInfoTabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function HelpfulInfoPage() {
  const [helpful, setHelpful] = useState("");
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
        setHelpful(data.info?.helpfulInfo ?? "");
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
        body: JSON.stringify({ helpfulInfo: helpful || null }),
      });
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Guest info · the small stuff that matters"
        title="Helpful info"
        description="Check-in & out times, parking, transfers, smoking policy — anything guests ask reception."
      >
        <GuestInfoTabs />
      </DashboardPageHeader>

      <div className="grid lg:grid-cols-[1fr_22rem] gap-6 items-start">
        <div className="card-surface p-5 sm:p-6 space-y-4">
          <div className="grid gap-2">
            <Label>Helpful info</Label>
            <textarea
              rows={14}
              placeholder={`Check-in 15:00, check-out 11:00.\nBreakfast 7-10:30 in the orchard hall.\nValet parking available — call reception 30 min in advance.\nSmoking only on the rooftop terrace.`}
              value={helpful}
              onChange={(e) => setHelpful(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-md bg-surface border border-[color:var(--border)] text-sm text-ink placeholder:text-foreground/45 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-foreground/50 mt-1">
              {helpful.length} / 4000 characters
            </p>
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
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <aside className="card-surface p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 rounded-lg bg-[#e3eadf] text-emerald-brand items-center justify-center">
              <Info className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="font-display text-base text-ink">Formatting tip</p>
          </div>
          <p className="text-[12.5px] text-foreground/70 leading-relaxed">
            Each line becomes a row in the guest view. Lead with the topic
            (Check-in, Parking, Breakfast…) and keep the answer short.
          </p>
        </aside>
      </div>
    </>
  );
}
