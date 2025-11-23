import Link from "next/link";
import { ChevronLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; categoryId: string }>;
}) {
  const { hotelSlug, roomCode, categoryId } = await params;

  // Mock services based on category
  const services = [
    { id: "club-sandwich", name: "Club Sandwich", description: "Chicken, bacon, lettuce, tomato, mayo.", price: "$18.00", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=200&q=80" },
    { id: "caesar-salad", name: "Caesar Salad", description: "Romaine lettuce, croutons, parmesan.", price: "$15.00", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=200&q=80" },
    { id: "burger", name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato.", price: "$20.00", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80" },
  ];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b sticky top-0 z-10 flex items-center gap-4">
        <Link 
          href={`/g/${hotelSlug}/${roomCode}`}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <h1 className="font-bold text-lg capitalize">{categoryId.replace("-", " ")}</h1>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4 pb-24">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex">
            <div className="w-24 h-full relative bg-gray-200">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={service.image} 
                alt={service.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{service.name}</h3>
                <span className="font-semibold text-primary">{service.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{service.description}</p>
              
              <Link 
                href={`/g/${hotelSlug}/${roomCode}/service/${service.id}`}
              >
                <Button size="sm" className="w-full rounded-full h-8 text-xs">
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

