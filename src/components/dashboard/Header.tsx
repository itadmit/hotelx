"use client";

import Link from "next/link";
import { Search, Menu, Command, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";

type DashboardPageSearchItem = {
  title: string;
  description: string;
  href: string;
  keywords: string[];
};

const DASHBOARD_PAGES: DashboardPageSearchItem[] = [
  {
    title: "Overview",
    description: "Front desk overview with KPIs and recent activity.",
    href: "/dashboard",
    keywords: ["home", "overview", "dashboard", "activity", "kpi"],
  },
  {
    title: "Requests",
    description: "Track and update guest requests in board/list views.",
    href: "/dashboard/requests",
    keywords: ["tickets", "tasks", "requests", "board", "status"],
  },
  {
    title: "Rooms",
    description: "Manage rooms, occupancy context, and room access.",
    href: "/dashboard/rooms",
    keywords: ["room", "suite", "accommodation", "keys"],
  },
  {
    title: "Services",
    description: "Create and edit hotel services, categories, and pricing.",
    href: "/dashboard/services",
    keywords: ["service", "menu", "amenities", "pricing"],
  },
  {
    title: "QR Codes",
    description: "Generate and print room QR codes for guest access.",
    href: "/dashboard/qr",
    keywords: ["qr", "code", "print", "scan"],
  },
  {
    title: "Payments",
    description: "Configure payment settings and service payment rules.",
    href: "/dashboard/payments",
    keywords: ["payment", "billing", "checkout", "card"],
  },
  {
    title: "Analytics",
    description: "View performance and operational analytics reports.",
    href: "/dashboard/reports",
    keywords: ["reports", "analytics", "insights", "metrics"],
  },
  {
    title: "Team",
    description: "Add staff to team and manage roles and access.",
    href: "/dashboard/team",
    keywords: ["staff", "team", "employees", "roles", "access", "add staff to team"],
  },
  {
    title: "Hotel Settings",
    description: "Edit hotel profile, identity, and guest-facing defaults.",
    href: "/dashboard/hotel-settings",
    keywords: ["settings", "hotel profile", "branding", "configuration"],
  },
  {
    title: "Wi-Fi",
    description: "Set guest Wi-Fi information shown in the guest app.",
    href: "/dashboard/guest-info/wifi",
    keywords: ["wifi", "internet", "network", "guest info"],
  },
  {
    title: "About",
    description: "Set the hotel story and about text for guests.",
    href: "/dashboard/guest-info/about",
    keywords: ["about", "story", "hotel info", "guest info"],
  },
  {
    title: "Amenities",
    description: "Configure amenities and featured guest information.",
    href: "/dashboard/guest-info/amenities",
    keywords: ["amenities", "facilities", "features", "guest info"],
  },
  {
    title: "Helpful Info",
    description: "Publish helpful guest instructions and local guidance.",
    href: "/dashboard/guest-info/helpful",
    keywords: ["help", "faq", "instructions", "guest info", "tips"],
  },
];

export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const userName = data?.user?.name ?? "Hotel User";
  const role = (data?.user?.role ?? "Manager").toString();
  const hotelSlug = data?.user?.hotelSlug ?? null;
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const filteredPages = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return DASHBOARD_PAGES.slice(0, 6);

    return DASHBOARD_PAGES.filter((page) => {
      const haystack = [
        page.title,
        page.description,
        page.href,
        ...page.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    }).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      if (!isCmdOrCtrl || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function goToPage(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

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
      <div className="relative flex-1 min-w-0 max-w-xl">
        <label className="group relative flex items-center h-10 rounded-md bg-surface border border-[color:var(--border)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <Search className="absolute left-3 h-4 w-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            ref={inputRef}
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const first = filteredPages[0];
                if (first) {
                  goToPage(first.href);
                }
              }
            }}
            onBlur={() => {
              window.setTimeout(() => setIsOpen(false), 120);
            }}
            placeholder="Search pages, features, actions…"
            className="w-full h-full pl-9 pr-16 bg-transparent text-sm text-ink placeholder:text-foreground/40 outline-none"
          />
          <kbd className="hidden sm:flex absolute right-2.5 items-center gap-0.5 h-6 px-1.5 rounded bg-background border border-[color:var(--border)] font-mono text-[10px] text-foreground/50">
            <Command className="h-3 w-3" />K
          </kbd>
        </label>
        {isOpen ? (
          <div className="absolute left-0 right-0 mt-2 rounded-xl border border-[color:var(--border)] bg-background shadow-lg overflow-hidden z-50">
            {filteredPages.length === 0 ? (
              <p className="px-3 py-2.5 text-xs text-foreground/55">
                No pages matched. Try another keyword.
              </p>
            ) : (
              <ul className="max-h-80 overflow-auto py-1">
                {filteredPages.map((page) => {
                  const isActive = pathname === page.href;
                  return (
                    <li key={page.href}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => goToPage(page.href)}
                        className="w-full text-left px-3 py-2.5 hover:bg-surface transition-colors"
                      >
                        <p
                          className={`text-sm font-medium ${isActive ? "text-primary" : "text-ink"}`}
                        >
                          {page.title}
                        </p>
                        <p className="text-xs text-foreground/55">{page.description}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
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
