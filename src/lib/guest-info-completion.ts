export type GuestInfoCompletionStatus = {
  wifi: boolean;
  about: boolean;
  amenities: boolean;
  helpful: boolean;
};

type InfoSnapshot = {
  wifiName?: string | null;
  wifiPassword?: string | null;
  about?: string | null;
  helpfulInfo?: string | null;
};

/**
 * Mirrors the onboarding checks in guest-info routes — used when bundling
 * dashboard data so we avoid duplicate `/api/hotel/info` calls.
 */
export function guestInfoCompletionFromResponses(
  infoPayload: unknown,
  amenitiesPayload: unknown
): GuestInfoCompletionStatus | null {
  try {
    const info = (infoPayload as { info?: InfoSnapshot | null })?.info ?? null;
    const amenities =
      (amenitiesPayload as { amenities?: unknown[] })?.amenities ?? [];
    return {
      wifi: Boolean(info?.wifiName || info?.wifiPassword),
      about: Boolean(info?.about && String(info.about).trim().length > 0),
      amenities: amenities.length > 0,
      helpful: Boolean(
        info?.helpfulInfo && String(info.helpfulInfo).trim().length > 0
      ),
    };
  } catch {
    return null;
  }
}
