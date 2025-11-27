"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import en from "@/locales/en.json";
import bg from "@/locales/bg.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";
import ru from "@/locales/ru.json";
import zh from "@/locales/zh.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import ar from "@/locales/ar.json";
import he from "@/locales/he.json";
import nl from "@/locales/nl.json";
import pl from "@/locales/pl.json";

const dictionaries = { en, bg, de, fr, it, es, pt, ru, zh, ja, ko, ar, he, nl, pl };

type Language = keyof typeof dictionaries;
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: Dictionary;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [language, setLanguage] = useState<Language>("en");
  const [t, setT] = useState<Dictionary>(en);

  useEffect(() => {
    // First try to load from localStorage (for immediate UI update)
    const saved = localStorage.getItem("hotelx-lang") as Language;
    if (saved && Object.keys(dictionaries).includes(saved)) {
      setLanguage(saved);
    }
    
    // Then try to load from database via API if user is logged in
    if (session?.user?.hotelId) {
      fetch(`/api/hotel/language?hotelId=${session.user.hotelId}`)
        .then(res => {
          if (!res.ok) {
            console.log("Could not fetch language from database, using saved preference");
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data && data.language && Object.keys(dictionaries).includes(data.language)) {
            setLanguage(data.language as Language);
            localStorage.setItem("hotelx-lang", data.language);
          }
        })
        .catch(err => console.log("Using local language preference:", err.message));
    }
  }, [session?.user?.hotelId]);

  useEffect(() => {
    setT(dictionaries[language]);
    document.documentElement.lang = language;
    // RTL languages: Hebrew and Arabic
    const isRTL = language === "he" || language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    // Add Hebrew font class when language is Hebrew
    if (language === "he") {
      document.documentElement.classList.add("lang-he");
    } else {
      document.documentElement.classList.remove("lang-he");
    }
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

  // Determine direction based on language
  const dir: "ltr" | "rtl" = language === "he" || language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage,
        dir,
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
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "bg", name: "Български", flag: "🇧🇬" },
] as const;
