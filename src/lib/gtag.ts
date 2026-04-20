export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-48XF89000Z";

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

export function event({ action, category, label, value }: GTagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackSignup(method: string = "email") {
  event({ action: "sign_up", category: "engagement", label: method });
}

export function trackLogin(method: string = "email") {
  event({ action: "login", category: "engagement", label: method });
}

export function trackCTAClick(location: string) {
  event({ action: "cta_click", category: "engagement", label: location });
}

export function trackDemoView() {
  event({ action: "demo_view", category: "engagement" });
}

export function trackPricingView() {
  event({ action: "pricing_view", category: "engagement" });
}

export function trackGuestScan(hotelSlug: string) {
  event({ action: "guest_scan", category: "guest", label: hotelSlug });
}

export function trackGuestOrder(hotelSlug: string, serviceId: string) {
  event({ action: "guest_order", category: "guest", label: `${hotelSlug}/${serviceId}` });
}

export function trackGuestRequest(hotelSlug: string) {
  event({ action: "guest_request", category: "guest", label: hotelSlug });
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
