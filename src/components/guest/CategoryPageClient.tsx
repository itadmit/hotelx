"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ServiceTags } from "./ServiceTags";
import { useLanguage } from "@/contexts/LanguageContext";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

// Category name translations (same as GuestHomeClient)
const categoryTranslations: Record<string, Record<string, string>> = {
  "Food & Drinks": {
    en: "Food & Drinks",
    bg: "Храна и напитки",
    de: "Essen & Getränke",
    fr: "Nourriture et boissons",
    it: "Cibo e bevande",
  },
  "Room Service": {
    en: "Room Service",
    bg: "Обслужване в стаята",
    de: "Zimmerservice",
    fr: "Service en chambre",
    it: "Servizio in camera",
  },
  "Spa & Wellness": {
    en: "Spa & Wellness",
    bg: "Спа и уелнес",
    de: "Spa & Wellness",
    fr: "Spa et bien-être",
    it: "Spa e benessere",
  },
  "Concierge": {
    en: "Concierge",
    bg: "Консиерж",
    de: "Concierge",
    fr: "Conciergerie",
    it: "Concierge",
  },
  "Maintenance": {
    en: "Maintenance",
    bg: "Поддръжка",
    de: "Wartung",
    fr: "Maintenance",
    it: "Manutenzione",
  },
  "Entertainment": {
    en: "Entertainment",
    bg: "Развлечения",
    de: "Unterhaltung",
    fr: "Divertissement",
    it: "Intrattenimento",
  },
  "Breakfast": {
    en: "Breakfast",
    bg: "Закуска",
    de: "Frühstück",
    fr: "Petit-déjeuner",
    it: "Colazione",
  },
  "Lunch": {
    en: "Lunch",
    bg: "Обяд",
    de: "Mittagessen",
    fr: "Déjeuner",
    it: "Pranzo",
  },
  "Dinner": {
    en: "Dinner",
    bg: "Вечеря",
    de: "Abendessen",
    fr: "Dîner",
    it: "Cena",
  },
  "Beverages": {
    en: "Beverages",
    bg: "Напитки",
    de: "Getränke",
    fr: "Boissons",
    it: "Bevande",
  },
};

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: any;
  currency: string;
  image: string | null;
  isRecommended?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  customName: string | null;
}

interface CategoryPageClientProps {
  hotelSlug: string;
  roomCode: string;
  categorySlug: string;
  services: Service[];
  subCategories: SubCategory[];
  primaryColor: string | null;
}

export function CategoryPageClient({
  hotelSlug,
  roomCode,
  categorySlug,
  services,
  subCategories,
  primaryColor,
}: CategoryPageClientProps) {
  const { translate, language } = useLanguage();
  const t = (key: string) => translate(`app.guest.${key}`);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Translate category name
  const translateCategoryName = (name: string, customName: string | null): string => {
    if (customName) return customName; // Custom names are not translated
    const translations = categoryTranslations[name];
    if (translations && translations[language]) {
      return translations[language];
    }
    return name; // Fallback to original name
  };

  // Filter services based on selected sub-category and search query
  const filteredServices = useMemo(() => {
    let filtered = selectedSubCategoryId
      ? services.filter((service: any) => service.subcategoryId === selectedSubCategoryId)
      : services;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((service: any) => 
        service.name.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [services, selectedSubCategoryId, searchQuery]);

  return (
    <>
      {/* Sub-Categories Slider */}
      {subCategories && subCategories.length > 0 && (
        <div className="px-4 pt-4 pb-2 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {/* All button */}
            <button
              onClick={() => {
                setSelectedSubCategoryId(null);
                setSearchQuery("");
              }}
              className="flex-shrink-0 active:scale-95 transition-transform"
            >
              <div
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedSubCategoryId === null
                    ? "border-gray-900 bg-gray-900 shadow-sm"
                    : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <span
                  className={`font-semibold text-sm whitespace-nowrap ${
                    selectedSubCategoryId === null ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t("all")}
                </span>
              </div>
            </button>

            {/* Sub-categories */}
            {subCategories.map((subCat) => (
              <button
                key={subCat.id}
                onClick={() => {
                  setSelectedSubCategoryId(subCat.id);
                  setSearchQuery("");
                }}
                className="flex-shrink-0 active:scale-95 transition-transform"
              >
                <div
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedSubCategoryId === subCat.id
                      ? "border-gray-900 bg-gray-900 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`font-medium text-sm whitespace-nowrap ${
                      selectedSubCategoryId === subCat.id ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {translateCategoryName(subCat.name, subCat.customName)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 pt-2 pb-4">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4 pb-8">
        {filteredServices.length === 0 ? (
          <EmptyState
            type={searchQuery ? "no-results" : "no-items"}
            title={searchQuery ? t("no_results") || "No results found" : t("no_services")}
            description={searchQuery ? t("no_results_desc") || "Try adjusting your search" : t("no_services_desc") || "Check back later"}
          />
        ) : (
          filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-row min-h-[140px] hover:shadow-md transition-all duration-200 active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {service.image && (
                <div className="w-32 min-h-[140px] relative bg-gray-200 shrink-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    quality={85}
                  />
                </div>
              )}
              <div className="flex-1 p-3 flex flex-col justify-between text-left min-w-0">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-base text-gray-900 leading-tight pr-2">
                      {service.name}
                    </h3>
                    <span className="font-bold text-primary whitespace-nowrap text-base">
                      {service.price
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: service.currency,
                          }).format(Number(service.price))
                        : t("free")}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1.5">
                      {service.description}
                    </p>
                  )}
                  <ServiceTags
                    isRecommended={service.isRecommended}
                    isNew={service.isNew}
                    isHot={service.isHot}
                    isVegetarian={service.isVegetarian}
                    isVegan={service.isVegan}
                  />
                </div>

                <Link
                  href={`/g/${hotelSlug}/${roomCode}/service/${service.slug || service.id}`}
                  className="mt-2 w-full cursor-pointer"
                >
                  <Button
                    size="sm"
                    className="w-full rounded-md h-8 text-xs font-semibold transition-all duration-200 active:scale-95 hover:shadow-md"
                    style={{ backgroundColor: primaryColor || undefined }}
                  >
                    {t("order_now")}
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

