export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="maison"
      className="min-h-screen bg-background text-ink antialiased"
    >
      {children}
    </div>
  );
}
