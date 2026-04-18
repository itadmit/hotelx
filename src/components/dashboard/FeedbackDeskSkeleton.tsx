function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-[color:var(--surface-2)] ${className}`}
    />
  );
}

/**
 * Loading state for /dashboard/feedback. Mirrors the live layout 1:1
 * so nothing reflows when the data lands.
 */
export function FeedbackDeskSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header — mirrors DashboardPageHeader */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
        <div className="space-y-2.5">
          <Bar className="h-3 w-44" />
          <Bar className="h-9 w-72" />
          <Bar className="h-4 w-[420px] max-w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Bar className="h-9 w-24 rounded-md" />
          <Bar className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card-surface p-4 sm:p-5 relative overflow-hidden"
          >
            <span className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full bg-[color:var(--surface-2)]" />
            <div className="flex items-start justify-between">
              <Bar className="h-3 w-20" />
              <Bar className="h-8 w-8 rounded-md" />
            </div>
            <div className="mt-3">
              <Bar className="h-8 sm:h-10 w-24" />
            </div>
            <Bar className="h-2.5 w-28 mt-2.5" />
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {["w-32", "w-32", "w-24", "w-16"].map((w, i) => (
          <Bar key={i} className={`h-8 ${w} rounded-full`} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Feedback list */}
        <section className="lg:col-span-2 card-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
            <div className="space-y-2">
              <Bar className="h-4 w-36" />
              <Bar className="h-3 w-44" />
            </div>
            <Bar className="h-3 w-24" />
          </div>
          <ul className="divide-y divide-[color:var(--border)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <Bar className="hidden sm:flex h-9 w-9 rounded-md shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Bar className="h-4 w-3/5" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <Bar key={j} className="h-3 w-3 rounded-full" />
                      ))}
                    </div>
                    <Bar className="h-3 w-24" />
                  </div>
                </div>
                <Bar className="shrink-0 h-6 w-20 rounded-full" />
                <Bar className="shrink-0 h-8 w-8 rounded-md" />
              </li>
            ))}
          </ul>
        </section>

        {/* Right column */}
        <aside className="space-y-4">
          {/* Reputation card — light variant */}
          <div className="card-surface p-5 relative overflow-hidden">
            <span className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-soft/40 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <Bar className="h-3 w-24" />
              <Bar className="h-5 w-12 rounded-full" />
            </div>
            <div className="relative mt-4 flex items-end gap-4">
              <div className="h-[72px] w-[72px] rounded-full border-[6px] border-[color:var(--surface-2)]" />
              <div className="pb-1 space-y-2">
                <Bar className="h-3 w-36" />
                <Bar className="h-2.5 w-24" />
              </div>
            </div>
            <div className="relative mt-5 pt-4 border-t border-[color:var(--border)] grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Bar className="h-2.5 w-12" />
                  <Bar className="h-7 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-surface p-5">
            <Bar className="h-3 w-24" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 -mx-1"
                >
                  <Bar className="h-9 w-9 rounded-md shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Bar className="h-3.5 w-32" />
                    <Bar className="h-2.5 w-44" />
                  </div>
                  <Bar className="h-3.5 w-3.5 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
