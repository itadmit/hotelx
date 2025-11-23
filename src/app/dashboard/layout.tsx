"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Toaster } from "sonner";
import { useNewRequests } from "@/hooks/useNewRequests";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  
  // Get hotelId from logged in user
  const hotelId = session?.user?.hotelId;
  
  // Activate notification system only if user is logged in and has a hotel
  useNewRequests(hotelId, !!hotelId);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 pt-2 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}