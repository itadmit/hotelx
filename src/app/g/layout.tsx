export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="maison"
      className="relative min-h-screen text-ink antialiased bg-background sm:bg-wash overflow-hidden"
    >
      {/* Desktop ambient background — large architectural grid like the /demo page.
          Hidden on mobile so the guest app stays full-bleed. */}
      <div className="hidden sm:block absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative">{children}</div>
    </div>
  );
}
