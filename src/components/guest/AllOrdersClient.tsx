"use client";

import Link from "next/link";
import { ChevronRight, Clock, Timer, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuestSidebar } from "./GuestSidebar";
import { TimeAgo } from "@/components/TimeAgo";
import { Button } from "@/components/ui/button";

interface Request {
  id: string;
  status: string;
  createdAt: Date;
  estimatedTime: string | null;
  quantity: number;
  service: {
    name: string;
  };
}

interface AllOrdersClientProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  roomNumber: string;
  requests: Request[];
  primaryColor?: string | null;
}

export function AllOrdersClient({
  hotelSlug,
  roomCode,
  hotelName,
  roomNumber,
  requests,
  primaryColor,
}: AllOrdersClientProps) {
  const { translate, language } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);

  return (
    <>
      {/* Sidebar */}
      <GuestSidebar 
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        hotelName={hotelName}
        primaryColor={primaryColor}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <Link href={`/g/${hotelSlug}/${roomCode}`}>
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back_to_home")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t("all_orders")}</h1>
            <p className="text-sm text-gray-600 mt-1">{t("room")} {roomNumber}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-2xl mx-auto px-6 py-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("no_orders_yet")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => {
                const statusConfig = request.status === 'NEW' 
                  ? { 
                      label: t("order_received"), 
                      color: "bg-blue-50 border-blue-200 text-blue-700",
                      iconBg: "bg-blue-100 text-blue-600",
                      icon: Clock
                    }
                  : request.status === 'IN_PROGRESS'
                  ? { 
                      label: t("in_progress"), 
                      color: "bg-orange-50 border-orange-200 text-orange-700",
                      iconBg: "bg-orange-100 text-orange-600",
                      icon: Timer
                    }
                  : request.status === 'COMPLETED'
                  ? { 
                      label: t("completed"), 
                      color: "bg-green-50 border-green-200 text-green-700",
                      iconBg: "bg-green-100 text-green-600",
                      icon: CheckCircle2
                    }
                  : { 
                      label: t("cancelled"), 
                      color: "bg-red-50 border-red-200 text-red-700",
                      iconBg: "bg-red-100 text-red-600",
                      icon: XCircle
                    };
                
                const StatusIcon = statusConfig.icon;
                
                return (
                  <Link
                    key={request.id}
                    href={`/g/${hotelSlug}/${roomCode}/request/${request.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 active:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${statusConfig.iconBg}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {request.quantity > 1 && <span className="font-bold">{request.quantity}x </span>}
                          {request.service.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          <TimeAgo date={request.createdAt} language={language} />
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}



