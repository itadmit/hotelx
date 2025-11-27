"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const PULL_THRESHOLD = 80;

  useEffect(() => {
    let touchStartY = 0;
    let currentPull = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setStartY(touchStartY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0) return;
      
      const currentY = e.touches[0].clientY;
      const pull = currentY - touchStartY;

      if (pull > 0 && window.scrollY === 0) {
        e.preventDefault();
        currentPull = Math.min(pull, PULL_THRESHOLD * 1.5);
        setPullDistance(currentPull);
        setIsPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (currentPull >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
      
      setPullDistance(0);
      setIsPulling(false);
      touchStartY = 0;
      currentPull = 0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, isRefreshing]);

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const shouldTrigger = pullDistance >= PULL_THRESHOLD;

  return (
    <div className="relative">
      {/* Pull Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 transition-all duration-200"
          style={{
            transform: `translateY(${Math.max(0, pullDistance - 20)}px)`,
            opacity: pullProgress,
          }}
        >
          <div className={`flex flex-col items-center gap-2 ${shouldTrigger ? 'text-gray-900' : 'text-gray-400'}`}>
            <RefreshCw 
              className={`h-6 w-6 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${pullProgress * 360}deg)` }}
            />
            <span className="text-xs font-medium">
              {isRefreshing ? "Refreshing..." : shouldTrigger ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}

