import { Clock, Coffee, Sparkles, Wrench, Car, Bell } from "lucide-react";

type PreviewCard = {
  icon: typeof Coffee
  room: string
  title: string
  time: string
  tag: string
  tagColor: string
  assignee?: string
  done?: boolean
}

const columns: Array<{
  title: string
  accent: string
  dot: string
  cards: PreviewCard[]
}> = [
  {
    title: "New",
    accent: "bg-amber-brand/15 text-amber-brand border-amber-brand/30",
    dot: "bg-amber-brand",
    cards: [
      {
        icon: Coffee,
        room: "Suite 412",
        title: "Late breakfast for two",
        time: "2 min",
        tag: "Room Service",
        tagColor: "bg-amber-soft/20 text-amber-soft",
      },
      {
        icon: Wrench,
        room: "Room 207",
        title: "AC adjustment",
        time: "5 min",
        tag: "Maintenance",
        tagColor: "bg-clay/20 text-[#e8a08a]",
      },
    ],
  },
  {
    title: "In progress",
    accent: "bg-emerald-soft/15 text-emerald-soft border-emerald-soft/30",
    dot: "bg-emerald-soft",
    cards: [
      {
        icon: Sparkles,
        room: "Suite 901",
        title: "Turn-down service",
        time: "8 min",
        tag: "Cleaning",
        tagColor: "bg-emerald-soft/20 text-emerald-soft",
        assignee: "MA",
      },
      {
        icon: Car,
        room: "Lobby",
        title: "Airport transfer 17:30",
        time: "14 min",
        tag: "Transport",
        tagColor: "bg-amber-soft/20 text-amber-soft",
        assignee: "DK",
      },
    ],
  },
  {
    title: "Resolved",
    accent: "bg-white/5 text-white/60 border-white/15",
    dot: "bg-white/40",
    cards: [
      {
        icon: Coffee,
        room: "Suite 318",
        title: "Champagne & strawberries",
        time: "delivered",
        tag: "Room Service",
        tagColor: "bg-white/5 text-white/50",
        assignee: "RS",
        done: true,
      },
    ],
  },
];

export function LivePreview() {
  return (
    <section className="relative py-20 sm:py-28 bg-ink text-[#f1ebde] overflow-hidden">
      {/* color washes */}
      <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-emerald-brand/30 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-amber-brand/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] bg-white/5 border border-white/10 text-emerald-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-soft" />
              Live ops view
            </span>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight text-white">
              Your front desk,
              <br />
              <span className="display-italic text-amber-soft">in one calm screen.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-white/60 max-w-md">
              A live look at the staff dashboard. Realtime, prioritized, and
              gracefully quiet — even on the busiest Saturday night.
            </p>
          </div>
        </div>

        {/* Browser frame */}
        <div className="relative">
          <div className="relative rounded-2xl border border-white/10 bg-[#0c1715]/80 backdrop-blur-xl shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 h-11 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-clay" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-brand" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-brand" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="font-mono text-[11px] text-white/40">
                  app.hotelx.io / requests
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-soft" />
                Live
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Requests board
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl mt-1 text-white">
                    Today · 38 served · 4 active
                  </h3>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
                  {[
                    { k: "All", n: 42, active: true },
                    { k: "VIP", n: 6 },
                    { k: "Spa", n: 3 },
                    { k: "F&B", n: 18 },
                  ].map((f) => (
                    <span
                      key={f.k}
                      className={`px-3 h-7 inline-flex shrink-0 items-center gap-1.5 rounded-full text-xs border ${
                        f.active
                          ? "bg-emerald-brand/20 border-emerald-brand/40 text-emerald-soft"
                          : "border-white/10 text-white/50"
                      }`}
                    >
                      {f.k}
                      <span className="font-mono opacity-70">{f.n}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile: horizontal scroll. Desktop: 3-column grid */}
              <div className="md:grid md:grid-cols-3 md:gap-5 mt-7 -mx-4 sm:-mx-6 md:mx-0 flex md:block gap-4 overflow-x-auto md:overflow-visible px-4 sm:px-6 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-none">
                {columns.map((col) => (
                  <div key={col.title} className="space-y-3 shrink-0 w-[78%] sm:w-[60%] md:w-auto snap-start">
                    <div className={`flex items-center justify-between rounded-md px-3 py-2 border ${col.accent}`}>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                        {col.title}
                      </p>
                      <span className="text-[10px] font-mono opacity-70">
                        {col.cards.length}
                      </span>
                    </div>
                    {col.cards.map((c, i) => (
                      <div
                        key={i}
                        className={`group rounded-xl p-4 border bg-white/[0.02] backdrop-blur-sm transition-all ${
                          c.done
                            ? "border-white/5 opacity-60"
                            : "border-white/10 hover:border-emerald-soft/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-[0.16em] ${c.tagColor}`}>
                            {c.tag}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[10px] text-white/50">
                            <Clock className="h-3 w-3" />
                            {c.time}
                          </span>
                        </div>
                        <div className="mt-3 flex items-start gap-3">
                          <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <c.icon className="h-4 w-4 text-amber-soft" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-tight text-white">
                              {c.title}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">
                              {c.room}
                            </p>
                          </div>
                          {c.assignee && (
                            <span className="h-7 w-7 rounded-full bg-emerald-brand text-[10px] font-semibold text-emerald-soft flex items-center justify-center border border-emerald-soft/30">
                              {c.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer notification */}
            <div className="border-t border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-white/60 min-w-0">
                <Bell className="h-3.5 w-3.5 text-emerald-soft shrink-0" />
                <span className="font-mono truncate">Maria accepted &ldquo;Turn-down&rdquo;</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 shrink-0 hidden sm:inline">
                synced · just now
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
