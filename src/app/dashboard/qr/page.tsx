import { auth } from "@/app/api/auth/[...nextauth]/route";
import { QRBuilder } from "@/components/dashboard/QRBuilder";
import prisma from "@/lib/prisma";

export default async function QRPage() {
  const session = await auth();
  
  let hotelName = "HotelX";
  const hotelSlug = session?.user?.hotelSlug || "demo-hotel";
  
  let wifiName = "HotelX_Guest";
  
  if (session?.user?.hotelId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: session.user.hotelId },
      select: { 
        name: true,
        wifiName: true
      }
    });
    if (hotel) {
      hotelName = hotel.name;
      wifiName = hotel.wifiName || `${hotel.name}_Guest`;
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QR Code Generator</h1>
          <p className="text-gray-500 mt-1">Create digital access points for your rooms</p>
        </div>
      </div>

      <QRBuilder 
        hotelSlug={hotelSlug} 
        hotelName={hotelName}
        wifiName={wifiName}
        baseUrl={baseUrl}
      />
    </div>
  );
}
