import { NotificationType, RequestStatus } from "@prisma/client";

export type TemplateContext = {
  serviceName?: string | null;
  roomNumber?: string | null;
  status?: RequestStatus | null;
  assigneeName?: string | null;
  amount?: number | null;
  currency?: string | null;
  hotelSlug?: string | null;
  roomCode?: string | null;
  requestId?: string | null;
};

export type RenderedTemplate = {
  title: string;
  body?: string;
  href?: string;
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  NEW: "received",
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

function staffRequestHref(requestId?: string | null): string | undefined {
  return requestId ? `/dashboard/requests?id=${requestId}` : "/dashboard/requests";
}

function guestRequestHref(ctx: TemplateContext): string | undefined {
  if (ctx.hotelSlug && ctx.roomCode && ctx.requestId) {
    return `/g/${ctx.hotelSlug}/${ctx.roomCode}/request/${ctx.requestId}`;
  }
  return undefined;
}

function formatMoney(amount?: number | null, currency?: string | null): string {
  if (amount == null) return "";
  const code = (currency ?? "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${code}`;
  }
}

export function renderStaff(
  type: NotificationType,
  ctx: TemplateContext
): RenderedTemplate {
  const room = ctx.roomNumber ? ` · Room ${ctx.roomNumber}` : "";
  const service = ctx.serviceName ?? "Service";
  const href = staffRequestHref(ctx.requestId);

  switch (type) {
    case "REQUEST_CREATED":
      return {
        title: `New request — ${service}${room}`,
        body: "Tap to open and assign or update status.",
        href,
      };
    case "REQUEST_STATUS_CHANGED": {
      const label = ctx.status ? STATUS_LABEL[ctx.status] : "updated";
      return {
        title: `Request ${label} — ${service}${room}`,
        href,
      };
    }
    case "REQUEST_ASSIGNED":
      return {
        title: `Assigned — ${service}${room}`,
        body: ctx.assigneeName ? `Owner: ${ctx.assigneeName}` : undefined,
        href,
      };
    case "REQUEST_COMPLETED":
      return {
        title: `Completed — ${service}${room}`,
        href,
      };
    case "PAYMENT_PAID":
      return {
        title: `Payment received — ${service}${room}`,
        body: formatMoney(ctx.amount, ctx.currency) || undefined,
        href,
      };
    case "PAYMENT_FAILED":
      return {
        title: `Payment failed — ${service}${room}`,
        body: "The guest's payment didn't go through.",
        href,
      };
    case "FEEDBACK_RECEIVED":
      return {
        title: `Positive feedback — ${service}${room}`,
        body: "A happy guest shared a 5-star moment.",
        href: "/dashboard/feedback",
      };
    case "FEEDBACK_ESCALATION":
      return {
        title: `Service recovery — ${service}${room}`,
        body: "A guest left low feedback. Reach out and make it right.",
        href: "/dashboard/feedback",
      };
  }
}

export function renderGuest(
  type: NotificationType,
  ctx: TemplateContext
): RenderedTemplate {
  const service = ctx.serviceName ?? "your request";
  const href = guestRequestHref(ctx);

  switch (type) {
    case "REQUEST_CREATED":
      return {
        title: "We've got your request",
        body: `${service} is on its way.`,
        href,
      };
    case "REQUEST_STATUS_CHANGED": {
      const label = ctx.status ? STATUS_LABEL[ctx.status] : "updated";
      return {
        title: `${service} — ${label}`,
        href,
      };
    }
    case "REQUEST_COMPLETED":
      return {
        title: `${service} is ready`,
        body: "Enjoy — and tell us if anything's off.",
        href,
      };
    case "REQUEST_ASSIGNED":
      return {
        title: `${service} is being prepared`,
        body: ctx.assigneeName ? `${ctx.assigneeName} is on it.` : undefined,
        href,
      };
    case "PAYMENT_PAID":
      return {
        title: "Payment confirmed",
        body: formatMoney(ctx.amount, ctx.currency) || undefined,
        href,
      };
    case "PAYMENT_FAILED":
      return {
        title: "Payment didn't go through",
        body: "Please try again or use another card.",
        href,
      };
    case "FEEDBACK_RECEIVED":
    case "FEEDBACK_ESCALATION":
      return {
        title: "Thank you for your feedback",
        href,
      };
  }
}
