import { 
  ConciergeBell, 
  Utensils, 
  Sparkles, 
  Car, 
  Info, 
  Wrench,
  ChevronRight, 
  LucideIcon,
  HelpCircle
} from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ServiceTags } from "@/components/guest/ServiceTags";
import { GuestHomeSkeleton } from "@/components/guest/skeletons/GuestHomeSkeleton";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function GuestHomeContent({
  hotelSlug,
  roomCode,
}: {
  hotelSlug: string;
  roomCode: string;
}) {

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

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room || room.hotelId !== hotel.id) {
    return notFound();
  }

  // Helper to get icon
  const getIcon = (name: string | null) => {
    if (!name) return HelpCircle;
    // @ts-ignore
    const Icon = Icons[name];
    return Icon || HelpCircle;
  };

  const bgColors = [
    "bg-orange-100 text-orange-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-green-100 text-green-600",
    "bg-gray-100 text-gray-600",
    "bg-indigo-100 text-indigo-600",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-48 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${hotel.coverImage || hotel.logo || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 text-white text-left w-full">
          <p className="text-sm font-medium opacity-90 mb-1">Welcome to</p>
          <h1 className="text-2xl font-bold font-heading">{hotel.name}</h1>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
            Room {room.number}
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="p-6 pb-2 text-left">
        <h2 className="text-lg font-semibold text-gray-900">How can we help you today?</h2>
        <p className="text-sm text-gray-500">Choose a category to request a service.</p>
      </div>

      {/* Categories Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {hotel.categories.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p className="text-sm">No categories available at the moment.</p>
          </div>
        ) : (
          hotel.categories.map((category, index) => {
            const Icon = getIcon(category.icon);
            const colorClass = bgColors[index % bgColors.length];
            
            return (
              <Link 
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.slug}`}
                className={`relative flex flex-col items-center justify-center rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group overflow-hidden ${
                  category.bgImage ? 'min-h-[160px] h-[160px]' : 'bg-white p-6 min-h-[140px]'
                }`}
              >
                {category.bgImage ? (
                  <>
                    {/* Cover Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${category.bgImage})` }}
                    />
                    {/* Uniform Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    {/* Category Name - Centered */}
                    <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
                      <span className="font-heading font-bold text-white text-lg text-center drop-shadow-2xl">
                        {category.customName || category.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {category.emoji ? (
                      <div className="text-4xl mb-3">
                        {category.emoji}
                      </div>
                    ) : (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${colorClass} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    )}
                    <span className="font-heading font-semibold text-gray-900 text-sm">{category.customName || category.name}</span>
                  </>
                )}
              </Link>
            );
          })
        )}
      </div>

      {/* Quick Actions / Popular */}
      <div className="px-6 mt-2 mb-8">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 text-left">Popular Services</h3>
        <div className="space-y-3">
          {hotel.services.map((service) => (
            <Link 
              key={service.id}
              href={`/g/${hotelSlug}/${roomCode}/service/${service.id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 active:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{service.name}</p>
                </div>
                <ServiceTags
                  isRecommended={service.isRecommended}
                  isNew={service.isNew}
                  isHot={service.isHot}
                  isVegetarian={service.isVegetarian}
                  isVegan={service.isVegan}
                />
                <p className="text-xs text-gray-500 mt-1">{service.estimatedTime || "15-30 mins"}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {service.price ? `$${Number(service.price).toFixed(2)}` : "Free"}
                </span>
                <div 
                  className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center"
                  style={{ color: hotel.primaryColor || undefined }}
                >
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-4 mt-auto">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 mb-0.5">Powered by</p>
          <div className="scale-75 -mt-1">
            <Logo size="sm" href="https://hotelx.app" />
          </div>
        </div>
      </div>
    </div>
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
