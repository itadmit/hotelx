"use client";

import { useEffect, useRef, useState } from "react";
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
  Database,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Wifi,
  Tag,
  BedDouble,
  UtensilsCrossed,
  Info as InfoIcon,
  CreditCard,
  Bell,
  Building2,
} from "lucide-react";
import { consumeSseFetch } from "@/lib/sse-fetch";

type StepStatus = "pending" | "running" | "done" | "error";

type Step = {
  key: string;
  label: string;
  status: StepStatus;
  detail?: string;
  done?: number;
  total?: number;
  current?: string;
};

const STEP_ICON: Record<string, typeof Wifi> = {
  identity: Building2,
  categories: Tag,
  rooms: BedDouble,
  services: UtensilsCrossed,
  info: InfoIcon,
  amenities: Sparkles,
  payments: CreditCard,
  samples: Bell,
};

export type DemoImportDialogProps = {
  open: boolean;
  /** Called when the dialog should close. */
  onOpenChange: (open: boolean) => void;
  /** Called once after a successful import. */
  onSuccess?: (result: ImportResult | null) => void;
};

export type ImportResult = {
  hotelName?: string;
  categories?: number;
  newRooms?: number;
  newServices?: number;
  newRequests?: number;
  amenities?: number;
};

type Phase = "confirm" | "running" | "done" | "error";

/**
 * Dialog that walks the manager through importing the Plaza Hotel demo:
 * confirmation → live progress (each backend step renders its own line
 * with a spinner / checkmark) → success summary. Driven by the SSE
 * stream from /api/demo/seed.
 */
