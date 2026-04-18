"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Database,
  CheckCircle2,
  RotateCcw,
  Wand2,
} from "lucide-react";

const STORAGE_KEY = "hotelx:welcome-dismissed";

export type FirstTimeWelcomeModalProps = {
  /** True when the dashboard finished loading and the hotel has zero rooms + zero services. */
  hotelIsEmpty: boolean;
  /**
   * Triggered when the manager confirms they want to import the demo. The
   * parent is responsible for opening the live-progress import dialog.
   * The welcome modal closes itself first so the two dialogs don't stack.
   */
  onRequestImport: () => void;
};

/**
 * Onboarding modal shown the first time a manager opens the dashboard with
 * an empty hotel. Offers a one-click import of the Plaza Hotel demo, or
 * lets them start from scratch. Dismissal is remembered in localStorage so
 * the modal does not flash on every navigation.
 */
export function FirstTimeWelcomeModal({
  hotelIsEmpty,
  onRequestImport,
}: FirstTimeWelcomeModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hotelIsEmpty) return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    if (!dismissed) setOpen(true);
  }, [hotelIsEmpty]);

  function dismiss() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setOpen(false);
  }

  function confirmImport() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setOpen(false);
    // Defer slightly so the welcome modal can fully close before the
    // progress dialog opens — avoids a brief stacked-overlay flash.
    setTimeout(onRequestImport, 60);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="bg-wash bg-grid px-6 pt-6 pb-5 border-b border-[color:var(--border)]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="eyebrow text-foreground/60">Welcome to HotelX</span>
          </div>
          <DialogHeader className="mt-3 space-y-2">
            <DialogTitle className="font-display text-2xl tracking-tight leading-[1.1] text-ink">
              Your hotel is{" "}
              <span className="display-italic text-primary">a blank canvas</span>
              .
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/70 leading-relaxed">
              You haven&rsquo;t added rooms, services or guest info yet. Want us
              to load a complete demo so you can explore the dashboard with
              real-looking data?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="card-surface p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Database className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">
                  Import the{" "}
                  <span className="font-semibold">Plaza Hotel</span> demo
                </p>
                <p className="mt-1 text-xs text-foreground/65 leading-relaxed">
                  A fictional 5-star hotel in Milan, steps from the Duomo.
                  Includes Wi-Fi & helpful info, 8 amenities, a full Room
                  Service menu with breakfast / starters / mains / desserts /
                  drinks, 5 rooms and 3 featured upsells.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-foreground/60">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                Hotel info (Wi-Fi, About)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                8 on-site amenities
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                Room Service menu
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                5 rooms with QR codes
              </li>
            </ul>
          </div>

          <div
            className={cn(
              "flex items-start gap-2 rounded-lg border border-amber-soft bg-amber-soft/40 px-3 py-2 text-[11px] leading-relaxed text-foreground/75",
            )}
          >
            <RotateCcw className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-brand" />
            <p>
              You can wipe the demo at any time with the{" "}
              <span className="font-mono font-medium text-ink">Reset</span>{" "}
              button at the top of the dashboard.
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-[color:var(--border)] bg-card flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Button
            variant="ghost"
            onClick={dismiss}
            className="gap-2 text-foreground/60 hover:text-ink"
          >
            <Wand2 className="h-3.5 w-3.5" />
            I&rsquo;ll start from scratch
          </Button>
          <Button
            onClick={confirmImport}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Database className="h-4 w-4" />
            Import Plaza Hotel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
