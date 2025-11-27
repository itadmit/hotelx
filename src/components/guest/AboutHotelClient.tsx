"use client";

import Link from "next/link";
import { ArrowLeft, Wifi, Phone, MapPin, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuestSidebar } from "./GuestSidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AboutHotelClientProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  hotelDescription: string | null;
  hotelLogo: string | null;
  wifiName: string | null;
  wifiPassword: string | null;
  primaryColor?: string | null;
  roomNumber: string;
}

export function AboutHotelClient({
  hotelSlug,
  roomCode,
  hotelName,
  hotelDescription,
  hotelLogo,
  wifiName,
  wifiPassword,
  primaryColor,
  roomNumber,
}: AboutHotelClientProps) {
  const { translate } = useLanguage();
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
            <h1 className="text-2xl font-bold text-gray-900">{t("about_hotel")}</h1>
            <p className="text-sm text-gray-600 mt-1">{hotelName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
          {/* Logo */}
          {hotelLogo && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex justify-center">
              <div className="relative w-40 h-40">
                <Image 
                  src={hotelLogo} 
                  alt={hotelName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Description */}
          {hotelDescription && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("about")}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{hotelDescription}</p>
            </div>
          )}

          {/* WiFi Info */}
          {(wifiName || wifiPassword) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{t("wifi_info")}</h2>
              </div>
              {wifiName && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">{t("network_name")}</p>
                  <p className="text-base font-medium text-gray-900">{wifiName}</p>
                </div>
              )}
              {wifiPassword && (
                <div>
                  <p className="text-sm text-gray-500">{t("password")}</p>
                  <p className="text-base font-mono font-medium text-gray-900">{wifiPassword}</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("contact_info")}</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t("reception")}</p>
                  <p className="text-base font-medium text-gray-900">{t("dial_0")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">{t("your_room")}</p>
            <p className="text-3xl font-bold text-blue-900">{roomNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
}



