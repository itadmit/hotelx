function Block({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function ServicesPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Block className="h-4 w-28" />
          <Block className="h-8 w-52" />
          <Block className="h-4 w-80" />
        </div>
        <Block className="h-9 w-28" />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
        <div className="card-surface p-5 space-y-6">
          <div className="space-y-2">
            <Block className="h-4 w-20" />
            {Array.from({ length: 5 }).map((_, idx) => (
              <Block key={idx} className="h-10 w-full" />
            ))}
          </div>
          <div className="space-y-2">
            <Block className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-2">
              <Block className="h-16 w-full" />
              <Block className="h-16 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6 min-w-0">
          <div className="card-surface p-2 flex flex-col sm:flex-row gap-2">
            <Block className="h-10 flex-1" />
            <Block className="h-10 w-36" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="card-surface p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Block className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Block className="h-5 w-36" />
                    <Block className="h-4 w-24" />
                  </div>
                </div>
                <Block className="h-12 w-full" />
                <div className="flex items-center justify-between">
                  <Block className="h-6 w-20" />
                  <Block className="h-4 w-12" />
                </div>
              </div>
            ))}
            <Block className="min-h-[200px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
