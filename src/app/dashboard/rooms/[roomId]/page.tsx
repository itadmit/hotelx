import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const session = await auth();
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const room = await prisma.room.findFirst({
    where: { id: roomId, hotelId: session.user.hotelId },
  });

  if (!room) {
    redirect("/dashboard/rooms");
  }

  const recentRequests = await prisma.request.findMany({
    where: { roomId: room.id },
    include: { service: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 pt-2">
        <Link href="/dashboard/rooms">
          <Button variant="ghost" size="icon" className="rounded-md shrink-0 mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            Hotel · room
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mt-2 tracking-tight">
            Room {room.number}
          </h1>
          <p className="text-sm text-foreground/60 mt-1.5 max-w-xl">
            Details, access code, and recent guest requests for this room.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-surface border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">Room information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground/50">Number</p>
              <p className="text-lg font-medium text-ink mt-0.5">{room.number}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground/50">Type</p>
              <p className="text-lg font-medium text-ink mt-0.5">{room.type ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground/50">Status</p>
              <div className="mt-1">
                <Badge variant={room.status === "ACTIVE" ? "default" : "secondary"}>
                  {room.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground/50">Access code</p>
              <p className="text-sm font-mono text-foreground/70 mt-0.5">{room.code}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-surface border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">QR preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="w-44 h-44 bg-ink rounded-md flex items-center justify-center mb-4 border border-[color:var(--border)]">
              <QrCode className="h-24 w-24 text-primary-foreground opacity-60" />
            </div>
            <a
              href={`/api/qr/room/${room.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--border)] bg-background px-4 py-2 text-sm font-medium hover:bg-surface"
            >
              <Download className="h-4 w-4" /> Download QR
            </a>
          </CardContent>
        </Card>
      </div>

      <Card className="card-surface border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Recent requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-foreground/55">No requests yet for this room.</p>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 rounded-md border border-[color:var(--border)] bg-background/50"
                >
                  <div>
                    <p className="font-medium text-ink">{req.service.name}</p>
                    <p className="text-xs text-foreground/50 font-mono mt-0.5">
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={req.status === "COMPLETED" ? "outline" : "default"}>
                    {req.status.replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
