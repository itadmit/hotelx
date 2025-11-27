"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, ChevronRight, XCircle, LucideIcon, Plus, AlertCircle, Phone, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { ReviewForm } from "./ReviewForm";
import { ComplaintForm } from "./ComplaintForm";

interface RequestStatusClientProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  requestId: string;
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
  hotelName,
  requestId,
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
  const { showTranslatedSuccess } = useToast();
  const [isDelayed, setIsDelayed] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isComplaintFormOpen, setIsComplaintFormOpen] = useState(false);

  // Check if order is delayed
  useEffect(() => {
    if (status !== 'IN_PROGRESS' || !estimatedTime) return;

    const checkDelay = () => {
      const orderTime = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsedMinutes = (now - orderTime) / (1000 * 60);
      
      // Parse estimated time (e.g., "20 minutes" -> 20)
      const estimatedMinutes = parseInt(estimatedTime.match(/\d+/)?.[0] || '0');
      
      // Consider delayed if elapsed time is 120% of estimated time
      if (elapsedMinutes > estimatedMinutes * 1.2) {
        setIsDelayed(true);
      }
    };

    checkDelay();
    const interval = setInterval(checkDelay, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [status, estimatedTime, createdAt]);

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
      label: t("order_received"), 
      color: "bg-green-50 text-green-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-green-600", 
      mainIconBg: "bg-green-100" 
    },
    IN_PROGRESS: { 
      title: t("in_progress"),
      message: t("in_progress_msg"),
      label: t("in_progress"), 
      color: "bg-orange-50 text-orange-700", 
      mainIcon: Clock, 
      mainIconColor: "text-orange-600", 
      mainIconBg: "bg-orange-100" 
    },
    COMPLETED: { 
      title: t("completed"),
      message: t("completed_msg"),
      label: t("completed"), 
      color: "bg-blue-50 text-blue-700", 
      mainIcon: CheckCircle2, 
      mainIconColor: "text-blue-600", 
      mainIconBg: "bg-blue-100" 
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
        {/* Hotel Name Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 font-heading">{hotelName}</h1>
        </div>

        <div className="flex flex-col items-center px-6 py-6 text-center">
          <div className={`w-12 h-12 ${statusConfig.mainIconBg} rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500 fade-in slide-in-from-bottom-4`}>
            <MainIcon className={`h-6 w-6 ${statusConfig.mainIconColor} animate-in zoom-in duration-300 delay-100`} />
          </div>

          <h1 className="text-base font-bold font-heading text-gray-900 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">{statusConfig.title}</h1>
          <p className="text-sm text-gray-500 mb-3 max-w-xs px-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Your request for <span className="font-semibold text-gray-900">{serviceName}</span> {statusConfig.message}
          </p>

          {/* Delay Alert */}
          {isDelayed && status === 'IN_PROGRESS' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 w-full max-w-sm mb-3 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-orange-900 mb-1">
                    {t("order_delayed")}
                  </h3>
                  <p className="text-xs text-orange-700 mb-3">
                    {t("order_delayed_desc")}
                  </p>
                  <Button
                    onClick={() => setIsContactDialogOpen(true)}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t("contact_hotel")}
                  </Button>
                </div>
              </div>
            </div>
          )}

        <div className="bg-white rounded-xl p-3.5 shadow-sm w-full max-w-sm border border-gray-100 mb-3 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
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

            {status === "IN_PROGRESS" && estimatedTime && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t("estimated_time")}</span>
                <div className="flex items-center gap-1 text-gray-900 font-medium">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm">{estimatedTime}</span>
                </div>
              </div>
            )}

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

          {/* Action Buttons */}
          <div className="space-y-2 w-full max-w-sm">
            {/* Review Button - Only for completed orders */}
            {status === "COMPLETED" && (
              <Button
                onClick={() => setIsReviewFormOpen(true)}
                className="w-full gap-2 h-10 text-sm bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 active:scale-95 hover:shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("rate_service")}
              </Button>
            )}

            {/* Complaint Button - Always available */}
            <Button
              onClick={() => setIsComplaintFormOpen(true)}
              variant="outline"
              className="w-full gap-2 h-10 text-sm border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-200 active:scale-95 hover:shadow-md"
            >
              <AlertCircle className="h-4 w-4" />
              {t("report_issue")}
            </Button>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link href={`/g/${hotelSlug}/${roomCode}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2 h-9 text-sm transition-all duration-200 active:scale-95 hover:shadow-md">
                  <ChevronRight className="h-4 w-4 rotate-180" /> {t("back_to_home")}
                </Button>
              </Link>
              <Link href={`/g/${hotelSlug}/${roomCode}`} className="flex-1">
                <Button className="w-full gap-2 h-9 text-sm transition-all duration-200 active:scale-95 hover:shadow-md">
                  <Plus className="h-4 w-4" /> {t("order_another")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">{t("contact_hotel_title")}</DialogTitle>
            <DialogDescription className="text-base">
              {t("contact_hotel_subtitle")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {/* Phone Option */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-bold text-blue-900 mb-2">
                    {t("call_reception")}
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    {t("call_reception_desc").replace("{number}", "0")}
                  </p>
                  <div className="bg-white/50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-800 text-center font-medium">
                      📞 {t("dial_zero")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Option */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-bold text-green-900 mb-2">
                    {t("send_message_via_system")}
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    {t("send_message_desc")}
                  </p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      // Show success message
                      showTranslatedSuccess("app.toast.success.message_sent");
                      // Close dialog
                      setIsContactDialogOpen(false);
                      // TODO: Implement actual message functionality
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("send_message")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setIsContactDialogOpen(false)}
            className="w-full"
          >
            {t("close")}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Review Form */}
      <ReviewForm
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        requestId={requestId}
        serviceName={serviceName}
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
      />

      {/* Complaint Form */}
      <ComplaintForm
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        requestId={status !== "COMPLETED" && status !== "CANCELLED" ? requestId : null}
        isOpen={isComplaintFormOpen}
        onClose={() => setIsComplaintFormOpen(false)}
      />

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

