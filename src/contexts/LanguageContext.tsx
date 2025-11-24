"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import bg from "@/locales/bg.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";

const dictionaries = { en, bg, de, fr, it };

type Language = keyof typeof dictionaries;
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr";
  t: Dictionary;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [t, setT] = useState<Dictionary>(en);

  useEffect(() => {
    // Load saved language from localStorage if available
    const saved = localStorage.getItem("hotelx-lang") as Language;
    if (saved && Object.keys(dictionaries).includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    setT(dictionaries[language]);
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("hotelx-lang", lang);
  };

  // Translate function with fallback to English
  const translate = (key: string): string => {
    const keys = key.split('.');
    let value: any = t;
    
    // Try to get value from current language
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let fallback: any = en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found in either
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage,
        dir: "ltr",
        t,
        translate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bg", name: "Български", flag: "🇧🇬" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
] as const;
