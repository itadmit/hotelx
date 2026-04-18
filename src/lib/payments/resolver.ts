import prisma from "@/lib/prisma";
import { loadAdapterFromRow } from "./registry";

export async function resolveDefaultProviderRow(hotelId: string) {
  const row = await prisma.paymentProvider.findFirst({
    where: { hotelId, isActive: true },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
  return row;
}

export async function resolveDefaultAdapter(hotelId: string) {
  const row = await resolveDefaultProviderRow(hotelId);
  if (!row) return null;
  return {
    row,
    adapter: loadAdapterFromRow(row),
  };
}
