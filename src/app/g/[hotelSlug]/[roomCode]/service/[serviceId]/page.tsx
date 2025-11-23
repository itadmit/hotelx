import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { ServiceRequestFormWrapper } from "@/components/guest/ServiceRequestFormWrapper";
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
      {/* Image Header */}
      <div className="relative h-56 bg-gray-200">
        <Link 
          href={`/g/${hotelSlug}/${roomCode}`}
          className="absolute top-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <ChevronLeft className="h-6 w-6 text-gray-900" />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={service.image || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"} 
          alt={service.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-left">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold font-heading text-gray-900">{service.name}</h1>
          <span className="text-xl font-bold text-primary">{formattedPrice}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4" />
          <span>Estimated time: {service.estimatedTime || "15-30 mins"}</span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {service.description || "No description available."}
        </p>

        {/* Quantity & Order Button */}
        <ServiceRequestFormWrapper
          hotelSlug={hotelSlug}
          roomCode={roomCode}
          serviceId={serviceId}
          price={formattedPrice}
          roomNumber={room.number}
          primaryColor={service.hotel.primaryColor}
          customFields={service.customFields}
        />
      </div>
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
