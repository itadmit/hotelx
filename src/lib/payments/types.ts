import type { PaymentProviderType, PaymentStatus } from "@prisma/client";

export type ProviderType = PaymentProviderType;

export type PaymentMethodKind =
  | "embedded-card"
  | "redirect"
  | "external-form"
  | "auto";

export interface CreateIntentInput {
  amount: number;
  currency: string;
  hotelSlug: string;
  hotelName: string;
  roomCode: string;
  serviceId: string;
  serviceName: string;
  notes?: string;
  paymentId: string;
  idempotencyKey: string;
  origin: string;
}

export interface CreateIntentResult {
  externalId: string | null;
  clientToken?: string;
  publicConfig?: Record<string, string>;
  redirectUrl?: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
}

export interface ConfirmInput {
  externalId: string | null;
  paymentId: string;
}

export interface ConfirmResult {
  status: PaymentStatus;
  externalId?: string | null;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
}

export interface WebhookEvent {
  externalId: string | null;
  status: PaymentStatus;
  raw?: unknown;
}

export interface PaymentProviderAdapter {
  type: ProviderType;
  kind: PaymentMethodKind;
  /** Pre-flight: validate stored config (used by /test). */
  test(): Promise<{ ok: boolean; message: string }>;
  createIntent(input: CreateIntentInput): Promise<CreateIntentResult>;
  confirm(input: ConfirmInput): Promise<ConfirmResult>;
  handleWebhook(rawBody: string, headers: Headers): Promise<WebhookEvent>;
}

export interface ProviderConfigShape {
  /** Public, non-secret values shown to admin/UI. */
  publicConfig: Record<string, string>;
  /** Secret values, encrypted at rest. */
  secretConfig: Record<string, string>;
}

export type ProviderFactory = (
  config: ProviderConfigShape
) => PaymentProviderAdapter;
