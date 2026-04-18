import type { EmailTemplateKind } from "@prisma/client";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  hotelId?: string | null;
  template?: EmailTemplateKind | null;
  meta?: Record<string, unknown>;
};

export type SendEmailResult = {
  ok: boolean;
  externalId?: string | null;
  error?: string;
  simulated?: boolean;
};

export interface EmailProvider {
  readonly name: string;
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
