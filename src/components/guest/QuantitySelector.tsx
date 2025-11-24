"use client";

import { Minus, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  const { translate } = useLanguage();
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">{translate("app.dashboard.common.quantity")}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4 text-gray-700" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold text-gray-900">{quantity}</span>
        </div>
        <button
          type="button"
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
}

