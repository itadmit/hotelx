import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServiceEditorForm } from "@/components/dashboard/ServiceEditorForm";

export default async function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId as string;

  // Fetch real service data
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!service || service.hotelId !== hotelId) {
    redirect("/dashboard/services");
  }

  // Fetch all categories for the select dropdown
  const categories = await prisma.category.findMany({
    where: { 
      hotelId,
      parentId: null, // Only main categories
    },
    orderBy: { order: 'asc' }
  });

  return <ServiceEditorForm service={service} categories={categories} />;
}

