"use client";

import { QRBuilder } from "@/components/dashboard/QRBuilder";
import { useLanguage } from "@/contexts/LanguageContext";

interface QRPageClientProps {
  hotelSlug: string;
  hotelName: string;
  wifiName: string;
  baseUrl: string;
}

export function QRPageClient({ hotelSlug, hotelName, wifiName, baseUrl }: QRPageClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.dashboard.qr.${key}`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <QRBuilder 
        hotelSlug={hotelSlug} 
        hotelName={hotelName}
        wifiName={wifiName}
        baseUrl={baseUrl}
      />
    </div>
  );
}



