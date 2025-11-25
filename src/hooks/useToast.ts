"use client";

import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export function useToast() {
  const { translate } = useLanguage();

  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  };

  // Helper functions with translations
  const showTranslatedSuccess = (key: string, descriptionKey?: string) => {
    showSuccess(translate(key), descriptionKey ? translate(descriptionKey) : undefined);
  };

  const showTranslatedError = (key: string, descriptionKey?: string) => {
    showError(translate(key), descriptionKey ? translate(descriptionKey) : undefined);
  };

  const showTranslatedInfo = (key: string, descriptionKey?: string) => {
    showInfo(translate(key), descriptionKey ? translate(descriptionKey) : undefined);
  };

  const showTranslatedWarning = (key: string, descriptionKey?: string) => {
    showWarning(translate(key), descriptionKey ? translate(descriptionKey) : undefined);
  };

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showTranslatedSuccess,
    showTranslatedError,
    showTranslatedInfo,
    showTranslatedWarning,
  };
}

