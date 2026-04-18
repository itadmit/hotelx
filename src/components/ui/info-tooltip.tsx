"use client";

import { useId, useState, type ReactNode } from "react";

type Props = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "right" | "left";
};

/**
 * Tiny no-dependency tooltip — Maison-styled. Hover or focus the trigger to
 * reveal a small floating card with helper text.
 */
export function InfoTooltip({ content, children, side = "top" }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const placement: Record<NonNullable<Props["side"]>, string> = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`absolute z-50 ${placement[side]} pointer-events-none`}
        >
          <span className="block w-56 sm:w-60 px-3 py-2 rounded-lg bg-ink text-[#f1ebde] text-[11.5px] leading-snug shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]">
            {content}
          </span>
        </span>
      ) : null}
    </span>
  );
}
