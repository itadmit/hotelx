"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogWidthContext = React.createContext<{
  className: string | undefined;
  setClassName: (cls: string | undefined) => void;
} | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [contentClassName, setContentClassName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogWidthContext.Provider
      value={{ className: contentClassName, setClassName: setContentClassName }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        />

        <div
          className={cn(
            "relative z-50 w-full max-w-lg bg-white p-6 shadow-lg sm:rounded-2xl animate-in fade-in zoom-in-95 duration-200",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </DialogWidthContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(DialogWidthContext);

  React.useEffect(() => {
    ctx?.setClassName(className);
    return () => ctx?.setClassName(undefined);
  }, [ctx, className]);

  return <div className="grid gap-4">{children}</div>;
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 sm:space-x-0",
        className
      )}
    >
      {children}
    </div>
  );
}
