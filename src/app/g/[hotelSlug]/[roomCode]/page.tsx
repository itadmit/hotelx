import { Suspense } from "react";
import { GuestHomeSkeleton } from "@/components/guest/skeletons/GuestHomeSkeleton";
import { GuestHomeClient } from "@/components/guest/GuestHomeClient";
import { GuestWelcome } from "@/components/guest/GuestWelcome";
import { getGuestSession } from "@/lib/guestSession";
import { registerGuest, continueAsGuest } from "@/app/actions/guestSession";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function GuestHomeContent({
  hotelSlug,
  roomCode,
}: {
  hotelSlug: string;
  roomCode: string;
}) {
  // Check if guest has a session
  const guestSession = await getGuestSession(hotelSlug, roomCode);

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        where: { 
          isActive: true,
          parentId: null, // Only show main categories, not sub-categories
        },
        orderBy: { order: 'asc' },
      },
      services: {
        where: { isActive: true },
        take: 6,
      }
    }
  });

  if (!hotel) {
    return notFound();
  }

  const room = await prisma.room.findFirst({
    where: { 
      number: roomCode,
      hotelId: hotel.id
    },
  });

  if (!room) {
    return notFound();
  }

  // If no session, show welcome screen
  if (!guestSession) {
    async function handleRegister(data: { fullName: string; phoneNumber: string; email?: string }) {
      "use server";
      const formData = new FormData();
      formData.append("hotelSlug", hotelSlug);
      formData.append("roomCode", roomCode);
      formData.append("fullName", data.fullName);
      formData.append("phoneNumber", data.phoneNumber);
      if (data.email) formData.append("email", data.email);
      
      const result = await registerGuest(formData);
      if (result.success) {
        redirect(`/g/${hotelSlug}/${roomCode}`);
      }
    }

    async function handleGuestMode() {
      "use server";
      const result = await continueAsGuest(hotelSlug, roomCode);
      if (result.success) {
        redirect(`/g/${hotelSlug}/${roomCode}`);
      }
    }

    return (
      <GuestWelcome
        hotelName={hotel.name}
        roomNumber={room.number}
        onRegister={handleRegister}
        onGuestMode={handleGuestMode}
      />
    );
  }

  // Fetch active and recently completed requests for this room
  const activeRequests = await prisma.request.findMany({
    where: {
      hotelId: hotel.id,
      roomId: room.id,
      OR: [
        {
          status: {
            in: ["NEW", "IN_PROGRESS"]
          }
        },
        {
          status: "COMPLETED",
          completedAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
          }
        }
      ]
    },
    include: {
      service: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10 // Limit to 10 most recent
  });

  // Fetch completed orders from last 24h for auto-review popup
  const completedOrdersForReview = await prisma.request.findMany({
    where: {
      hotelId: hotel.id,
      roomId: room.id,
      status: "COMPLETED",
      completedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    include: {
      service: true,
      reviews: true, // Check if already reviewed
    },
    orderBy: {
      completedAt: 'desc'
    },
    take: 5 // Only show popup for last 5 completed orders
  });

  return (
    <GuestHomeClient
      hotelSlug={hotelSlug}
      roomCode={room.number}
      hotelName={hotel.name}
      roomNumber={room.number}
      primaryColor={hotel.primaryColor}
      completedOrdersForReview={completedOrdersForReview.map(order => ({
        id: order.id,
        serviceName: order.service.name,
        hasReview: order.reviews.length > 0,
      }))}
      coverImage={hotel.coverImage}
      logo={hotel.logo}
      activeRequests={activeRequests.map(req => ({
        id: req.id,
        status: req.status as "NEW" | "IN_PROGRESS",
        serviceName: req.service.name,
        createdAt: req.createdAt,
        quantity: req.quantity,
        estimatedTime: req.service.estimatedTime
      }))}
      categories={hotel.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        customName: cat.customName,
        icon: cat.icon,
        emoji: cat.emoji,
        bgImage: cat.bgImage,
        slug: cat.slug,
      }))}
      services={hotel.services.map(service => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        price: service.price ? Number(service.price) : null,
        estimatedTime: service.estimatedTime,
        isRecommended: service.isRecommended,
        isNew: service.isNew,
        isHot: service.isHot,
        isVegetarian: service.isVegetarian,
        isVegan: service.isVegan,
      }))}
    />
  );
}

export default async function GuestHome({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  return (
    <Suspense fallback={<GuestHomeSkeleton />}>
      <GuestHomeContent hotelSlug={hotelSlug} roomCode={roomCode} />
    </Suspense>
  );
}
