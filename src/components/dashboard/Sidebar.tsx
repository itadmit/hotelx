"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BedDouble,
  ConciergeBell,
  QrCode,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  CreditCard,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

const sidebarSections: {
  label: string;
  items: { title: string; href: string; icon: typeof LayoutDashboard; badge?: string }[];
}[] = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Requests", href: "/dashboard/requests", icon: ClipboardList, badge: "live" },
    ],
  },
  {
    label: "Hotel",
    items: [
      { title: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
      { title: "Services", href: "/dashboard/services", icon: ConciergeBell },
      { title: "QR Codes", href: "/dashboard/qr", icon: QrCode },
      { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", href: "/dashboard/reports", icon: BarChart3 },
      { title: "Team", href: "/dashboard/team", icon: Users },
      { title: "Settings", href: "/dashboard/hotel-settings", icon: Settings },
    ],
  },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-auto h-screen w-72 lg:w-64 flex flex-col bg-surface border-r border-[color:var(--border)] transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-[color:var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="relative w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <span className="font-display text-base leading-none">H</span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand border-2 border-surface" />
              </span>
            </span>
            <div className="leading-none">
              <div className="font-display text-lg tracking-tight text-ink">
                Hotel<span className="text-primary">X</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50 mt-0.5">
                Concierge OS
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="lg:hidden h-9 w-9 rounded-md flex items-center justify-center hover:bg-background text-foreground/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-5 last:mb-0">
              <p className="px-3 mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    onClick={onCloseMobile}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — logout */}
        <div className="px-3 py-3 border-t border-[color:var(--border)]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground/70 hover:bg-background hover:text-clay transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
          <p className="px-3 pt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">
            v2.0 · <span className="text-primary">all systems nominal</span>
          </p>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  item,
  onClick,
}: {
  item: { title: string; href: string; icon: typeof LayoutDashboard; badge?: string };
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "group relative flex items-center gap-3 pl-3 pr-2.5 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-background text-ink font-medium"
            : "text-foreground/70 hover:bg-background hover:text-ink"
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />
        )}
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground/80"
          )}
          strokeWidth={2}
        />
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        {isActive && (
          <ChevronRight className="h-3.5 w-3.5 text-primary" />
        )}
      </Link>
    </li>
  );
}
