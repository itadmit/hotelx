"use client";

import * as React from "react";
import { Globe, ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  mode?: "dropdown" | "flags" | "modal";
  className?: string;
}

export function LanguageSwitcher({ mode = "dropdown", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(l => l.code === language) || languages[0];
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setIsModalOpen(false);
  };

  if (mode === "modal") {
    return (
      <>
        {/* Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200",
            "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200",
            "font-semibold hover:scale-105 active:scale-95 transform",
            className
          )}
        >
          <span className="text-xl">{currentLang.flag}</span>
          <span>{currentLang.name}</span>
        </button>

        {/* Modal Overlay */}
        {isModalOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9998] bg-black/60 animate-in fade-in duration-200"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'he' ? 'בחר שפה' : 
                   language === 'ar' ? 'اختر اللغة' : 
                   'Select Language'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Language List */}
              <div className="overflow-y-auto flex-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-6 py-4 transition-colors",
                      "hover:bg-gray-50 active:bg-gray-100",
                      language === lang.code && "bg-blue-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className={cn(
                        "text-base font-medium",
                        language === lang.code ? "text-blue-600" : "text-gray-900"
                      )}>
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.code && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  if (mode === "flags") {
    return (
      <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold",
              "hover:scale-105 active:scale-95 transform",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              language === lang.code 
                ? "bg-white text-gray-900 shadow-xl ring-2 ring-white/90 scale-105" 
                : "bg-white/30 text-white hover:bg-white/40 border border-white/40 hover:border-white/60 backdrop-blur-md shadow-md"
            )}
            title={lang.name}
            aria-label={`Switch to ${lang.name}`}
            aria-pressed={language === lang.code}
          >
            <span className="text-xl leading-none flex-shrink-0">{lang.flag}</span>
            <span className="whitespace-nowrap font-bold">{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("gap-2 w-full sm:w-auto justify-between px-4 py-2 h-auto", className)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{currentLang.flag}</span>
            <span className="font-medium">{currentLang.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="bg-white w-[240px] sm:w-[220px] max-h-[400px] overflow-y-auto"
      >
        <div className="py-1">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "gap-2.5 cursor-pointer py-2 px-3 text-sm",
                language === lang.code && "bg-blue-50 font-medium"
              )}
            >
              <span className="text-lg leading-none flex-shrink-0">{lang.flag}</span>
              <span className="flex-1 font-medium truncate">{lang.name}</span>
              {language === lang.code && (
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

