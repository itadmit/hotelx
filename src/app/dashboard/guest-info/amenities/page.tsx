"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Save,
  GripVertical,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { GuestInfoTabs } from "@/components/dashboard/GuestInfoTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Amenity = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  hours: string | null;
  location: string | null;
  order: number;
};

const ICON_CHOICES: { value: string; label: string }[] = [
  { value: "pool", label: "Pool" },
  { value: "gym", label: "Gym" },
  { value: "spa", label: "Spa" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bar", label: "Bar" },
  { value: "breakfast", label: "Breakfast" },
  { value: "parking", label: "Parking" },
  { value: "elevator", label: "Elevator" },
  { value: "kids", label: "Kids" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "concierge", label: "Concierge" },
  { value: "lobby", label: "Lobby" },
];

const EMPTY_DRAFT = {
  name: "",
  description: "",
  icon: "",
  hours: "",
  location: "",
};

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draft, setDraft] = useState({ ...EMPTY_DRAFT });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/hotel/amenities", { cache: "no-store" });
      const data = await res.json();
      setAmenities(data.amenities ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/hotel/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          description: draft.description || null,
          icon: draft.icon || null,
          hours: draft.hours || null,
          location: draft.location || null,
          order: amenities.length,
        }),
      });
      setDraft({ ...EMPTY_DRAFT });
      setIsAddOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      await fetch(`/api/hotel/amenities/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          description: editing.description || null,
          icon: editing.icon || null,
          hours: editing.hours || null,
          location: editing.location || null,
        }),
      });
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this amenity?")) return;
    await fetch(`/api/hotel/amenities/${id}`, { method: "DELETE" });
    await load();
  }

  const sorted = useMemo(
    () => [...amenities].sort((a, b) => a.order - b.order),
    [amenities]
  );

  return (
    <>
      <DashboardPageHeader
        eyebrow="Guest info · the property"
        title="Amenities"
        description="Pool, gym, spa, restaurant — anything guests can use on-site."
      >
        <GuestInfoTabs />
      </DashboardPageHeader>

      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/65">
          {sorted.length} {sorted.length === 1 ? "amenity" : "amenities"}
        </p>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="gap-2 h-9 rounded-md bg-primary hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add amenity
        </Button>
      </div>

      {loading ? (
        <div className="card-surface p-10 text-center text-sm text-foreground/55">
          Loading…
        </div>
      ) : sorted.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <span className="inline-flex h-12 w-12 rounded-full bg-emerald-soft text-emerald-brand items-center justify-center mb-3">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="font-display text-lg text-ink">
            No amenities yet
          </p>
          <p className="text-sm text-foreground/55 mt-1">
            Add the first one to start showing it on the guest screen.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="card-surface p-4 sm:p-5 flex items-start gap-3 group"
            >
              <span className="shrink-0 mt-0.5 inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink leading-tight truncate">
                  {a.name}
                </p>
                {a.description ? (
                  <p className="text-[12.5px] text-foreground/65 mt-1 leading-snug line-clamp-2">
                    {a.description}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {a.hours ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-[color:var(--border)] font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/65">
                      {a.hours}
                    </span>
                  ) : null}
                  {a.location ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-[0.12em]">
                      {a.location}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  className="h-8 px-2 rounded-md text-[12px] text-foreground/65 hover:text-ink hover:bg-surface"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  aria-label="Remove"
                  className="h-8 w-8 rounded-md flex items-center justify-center text-foreground/55 hover:text-clay hover:bg-surface"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="hidden md:inline-flex h-8 w-6 items-center justify-center text-foreground/30 cursor-grab">
                  <GripVertical className="h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add amenity</DialogTitle>
            <DialogDescription>
              Anything on-site guests can use. Keep it concise — the description
              shows in a small card.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Rooftop pool"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Icon</Label>
              <Select
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
              >
                <option value="">Default sparkles</option>
                {ICON_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Hours</Label>
                <Input
                  placeholder="e.g. 6:00 – 22:00"
                  value={draft.hours}
                  onChange={(e) => setDraft({ ...draft, hours: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g. Floor 7"
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description (optional)</Label>
              <textarea
                rows={3}
                placeholder="Short note for guests"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-surface border border-[color:var(--border)] text-sm text-ink placeholder:text-foreground/45 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={create}
              disabled={saving || !draft.name.trim()}
              className="gap-2 rounded-md bg-primary hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5" />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit amenity</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Icon</Label>
                <Select
                  value={editing.icon ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, icon: e.target.value || null })
                  }
                >
                  <option value="">Default sparkles</option>
                  {ICON_CHOICES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Hours</Label>
                  <Input
                    value={editing.hours ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, hours: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    value={editing.location ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md bg-surface border border-[color:var(--border)] text-sm text-ink placeholder:text-foreground/45 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditing(null)}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={saving || !editing?.name.trim()}
              className="gap-2 rounded-md bg-primary hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
