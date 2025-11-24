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

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      hotel: true,
      customFields: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!service || service.hotel.slug !== hotelSlug) {
    return notFound();
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room || room.hotelId !== service.hotel.id) {
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
