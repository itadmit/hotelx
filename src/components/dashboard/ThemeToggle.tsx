"use client";

import { useTheme } from "@/lib/theme";
import { Palette, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Dashboard theme"
      className="hidden sm:inline-flex items-center h-9 p-0.5 rounded-md bg-surface border border-[color:var(--border)]"
    >
      <ToggleButton
        active={theme === "maison"}
        onClick={() => setTheme("maison")}
        icon={Palette}
        label="Maison"
      />
      <ToggleButton
        active={theme === "tech"}
        onClick={() => setTheme("tech")}
        icon={Terminal}
        label="Tech"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Palette;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-2.5 rounded text-[11px] font-medium tracking-wide transition-all",
        active
          ? "bg-background text-ink shadow-sm"
          : "text-foreground/55 hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </button>
  );
}
