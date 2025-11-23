import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Changed to Textarea if available, otherwise Input
import { Label } from "@/components/ui/label";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; serviceId: string }>;
}) {
  const { hotelSlug, roomCode, serviceId } = await params;

  // Mock service details
  const service = { 
    id: serviceId, 
    name: "Club Sandwich", 
    description: "Triple-decker sandwich with roasted chicken breast, crispy bacon, lettuce, tomato, and mayonnaise on toasted white bread. Served with french fries.", 
    price: "$18.00", 
    time: "20-30 min",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80" 
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      {/* Image Header */}
      <div className="relative h-64 bg-gray-200">
        <Link 
          href={`/g/${hotelSlug}/${roomCode}`}
          className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <ChevronLeft className="h-6 w-6 text-gray-900" />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={service.image} 
          alt={service.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 p-6 pb-24 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold font-heading text-gray-900">{service.name}</h1>
          <span className="text-xl font-bold text-primary">{service.price}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Clock className="h-4 w-4" />
          <span>Estimated time: {service.time}</span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          {service.description}
        </p>

        <div className="mt-auto space-y-6">
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Input placeholder="E.g. No mayo, extra crispy fries..." className="h-20" />
          </div>

          <Link href={`/g/${hotelSlug}/${roomCode}/request/req-123`} className="block">
            <Button className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20">
              Confirm Request • {service.price}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

