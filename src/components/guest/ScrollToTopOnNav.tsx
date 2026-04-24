"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Forces the viewport back to the top every time the guest navigates to a new
 * page. The App Router's built-in scroll restoration occasionally leaves the
 * page mid-scroll — e.g. iOS Safari with a tall home screen then a taller
 * category page — which hides the back button inside the sticky header.
 *
 * We reset scroll in three stages because Next's internal restoration can
 * fire after a plain useEffect: first synchronously via useLayoutEffect,
 * then on the next animation frame, then after the page has finished any
 * streaming work (short timeout). Each stage is a safety net; the next only
 * ever wins if something repositioned the viewport since the previous one.
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

  useIsoLayoutEffect(() => {
    if (isBackNavRef.current) {
      isBackNavRef.current = false;
      return;
    }

    const toTop = () => window.scrollTo(0, 0);
    toTop();
    const raf = requestAnimationFrame(toTop);
    const timer = setTimeout(toTop, 50);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
