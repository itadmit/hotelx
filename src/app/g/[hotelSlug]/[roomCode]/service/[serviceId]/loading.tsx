export default function GuestServiceLoading() {
  return (
    <main className="mx-auto w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-3rem)] sm:my-6 bg-background text-ink flex flex-col sm:rounded-[28px] sm:border sm:border-[color:var(--border)]/70 sm:shadow-[0_20px_60px_-30px_rgba(31,41,28,0.25)] sm:overflow-hidden animate-pulse">
      <section className="relative h-72 bg-surface">
        <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-card" />
        <div className="absolute top-4 right-4 h-7 w-24 rounded-full bg-card" />
        <div className="absolute bottom-5 left-5 space-y-2">
          <div className="h-3 w-24 rounded bg-card" />
          <div className="h-10 w-56 rounded bg-card" />
        </div>
      </section>

      <section className="px-5 pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-16 rounded-xl bg-surface" />
          <div className="h-16 rounded-xl bg-surface" />
        </div>
        <div className="h-4 w-32 rounded bg-surface" />
        <div className="h-20 rounded-xl bg-surface" />
        <div className="h-14 rounded-2xl bg-surface" />
      </section>
    </main>
  );
}
