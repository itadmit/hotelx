"use client";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function GuestLayoutContent({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6" dir={dir}>
      <main className="w-full max-w-md mx-auto bg-white min-h-[calc(100vh-3rem)] rounded-2xl overflow-hidden shadow-2xl relative">
        {children}
      </main>
    </div>
  );
}

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <GuestLayoutContent>{children}</GuestLayoutContent>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
