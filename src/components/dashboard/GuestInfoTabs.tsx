"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wifi, BookOpen, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard/guest-info/wifi", label: "Wi-Fi", Icon: Wifi },
  { href: "/dashboard/guest-info/about", label: "About", Icon: BookOpen },
  { href: "/dashboard/guest-info/amenities", label: "Amenities", Icon: Sparkles },
  { href: "/dashboard/guest-info/helpful", label: "Helpful info", Icon: Info },
];

export function GuestInfoTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-surface border border-[color:var(--border)] w-fit">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] font-medium transition-colors",
              active
                ? "bg-background text-ink border border-[color:var(--border)]"
                : "text-foreground/65 hover:text-ink hover:bg-background/60 border border-transparent"
            )}
          >
            <tab.Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
