import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServicesClient } from "@/components/dashboard/ServicesClient";

export default async function ServicesPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      where: { hotelId },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany({
      where: { 
        hotelId,
        parentId: null, // Only main categories, not sub-categories
      },
      orderBy: { order: 'asc' }
    })
  ]);

  const formattedServices = services.map(service => ({
    id: service.id,
    name: service.name,
    category: service.category.name,
    price: service.price ? `$${Number(service.price).toFixed(2)}` : "Free",
    time: service.estimatedTime || "15-30 min",
    status: service.isActive ? "Active" : "Inactive",
    description: service.description || ""
  }));

  return <ServicesClient services={formattedServices} categories={categories} />;
}
