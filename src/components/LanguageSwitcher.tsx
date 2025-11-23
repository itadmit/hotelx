"use client";

import * as React from "react";
import { Globe, ChevronDown } from "lucide-react";
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
  mode?: "dropdown" | "flags";
  className?: string;
}

export function LanguageSwitcher({ mode = "dropdown", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(l => l.code === language) || languages[0];

  if (mode === "flags") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm hover:bg-gray-100",
              language === lang.code ? "bg-white shadow-sm ring-1 ring-gray-200 font-medium" : "opacity-70 hover:opacity-100"
            )}
            title={lang.name}
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLang.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "gap-3 cursor-pointer",
              language === lang.code && "bg-accent"
            )}
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

