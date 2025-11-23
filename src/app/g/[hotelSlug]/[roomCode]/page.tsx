import { 
  ConciergeBell, 
  Utensils, 
  Sparkles, 
  Car, 
  Info, 
  Wrench,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This would come from the DB based on params
const mockHotel = {
  name: "Grand Hotel & Spa",
  coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  primaryColor: "#2563eb",
};

const categories = [
  { id: "room-service", name: "Room Service", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { id: "cleaning", name: "Housekeeping", icon: Sparkles, color: "bg-blue-100 text-blue-600" },
  { id: "spa", name: "Spa & Wellness", icon: ConciergeBell, color: "bg-purple-100 text-purple-600" },
  { id: "transport", name: "Transport", icon: Car, color: "bg-green-100 text-green-600" },
  { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-gray-100 text-gray-600" },
  { id: "info", name: "Hotel Info", icon: Info, color: "bg-indigo-100 text-indigo-600" },
];

export default async function GuestHome({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string }>;
}) {
  const { hotelSlug, roomCode } = await params;

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <div className="relative h-48 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${mockHotel.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <p className="text-sm font-medium opacity-90 mb-1">Welcome to</p>
          <h1 className="text-2xl font-bold font-heading">{mockHotel.name}</h1>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
            Room {roomCode}
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">How can we help you today?</h2>
        <p className="text-sm text-gray-500">Select a category to request a service.</p>
      </div>

      {/* Categories Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/g/${hotelSlug}/${roomCode}/category/${category.id}`}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white text-center group"
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${category.color} group-hover:scale-110 transition-transform`}>
              <category.icon className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-900 text-sm">{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Quick Actions / Popular */}
      <div className="px-6 mt-2 mb-8">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Popular Requests</h3>
        <div className="space-y-3">
          {[
            { name: "Extra Towels", price: "Free", time: "5-10 min" },
            { name: "Club Sandwich", price: "$18.00", time: "20-30 min" },
            { name: "Wake Up Call", price: "Free", time: "Instant" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 active:bg-gray-100">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{item.price}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white shadow-sm text-primary">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

