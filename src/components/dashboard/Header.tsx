"use client";

import Link from "next/link";
import { Search, Menu, Command, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";


export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { data } = useSession();
  const userName = data?.user?.name ?? "Hotel User";
  const role = (data?.user?.role ?? "Manager").toString();
  const hotelSlug = data?.user?.hotelSlug ?? null;
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center gap-3 bg-background/85 backdrop-blur-md border-b border-[color:var(--border)]">
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
      <div className="flex-1 min-w-0 max-w-xl">
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
      <div className="ml-auto shrink-0 flex items-center gap-2 sm:gap-3">
        {hotelSlug ? (
          <Link
            href={`/g/${hotelSlug}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open guest hotel page in a new tab"
            title="View your guest hotel page"
            className="group hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-[color:var(--border)] bg-surface hover:bg-background hover:border-primary/30 text-foreground/75 hover:text-ink text-[13px] font-medium transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span className="hidden md:inline">Visit hotel page</span>
          </Link>
        ) : null}

        <ThemeToggle />

        <NotificationsBell />

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
