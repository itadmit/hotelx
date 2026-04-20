import prisma from "@/lib/prisma";
import {
  EmailStatus,
  EmailTemplateKind,
  type HotelEmailTemplate,
} from "@prisma/client";
import { ResendEmailProvider } from "./resend-provider";
import {
  renderTemplate,
  type EmailVariables,
  type EmailTemplate,
} from "./render";
import { DEFAULT_TEMPLATES } from "./defaults";
import type { EmailProvider, SendEmailResult } from "./types";

let cachedProvider: EmailProvider | null = null;
function getProvider(): EmailProvider {
  if (!cachedProvider) {
    cachedProvider = new ResendEmailProvider();
  }
  return cachedProvider;
}

/**
 * Resolve the active template for a given hotel + kind.
 *
 * Lookup order:
 *   1. Hotel override (HotelEmailTemplate where isActive)
 *   2. Built-in default
 */
export async function resolveTemplate(
  hotelId: string | null | undefined,
  kind: EmailTemplateKind
): Promise<EmailTemplate> {
  if (hotelId) {
    const override = await prisma.hotelEmailTemplate.findUnique({
      where: { hotelId_kind: { hotelId, kind } },
    });
    if (override && override.isActive) {
      return toEmailTemplate(override);
    }
  }

  const global = await prisma.hotelEmailTemplate.findFirst({
    where: { hotelId: null, kind, isActive: true },
  });
  if (global) {
    return toEmailTemplate(global);
  }

  return DEFAULT_TEMPLATES[kind];
}

function toEmailTemplate(row: HotelEmailTemplate): EmailTemplate {
  return {
    subject: row.subject,
    heading: row.heading,
    body: row.body,
    ctaLabel: row.ctaLabel,
    ctaUrl: row.ctaUrl,
  };
}

/**
 * Send a templated email. Always logs to EmailLog regardless of
 * provider success/simulation, so the dashboard can show delivery
 * health.
 */
export async function sendTemplatedEmail(input: {
  to: string;
  hotelId?: string | null;
  template: EmailTemplateKind;
  variables: EmailVariables;
  replyTo?: string;
  fromName?: string;
}): Promise<SendEmailResult> {
  const tpl = await resolveTemplate(input.hotelId ?? null, input.template);
  const rendered = renderTemplate(tpl, input.variables);

  const provider = getProvider();
  const result = await provider.send({
    to: input.to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    replyTo: input.replyTo,
    fromName: input.fromName,
    hotelId: input.hotelId ?? null,
    template: input.template,
  });

  try {
    await prisma.emailLog.create({
      data: {
        hotelId: input.hotelId ?? null,
        to: input.to,
        subject: rendered.subject,
        template: input.template,
        provider: provider.name,
        externalId: result.externalId ?? null,
        status: result.simulated
          ? EmailStatus.SIMULATED
          : result.ok
          ? EmailStatus.SENT
          : EmailStatus.FAILED,
        error: result.error ?? null,
        meta: {
          variables: sanitizeVariables(input.variables),
        } as object,
      },
    });
  } catch (e) {
    console.error("[email] failed to write EmailLog", e);
  }

  return result;
}

function sanitizeVariables(vars: EmailVariables): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(vars)) {
    if (k.toLowerCase().includes("password") || k.toLowerCase().includes("token")) {
      out[k] = "[redacted]";
    } else {
      out[k] = v ?? null;
    }
  }
  return out;
}
