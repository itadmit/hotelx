import { PaymentStatus } from "@prisma/client";
import type {
  PaymentProviderAdapter,
  ProviderConfigShape,
  ProviderFactory,
} from "./types";

type StripeIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "requires_capture"
  | "canceled"
  | "succeeded";

function mapStripeStatus(s: StripeIntentStatus | string): PaymentStatus {
  switch (s) {
    case "succeeded":
      return PaymentStatus.PAID;
    case "processing":
      return PaymentStatus.AUTHORIZED;
    case "requires_capture":
      return PaymentStatus.AUTHORIZED;
    case "canceled":
      return PaymentStatus.CANCELLED;
    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
      return PaymentStatus.PENDING;
    default:
      return PaymentStatus.PENDING;
  }
}

async function stripeFetch(
  secretKey: string,
  path: string,
  init: { method: "GET" | "POST"; body?: Record<string, string> }
): Promise<Record<string, unknown>> {
  const url = `https://api.stripe.com/v1${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`,
    "Stripe-Version": "2024-06-20",
  };
  let body: string | undefined;
  if (init.body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(init.body).toString();
  }
  const res = await fetch(url, { method: init.method, headers, body });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const errObj =
      typeof json.error === "object" && json.error !== null
        ? (json.error as { message?: string })
        : null;
    throw new Error(errObj?.message ?? `Stripe error (${res.status})`);
  }
  return json;
}

export const createStripeAdapter: ProviderFactory = (
  config: ProviderConfigShape
): PaymentProviderAdapter => {
  const publishableKey = config.publicConfig.publishableKey ?? "";
  const secretKey = config.secretConfig.secretKey ?? "";

  return {
    type: "STRIPE",
    kind: "embedded-card",
    async test() {
      if (!secretKey) {
        return { ok: false, message: "Missing Stripe secret key" };
      }
      try {
        await stripeFetch(secretKey, "/balance", { method: "GET" });
        return { ok: true, message: "Stripe credentials look good" };
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : "Stripe test failed",
        };
      }
    },
    async createIntent(input) {
      if (!secretKey) {
        throw new Error("Stripe is not configured (missing secret key).");
      }
      const amountInMinorUnits = Math.round(input.amount * 100);
      const params: Record<string, string> = {
        amount: String(amountInMinorUnits),
        currency: input.currency.toLowerCase(),
        "automatic_payment_methods[enabled]": "true",
        description: `${input.serviceName} · ${input.hotelName} · Room ${input.roomCode}`,
        "metadata[paymentId]": input.paymentId,
        "metadata[hotelSlug]": input.hotelSlug,
        "metadata[roomCode]": input.roomCode,
        "metadata[serviceId]": input.serviceId,
      };
      const intent = await stripeFetch(secretKey, "/payment_intents", {
        method: "POST",
        body: params,
      });
      return {
        externalId: String(intent.id ?? ""),
        clientToken: String(intent.client_secret ?? ""),
        status: mapStripeStatus(String(intent.status ?? "")),
        publicConfig: { publishableKey },
        metadata: {
          intent_id: intent.id,
        },
      };
    },
    async confirm(input) {
      if (!input.externalId) {
        return {
          status: PaymentStatus.FAILED,
          errorMessage: "Missing payment intent id",
        };
      }
      try {
        const intent = await stripeFetch(
          secretKey,
          `/payment_intents/${input.externalId}`,
          { method: "GET" }
        );
        return {
          status: mapStripeStatus(String(intent.status ?? "")),
          externalId: String(intent.id ?? input.externalId),
          metadata: { last_status: intent.status },
        };
      } catch (e) {
        return {
          status: PaymentStatus.FAILED,
          errorMessage: e instanceof Error ? e.message : "Stripe confirm failed",
        };
      }
    },
    async handleWebhook(rawBody) {
      try {
        const event = JSON.parse(rawBody) as {
          type?: string;
          data?: { object?: { id?: string; status?: string } };
        };
        const obj = event.data?.object ?? {};
        return {
          externalId: obj.id ?? null,
          status: mapStripeStatus(String(obj.status ?? "")),
          raw: event.type,
        };
      } catch {
        return { externalId: null, status: PaymentStatus.FAILED };
      }
    },
  };
};
