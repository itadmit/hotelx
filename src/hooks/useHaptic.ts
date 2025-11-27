"use client";

export function useHaptic() {
  const trigger = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => {
    if (typeof window === "undefined" || !("vibrate" in navigator)) {
      return;
    }

    const patterns: Record<string, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [20, 50, 20, 50, 20],
      warning: [10, 50, 10, 50, 10],
    };

    navigator.vibrate(patterns[type] || patterns.medium);
  };

  return { trigger };
}

