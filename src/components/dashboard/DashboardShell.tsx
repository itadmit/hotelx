"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 pt-4 overflow-y-auto">
          <div className="max-w-[1500px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
