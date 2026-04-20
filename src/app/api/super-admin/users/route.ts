import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/server-auth";

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
        hotel: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                rooms: true,
                categories: true,
                requests: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
