"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, ListOrdered, Info, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/Logo";

interface GuestSidebarProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  primaryColor?: string | null;
  currentPage?: string;
}

export function GuestSidebar({ hotelSlug, roomCode, hotelName, primaryColor, currentPage }: GuestSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);

  const menuItems = [
    {
      href: `/g/${hotelSlug}/${roomCode}`,
      icon: Home,
      label: t("home"),
      exact: true,
    },
    {
      href: `/g/${hotelSlug}/${roomCode}/orders`,
      icon: ListOrdered,
      label: t("all_orders"),
      exact: false,
    },
    {
      href: `/g/${hotelSlug}/${roomCode}/about`,
      icon: Info,
      label: t("about_hotel"),
      exact: false,
    },
    {
      href: `/g/${hotelSlug}/${roomCode}/settings`,
      icon: Settings,
      label: translate("app.guest.settings.title"),
      exact: false,
    },
  ];

  const isActive = (item: typeof menuItems[0]) => {
    // If currentPage is provided, use it for comparison
    if (currentPage) {
      return item.href.endsWith(`/${currentPage}`);
    }
    
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <Logo size="sm" />
            <p className="text-sm text-gray-600 mt-1">{hotelName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={active && primaryColor ? { backgroundColor: `${primaryColor}10`, color: primaryColor } : {}}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Room Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 uppercase tracking-wider">{t("your_room")}</p>
          <p className="text-lg font-bold text-gray-900">{roomCode}</p>
        </div>
      </div>
    </>
  );
}


