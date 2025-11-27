"use client";

import { useState } from "react";
import { ServiceRequestFormClient } from "./ServiceRequestFormClient";
import { QuantitySelector } from "./QuantitySelector";
import { CustomFieldRenderer, CustomField } from "./CustomFieldRenderer";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceRequestFormWrapperProps {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  price: string;
  roomNumber?: string | null;
  primaryColor?: string | null;
  customFields?: CustomField[];
}

export function ServiceRequestFormWrapper(props: ServiceRequestFormWrapperProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);
  const [quantity, setQuantity] = useState(1);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Custom Fields */}
      {props.customFields && props.customFields.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold text-base text-gray-900 mb-4">{t("customize_order")}</h3>
          <CustomFieldRenderer
            fields={props.customFields}
            values={customFieldValues}
            onChange={handleCustomFieldChange}
          />
        </div>
      )}

      {/* Quantity & Order Button */}
      <div className="space-y-3">
        {/* Compact Quantity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{t("quantity")}:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQuantity(Math.max(1, quantity - 1));
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(10);
                }
              }}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-150"
            >
              <span className="text-lg font-semibold text-gray-700">−</span>
            </button>
            <span className="text-lg font-bold text-gray-900 w-8 text-center transition-all duration-200">{quantity}</span>
            <button
              type="button"
              onClick={() => {
                setQuantity(quantity + 1);
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(10);
                }
              }}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-150"
            >
              <span className="text-lg font-semibold text-gray-700">+</span>
            </button>
          </div>
        </div>

        {/* Order Button */}
        <ServiceRequestFormClient
          {...props}
          quantity={quantity}
          customFieldValues={customFieldValues}
        />
      </div>
    </div>
  );
}

