/**
 * Parent categories that show one aggregated menu (all child services)
 * plus the horizontal subcategory strip — same UX as the seeded
 * `room-service` hub, even if the hotel used a slightly different slug.
 */
export function isRoomServiceHubSlug(slug: string | null | undefined): boolean {
  if (!slug) return false
  const s = slug.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-")
  if (s === "room-service" || s === "roomservice") return true
  if (s === "in-room-dining" || s === "inroom-dining" || s === "room-dining")
    return true
  return false
}
