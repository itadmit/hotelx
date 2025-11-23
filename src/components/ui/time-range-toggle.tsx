"use client";

import { cn } from "@/lib/utils";

export type TimeRange = "daily" | "weekly" | "monthly";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const ranges: { value: TimeRange; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function TimeRangeToggle({ value, onChange, className }: TimeRangeToggleProps) {
  return (
    <div className={cn("flex gap-2 p-1 bg-gray-100 rounded-xl", className)}>
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
            value === range.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

