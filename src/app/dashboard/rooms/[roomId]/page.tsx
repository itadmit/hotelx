import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { RoomQRCode } from "@/components/dashboard/RoomQRCode";
import { notFound } from "next/navigation";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hotel: true }
  });

  if (!room) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const qrUrl = `${baseUrl}/g/${room.hotel.slug}/${room.code}`;

  const recentRequests = [
    { id: "1", service: "Extra Towels", time: "2h ago", status: "Completed" },
    { id: "2", service: "Room Service", time: "1d ago", status: "Completed" },
    { id: "3", service: "Maintenance", time: "2d ago", status: "In Progress" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rooms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Room {room.number}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="text-lg font-semibold">{room.number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="text-lg font-semibold">{room.type || "Standard"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={room.status === "ACTIVE" ? "default" : "destructive"}>
                {room.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">QR Code</p>
              <p className="text-sm font-mono text-gray-600">{room.code}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <RoomQRCode url={qrUrl} />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download QR
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{req.service}</p>
                  <p className="text-sm text-muted-foreground">{req.time}</p>
                </div>
                <Badge variant={req.status === "Completed" ? "outline" : "default"}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
