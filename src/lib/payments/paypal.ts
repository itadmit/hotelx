import { PaymentStatus } from "@prisma/client";
import type {
  PaymentProviderAdapter,
  ProviderConfigShape,
  ProviderFactory,
} from "./types";

/**
 * PayPal adapter — STUB.
 *
 * The interface is wired through end-to-end so the admin can already pick
 * PayPal in the UI. The real OAuth + Orders v2 flow is intentionally left
 * for a follow-up. createIntent throws a controlled "coming soon" error so
 * the guest gets a clean message and the request is not silently created.
 */
export const createPayPalAdapter: ProviderFactory = (
  _config: ProviderConfigShape
): PaymentProviderAdapter => ({
  type: "PAYPAL",
  kind: "redirect",
  async test() {
    return {
      ok: false,
      message:
        "PayPal connector is in beta — the integration ships in the next release.",
    };
  },
  async createIntent() {
    throw new Error(
      "PayPal is not yet available. Please use Stripe or your custom processor."
    );
  },
  async confirm() {
    return {
      status: PaymentStatus.FAILED,
      errorMessage: "PayPal not implemented",
    };
  },
  async handleWebhook() {
    return { externalId: null, status: PaymentStatus.PENDING };
  },
});
