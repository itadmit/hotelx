import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CategoryPageClient } from "@/components/guest/CategoryPageClient";
import { CategoryPageSkeleton } from "@/components/guest/skeletons/CategoryPageSkeleton";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function CategoryPageContent({
  hotelSlug,
  roomCode,
  categoryId,
}: {
  hotelSlug: string;
  roomCode: string;
  categoryId: string;
}) {

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      hotel: true,
      services: {
        where: { isActive: true },
      },
      subCategories: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          services: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  // Get all services from this category and its sub-categories
  const allServices = [
    ...category.services,
    ...category.subCategories.flatMap((sub: any) => sub.services),
  ];

  if (!category || category.hotel.slug !== hotelSlug) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Category Cover Header */}
      {category.bgImage ? (
        <div className="relative h-48 bg-gray-900">
          <div 
            className="absolute inset-0 bg-cover"
            style={{ 
              backgroundImage: `url(${category.bgImage})`,
              backgroundPosition: 'center center'
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Back Button */}
          <Link 
            href={`/g/${hotelSlug}/${roomCode}`}
            className="absolute top-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </Link>
          
          {/* Category Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="font-heading font-bold text-3xl capitalize drop-shadow-2xl">
              {category.customName || category.name}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 py-4 border-b sticky top-0 z-10 flex items-center gap-4 shadow-sm">
          <Link 
            href={`/g/${hotelSlug}/${roomCode}`}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Link>
          <h1 className="font-heading font-bold text-lg capitalize">{category.customName || category.name}</h1>
        </div>
      )}

      <CategoryPageClient
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        categoryId={categoryId}
        services={allServices}
        subCategories={category.subCategories}
        primaryColor={category.hotel.primaryColor}
      />

      {/* Footer */}
      <div className="px-6 pb-6 pt-2">
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; categoryId: string }>;
}) {
  const { hotelSlug, roomCode, categoryId } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent hotelSlug={hotelSlug} roomCode={roomCode} categoryId={categoryId} />
    </Suspense>
  );
}
