"use client";

import { Bell, Search, Menu, Command } from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { data } = useSession();
  const userName = data?.user?.name ?? "Hotel User";
  const role = (data?.user?.role ?? "Manager").toString();
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-3 bg-background/80 backdrop-blur-md border-b border-[color:var(--border)]">
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="lg:hidden h-9 w-9 -ml-1 rounded-md flex items-center justify-center hover:bg-surface text-foreground/70"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <label className="group relative flex items-center h-10 rounded-md bg-surface border border-[color:var(--border)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <Search className="absolute left-3 h-4 w-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder="Search guests, rooms, services…"
            className="w-full h-full pl-9 pr-16 bg-transparent text-sm text-ink placeholder:text-foreground/40 outline-none"
          />
          <kbd className="hidden sm:flex absolute right-2.5 items-center gap-0.5 h-6 px-1.5 rounded bg-background border border-[color:var(--border)] font-mono text-[10px] text-foreground/50">
            <Command className="h-3 w-3" />K
          </kbd>
        </label>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Notifications"
          className="relative h-10 w-10 rounded-md flex items-center justify-center hover:bg-surface text-foreground/70"
        >
          <Bell className="h-4.5 w-4.5" strokeWidth={2} />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-clay ring-2 ring-background" />
        </button>

        <div className="hidden sm:block w-px h-6 bg-[color:var(--border)]" />

        <div className="flex items-center gap-2.5 pl-1 pr-1 py-1 rounded-full hover:bg-surface cursor-pointer transition-colors">
          <div className="hidden md:block text-right leading-tight pl-2">
            <div className="text-[13px] font-medium text-ink">{userName}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
              {role}
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[12px] font-semibold tracking-wide">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
