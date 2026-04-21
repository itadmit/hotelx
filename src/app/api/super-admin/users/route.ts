import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/server-auth";

export type SuperAdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  hotel: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    demoSeedAt: Date | null;
    _count: {
      rooms: number;
      categories: number;
      requests: number;
      services: number;
    };
  } | null;
  manualRoomsAfterDemo: number | null;
  manualServicesAfterDemo: number | null;
  engagementLabel: string;
};

function engagementLabel(row: {
  lastLoginAt: Date | null;
  hotel: SuperAdminUserRow["hotel"];
  manualRoomsAfterDemo: number | null;
  manualServicesAfterDemo: number | null;
}): string {
  if (!row.hotel) return "No hotel";

  const h = row.hotel;
  const hasCatalog =
    h._count.categories > 0 || h._count.services > 0 || h._count.requests > 0;
  const hasRoomsOnly =
    h._count.rooms > 0 && !hasCatalog && h._count.requests === 0;
  const hotelTouched = h.updatedAt.getTime() > h.createdAt.getTime() + 2000;
  const demo = !!h.demoSeedAt;
  const manual =
    (row.manualRoomsAfterDemo ?? 0) + (row.manualServicesAfterDemo ?? 0) > 0;
  const loggedIn = !!row.lastLoginAt;

  if (!loggedIn && !demo && !hasCatalog && h._count.rooms === 0)
    return "Registered only";
  if (!loggedIn && !demo && hasRoomsOnly) return "Rooms only (no login yet)";
  if (demo && manual) return "Demo import + manual adds";
  if (demo && !manual) return "Demo import only";
  if (!demo && hasCatalog) return "Manual catalog (no demo)";
  if (loggedIn && !hasCatalog && h._count.rooms === 0)
    return "Logged in, empty hotel";
  if (hotelTouched && !demo && !hasCatalog) return "Touched settings";
  return loggedIn ? "Active" : "In progress";
}

export async function GET() {
  try {
    await requireSuperAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        hotel: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
            demoSeedAt: true,
            _count: {
              select: {
                rooms: true,
                categories: true,
                requests: true,
                services: true,
              },
            },
          },
        },
      },
    });

    const enriched: SuperAdminUserRow[] = await Promise.all(
      users.map(async (u) => {
        let manualRoomsAfterDemo: number | null = null;
        let manualServicesAfterDemo: number | null = null;

        if (u.hotel?.demoSeedAt) {
          const t = u.hotel.demoSeedAt;
          ;[manualRoomsAfterDemo, manualServicesAfterDemo] = await Promise.all([
            prisma.room.count({
              where: { hotelId: u.hotel.id, createdAt: { gt: t } },
            }),
            prisma.service.count({
              where: { hotelId: u.hotel.id, createdAt: { gt: t } },
            }),
          ]);
        }

        const row: SuperAdminUserRow = {
          ...u,
          manualRoomsAfterDemo,
          manualServicesAfterDemo,
          engagementLabel: "",
        };
        row.engagementLabel = engagementLabel(row);
        return row;
      })
    );

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
