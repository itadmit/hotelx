import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  Bell,
  Car,
  ChevronRight,
  CheckCircle2,
  Flower2,
  Home,
  MessageCircle,
  ScanLine,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Wifi,
  Wine,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-wash">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7 text-center lg:text-left lg:pr-8 xl:pr-16">
            <div className="reveal flex justify-center lg:justify-start" style={{ animationDelay: "0ms" }}>
              <span className="pill">
                <Sparkles className="h-3 w-3 text-emerald-brand" />
                Founders cohort · 6 months retainer free
              </span>
            </div>

            <h1
              className="reveal mt-6 sm:mt-7 font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[4.75rem] leading-[1.0] tracking-tight text-ink max-w-[18ch] mx-auto lg:mx-0"
              style={{ animationDelay: "100ms" }}
            >
              Turn every room into a
              <br />
              <span className="display-italic text-emerald-brand">
                revenue channel.
              </span>
            </h1>

            <p
              className="reveal mt-6 sm:mt-7 text-base sm:text-lg text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animationDelay: "220ms" }}
            >
              The QR concierge that lifts in-room spend, raises your Booking
              score, and cuts calls to reception &mdash; in 14 languages, live
              in 48 hours.
            </p>

            <div
              className="reveal mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:justify-start justify-center lg:justify-start"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
              >
                Start your free trial
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
              >
                See live demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Two micro-KPI chips — the marketing manager's eye candy */}
            <div
              className="reveal mt-8 sm:mt-10 grid sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0"
              style={{ animationDelay: "440ms" }}
            >
              <div className="card-surface p-3 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-brand">
                    Earn extra
                  </p>
                  <p className="numeral text-lg text-ink leading-none mt-1">
                    +&euro;18 <span className="text-foreground/55 text-xs font-sans">/ room / night</span>
                  </p>
                </div>
              </div>

              <div className="card-surface p-3 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center shrink-0">
                  <Star className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-brand">
                    Score lift
                  </p>
                  <p className="numeral text-lg text-ink leading-none mt-1">
                    +0.4 <span className="text-foreground/55 text-xs font-sans">stars on Booking</span>
                  </p>
                </div>
              </div>
            </div>

            <p
              className="reveal mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 text-center lg:text-left"
              style={{ animationDelay: "520ms" }}
            >
              30 days free &middot; no credit card &middot; no commitment
            </p>
          </div>

          {/* Right — orderly composition */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <HeroComposition />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroComposition() {
  return (
    <div className="relative w-full">
      <div className="relative reveal" style={{ animationDelay: "300ms" }}>
        <div className="relative mx-auto w-[280px] py-6">
          {/* color halos behind phone */}
          <div className="absolute top-2 -left-6 h-28 w-28 rounded-2xl bg-amber-soft -z-10" />
          <div className="absolute -bottom-2 -right-6 h-36 w-36 rounded-full bg-emerald-soft -z-10" />

          {/* iPhone 17 — Titanium frame */}
          <div className="relative z-0">
            {/* Side buttons — left side */}
            <span className="absolute left-[-3px] top-[78px] h-8 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />{/* action */}
            <span className="absolute left-[-3px] top-[122px] h-12 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />{/* vol up */}
            <span className="absolute left-[-3px] top-[180px] h-12 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />{/* vol down */}
            {/* Side buttons — right side */}
            <span className="absolute right-[-3px] top-[105px] h-16 w-[3px] rounded-r-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />{/* power */}
            <span className="absolute right-[-3px] top-[195px] h-9 w-[3px] rounded-r-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />{/* camera */}

            {/* Titanium outer frame */}
            <div className="relative rounded-[48px] p-[3px] bg-gradient-to-br from-[#5a6661] via-[#3a4742] to-[#1a2420] shadow-[0_50px_100px_-30px_rgba(21,32,28,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
              {/* Bezel */}
              <div className="rounded-[45px] p-[5px] bg-ink">
                {/* Screen */}
                <div className="rounded-[40px] overflow-hidden bg-card relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 h-[26px] w-[96px] rounded-full bg-ink z-30 flex items-center justify-end pr-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1a2a26] ring-1 ring-[#0a1310]" />
                  </div>

                  {/* Status bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 z-20 flex items-center justify-between px-6">
                    <span className="font-mono text-[11px] text-ink font-medium">9:41</span>
                    <div className="flex items-center gap-1 text-ink">
                      <span className="flex items-end gap-[1.5px] h-2.5">
                        <span className="w-[2px] h-1 rounded-sm bg-ink" />
                        <span className="w-[2px] h-1.5 rounded-sm bg-ink" />
                        <span className="w-[2px] h-2 rounded-sm bg-ink" />
                        <span className="w-[2px] h-2.5 rounded-sm bg-ink" />
                      </span>
                      <Wifi className="h-3 w-3" strokeWidth={2.5} />
                      <span className="ml-0.5 relative inline-flex items-center">
                        <span className="h-2.5 w-5 rounded-[3px] border border-ink relative">
                          <span className="absolute inset-[1px] rounded-[1px] bg-ink w-[80%]" />
                        </span>
                        <span className="ml-px h-1.5 w-[2px] rounded-r-sm bg-ink" />
                      </span>
                    </div>
                  </div>

                  {/* App content — guest landing page */}
                  <div className="pt-10 pb-2 flex flex-col bg-background">
                    {/* Top bar — brand + bell */}
                    <div className="px-4 pt-2 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="relative h-5 w-5 rounded-md bg-emerald-brand flex items-center justify-center">
                          <span className="font-display text-[10px] leading-none text-primary-foreground">H</span>
                          <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-brand border border-background" />
                        </span>
                        <span className="font-display text-[13px] tracking-tight text-ink leading-none">
                          Hotel<span className="text-emerald-brand">X</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="relative h-6 w-6 rounded-full border border-[color:var(--border)] flex items-center justify-center">
                          <Bell className="h-3 w-3 text-ink" strokeWidth={2} />
                          <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-clay" />
                        </span>
                        <span className="h-6 w-6 rounded-full bg-emerald-brand flex items-center justify-center text-[8px] font-mono text-primary-foreground">
                          MS
                        </span>
                      </div>
                    </div>

                    {/* Hero greeting */}
                    <div className="px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-brand font-mono text-[8px] uppercase tracking-[0.14em]">
                        <span className="h-1 w-1 rounded-full bg-emerald-brand" />
                        Suite · 412
                      </span>
                      <h4 className="font-display text-[20px] mt-2 leading-[1.05] text-ink">
                        Good evening,
                        <br />
                        <span className="text-emerald-brand display-italic">Mr. Sullivan.</span>
                      </h4>
                      <p className="mt-1 text-[10px] text-foreground/60 leading-snug">
                        How may we make tonight unforgettable?
                      </p>
                    </div>

                    {/* Featured offer card */}
                    <div className="mx-4 mt-3 relative overflow-hidden rounded-xl bg-emerald-brand text-primary-foreground p-3">
                      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-amber-brand/30 blur-xl" />
                      <div className="relative flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-lg bg-amber-brand flex items-center justify-center shrink-0">
                          <Wine className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-soft">
                            Tonight's offer
                          </p>
                          <p className="font-display text-[13px] leading-tight mt-0.5">
                            Champagne &amp; <span className="display-italic">strawberries</span>
                          </p>
                        </div>
                        <span className="numeral text-[16px] leading-none">€48</span>
                      </div>
                    </div>

                    {/* Categories section */}
                    <div className="px-4 mt-3">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-foreground/50">
                          Concierge
                        </p>
                        <span className="font-mono text-[8px] text-foreground/40">View all</span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {[
                          { label: "Room Service", note: "24/7", icon: Wine, color: "bg-amber-soft text-amber-brand" },
                          { label: "Spa", note: "By appt.", icon: Flower2, color: "bg-emerald-soft text-emerald-brand" },
                          { label: "Cleaning", note: "Now", icon: Sparkles, color: "bg-[#f3d8cf] text-clay" },
                          { label: "Transport", note: "5 min", icon: Car, color: "bg-[#e3eadf] text-emerald-brand" },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className="rounded-lg p-2 border border-[color:var(--border)] bg-card"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`inline-flex items-center justify-center h-6 w-6 rounded-md ${c.color}`}>
                                <c.icon className="h-3 w-3" strokeWidth={2} />
                              </div>
                              <ChevronRight className="h-3 w-3 text-foreground/30" />
                            </div>
                            <p className="mt-1.5 text-[10px] text-ink leading-tight font-medium">
                              {c.label}
                            </p>
                            <p className="text-[8px] text-foreground/50 mt-0.5 font-mono uppercase tracking-[0.1em]">
                              {c.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status row */}
                    <div className="mx-4 mt-2.5 flex items-center justify-between rounded-lg bg-surface px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-emerald-brand pulse-ring" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-brand" />
                        </span>
                        <p className="text-[9px] text-ink leading-none">
                          Towels on the way
                        </p>
                      </div>
                      <span className="font-mono text-[8px] text-foreground/50">3 min</span>
                    </div>

                    {/* Bottom tab bar */}
                    <div className="mt-3 mx-2 px-2 py-2 border-t border-[color:var(--border)] flex items-center justify-around">
                      {[
                        { icon: Home, active: true, label: "Home" },
                        { icon: Sparkles, active: false, label: "Services" },
                        { icon: MessageCircle, active: false, label: "Chat" },
                        { icon: User, active: false, label: "Stay" },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-0.5">
                          <t.icon
                            className={`h-3.5 w-3.5 ${t.active ? "text-emerald-brand" : "text-foreground/40"}`}
                            strokeWidth={2}
                          />
                          <span className={`text-[7px] font-medium ${t.active ? "text-emerald-brand" : "text-foreground/40"}`}>
                            {t.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Home indicator */}
                    <div className="mx-auto mt-1 h-[4px] w-[90px] rounded-full bg-ink/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === Floating chips — must be ABOVE the phone === */}

          {/* Live request chip — visible on all sizes (positioned so it stays in view) */}
          <div className="absolute -top-3 right-0 sm:right-2 lg:-right-16 card-elev px-3 py-2.5 flex items-center gap-2.5 w-[170px] sm:w-[200px] z-30">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-brand pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-brand" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-emerald-brand">New · 2s ago</p>
              <p className="text-xs text-ink leading-tight mt-0.5 truncate">
                Extra towels · 412
              </p>
            </div>
          </div>

          {/* Bell chip — desktop only */}
          <div className="hidden lg:flex absolute top-28 -left-[152px] card-elev p-2.5 items-center gap-2 w-[170px] z-30">
            <div className="h-9 w-9 rounded-md bg-amber-brand flex items-center justify-center shrink-0">
              <BellRing className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="eyebrow">Notify</p>
              <p className="text-xs text-ink truncate">Maria assigned</p>
            </div>
          </div>

          {/* QR chip — desktop only */}
          <div className="hidden lg:flex absolute top-[260px] -right-24 card-elev p-2.5 items-center gap-2 w-[180px] z-30">
            <div className="h-9 w-9 rounded-md bg-ink flex items-center justify-center shrink-0">
              <ScanLine className="h-4 w-4 text-amber-soft" />
            </div>
            <div className="min-w-0">
              <p className="eyebrow">Scan · Order</p>
              <p className="text-xs text-ink truncate">Zero friction</p>
            </div>
          </div>

          {/* KPI chip — visible on all sizes */}
          <div className="absolute -bottom-3 left-0 sm:left-2 lg:-left-20 card-elev p-3 flex items-center gap-3 z-30">
            <CheckCircle2 className="h-4 w-4 text-emerald-brand shrink-0" />
            <div>
              <p className="eyebrow">Avg response</p>
              <p className="numeral text-xl text-ink leading-none mt-0.5">3 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
