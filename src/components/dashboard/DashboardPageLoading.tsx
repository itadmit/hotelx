type DashboardLoadingVariant =
  | "overview"
  | "list"
  | "board"
  | "form"
  | "details"
  | "analytics";

function Line({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function DashboardPageLoading({
  variant = "list",
}: {
  variant?: DashboardLoadingVariant;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Line className="h-7 w-44" />
          <Line className="h-4 w-64" />
        </div>
        <Line className="h-10 w-36 rounded-xl" />
      </div>

      {variant === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-4 space-y-3"
              >
                <Line className="h-4 w-20" />
                <Line className="h-8 w-24" />
                <Line className="h-3 w-28" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Line key={index} className="h-12 w-full rounded-xl" />
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Line key={index} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </>
      ) : null}

      {variant === "board" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, columnIndex) => (
            <div
              key={columnIndex}
              className="rounded-2xl border border-border bg-card p-4 space-y-3"
            >
              <Line className="h-5 w-28" />
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <Line key={cardIndex} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {variant === "analytics" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Line key={index} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Line className="h-72 w-full rounded-2xl" />
        </>
      ) : null}

      {variant === "form" ? (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Line className="h-4 w-28" />
              <Line className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : null}

      {variant === "details" ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4">
            <Line className="h-8 w-56" />
            <Line className="h-11 w-full rounded-xl" />
            <Line className="h-11 w-full rounded-xl" />
            <Line className="h-40 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Line key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : null}

      {variant === "list" ? (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <Line className="h-10 w-full rounded-xl" />
          {Array.from({ length: 8 }).map((_, index) => (
            <Line key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
