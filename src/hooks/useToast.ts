"use client";

import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export function useToast() {
  const { translate } = useLanguage();

  const showSuccess = (message: string, description?: string, id?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
      id: id || `success-${Date.now()}-${Math.random()}`,
    });
  };

  const showError = (message: string, description?: string, id?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
      id: id || `error-${Date.now()}-${Math.random()}`,
    });
  };

  const showInfo = (message: string, description?: string, id?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
      id: id || `info-${Date.now()}-${Math.random()}`,
    });
  };

  const showWarning = (message: string, description?: string, id?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
      id: id || `warning-${Date.now()}-${Math.random()}`,
    });
  };

  // Helper functions with translations
  const showTranslatedSuccess = (key: string, descriptionKey?: string) => {
    const id = `success-${key}`;
    // Dismiss any existing toast with the same ID to prevent duplicates
    toast.dismiss(id);
    showSuccess(translate(key), descriptionKey ? translate(descriptionKey) : undefined, id);
  };

  const showTranslatedError = (key: string, descriptionKey?: string) => {
    const id = `error-${key}`;
    toast.dismiss(id);
    showError(translate(key), descriptionKey ? translate(descriptionKey) : undefined, id);
  };

  const showTranslatedInfo = (key: string, descriptionKey?: string) => {
    const id = `info-${key}`;
    toast.dismiss(id);
    showInfo(translate(key), descriptionKey ? translate(descriptionKey) : undefined, id);
  };

  const showTranslatedWarning = (key: string, descriptionKey?: string) => {
    const id = `warning-${key}`;
    toast.dismiss(id);
    showWarning(translate(key), descriptionKey ? translate(descriptionKey) : undefined, id);
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

