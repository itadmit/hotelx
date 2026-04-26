"use client";

import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { trackCTAClick } from "@/lib/gtag";

export function CTA() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 md:p-16 bg-emerald-brand text-[#f1ebde]">
          {/* color washes */}
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-brand/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-clay/30 blur-3xl" />
          {/* grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative grid md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] bg-white/10 border border-white/20 text-amber-soft">
                // ready when you are
              </span>
              <h2 className="mt-4 sm:mt-5 font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02] text-white">
                Open the doors.
                <br />
                <span className="display-italic text-amber-soft">Quietly.</span>
              </h2>
              <p className="mt-4 sm:mt-5 text-white/70 max-w-md">
                Set up your first 10 rooms in under 30 minutes. Print the QR
                cards. The AI starts learning your guests from the very first
                scan &mdash; and offering them what they&rsquo;ll actually buy.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col gap-3">
              <Link
                href="/signup"
                onClick={() => trackCTAClick("cta_section_signup")}
                className="group inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-amber-brand text-white font-medium text-base hover:bg-clay transition-colors"
              >
                Start your free trial
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/demo"
                onClick={() => trackCTAClick("cta_section_demo")}
                className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <PlayCircle className="h-4 w-4 text-amber-soft" />
                Try now
              </Link>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 text-center mt-2">
                30 days free · no credit card · no commitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
