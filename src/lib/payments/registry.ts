import { PaymentProviderType } from "@prisma/client";
import { decryptJson } from "@/lib/crypto";
import type { PaymentProviderAdapter, ProviderConfigShape } from "./types";
import { createMockAdapter } from "./mock";
import { createStripeAdapter } from "./stripe";
import { createPayPalAdapter } from "./paypal";
import { createCustomAdapter } from "./custom";

export function getProviderAdapter(
  type: PaymentProviderType,
  config: ProviderConfigShape
): PaymentProviderAdapter {
  switch (type) {
    case "STRIPE":
      return createStripeAdapter(config);
    case "PAYPAL":
      return createPayPalAdapter(config);
    case "CUSTOM":
      return createCustomAdapter(config);
    case "MOCK":
    default:
      return createMockAdapter(config);
  }
}

export function loadAdapterFromRow(row: {
  type: PaymentProviderType;
  publicConfig: unknown;
  secretConfig: string;
}): PaymentProviderAdapter {
  const publicConfig = (row.publicConfig ?? {}) as Record<string, string>;
  const secretConfig = decryptJson<Record<string, string>>(row.secretConfig);
  return getProviderAdapter(row.type, { publicConfig, secretConfig });
}

export const PROVIDER_LABEL: Record<PaymentProviderType, string> = {
  STRIPE: "Stripe",
  PAYPAL: "PayPal",
  CUSTOM: "Custom processor",
  MOCK: "Mock (demo)",
};

export const PROVIDER_BLURB: Record<PaymentProviderType, string> = {
  STRIPE: "Cards, wallets, and 3DS via Stripe Elements.",
  PAYPAL: "PayPal Orders v2 (beta — coming next release).",
  CUSTOM:
    "Bring your own processor. Two webhooks, HMAC-signed. We build the integration.",
  MOCK: "Auto-confirms in 1s. Useful for demos and dev environments.",
};
