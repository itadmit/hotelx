import { PaymentStatus } from "@prisma/client";
import type {
  PaymentProviderAdapter,
  ProviderConfigShape,
  ProviderFactory,
} from "./types";

export const createMockAdapter: ProviderFactory = (
  _config: ProviderConfigShape
): PaymentProviderAdapter => ({
  type: "MOCK",
  kind: "auto",
  async test() {
    return { ok: true, message: "Mock processor — always succeeds" };
  },
  async createIntent(input) {
    return {
      externalId: `mock_${input.paymentId}`,
      status: PaymentStatus.PENDING,
      publicConfig: { mode: "auto" },
    };
  },
  async confirm(input) {
    return {
      status: PaymentStatus.PAID,
      externalId: input.externalId,
      metadata: { confirmedBy: "mock" },
    };
  },
  async handleWebhook() {
    return { externalId: null, status: PaymentStatus.PAID };
  },
});
