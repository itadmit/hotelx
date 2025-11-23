"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BedDouble, 
  ConciergeBell, 
  QrCode, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Requests",
    href: "/dashboard/requests",
    icon: ClipboardList,
  },
  {
    title: "Rooms",
    href: "/dashboard/rooms",
    icon: BedDouble,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: ConciergeBell,
  },
  {
    title: "QR Codes",
    href: "/dashboard/qr",
    icon: QrCode,
  },
  {
    title: "Analytics",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/hotel-settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-gray-50/50 p-4">
      <div className="px-4 py-6 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
          H
        </div>
        <span className="text-xl font-bold font-heading text-gray-900">HotelX</span>
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-500 hover:bg-white/50 hover:text-red-600 transition-colors group">
          <LogOut className="h-5 w-5 group-hover:text-red-600" />
          Log Out
        </button>
      </div>
    </aside>
  );
}