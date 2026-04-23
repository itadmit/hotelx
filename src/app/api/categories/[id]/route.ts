import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { isValidCategoryIconKey } from "@/lib/category-icons";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  icon: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSessionUser();
    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findFirst({
      where: { id, hotelId: user.hotelId! },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (parsed.data.icon !== undefined && !isValidCategoryIconKey(parsed.data.icon)) {
      return NextResponse.json(
        { error: "Invalid icon key" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name.trim() } : {}),
        ...(parsed.data.icon !== undefined ? { icon: parsed.data.icon } : {}),
        ...(parsed.data.order !== undefined ? { order: parsed.data.order } : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        order: true,
        parentId: true,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
