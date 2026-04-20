import type { RequestStatus } from "@prisma/client";
import {
  guestInfoCompletionFromResponses,
  type GuestInfoCompletionStatus,
} from "@/lib/guest-info-completion";

export type DashboardBundleStats = {
  totalRequests: number;
  openRequests: number;
  completedRequests: number;
  roomsCount: number;
  servicesCount: number;
  avgResponseMinutes: number | null;
  topService: string | null;
};

export type DashboardRequestRow = {
  id: string;
  status: RequestStatus;
  createdAt: string;
  room: { number: string };
  service: { name: string };
};

export type DashboardBundle = {
  stats: DashboardBundleStats | null;
  requests: DashboardRequestRow[];
  rooms: Array<{ id: string; number: string }>;
  services: Array<{ id: string; name: string }>;
  guestCompletion: GuestInfoCompletionStatus | null;
};

let inflight: Promise<DashboardBundle> | null = null;
let recent: { at: number; bundle: DashboardBundle } | null = null;

/** Next dev Strict Mode mounts twice quickly — reuse fresh result briefly. */
const INITIAL_REUSE_MS = 450;

async function fetchDashboardBundleFresh(): Promise<DashboardBundle> {
  const [
    analyticsRes,
    reqRes,
    roomsRes,
    servicesRes,
    infoRes,
    amenitiesRes,
  ] = await Promise.all([
    fetch("/api/analytics/overview", { cache: "no-store" }),
    fetch("/api/requests", { cache: "no-store" }),
    fetch("/api/rooms", { cache: "no-store" }),
    fetch("/api/services", { cache: "no-store" }),
    fetch("/api/hotel/info", { cache: "no-store" }),
    fetch("/api/hotel/amenities", { cache: "no-store" }),
  ]);

  const [
    analyticsData,
    reqData,
    roomData,
    serviceData,
    infoJson,
    amenitiesJson,
  ] = await Promise.all([
    analyticsRes.json(),
    reqRes.json(),
    roomsRes.json(),
    servicesRes.json(),
    infoRes.json(),
    amenitiesRes.json(),
  ]);

  const stats = (analyticsData?.stats ?? null) as DashboardBundleStats | null;
  const requests = (reqData?.requests ?? []) as DashboardRequestRow[];
  const rooms = (roomData?.rooms ?? []) as DashboardBundle["rooms"];
  const services = (serviceData?.services ?? []) as DashboardBundle["services"];

  let guestCompletion: GuestInfoCompletionStatus | null = null;
  try {
    guestCompletion = guestInfoCompletionFromResponses(infoJson, amenitiesJson);
  } catch {
    guestCompletion = null;
  }

  const bundle: DashboardBundle = {
    stats,
    requests,
    rooms,
    services,
    guestCompletion,
  };

  recent = { at: Date.now(), bundle };
  return bundle;
}

/**
 * One wave of dashboard API reads. De-duplicates concurrent callers (Strict Mode).
 * Initial load may reuse the last bundle briefly so the double-mount does not repeat work.
 */
export async function fetchDashboardBundle(options: {
  /** Strict Mode second pass — reuse if the first bundle just finished */
  reuseInitialPass?: boolean;
}): Promise<DashboardBundle> {
  const reuse = options.reuseInitialPass ?? false;
  const now = Date.now();

  if (reuse && recent && now - recent.at < INITIAL_REUSE_MS) {
    return recent.bundle;
  }

  if (inflight) {
    return inflight;
  }

  inflight = fetchDashboardBundleFresh().finally(() => {
    inflight = null;
  });

  return inflight;
}
