"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CATEGORY_ICON_KEYS, resolveCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (key: string) => void;
};

export function CategoryIconPicker({ open, onOpenChange, value, onChange }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORY_ICON_KEYS;
    return CATEGORY_ICON_KEYS.filter((key) => key.toLowerCase().includes(q));
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden border-[color:var(--border)] bg-card"
        bodyClassName="flex flex-col flex-1 min-h-0"
      >
        <DialogHeader className="px-5 pt-5 pb-3 shrink-0 border-b border-[color:var(--border)]">
          <DialogTitle className="font-display text-lg text-ink">
            Choose category icon
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/60">
            Pick one of {CATEGORY_ICON_KEYS.length} icons. It appears on the guest
            app and in the dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 py-3 shrink-0 border-b border-[color:var(--border)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              autoFocus
              className="w-full rounded-lg border border-[color:var(--border)] bg-surface pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/20"
            />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-foreground/50">
              No icons match “{query}”.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {filtered.map((key) => {
                const Icon = resolveCategoryIcon(key);
                const selected = value === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 transition-colors",
                      selected
                        ? "border-emerald-brand bg-emerald-soft text-emerald-brand"
                        : "border-[color:var(--border)] bg-surface hover:border-primary/30 hover:bg-background text-foreground/70"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                    <span className="font-mono text-[9px] uppercase tracking-wide truncate w-full text-center text-foreground/50">
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
