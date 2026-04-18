export default function GuestRequestStatusLoading() {
  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col pb-12 sm:pb-10 sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden animate-pulse">
      <header className="h-16 border-b border-[color:var(--border)]/60 px-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-surface" />
        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-surface" />
          <div className="h-4 w-20 rounded bg-surface" />
        </div>
      </header>

      <section className="px-5 pt-8 text-center space-y-3">
        <div className="mx-auto h-16 w-16 rounded-full bg-surface" />
        <div className="mx-auto h-10 w-56 rounded bg-surface" />
        <div className="mx-auto h-4 w-64 rounded bg-surface" />
      </section>

      <section className="mx-5 mt-7 rounded-2xl border border-[color:var(--border)] bg-card overflow-hidden">
        <div className="h-12 border-b border-[color:var(--border)] bg-surface" />
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-8 rounded bg-surface" />
          ))}
        </div>
        <div className="h-16 border-t border-[color:var(--border)] bg-surface" />
      </section>
    </main>
  );
}
