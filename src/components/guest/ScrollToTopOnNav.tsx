"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the viewport back to the top every time the guest navigates to a new
 * page. The App Router's built-in scroll restoration occasionally leaves the
 * page mid-scroll — e.g. iOS Safari with a tall home screen then a taller
 * category page — which hides the back button inside the sticky header.
 *
 * Browser-back (popstate) is detected and left alone so returning to a
 * previous page still restores the scroll position the user last had there.
 */
export function ScrollToTopOnNav() {
  const pathname = usePathname();
  const isBackNavRef = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isBackNavRef.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isBackNavRef.current) {
      isBackNavRef.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
