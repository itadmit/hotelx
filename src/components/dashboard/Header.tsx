"use client";

import { Bell, Search, LogOut, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { handleSignOut } from "@/app/actions/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { TimeAgo } from "@/components/TimeAgo";

interface Notification {
  id: string;
  type: "request" | "complaint" | "review";
  title: string;
  description: string;
  time: Date;
  read: boolean;
  link?: string;
}

interface NewRequest {
  id: string;
  room: string;
  service: string;
  notes?: string | null;
  createdAt: string;
}

export function Header() {
  const { data: session } = useSession();
  const { translate } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastChecked, setLastChecked] = useState<string>("");

  // Initialize lastChecked only on client side
  useEffect(() => {
    if (lastChecked === "") {
      setLastChecked(new Date().toISOString());
    }
  }, [lastChecked]);

  // Poll for new requests
  useEffect(() => {
    const hotelId = session?.user?.hotelId;
    if (!hotelId || lastChecked === "") return;

    let isActive = true;

    const checkNewRequests = async () => {
      try {
        const response = await fetch(
          `/api/requests/new?hotelId=${hotelId}&lastChecked=${encodeURIComponent(lastChecked)}`
        );

        if (!response.ok || !isActive) return;

        const data = await response.json();
        const newRequests: NewRequest[] = data.requests || [];

        if (newRequests.length > 0) {
          // Add new notifications
          const newNotifications: Notification[] = newRequests.map((req) => ({
            id: req.id,
            type: "request" as const,
            title: translate("app.dashboard.notifications.new_request"),
            description: `${translate("app.dashboard.common.room")} ${req.room} - ${req.service}`,
            time: new Date(req.createdAt),
            read: false,
            link: "/dashboard/requests",
          }));

          setNotifications((prev) => [...newNotifications, ...prev]);
          setLastChecked(new Date().toISOString());
        }
      } catch (error) {
        console.error("Error checking for new requests:", error);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkNewRequests, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [session?.user?.hotelId, lastChecked, translate]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);
  
  if (!session?.user) {
    return null;
  }

  const userInitials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "??";

  const roleTranslations: Record<string, string> = {
    ADMIN: translate("app.dashboard.header.administrator"),
    MANAGER: translate("app.dashboard.header.hotel_manager"),
    STAFF: translate("app.dashboard.header.staff"),
  };

  const userRole = roleTranslations[session.user.role || "STAFF"] || translate("app.dashboard.header.user");

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm">
      <div className="w-full max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            type="search"
            placeholder={translate("app.dashboard.header.search_placeholder")}
            className="pl-10 bg-white border-transparent shadow-sm focus:border-indigo-100 focus:ring-2 focus:ring-indigo-100 rounded-xl h-11 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/50 rounded-xl h-10 w-10"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-gray-50"></span>
            )}
          </Button>

          {/* Notifications Panel */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">
                    {translate("app.dashboard.notifications.title")}
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        {translate("app.dashboard.notifications.no_notifications")}
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <a
                        key={notification.id}
                        href={notification.link}
                        onClick={() => {
                          markAsRead(notification.id);
                          setShowNotifications(false);
                        }}
                        className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              <TimeAgo date={notification.time} />
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                      </a>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200">
                    <a
                      href="/dashboard/requests"
                      className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      {translate("app.dashboard.notifications.view_all")}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
             <div className="text-sm font-bold text-gray-900">{session.user.name || session.user.email}</div>
             <div className="text-xs text-gray-500">{userRole}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
            {userInitials}
          </div>
          
          <form action={handleSignOut}>
            <Button 
              type="submit"
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">{translate("app.dashboard.sidebar.log_out")}</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
