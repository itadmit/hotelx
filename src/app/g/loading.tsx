export default function GuestRootLoading() {
  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-x-hidden animate-pulse">
      <div className="h-16 border-b border-[color:var(--border)]/60 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-surface" />
          <div className="h-4 w-28 rounded bg-surface" />
        </div>
        <div className="h-8 w-8 rounded-full bg-surface" />
      </div>

      <section className="px-5 pt-7 space-y-3">
        <div className="h-5 w-24 rounded bg-surface" />
        <div className="h-10 w-64 rounded bg-surface" />
        <div className="h-4 w-52 rounded bg-surface" />
      </section>

      <section className="px-5 mt-6 space-y-3">
        <div className="h-24 rounded-2xl bg-surface" />
      </section>

      <section className="px-5 mt-6">
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-xl bg-surface" />
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-surface" />
        ))}
      </section>
    </main>
  );
}