export function DemoImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: DemoImportDialogProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [steps, setSteps] = useState<Step[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Reset everything when the dialog closes so the next open is clean.
  useEffect(() => {
    if (!open) {
      setPhase("confirm");
      setSteps([]);
      setErrorMessage(null);
      setResult(null);
      startedAtRef.current = null;
      setElapsedMs(0);
    }
  }, [open]);

  // Tick a stopwatch while running, so the modal feels alive even if a
  // single step takes a few seconds.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedMs(Date.now() - startedAtRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  async function startImport() {
    setPhase("running");
    setErrorMessage(null);
    setSteps([]);
    setResult(null);
    startedAtRef.current = Date.now();
    setElapsedMs(0);

    try {
      await consumeSseFetch(
        "/api/demo/seed",
        {
          method: "POST",
          headers: { Accept: "text/event-stream" },
        },
        (event, data) => {
          if (event === "init") {
            const initData = data as {
              steps: Array<{ key: string; label: string }>;
            };
            setSteps(
              initData.steps.map((s) => ({
                key: s.key,
                label: s.label,
                status: "pending" as StepStatus,
              })),
            );
            return;
          }

          if (event === "step") {
            const stepData = data as Step & { status: StepStatus };
            setSteps((prev) => {
              const next = [...prev];
              const idx = next.findIndex((s) => s.key === stepData.key);
              if (idx === -1) {
                next.push({ ...stepData });
              } else {
                next[idx] = {
                  ...next[idx],
                  ...stepData,
                };
              }
              return next;
            });
            return;
          }

          if (event === "done") {
            const okData = data as { result?: ImportResult };
            setResult(okData.result ?? null);
            setPhase("done");
            return;
          }

          if (event === "error") {
            const errData = data as { error?: string; detail?: string };
            setErrorMessage(
              errData.detail ?? errData.error ?? "Import failed.",
            );
            setSteps((prev) =>
              prev.map((s) =>
                s.status === "running" ? { ...s, status: "error" } : s,
              ),
            );
            setPhase("error");
            return;
          }
        },
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Network error during import.",
      );
      setPhase("error");
    }
  }

  function handleSuccessClose() {
    onSuccess?.(result);
    onOpenChange(false);
  }

  const isInteractive = phase === "confirm" || phase === "done" || phase === "error";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isInteractive) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div
          className={cn(
            "px-6 pt-6 pb-5 border-b border-[color:var(--border)]",
            phase === "done"
              ? "bg-emerald-soft/40"
              : phase === "error"
                ? "bg-[#f3d8cf]/40"
                : "bg-wash bg-grid",
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                phase === "error"
                  ? "bg-[#f3d8cf] text-clay"
                  : "bg-primary/10 text-primary",
              )}
            >
              {phase === "error" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Database className="h-4 w-4" />
              )}
            </span>
            <span className="eyebrow text-foreground/60">
              Plaza Hotel demo
            </span>
          </div>
          <DialogHeader className="mt-3 space-y-2">
            <DialogTitle className="font-display text-2xl tracking-tight leading-[1.1] text-ink">
              {phase === "confirm" && (
                <>
                  Import the{" "}
                  <span className="display-italic text-primary">
                    Plaza Hotel
                  </span>{" "}
                  demo?
                </>
              )}
              {phase === "running" && (
                <>
                  Importing{" "}
                  <span className="display-italic text-primary">
                    Plaza Hotel
                  </span>
                  …
                </>
              )}
              {phase === "done" && (
                <>
                  Plaza Hotel is{" "}
                  <span className="display-italic text-primary">ready</span>.
                </>
              )}
              {phase === "error" && <>Something went wrong</>}
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/70 leading-relaxed">
              {phase === "confirm" && (
                <>
                  This will rename your hotel to{" "}
                  <strong>Plaza Hotel</strong> and seed it with the full
                  Milan demo: 8 amenities, Wi-Fi & helpful info, the Room
                  Service menu, and 3 featured upsells. Existing items with
                  the same names are updated; nothing is deleted.
                </>
              )}
              {phase === "running" && (
                <>
                  Each step runs against your live database. You can leave
                  this open — the spinner will become a checkmark when the
                  step finishes.{" "}
                  <span className="font-mono text-[11px] text-foreground/50">
                    {(elapsedMs / 1000).toFixed(1)}s elapsed
                  </span>
                </>
              )}
              {phase === "done" && (
                <>
                  Everything is in place. You can wipe the demo at any time
                  with the <span className="font-mono">Reset</span> button.
                </>
              )}
              {phase === "error" && (
                <span className="text-clay">
                  {errorMessage ?? "An unknown error occurred."}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {phase !== "confirm" && (
          <div className="px-6 py-4 max-h-[55vh] overflow-y-auto">
            <ol className="space-y-2.5">
              {steps.map((step) => {
                const Icon = STEP_ICON[step.key] ?? Database;
                const progress =
                  step.total && step.total > 0
                    ? Math.min(100, ((step.done ?? 0) / step.total) * 100)
                    : null;
                return (
                  <li
                    key={step.key}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                      step.status === "done" &&
                        "border-primary/25 bg-primary/[0.04]",
                      step.status === "running" &&
                        "border-primary/35 bg-card shadow-sm",
                      step.status === "pending" &&
                        "border-[color:var(--border)] bg-card/60 opacity-60",
                      step.status === "error" &&
                        "border-clay/40 bg-[#f3d8cf]/30",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        step.status === "done" &&
                          "bg-primary text-primary-foreground",
                        step.status === "running" &&
                          "bg-primary/10 text-primary",
                        step.status === "pending" &&
                          "bg-[color:var(--surface-2)] text-foreground/45",
                        step.status === "error" && "bg-[#f3d8cf] text-clay",
                      )}
                    >
                      {step.status === "done" ? (
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                      ) : step.status === "running" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step.status === "error" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium leading-tight",
                            step.status === "done"
                              ? "text-ink"
                              : step.status === "pending"
                                ? "text-foreground/55"
                                : "text-ink",
                          )}
                        >
                          {step.label}
                        </p>
                        {step.total !== undefined && step.total > 0 && (
                          <span className="font-mono text-[10px] text-foreground/55 shrink-0">
                            {step.done ?? 0}/{step.total}
                          </span>
                        )}
                      </div>
                      {step.status === "running" && step.current && (
                        <p className="mt-0.5 text-[11.5px] text-foreground/55 truncate">
                          {step.current}
                        </p>
                      )}
                      {step.status === "done" && step.detail && (
                        <p className="mt-0.5 text-[11.5px] text-foreground/55 truncate">
                          {step.detail}
                        </p>
                      )}
                      {progress !== null && step.status === "running" && (
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-200"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {phase === "done" && result && (
              <div className="mt-4 rounded-xl border border-primary/25 bg-primary/[0.04] p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  Summary
                </p>
                <ul className="mt-1.5 grid grid-cols-2 gap-1.5 text-[12px] text-foreground/75">
                  {typeof result.categories === "number" && (
                    <li>
                      <span className="numeral text-ink font-medium">
                        {result.categories}
                      </span>{" "}
                      categories
                    </li>
                  )}
                  {typeof result.newRooms === "number" && (
                    <li>
                      <span className="numeral text-ink font-medium">
                        {result.newRooms}
                      </span>{" "}
                      new rooms
                    </li>
                  )}
                  {typeof result.newServices === "number" && (
                    <li>
                      <span className="numeral text-ink font-medium">
                        {result.newServices}
                      </span>{" "}
                      new services
                    </li>
                  )}
                  {typeof result.amenities === "number" && (
                    <li>
                      <span className="numeral text-ink font-medium">
                        {result.amenities}
                      </span>{" "}
                      amenities
                    </li>
                  )}
                  {typeof result.newRequests === "number" && (
                    <li>
                      <span className="numeral text-ink font-medium">
                        {result.newRequests}
                      </span>{" "}
                      sample requests
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="px-6 py-4 border-t border-[color:var(--border)] bg-card flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          {phase === "confirm" && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-foreground/70"
              >
                Cancel
              </Button>
              <Button
                onClick={startImport}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Database className="h-4 w-4" />
                Yes, import Plaza Hotel
              </Button>
            </>
          )}
          {phase === "running" && (
            <p className="text-[11px] font-mono text-foreground/45 ml-auto">
              Please don&rsquo;t close this window…
            </p>
          )}
          {phase === "error" && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-foreground/70"
              >
                Close
              </Button>
              <Button
                onClick={startImport}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Database className="h-4 w-4" />
                Try again
              </Button>
            </>
          )}
          {phase === "done" && (
            <Button
              onClick={handleSuccessClose}
              className="gap-2 bg-primary hover:bg-primary/90 ml-auto"
            >
              Continue to dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
