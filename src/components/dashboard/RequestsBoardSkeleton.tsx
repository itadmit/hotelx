function Block({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function RequestsBoardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Block className="h-4 w-32" />
          <Block className="h-8 w-56" />
          <Block className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Block className="h-9 w-24" />
          <Block className="h-9 w-32" />
        </div>
      </div>

      <div className="card-surface p-2 flex flex-col md:flex-row gap-2">
        <Block className="h-10 flex-1" />
        <div className="flex items-center gap-2 px-2">
          <Block className="h-8 w-16" />
          <Block className="h-8 w-16" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Block className="h-8 w-28 rounded-full" />
        <Block className="h-8 w-32 rounded-full" />
        <Block className="h-8 w-36 rounded-full" />
        <Block className="h-8 w-28 rounded-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {Array.from({ length: 3 }).map((_, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Block className="h-2.5 w-2.5 rounded-full" />
                <Block className="h-4 w-20" />
                <Block className="h-5 w-8 rounded-full" />
              </div>
              <Block className="h-7 w-7" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="card-surface p-4 border border-[color:var(--border)] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <Block className="h-6 w-20" />
                    <Block className="h-5 w-10" />
                  </div>
                  <Block className="h-5 w-36" />
                  <Block className="h-4 w-24" />
                  <Block className="h-4 w-40" />
                  <div className="pt-3 border-t border-[color:var(--border)] flex items-center gap-2">
                    <Block className="h-6 w-6 rounded-full" />
                    <Block className="h-4 w-24" />
                  </div>
                </div>
              ))}
              <Block className="h-11 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
