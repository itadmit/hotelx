import { PaymentStatus } from "@prisma/client";
import { createHmac } from "crypto";
import type {
  PaymentProviderAdapter,
  ProviderConfigShape,
  ProviderFactory,
} from "./types";

/**
 * Custom processor adapter.
 *
 * The hotel exposes two endpoints we POST to:
 *   - authorizeUrl  → returns { externalId, status, redirectUrl?, clientToken? }
 *   - confirmUrl    → returns { status, externalId? }
 *
 * Requests are signed with HMAC-SHA256 over the JSON body using
 * `signingSecret`. The signature lands in `x-hotelx-signature`.
 *
 * This is the headline of the marketing claim: any processor, no buy-in
 * needed from the processor. The hotel (or our integrations team) controls
 * both endpoints.
 */
export const createCustomAdapter: ProviderFactory = (
  config: ProviderConfigShape
): PaymentProviderAdapter => {
  const authorizeUrl = config.publicConfig.authorizeUrl ?? "";
  const confirmUrl = config.publicConfig.confirmUrl ?? "";
  const signingSecret = config.secretConfig.signingSecret ?? "";

  function sign(body: string): string {
    if (!signingSecret) return "";
    return createHmac("sha256", signingSecret).update(body).digest("hex");
  }

  async function post(url: string, payload: unknown): Promise<Record<string, unknown>> {
    const body = JSON.stringify(payload);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hotelx-signature": sign(body),
      },
      body,
    });
    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      json = {};
    }
    if (!res.ok) {
      throw new Error(
        typeof json.error === "string"
          ? json.error
          : `Custom processor returned ${res.status}`
      );
    }
    return json;
  }

  function mapStatus(value: unknown): PaymentStatus {
    const s = String(value ?? "").toUpperCase();
    if (s === "PAID" || s === "SUCCESS" || s === "SUCCEEDED")
      return PaymentStatus.PAID;
    if (s === "AUTHORIZED") return PaymentStatus.AUTHORIZED;
    if (s === "FAILED" || s === "ERROR") return PaymentStatus.FAILED;
    if (s === "CANCELLED" || s === "CANCELED") return PaymentStatus.CANCELLED;
    if (s === "REFUNDED") return PaymentStatus.REFUNDED;
    return PaymentStatus.PENDING;
  }

  return {
    type: "CUSTOM",
    kind: "external-form",
    async test() {
      if (!authorizeUrl) {
        return { ok: false, message: "Missing authorize URL" };
      }
      try {
        const u = new URL(authorizeUrl);
        return {
          ok: true,
          message: `Will POST to ${u.host} with HMAC signing`,
        };
      } catch {
        return { ok: false, message: "Invalid authorize URL" };
      }
    },
    async createIntent(input) {
      if (!authorizeUrl) {
        throw new Error("Custom processor is not configured (missing authorize URL).");
      }
      const result = await post(authorizeUrl, {
        paymentId: input.paymentId,
        amount: input.amount,
        currency: input.currency,
        idempotencyKey: input.idempotencyKey,
        service: { id: input.serviceId, name: input.serviceName },
        room: input.roomCode,
        hotel: { slug: input.hotelSlug, name: input.hotelName },
        notes: input.notes ?? null,
        callbackUrl: `${input.origin}/api/payments/webhook/custom`,
      });
      return {
        externalId: result.externalId ? String(result.externalId) : null,
        clientToken: result.clientToken ? String(result.clientToken) : undefined,
        redirectUrl: result.redirectUrl ? String(result.redirectUrl) : undefined,
        status: mapStatus(result.status),
        publicConfig: { processor: "custom" },
      };
    },
    async confirm(input) {
      if (!confirmUrl) {
        return {
          status: PaymentStatus.PENDING,
          externalId: input.externalId,
        };
      }
      try {
        const result = await post(confirmUrl, {
          paymentId: input.paymentId,
          externalId: input.externalId,
        });
        return {
          status: mapStatus(result.status),
          externalId: result.externalId
            ? String(result.externalId)
            : input.externalId,
        };
      } catch (e) {
        return {
          status: PaymentStatus.FAILED,
          errorMessage:
            e instanceof Error ? e.message : "Custom confirm failed",
        };
      }
    },
    async handleWebhook(rawBody) {
      try {
        const event = JSON.parse(rawBody) as Record<string, unknown>;
        return {
          externalId: event.externalId ? String(event.externalId) : null,
          status: mapStatus(event.status),
          raw: event,
        };
      } catch {
        return { externalId: null, status: PaymentStatus.FAILED };
      }
    },
  };
};
