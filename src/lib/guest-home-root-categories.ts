import prisma from "@/lib/prisma";

/**
 * Slugs that must appear as home tiles even when `parentId` was set by mistake
 * (common when "Spa" was created under another department — it would otherwise
 * be hidden from the guest home grid which only lists root categories).
 */
const HOME_TILE_SLUGS_EVEN_IF_NESTED = ["spa"] as const;

export type GuestHomeCategoryTile = {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
};

/**
 * Root categories for the guest concierge home, plus pinned slugs that exist
 * only as children (so guests can still open Spa, etc.).
 */
export async function loadGuestHomeCategoryTiles(
  hotelId: string
): Promise<GuestHomeCategoryTile[]> {
  const roots = await prisma.category.findMany({
    where: { hotelId, parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      icon: true,
      slug: true,
      order: true,
    },
  });

  const seen = new Set(roots.map((r) => r.id));
  const pinned: typeof roots = [];

  for (const slug of HOME_TILE_SLUGS_EVEN_IF_NESTED) {
    const row = await prisma.category.findFirst({
      where: {
        hotelId,
        slug,
        parentId: { not: null },
      },
      select: {
        id: true,
        name: true,
        icon: true,
        slug: true,
        order: true,
      },
    });
    if (row && !seen.has(row.id)) {
      pinned.push(row);
      seen.add(row.id);
    }
  }

  const merged = [...roots, ...pinned].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });

  return merged.map(({ id, name, icon, slug }) => ({ id, name, icon, slug }));
}
