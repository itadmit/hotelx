import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Shared page chrome — Maison (warm) vs Tech (minimal) comes from `data-theme` + globals.css */
export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
      <div>
        {eyebrow ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl sm:text-4xl text-ink mt-2 tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-foreground/60 mt-1.5 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div>
      ) : null}
    </div>
  );
}
