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
  categorySlug,
}: {
  hotelSlug: string;
  roomCode: string;
  categorySlug: string;
}) {

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
  });

  if (!hotel) {
    return notFound();
  }

  const category = await prisma.category.findUnique({
    where: { 
      hotelId_slug: {
        hotelId: hotel.id,
        slug: categorySlug
      }
    },
    include: {
      hotel: true,
      services: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!category || category.hotel.slug !== hotelSlug) {
    return notFound();
  }

  // Group services by type for Food & Drinks
  // For Food category, we'll create virtual subcategories based on service names/types
  const subcategories: {id: string, name: string, customName: string | null}[] = [];
  
  if (category.slug === 'food-drinks' && category.services.length > 0) {
    // Create subcategories based on common patterns
    const hasBreakfast = category.services.some(s => 
      s.name.toLowerCase().includes('breakfast') || 
      s.name.toLowerCase().includes('continental') ||
      s.name.toLowerCase().includes('american')
    );
    const hasMain = category.services.some(s => 
      s.name.toLowerCase().includes('salmon') || 
      s.name.toLowerCase().includes('beef') ||
      s.name.toLowerCase().includes('pasta') ||
      s.name.toLowerCase().includes('burger')
    );
    const hasBeverages = category.services.some(s => 
      s.name.toLowerCase().includes('juice') || 
      s.name.toLowerCase().includes('coffee') ||
      s.name.toLowerCase().includes('cappuccino')
    );
    const hasDesserts = category.services.some(s => 
      s.name.toLowerCase().includes('cake') || 
      s.name.toLowerCase().includes('fruit platter') ||
      s.name.toLowerCase().includes('ice cream')
    );
    
    if (hasBreakfast) subcategories.push({id: 'breakfast', name: 'Breakfast', customName: null});
    if (hasMain) subcategories.push({id: 'main-dishes', name: 'Main Dishes', customName: null});
    if (hasBeverages) subcategories.push({id: 'beverages', name: 'Beverages', customName: null});
    if (hasDesserts) subcategories.push({id: 'desserts', name: 'Desserts', customName: null});
  }

  // Convert Decimal to number and Dates to strings for Client Components
  const allServices = category.services.map(service => ({
    ...service,
    price: service.price ? Number(service.price) : null,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    // Add subcategory ID based on service name
    subcategoryId: category.slug === 'food-drinks' ? (
      service.name.toLowerCase().includes('breakfast') || service.name.toLowerCase().includes('continental') || service.name.toLowerCase().includes('american') ? 'breakfast' :
      service.name.toLowerCase().includes('salmon') || service.name.toLowerCase().includes('beef') || service.name.toLowerCase().includes('pasta') || service.name.toLowerCase().includes('burger') ? 'main-dishes' :
      service.name.toLowerCase().includes('juice') || service.name.toLowerCase().includes('coffee') || service.name.toLowerCase().includes('cappuccino') ? 'beverages' :
      service.name.toLowerCase().includes('cake') || service.name.toLowerCase().includes('fruit') || service.name.toLowerCase().includes('ice cream') ? 'desserts' :
      null
    ) : null,
  }));

  const serializedSubCategories = subcategories;

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
        categorySlug={categorySlug}
        services={allServices}
        subCategories={serializedSubCategories}
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
  params: Promise<{ hotelSlug: string; roomCode: string; categorySlug: string }>;
}) {
  const { hotelSlug, roomCode, categorySlug } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent hotelSlug={hotelSlug} roomCode={roomCode} categorySlug={categorySlug} />
    </Suspense>
  );
}
