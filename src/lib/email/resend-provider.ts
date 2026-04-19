import { Resend } from "resend";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "./types";

/**
 * Resend-based EmailProvider.
 *
 * If RESEND_API_KEY is not set, the provider runs in "simulated" mode:
 * the email is logged but never actually delivered. This keeps local
 * development friction-free while production uses a real key.
 */
export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";
  private client: Resend | null;
  private defaultFromEmail: string;
  private defaultFromName: string;

  constructor() {
    const key = process.env.RESEND_API_KEY ?? "";
    this.client = key ? new Resend(key) : null;
    this.defaultFromEmail =
      process.env.EMAIL_FROM ?? "HotelX <hello@hotelx.app>";
    this.defaultFromName = process.env.EMAIL_FROM_NAME ?? "HotelX";
  }

  get isLive(): boolean {
    return Boolean(this.client);
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const fromEmail = input.fromEmail ?? this.extractEmail(this.defaultFromEmail);
    const fromName = input.fromName ?? this.defaultFromName;
    const from = `${fromName} <${fromEmail}>`;

    if (!this.client) {
      return { ok: true, simulated: true };
    }

    try {
      const result = await this.client.emails.send({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo,
      });
      if (result.error) {
        return {
          ok: false,
          error: result.error.message ?? "Resend send failed",
        };
      }
      return { ok: true, externalId: result.data?.id ?? null };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Email provider crashed",
      };
    }
  }

  private extractEmail(value: string): string {
    const match = value.match(/<([^>]+)>/);
    return match ? match[1] : value;
  }
}
