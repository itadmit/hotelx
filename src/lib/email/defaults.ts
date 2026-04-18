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
};
