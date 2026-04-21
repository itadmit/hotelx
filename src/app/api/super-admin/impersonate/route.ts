import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiAuthError, requireSuperAdmin } from "@/lib/server-auth";
import { createImpersonationToken } from "@/lib/impersonation-token";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const admin = await requireSuperAdmin();
    const body = await request.json();
    const { userId } = schema.parse(body);

    if (userId === admin.id) {
      return NextResponse.json(
        { error: "Cannot impersonate yourself" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, hotelId: true },
    });

    if (!target?.hotelId) {
      return NextResponse.json(
        { error: "User has no hotel — cannot open dashboard" },
        { status: 400 }
      );
    }

    const token = createImpersonationToken(admin.email!, target.id);
    if (!token) {
      return NextResponse.json(
        { error: "Server misconfiguration (NEXTAUTH_SECRET)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ token });
  } catch (e) {
    if (e instanceof ApiAuthError) {
      const status = e.message === "Forbidden" ? 403 : 401;
      return NextResponse.json({ error: e.message }, { status });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
