"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/demo", label: "Try now" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-[color:var(--border)]" />
      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative w-8 h-8 rounded-md bg-emerald-brand flex items-center justify-center text-primary-foreground">
            <span className="font-display text-base leading-none">H</span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand border-2 border-background" />
            </span>
          </span>
          <span className="font-display text-xl tracking-tight text-ink">
            Hotel<span className="text-emerald-brand">X</span>
          </span>
          <span className="hidden sm:inline-block ml-1 eyebrow">
            / Concierge OS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/70 hover:text-emerald-brand transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-sm text-foreground/70 hover:text-emerald-brand transition-colors hidden md:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex group items-center gap-1.5 h-9 pl-4 pr-3 rounded-full bg-emerald-brand text-primary-foreground text-sm font-medium hover:bg-ink transition-colors"
          >
            Start free trial
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-[color:var(--border)] text-ink hover:bg-surface transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/98 backdrop-blur-xl border-t border-[color:var(--border)] transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-6 pt-8 pb-12 flex flex-col gap-1 h-full overflow-y-auto">
          {navLinks.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-[color:var(--border)]"
              style={{
                animation: open ? `reveal-up 0.4s ease-out ${i * 60}ms both` : "none",
              }}
            >
              <span className="font-display text-3xl text-ink group-hover:text-emerald-brand transition-colors">
                {item.label}
              </span>
              <ArrowUpRight className="h-5 w-5 text-foreground/40 group-hover:text-emerald-brand group-hover:rotate-45 transition-all" />
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
            >
              Start free trial
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-[color:var(--border)] text-ink hover:bg-surface transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-auto pt-8 flex items-center justify-between">
            <span className="eyebrow">Concierge OS</span>
            <span className="eyebrow text-emerald-brand">v2.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
