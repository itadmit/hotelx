"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-radix";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Phone, Mail, Globe, DollarSign, Trash2, LogOut, AlertTriangle } from "lucide-react";
import { clearGuestData } from "@/app/actions/guestSession";
import { toast } from "sonner";
import { GuestSidebar } from "./GuestSidebar";

interface SettingsClientProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  defaultLanguage: string;
  defaultCurrency: string;
  guestSession: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    isGuestMode: boolean;
  } | null;
}

export function SettingsClient({
  hotelSlug,
  roomCode,
  hotelName,
  defaultLanguage,
  defaultCurrency,
  guestSession,
}: SettingsClientProps) {
  const router = useRouter();
  const { language, setLanguage, translate, dir } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const t = (key: string) => translate(`app.guest.settings.${key}`);

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "pt", label: "Português" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "ru", label: "Русский" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "ar", label: "العربية" },
    { value: "he", label: "עברית" },
    { value: "nl", label: "Nederlands" },
    { value: "pl", label: "Polski" },
    { value: "bg", label: "Български" },
  ];

  const currencies = [
    { value: "USD", label: "USD ($)", symbol: "$" },
    { value: "EUR", label: "EUR (€)", symbol: "€" },
    { value: "GBP", label: "GBP (£)", symbol: "£" },
    { value: "ILS", label: "ILS (₪)", symbol: "₪" },
    { value: "JPY", label: "JPY (¥)", symbol: "¥" },
    { value: "BGN", label: "BGN (лв)", symbol: "лв" },
  ];

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      const result = await clearGuestData();
      
      if (result.success) {
        toast.success(t("data_deleted"));
        
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push(`/g/${hotelSlug}/${roomCode}`);
          router.refresh();
        }, 1000);
      } else {
        toast.error(translate("app.toast.error.complaint_failed"));
      }
    } catch (error) {
      toast.error(translate("app.toast.error.complaint_failed"));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={dir}>
      <GuestSidebar
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        hotelName={hotelName}
        currentPage="settings"
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translate("app.guest.back_to_home")}
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600">{hotelName}</p>
        </div>

        <div className="space-y-6">
          {/* Guest Information */}
          {guestSession && !guestSession.isGuestMode && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("my_info")}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{t("name")}</p>
                    <p className="font-medium text-gray-900">{guestSession.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{t("phone")}</p>
                    <p className="font-medium text-gray-900 text-left" dir="ltr">{guestSession.phoneNumber}</p>
                  </div>
                </div>

                {guestSession.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{t("email")}</p>
                      <p className="font-medium text-gray-900 text-left" dir="ltr">{guestSession.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{t("language")}</h2>
            </div>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="py-2">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{t("currency")}</h2>
            </div>
            
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delete Data */}
          <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-900 mb-1">{t("delete_data")}</h2>
                <p className="text-sm text-red-700 mb-1">{t("delete_warning")}</p>
                <p className="text-sm text-red-600">{t("delete_description")}</p>
              </div>
            </div>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("delete_button")}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">{t("confirm_delete_title")}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              {t("confirm_delete_message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteData}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? translate("app.guest.loading") : t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

