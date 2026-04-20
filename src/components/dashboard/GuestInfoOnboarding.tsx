"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wifi,
  BookOpen,
  Sparkles,
  Info,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";
import type { GuestInfoCompletionStatus } from "@/lib/guest-info-completion";

const DISMISS_KEY = "hotelx:guest-info-onboarding-dismissed";

const STEPS: Array<{
  key: keyof GuestInfoCompletionStatus;
  title: string;
  description: string;
  href: string;
  Icon: typeof Wifi;
  accent: string;
}> = [
  {
    key: "wifi",
    title: "Add the Wi-Fi password",
    description: "The most-asked question at reception.",
    href: "/dashboard/guest-info/wifi",
    Icon: Wifi,
    accent: "bg-emerald-soft text-emerald-brand",
  },
  {
    key: "about",
    title: "Write the about story",
    description: "A short paragraph about the property.",
    href: "/dashboard/guest-info/about",
    Icon: BookOpen,
    accent: "bg-amber-soft text-amber-brand",
  },
  {
    key: "amenities",
    title: "List your amenities",
    description: "Pool, gym, spa — anything on-site.",
    href: "/dashboard/guest-info/amenities",
    Icon: Sparkles,
    accent: "bg-[#e3eadf] text-emerald-brand",
  },
  {
    key: "helpful",
    title: "Add helpful info",
    description: "Check-in, parking, breakfast hours.",
    href: "/dashboard/guest-info/helpful",
    Icon: Info,
    accent: "bg-[#f3d8cf] text-clay",
  },
];

/**
 * Onboarding nudge driven by dashboard bundle data (no separate `/api/hotel/*` fetch).
 */
export function GuestInfoOnboarding({
  completion,
  loading,
}: {
  completion: GuestInfoCompletionStatus | null;
  loading: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(DISMISS_KEY) === "1"
      ) {
        setDismissed(true);
      }
    } catch {
      // sessionStorage may be blocked — that's fine, we just always show.
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (loading || dismissed || !completion) return null;

  const missing = STEPS.filter((step) => !completion[step.key]);
  if (missing.length === 0) return null;

  const completed = STEPS.length - missing.length;

  return (
    <div className="card-surface border border-[color:var(--border)] bg-amber-soft/40 p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-emerald-brand/10 blur-3xl pointer-events-none" />
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 h-8 w-8 rounded-md flex items-center justify-center text-foreground/45 hover:text-ink hover:bg-background/70"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative flex items-start gap-3">
        <span className="inline-flex h-10 w-10 rounded-lg bg-emerald-brand text-primary-foreground items-center justify-center shrink-0">
          <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
        <div className="min-w-0 pr-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
            Finish setting up · {completed}/{STEPS.length}
          </p>
          <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mt-1">
            Help your guests find their way around.
          </h2>
          <p className="text-sm text-foreground/65 mt-1.5 max-w-2xl">
            A few short paragraphs and your in-room screens come alive — Wi-Fi,
            amenities, and the small details guests usually call reception for.
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid gap-2 sm:grid-cols-2">
        {STEPS.map((step) => {
          const done = completion[step.key];
          return (
            <Link
              key={step.key}
              href={step.href}
              className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                done
                  ? "border-[color:var(--border)] bg-background/60"
                  : "border-emerald-brand/25 bg-card hover:border-emerald-brand/45"
              }`}
            >
              <span
                className={`inline-flex h-9 w-9 rounded-lg items-center justify-center shrink-0 ${
                  done ? "bg-emerald-soft text-emerald-brand" : step.accent
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <step.Icon className="h-4 w-4" strokeWidth={2} />
                )}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium leading-tight ${
                    done ? "text-foreground/55 line-through" : "text-ink"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11.5px] text-foreground/55 mt-0.5 truncate">
                  {done ? "All set." : step.description}
                </p>
              </div>
              {!done ? (
                <ArrowRight className="h-4 w-4 text-foreground/40 group-hover:text-emerald-brand transition-colors shrink-0" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
