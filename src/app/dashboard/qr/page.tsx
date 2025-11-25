import { auth } from "@/app/api/auth/[...nextauth]/route";
import { QRPageClient } from "@/components/dashboard/QRPageClient";
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
    <QRPageClient 
      hotelSlug={hotelSlug} 
      hotelName={hotelName}
      wifiName={wifiName}
      baseUrl={baseUrl}
    />
  );
}
