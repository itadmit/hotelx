import type { EmailTemplateKind } from "@prisma/client";
import type { EmailTemplate } from "./render";

/**
 * Built-in defaults. Hotels can override per-property via
 * HotelEmailTemplate; if no override exists we fall back to these.
 */
export const DEFAULT_TEMPLATES: Record<EmailTemplateKind, EmailTemplate> = {
  FEEDBACK_THANKS: {
    subject: "Thank you for staying with {{hotelName}}",
    heading: "Thank you, {{guestName}}.",
    body:
      "We're delighted you enjoyed {{serviceName}} during your stay at {{hotelName}}.\n\n" +
      "If you have a moment, a short public review goes a very long way for our team.",
    ctaLabel: "Leave a review",
    ctaUrl: "{{primaryReviewUrl}}",
  },
  FEEDBACK_APOLOGY: {
    subject: "We're sorry your visit fell short — {{hotelName}}",
    heading: "We let you down, {{guestName}}.",
    body:
      "Thank you for telling us about your experience with {{serviceName}}.\n\n" +
      "Our concierge team has been notified and someone will personally reach out to make this right.\n\n" +
      "If you'd like to share more, simply reply to this email.",
    ctaLabel: null,
    ctaUrl: null,
  },
  PASSWORD_RESET: {
    subject: "Reset your HotelX password",
    heading: "Reset your password",
    body:
      "We received a request to reset the password for {{email}}.\n\n" +
      "If this was you, tap the button below within the next 30 minutes. " +
      "Otherwise you can safely ignore this email.",
    ctaLabel: "Reset password",
    ctaUrl: "{{resetUrl}}",
  },
  TEAM_INVITE: {
    subject: "You're invited to {{hotelName}} on HotelX",
    heading: "Welcome to the {{hotelName}} team",
    body:
      "Hi {{guestName}},\n\nYou've been invited to manage guest requests at {{hotelName}}. " +
      "Sign in with the temporary password below and update it from your profile.\n\n" +
      "Temporary password: {{tempPassword}}",
    ctaLabel: "Open dashboard",
    ctaUrl: "{{loginUrl}}",
  },
  WELCOME: {
    subject: "Welcome to HotelX, {{guestName}} — let's get {{hotelName}} live",
    heading: "Welcome aboard, {{guestName}}.",
    body:
      "You've just created {{hotelName}} on HotelX — and you're three steps away from a fully digital guest experience.\n\n" +
      "1. Add your rooms — import your room list so every QR code maps to the right guest.\n\n" +
      "2. Create services & menus — room service, spa bookings, restaurant orders. Set prices, photos, and availability.\n\n" +
      "3. Print QR codes — place them in each room. Guests scan and they're in.\n\n" +
      "The whole setup takes about 30 minutes. If you'd prefer a guided walkthrough, we'd love to hop on a free onboarding call — just reply to this email and we'll find a time.\n\n" +
      "We're here to help at every step.",
    ctaLabel: "Open your dashboard",
    ctaUrl: "{{dashboardUrl}}",
  },
};
