"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Monitor, Clock, X, Maximize2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

type Request = {
  id: string;
  room: string;
  service: string;
  notes: string | null;
  createdAt: string;
  status: string;
};

function getTimeSince(createdAt: string): { text: string; urgency: "new" | "pending" | "urgent" } {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 5) {
    return { text: `${diffMins}m ago`, urgency: "new" };
  } else if (diffMins < 15) {
    return { text: `${diffMins}m ago`, urgency: "pending" };
  } else if (diffMins < 60) {
    return { text: `${diffMins}m ago`, urgency: "urgent" };
  } else {
    const hours = Math.floor(diffMins / 60);
    return { text: `${hours}h ${diffMins % 60}m ago`, urgency: "urgent" };
  }
}

export default function LiveMonitorCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [categoryId, setCategoryId] = useState<string>("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousCountRef = useRef<number>(0);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setCategoryId(p.categoryId));
  }, [params]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch requests
  useEffect(() => {
    if (!session?.user?.hotelId || !categoryId) return;

    async function fetchRequests() {
      try {
        const url =
          categoryId === "all"
            ? `/api/monitor/requests?hotelId=${session.user.hotelId}`
            : `/api/monitor/requests?hotelId=${session.user.hotelId}&categoryId=${categoryId}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
          setCategoryName(data.categoryName || "All Departments");

          // Play sound if new requests arrived
          if (previousCountRef.current > 0 && data.requests.length > previousCountRef.current) {
            audioRef.current?.play();
          }
          previousCountRef.current = data.requests.length;
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }

    // Initial fetch
    fetchRequests();

    // Refresh every 3 seconds
    const interval = setInterval(fetchRequests, 3000);

    return () => clearInterval(interval);
  }, [session?.user?.hotelId, categoryId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const markAsCompleted = async (requestId: string) => {
    try {
      const response = await fetch('/api/monitor/requests/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove from local state immediately for instant feedback
        setRequests(prev => prev.filter(r => r.id !== requestId));
        showTranslatedSuccess("app.toast.success.request_completed");
      } else {
        showTranslatedError("app.toast.error.request_complete_failed");
      }
    } catch (error) {
      console.error("Error completing request:", error);
      showTranslatedError("app.toast.error.request_complete_failed");
    }
  };

  const newRequests = requests.filter((r) => r.status === "NEW");
  const urgentCount = newRequests.filter(
    (r) => getTimeSince(r.createdAt).urgency === "urgent"
  ).length;

  return (
    <>
      {/* Notification Sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden z-50">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 px-6 py-3">
          <div className="max-w-[2000px] mx-auto flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-lg shadow-lg">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">{categoryName}</h1>
                <p className="text-gray-400 text-xs">Live Request Monitor</p>
              </div>
            </div>

            {/* Right: Stats & Controls */}
            <div className="flex items-center gap-4">
              {/* Active Requests Count */}
              <div className="text-center px-4 py-1 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-400 leading-tight">{newRequests.length}</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>

              {/* Urgent Badge */}
              {urgentCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500 rounded-lg animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-bold text-sm">{urgentCount} Urgent</span>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-mono text-gray-300">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-9 w-9 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {!isFullscreen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard/live-monitor")}
                    className="h-9 w-9 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
                    title="Close Monitor"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="p-6 h-[calc(100vh-73px)] overflow-y-auto">
          {newRequests.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Monitor className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-400 mb-2">No Active Requests</h2>
                <p className="text-gray-500">New requests will appear here automatically</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 max-w-[2000px] mx-auto">
              {newRequests.map((request) => {
                const { text: timeText, urgency } = getTimeSince(request.createdAt);

                const urgencyColors = {
                  new: "bg-green-500/20 border-green-500/80 text-green-300",
                  pending: "bg-yellow-500/20 border-yellow-500/80 text-yellow-300",
                  urgent: "bg-red-500/20 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-500/20",
                };

                const urgencyLabels = {
                  new: "🟢 NEW",
                  pending: "🟡 PENDING",
                  urgent: "🔴 URGENT",
                };

                return (
                  <div
                    key={request.id}
                    className={`p-5 rounded-xl border-2 ${urgencyColors[urgency]} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/10">
                      <span className="text-lg font-bold">{urgencyLabels[urgency]}</span>
                      <span className="text-sm opacity-70 font-mono">{timeText}</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-baseline gap-3">
                        <div className="text-xs opacity-60 w-16">Room</div>
                        <div className="text-4xl font-bold leading-none">{request.room}</div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-xs opacity-60 w-16 pt-0.5">Service</div>
                        <div className="text-base font-semibold leading-snug flex-1">{request.service}</div>
                      </div>

                      {request.notes && (
                        <div className="flex items-start gap-3">
                          <div className="text-xs opacity-60 w-16 pt-1">Notes</div>
                          <div className="text-sm bg-black/20 rounded-lg p-2.5 border border-white/10 flex-1 leading-relaxed">
                            {request.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Complete Button */}
                    <Button
                      onClick={() => markAsCompleted(request.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Completed
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

