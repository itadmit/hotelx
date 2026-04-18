function Block({ className }: { className: string }) {
  return <div className={`rounded-md bg-muted/70 ${className}`} />;
}

export function QrPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <Block className="h-4 w-28" />
        <Block className="h-8 w-40" />
        <Block className="h-4 w-80" />
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
        <div className="card-surface p-5 space-y-4">
          <Block className="h-4 w-16" />
          <Block className="h-10 w-full" />
          <div className="space-y-2 pt-2">
            <Block className="h-10 w-full" />
            <Block className="h-10 w-full" />
          </div>
        </div>

        <div className="card-surface p-8 min-h-[480px] flex flex-col items-center justify-center gap-4">
          <Block className="h-72 w-72 rounded-xl" />
          <Block className="h-4 w-80" />
        </div>
      </div>
    </div>
  );
}
