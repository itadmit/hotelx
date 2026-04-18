import type { Notification } from "@prisma/client";

export type Channel = `staff:${string}` | `guest:${string}`;
type Listener = (n: Notification) => void;

declare global {
  // eslint-disable-next-line no-var
  var __hotelxNotificationBus: Map<Channel, Set<Listener>> | undefined;
}

const channels: Map<Channel, Set<Listener>> =
  globalThis.__hotelxNotificationBus ?? new Map();

if (!globalThis.__hotelxNotificationBus) {
  globalThis.__hotelxNotificationBus = channels;
}

export function staffChannel(hotelId: string): Channel {
  return `staff:${hotelId}`;
}

export function guestChannel(roomId: string): Channel {
  return `guest:${roomId}`;
}

export function subscribe(channel: Channel, listener: Listener): () => void {
  let set = channels.get(channel);
  if (!set) {
    set = new Set();
    channels.set(channel, set);
  }
  set.add(listener);
  return () => {
    const current = channels.get(channel);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) channels.delete(channel);
  };
}

export function publish(channel: Channel, notification: Notification): void {
  const set = channels.get(channel);
  if (!set) return;
  for (const listener of set) {
    try {
      listener(notification);
    } catch {
      // ignore listener errors so one bad subscriber doesn't break others
    }
  }
}
