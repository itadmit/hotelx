function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-[color:var(--surface-2)] ${className}`}
    />
  );
}

/**
 * Loading state for /dashboard/email-templates. Mirrors the live layout 1:1.
 */
export function EmailTemplatesSkeleton() {
  return (
    <div className="space-y-7 pb-12 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
        <div className="space-y-2.5">
          <Bar className="h-3 w-44" />
          <Bar className="h-9 w-64" />
          <Bar className="h-4 w-[460px] max-w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Bar className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left nav */}
        <nav className="card-surface p-2 h-fit">
          <ul className="space-y-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <div className="flex items-start gap-3 p-3">
                  <Bar className="h-8 w-8 rounded-md shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bar className="h-3.5 w-40" />
                    <Bar className="h-2.5 w-16" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-5">
          {/* Top context card */}
          <div className="card-surface p-5">
            <div className="flex items-start gap-3">
              <Bar className="h-10 w-10 rounded-lg shrink-0" />
              <div className="min-w-0 space-y-2 flex-1">
                <Bar className="h-5 w-56" />
                <Bar className="h-3.5 w-72" />
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Bar key={i} className="h-5 w-20 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor + preview */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card-surface p-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Bar className="h-2.5 w-20" />
                  <Bar className="h-10 w-full rounded-md" />
                </div>
              ))}
              <div className="space-y-1.5">
                <Bar className="h-2.5 w-20" />
                <Bar className="h-32 w-full rounded-md" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Bar className="h-2.5 w-28" />
                    <Bar className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Bar className="h-9 w-32 rounded-md" />
                <Bar className="h-9 w-36 rounded-md" />
              </div>
            </div>

            <div className="card-surface p-5">
              <Bar className="h-3 w-24 mb-3" />
              <div className="rounded-xl border border-[color:var(--border)] bg-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[color:var(--border)] bg-surface/60">
                  <Bar className="h-3 w-44" />
                </div>
                <div className="px-5 py-5 space-y-3">
                  <Bar className="h-6 w-3/4" />
                  <Bar className="h-3.5 w-full" />
                  <Bar className="h-3.5 w-11/12" />
                  <Bar className="h-3.5 w-10/12" />
                  <Bar className="h-3.5 w-9/12" />
                  <div className="pt-2">
                    <Bar className="h-10 w-40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
