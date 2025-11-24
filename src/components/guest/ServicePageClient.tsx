"use client";

import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";
import { ServiceRequestFormWrapper } from "./ServiceRequestFormWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomField } from "./CustomFieldRenderer";

interface ServicePageClientProps {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string | null;
  serviceImage: string | null;
  formattedPrice: string;
  estimatedTime: string | null;
  roomNumber: string;
  primaryColor: string | null;
  customFields: CustomField[];
}

export function ServicePageClient({
  hotelSlug,
  roomCode,
  serviceId,
  serviceName,
  serviceDescription,
  serviceImage,
  formattedPrice,
  estimatedTime,
  roomNumber,
  primaryColor,
  customFields,
}: ServicePageClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);

  return (
    <>
      {/* Image Header */}
      <div className="relative h-56 bg-gray-200">
        <Link 
          href={`/g/${hotelSlug}/${roomCode}`}
          className="absolute top-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <ChevronLeft className="h-6 w-6 text-gray-900" />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={serviceImage || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"} 
          alt={serviceName} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-left">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold font-heading text-gray-900">{serviceName}</h1>
          <span className="text-xl font-bold text-primary">{formattedPrice}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4" />
          <span>{t("estimated_time")}: {estimatedTime || "15-30 mins"}</span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {serviceDescription || "No description available."}
        </p>

        {/* Quantity & Order Button */}
        <ServiceRequestFormWrapper
          hotelSlug={hotelSlug}
          roomCode={roomCode}
          serviceId={serviceId}
          price={formattedPrice}
          roomNumber={roomNumber}
          primaryColor={primaryColor}
          customFields={customFields}
        />
      </div>
    </>
  );
}

