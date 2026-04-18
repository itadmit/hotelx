function Block({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function RoomsPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Block className="h-4 w-32" />
          <Block className="h-8 w-40" />
          <Block className="h-4 w-80" />
        </div>
        <Block className="h-9 w-28" />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-[color:var(--border)] flex flex-col md:flex-row gap-4 justify-between items-center">
          <Block className="h-10 w-full md:w-80" />
          <Block className="h-4 w-20" />
        </div>

        <div className="p-4 space-y-3">
          <Block className="h-8 w-full" />
          {Array.from({ length: 8 }).map((_, index) => (
            <Block key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
