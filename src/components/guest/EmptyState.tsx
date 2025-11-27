"use client";

import { LucideIcon, Inbox, Search, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: "no-results" | "no-items" | "error" | "empty";
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  type = "empty"
}: EmptyStateProps) {
  const { translate } = useLanguage();
  
  const defaultIcons = {
    "no-results": Search,
    "no-items": Package,
    "error": Inbox,
    "empty": Inbox,
  };

  const Icon = icon || defaultIcons[type];
  const defaultDescription = {
    "no-results": translate("app.guest.no_results_desc") || "Try adjusting your search",
    "no-items": translate("app.guest.no_items_desc") || "Check back later",
    "error": translate("app.guest.error_desc") || "Something went wrong",
    "empty": translate("app.guest.empty_desc") || "Nothing here yet",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {(description || defaultDescription[type]) && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          {description || defaultDescription[type]}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

