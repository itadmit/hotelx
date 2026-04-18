"use client";

import { useEffect, useState } from "react";
import { Save, BookOpen } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { GuestInfoTabs } from "@/components/dashboard/GuestInfoTabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AboutPage() {
  const [about, setAbout] = useState("");
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
        setAbout(data.info?.about ?? "");
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
        body: JSON.stringify({ about: about || null }),
      });
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Guest info · the story"
        title="About the hotel"
        description="A short, warm intro guests will read on their first tap."
      >
        <GuestInfoTabs />
      </DashboardPageHeader>

      <div className="grid lg:grid-cols-[1fr_22rem] gap-6 items-start">
        <div className="card-surface p-5 sm:p-6 space-y-4">
          <div className="grid gap-2">
            <Label>About text</Label>
            <textarea
              rows={14}
              placeholder="Welcome to our hotel. A few words about the property, the neighbourhood, and what makes the stay special…"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-md bg-surface border border-[color:var(--border)] text-sm text-ink placeholder:text-foreground/45 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-foreground/50 mt-1">
              {about.length} / 4000 characters
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

        <aside className="card-surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center">
              <BookOpen className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="font-display text-base text-ink">Why this matters</p>
          </div>
          <p className="text-[12.5px] text-foreground/70 leading-relaxed">
            The first 80 characters appear on the guest&apos;s home screen card.
            The full text shows up on the dedicated &quot;About&quot; page —
            ideal for setting expectations, mentioning the breakfast hours, or
            pointing out a hidden gem nearby.
          </p>
          <div className="rounded-xl border border-[color:var(--border)] bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-1">
              Live preview
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6">
              {about || "Your about text will appear here as guests will see it."}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
