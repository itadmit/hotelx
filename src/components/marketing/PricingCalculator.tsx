"use client";

import { useState } from "react";
import { Minus, Plus, BedDouble, Sparkles, Gift } from "lucide-react";
import Link from "next/link";
import {
  FOUNDERS,
  LIST,
  foundersMonthly,
  listMonthly,
  monthlySavings,
  firstYearSavings,
  formatUsd,
} from "@/lib/pricing";

export function PricingCalculator() {
  const [rooms, setRooms] = useState(40);
  const monthly = foundersMonthly(rooms);
  const listMo = listMonthly(rooms);
  const monthlyDiff = monthlySavings(rooms);
  const yearSave = firstYearSavings(rooms);
  const perRoomCost = (monthly / Math.max(rooms, 1)).toFixed(2);

  return (
    <div className="card-elev p-6 sm:p-8 relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-soft/50 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-amber-soft/40 blur-3xl"
      />

      <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
        {/* Left — slider */}
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-emerald-brand" />
            Build your plan
          </p>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl text-ink leading-tight">
            How many rooms in your hotel?
          </h3>
          <p className="mt-2 text-sm text-foreground/65 max-w-md">
            Slide to your room count &mdash; we&rsquo;ll show you the exact
            monthly cost and the founders savings.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRooms((r) => Math.max(1, r - 5))}
              className="h-10 w-10 rounded-full border border-[color:var(--border)] bg-card flex items-center justify-center text-ink hover:bg-surface transition-colors"
              aria-label="Fewer rooms"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 flex items-baseline gap-2">
              <span className="numeral text-5xl text-ink">{rooms}</span>
              <span className="text-sm text-foreground/60">
                {rooms === 1 ? "room" : "rooms"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRooms((r) => Math.min(500, r + 5))}
              className="h-10 w-10 rounded-full border border-[color:var(--border)] bg-card flex items-center justify-center text-ink hover:bg-surface transition-colors"
              aria-label="More rooms"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <input
            type="range"
            min={1}
            max={300}
            step={1}
            value={Math.min(rooms, 300)}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="mt-5 w-full accent-emerald-brand"
            aria-label="Room count"
          />
          <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
            <span>1</span>
            <span>50</span>
            <span>120</span>
            <span>300+</span>
          </div>
        </div>

        {/* Right — price box */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-card p-6 sm:p-7">
          {/* Founders badge */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-brand text-white font-mono text-[10px] uppercase tracking-[0.16em]">
              <Gift className="h-3 w-3" />
              Founders offer
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[10px] uppercase tracking-[0.16em]">
              <Sparkles className="h-3 w-3" />
              0% commission
            </span>
          </div>

          {/* List price (struck through) — anchor */}
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/50">
            <span className="line-through">Normally {formatUsd(listMo)}/mo</span>
            <span className="mx-2 text-foreground/30">&middot;</span>
            <span className="text-emerald-brand normal-case tracking-normal font-medium">
              You save {formatUsd(monthlyDiff)}/mo
            </span>
          </p>

          {/* Founders price — the big number */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="numeral text-5xl sm:text-6xl text-ink">
              {formatUsd(monthly)}
            </span>
            <span className="text-sm text-foreground/60">/ month</span>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/55">
            ${FOUNDERS.base} base + ${FOUNDERS.perRoom} per room &middot; ~$
            {perRoomCost} / room
          </p>

          {/* What's included — strike-through anchors */}
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <IncludedTile
              label="Onboarding"
              listPrice={`$${LIST.onboarding}`}
            />
            <IncludedTile label="Training" listPrice={`$${LIST.training}`} />
            <IncludedTile
              label="6mo retainer"
              listPrice={`$${LIST.retainerMonthly * LIST.retainerMonthsFree}`}
            />
          </div>

          {/* First-year savings strip */}
          <div className="mt-5 rounded-xl bg-emerald-soft/50 border border-emerald-brand/20 px-4 py-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-brand">
              First-year savings
            </p>
            <p className="numeral text-2xl text-emerald-brand leading-none">
              {formatUsd(yearSave)}
            </p>
          </div>

          <Link
            href="/signup"
            className="group mt-6 inline-flex items-center justify-center w-full h-12 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
          >
            Start with {rooms} {rooms === 1 ? "room" : "rooms"}
          </Link>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 text-center">
            14-day trial &middot; no card &middot; cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

function IncludedTile({
  label,
  listPrice,
}: {
  label: string;
  listPrice: string;
}) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2 border border-[color:var(--border)]">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </p>
      <p className="text-[11px] mt-1 leading-tight">
        <span className="line-through text-foreground/40">{listPrice}</span>
        <span className="ml-1 text-emerald-brand font-medium">Free</span>
      </p>
    </div>
  );
}
