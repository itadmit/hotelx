export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}

