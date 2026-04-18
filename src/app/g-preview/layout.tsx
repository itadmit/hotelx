/**
 * Maison guest preview shell.
 * Wraps the guest experience in an iPhone-style frame on desktop,
 * full-bleed on mobile (where it actually runs as the guest app).
 */
export default function GuestPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wash relative">
      {/* Subtle paper grid */}
      <div
        className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35]"
        aria-hidden
      />

      {/* Mobile (≤md): full-bleed — matches what guests really see */}
      <div className="md:hidden relative min-h-screen bg-background">
        {children}
      </div>

      {/* Desktop (≥md): editorial display — iPhone frame on a stage */}
      <div className="hidden md:flex relative min-h-screen items-center justify-center px-6 py-10">
        {/* Color halos behind phone — same vocabulary as Hero */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-10 left-2 h-44 w-44 rounded-3xl bg-amber-soft/80" />
          <div className="absolute bottom-6 right-2 h-52 w-52 rounded-full bg-emerald-soft/80" />
        </div>

        <div className="relative">
          {/* Caption above */}
          <p className="absolute -top-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50 whitespace-nowrap">
            Guest experience · live preview
          </p>

          {/* iPhone 17 Titanium frame */}
          <div className="relative">
            {/* Side buttons — left */}
            <span className="absolute left-[-3px] top-[110px] h-10 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
            <span className="absolute left-[-3px] top-[170px] h-16 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
            <span className="absolute left-[-3px] top-[250px] h-16 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
            {/* Side buttons — right */}
            <span className="absolute right-[-3px] top-[150px] h-20 w-[3px] rounded-r-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />

            {/* Outer titanium */}
            <div className="rounded-[58px] p-[3px] bg-gradient-to-br from-[#5a6661] via-[#3a4742] to-[#1a2420] shadow-[0_60px_120px_-30px_rgba(21,32,28,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
              {/* Bezel */}
              <div className="rounded-[55px] p-[6px] bg-ink">
                {/* Screen */}
                <div className="relative w-[380px] h-[820px] rounded-[50px] overflow-hidden bg-background">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 h-[30px] w-[120px] rounded-full bg-ink z-30 flex items-center justify-end pr-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1a2a26] ring-1 ring-[#0a1310]" />
                  </div>

                  {/* App content — scrollable */}
                  <div className="absolute inset-0 overflow-y-auto scrollbar-none">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            {/* Caption below */}
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
              Tap any category — opens the real guest flow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
