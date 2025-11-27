import { Suspense } from "react";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { ServicePageClient } from "@/components/guest/ServicePageClient";
import { ServicePageSkeleton } from "@/components/guest/skeletons/ServicePageSkeleton";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function ServicePageContent({
  hotelSlug,
  roomCode,
  serviceId,
}: {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
}) {

  // Try to find service by slug first, then by ID (for backwards compatibility)
  let service = await prisma.service.findFirst({
    where: { 
      slug: serviceId,
      hotel: {
        slug: hotelSlug
      }
    },
    include: {
      hotel: true,
      category: true,
      customFields: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // If not found by slug, try by ID
  if (!service) {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        hotel: true,
        category: true,
        customFields: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  if (!service || service.hotel.slug !== hotelSlug) {
    return notFound();
  }

  const room = await prisma.room.findFirst({
    where: { 
      number: roomCode,
      hotelId: service.hotel.id
    },
  });

  if (!room) {
    return notFound();
  }

  const formattedPrice = service.price 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(Number(service.price))
    : "Free";

  return (
    <GuestLayout>
      <ServicePageClient
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        serviceId={serviceId}
        serviceName={service.name}
        serviceDescription={service.description}
        serviceImage={service.image}
        formattedPrice={formattedPrice}
        estimatedTime={service.estimatedTime}
        roomNumber={room.number}
        primaryColor={service.hotel.primaryColor}
        customFields={service.customFields}
        categorySlug={service.category.slug}
      />
    </GuestLayout>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; serviceId: string }>;
}) {
  const { hotelSlug, roomCode, serviceId } = await params;

  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <ServicePageContent hotelSlug={hotelSlug} roomCode={roomCode} serviceId={serviceId} />
    </Suspense>
  );
}
