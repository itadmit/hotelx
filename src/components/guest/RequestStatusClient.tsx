"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ChevronRight, XCircle, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequestStatusClientProps {
  hotelSlug: string;
  roomCode: string;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  serviceName: string;
  roomNumber: string;
  price: string | null;
  currency: string;
  estimatedTime: string | null;
  createdAt: Date;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  notes: string | null;
}

export function RequestStatusClient({
  hotelSlug,
  roomCode,
  status,
  serviceName,
  roomNumber,
  price,
  currency,
  estimatedTime,
  createdAt,
  guestName,
  guestPhone,
  guestEmail,
  notes,
}: RequestStatusClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);

  const statusMap: Record<string, { 
    title: string; 
    message: string; 
    label: string; 
    color: string; 
    mainIcon: LucideIcon; 
    mainIconColor: string; 
    mainIconBg: string;
  }> = {
    NEW: { 
      title: t("order_received"),
      message: t("order_received_msg"),
      label: t("status"), 
      color: "bg-blue-50 text-blue-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-green-600", 
      mainIconBg: "bg-green-100" 
    },
    IN_PROGRESS: { 
      title: t("in_progress"),
      message: t("in_progress_msg"),
      label: t("in_progress"), 
      color: "bg-yellow-50 text-yellow-700", 
      mainIcon: Clock, 
      mainIconColor: "text-yellow-600", 
      mainIconBg: "bg-yellow-100" 
    },
    COMPLETED: { 
      title: t("completed"),
      message: t("completed_msg"),
      label: t("completed"), 
      color: "bg-green-50 text-green-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-green-600", 
      mainIconBg: "bg-green-100" 
    },
    CANCELLED: { 
      title: t("cancelled"),
      message: t("cancelled_msg"),
      label: t("cancelled"), 
      color: "bg-red-50 text-red-700", 
      mainIcon: XCircle, 
      mainIconColor: "text-red-600", 
      mainIconBg: "bg-red-100" 
    },
  };

  const statusConfig = statusMap[status] || statusMap.NEW;
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
            Your request for <span className="font-semibold text-gray-900">{serviceName}</span> {statusConfig.message}
          </p>

        <div className="bg-white rounded-xl p-3.5 shadow-sm w-full max-w-sm border border-gray-100 mb-3 space-y-2">
          {/* Order Details */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t("status")}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t("room_number")}</span>
              <span className="text-sm font-semibold text-gray-900">{roomNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t("service")}</span>
              <span className="text-sm font-semibold text-gray-900">{serviceName}</span>
            </div>

            {price && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t("price")}</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${Number(price).toFixed(2)} {currency}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t("estimated_time")}</span>
              <div className="flex items-center gap-1 text-gray-900 font-medium">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm">{estimatedTime || "15-30 mins"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
              <span className="text-xs text-gray-500">{t("order_date")}</span>
              <span className="text-sm text-gray-900">
                {new Date(createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Guest Information */}
          {guestName && (
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("guest_information")}</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{t("name")}</span>
                  <span className="text-sm font-medium text-gray-900">{guestName}</span>
                </div>
                {guestPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t("phone")}</span>
                    <span className="text-sm text-gray-900">{guestPhone}</span>
                  </div>
                )}
                {guestEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t("email")}</span>
                    <span className="text-sm text-gray-900">{guestEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div className="pt-2 border-t border-gray-100 text-left">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t("special_requests")}</span>
              <p className="text-sm text-gray-900">{notes}</p>
            </div>
          )}
        </div>

          <Link href={`/g/${hotelSlug}/${roomCode}`}>
            <Button variant="outline" className="gap-2 h-9 text-sm">
              <ChevronRight className="h-4 w-4 rotate-180" /> {t("back_to_home")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 mb-0.5">{t("powered_by")}</p>
          <div className="scale-75 -mt-1">
            <Logo size="sm" href="https://hotelx.app" />
          </div>
        </div>
      </div>
    </div>
  );
}

