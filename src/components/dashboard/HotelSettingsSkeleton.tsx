function Block({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function HotelSettingsSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-pulse">
      <div className="py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <Block className="h-4 w-36" />
            <Block className="h-8 w-56" />
            <Block className="h-4 w-80" />
          </div>
          <div className="flex gap-2">
            <Block className="h-9 w-24" />
            <Block className="h-9 w-24" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1">
          <div className="card-surface p-2 space-y-1.5">
            <Block className="h-10 w-full" />
            <Block className="h-10 w-full" />
            <Block className="h-10 w-full" />
            <Block className="h-10 w-full" />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card-surface p-6 lg:p-8 space-y-4">
              <Block className="h-6 w-44" />
              <Block className="h-4 w-72" />
              <div className="space-y-3 pt-2">
                <Block className="h-10 w-full" />
                <Block className="h-10 w-full" />
                <Block className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
