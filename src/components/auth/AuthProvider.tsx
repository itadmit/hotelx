"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      // The session is JWT-backed and rarely changes during a tab's lifetime.
      // Disabling automatic re-fetches removes the stream of /api/auth/session
      // hits we were making on every focus / route change.
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}

