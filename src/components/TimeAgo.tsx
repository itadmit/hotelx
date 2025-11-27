"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/timeAgo";

interface TimeAgoProps {
  date: Date | string;
  language?: string;
  className?: string;
}

export function TimeAgo({ date, language = "en", className }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dateObj = typeof date === "string" ? new Date(date) : date;
    setTimeAgo(formatTimeAgo(dateObj, language));

    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(dateObj, language));
    }, 60000);

    return () => clearInterval(interval);
  }, [date, language]);

  if (!mounted) {
    // Return placeholder during SSR to prevent hydration mismatch
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{timeAgo}</span>;
}



