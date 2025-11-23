import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Clock, ChevronRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { RequestStatusSkeleton } from "@/components/guest/skeletons/RequestStatusSkeleton";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function RequestStatusContent({
  hotelSlug,
  roomCode,
  requestId,
}: {
  hotelSlug: string;
  roomCode: string;
  requestId: string;
}) {

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      service: true,
      hotel: true,
      room: true,
    },
  });

  if (!request || request.hotel.slug !== hotelSlug) {
    return notFound();
  }

  const statusMap = {
    NEW: { 
      title: "Order Received!",
      message: "Sent to staff and is being processed.",
      label: "Received", 
      color: "bg-blue-50 text-blue-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-green-600", 
      mainIconBg: "bg-green-100" 
    },
    IN_PROGRESS: { 
      title: "In Progress...",
      message: "Is being prepared.",
      label: "In Progress", 
      color: "bg-yellow-50 text-yellow-700", 
      mainIcon: Clock, 
      mainIconColor: "text-yellow-600", 
      mainIconBg: "bg-yellow-100" 
    },
    COMPLETED: { 
      title: "Completed!",
      message: "Has been successfully completed.",
      label: "Completed", 
      color: "bg-green-50 text-green-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-green-600", 
      mainIconBg: "bg-green-100" 
    },
    CANCELLED: { 
      title: "Cancelled",
      message: "Has been cancelled.",
      label: "Cancelled", 
      color: "bg-red-50 text-red-700", 
      mainIcon: XCircle, 
      mainIconColor: "text-red-600", 
      mainIconBg: "bg-red-100" 
    },
  };

  const statusConfig = statusMap[request.status] || statusMap.NEW;
  const MainIcon = statusConfig.mainIcon;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className={`w-14 h-14 ${statusConfig.mainIconBg} rounded-full flex items-center justify-center mb-3 animate-in zoom-in duration-300`}>
            <MainIcon className={`h-7 w-7 ${statusConfig.mainIconColor}`} />
          </div>

          <h1 className="text-lg font-bold font-heading text-gray-900 mb-1">{statusConfig.title}</h1>
          <p className="text-sm text-gray-500 mb-4 max-w-xs px-4">
            Your request for <span className="font-semibold text-gray-900">{request.service.name}</span> {statusConfig.message}
          </p>

        <div className="bg-white rounded-xl p-3.5 shadow-sm w-full max-w-sm border border-gray-100 mb-3 space-y-2">
          {/* Order Details */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Room Number</span>
              <span className="text-sm font-semibold text-gray-900">{request.room.number}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Service</span>
              <span className="text-sm font-semibold text-gray-900">{request.service.name}</span>
            </div>

            {request.service.price && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Price</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${Number(request.service.price).toFixed(2)} {request.service.currency}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Estimated Time</span>
              <div className="flex items-center gap-1 text-gray-900 font-medium">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm">{request.service.estimatedTime || "15-30 mins"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
              <span className="text-xs text-gray-500">Order Date</span>
              <span className="text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Guest Information */}
          {request.guestName && (
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guest Information</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Name</span>
                  <span className="text-sm font-medium text-gray-900">{request.guestName}</span>
                </div>
                {request.guestPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Phone</span>
                    <span className="text-sm text-gray-900">{request.guestPhone}</span>
                  </div>
                )}
                {request.guestEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="text-sm text-gray-900">{request.guestEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {request.notes && (
            <div className="pt-2 border-t border-gray-100 text-left">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Special Requests</span>
              <p className="text-sm text-gray-900">{request.notes}</p>
            </div>
          )}
        </div>

          <Link href={`/g/${hotelSlug}/${roomCode}`}>
            <Button variant="outline" className="gap-2 h-9 text-sm">
              <ChevronRight className="h-4 w-4 rotate-180" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
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

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; requestId: string }>;
}) {
  const { hotelSlug, roomCode, requestId } = await params;

  return (
    <Suspense fallback={<RequestStatusSkeleton />}>
      <RequestStatusContent hotelSlug={hotelSlug} roomCode={roomCode} requestId={requestId} />
    </Suspense>
  );
}
