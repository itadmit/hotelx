import prisma from "@/lib/prisma";
import {
  NotificationAudience,
  NotificationType,
  type Notification,
} from "@prisma/client";
import { guestChannel, publish, staffChannel } from "./bus";
import {
  renderGuest,
  renderStaff,
  type TemplateContext,
} from "./templates";

const MAX_BODY = 280;

export type EmitOptions = {
  hotelId: string;
  audience: NotificationAudience;
  type: NotificationType;
  context: TemplateContext;
  roomId?: string | null;
  requestId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

function clamp(text: string | undefined, max: number): string | undefined {
  if (!text) return undefined;
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

async function emitOne(opts: EmitOptions): Promise<Notification | null> {
  const rendered =
    opts.audience === "STAFF"
      ? renderStaff(opts.type, opts.context)
      : renderGuest(opts.type, opts.context);

  if (!rendered) return null;

  try {
    const created = await prisma.notification.create({
      data: {
        hotelId: opts.hotelId,
        audience: opts.audience,
        type: opts.type,
        title: clamp(rendered.title, 140) ?? rendered.title,
        body: clamp(rendered.body ?? undefined, MAX_BODY) ?? null,
        href: rendered.href ?? null,
        roomId: opts.roomId ?? null,
        requestId: opts.requestId ?? null,
        userId: opts.userId ?? null,
        metadata: (opts.metadata ?? {}) as object,
      },
    });

    if (opts.audience === "STAFF") {
      publish(staffChannel(opts.hotelId), created);
    } else if (opts.roomId) {
      publish(guestChannel(opts.roomId), created);
    }

    return created;
  } catch (err) {
    console.error("[notifications] emit failed", err);
    return null;
  }
}

export async function emitNotification(
  opts: EmitOptions
): Promise<Notification | null> {
  return emitOne(opts);
}

export type DualEmitInput = {
  hotelId: string;
  type: NotificationType;
  context: TemplateContext;
  roomId?: string | null;
  requestId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function emitForBoth(input: DualEmitInput): Promise<void> {
  await Promise.all([
    emitOne({ ...input, audience: "STAFF" }),
    input.roomId
      ? emitOne({ ...input, audience: "GUEST" })
      : Promise.resolve(null),
  ]);
}
