"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceTags } from "./ServiceTags";

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
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  // Filter services based on selected sub-category
  const filteredServices = selectedSubCategoryId
    ? services.filter((service: any) => service.categoryId === selectedSubCategoryId)
    : services;

  return (
    <>
      {/* Sub-Categories Slider */}
      {subCategories && subCategories.length > 0 && (
        <div className="px-4 pt-4 pb-2 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {/* All button */}
            <button
              onClick={() => setSelectedSubCategoryId(null)}
              className="flex-shrink-0"
            >
              <div
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedSubCategoryId === null
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <span
                  className={`font-semibold text-sm whitespace-nowrap ${
                    selectedSubCategoryId === null ? "text-white" : "text-gray-700"
                  }`}
                >
                  All
                </span>
              </div>
            </button>

            {/* Sub-categories */}
            {subCategories.map((subCat) => (
              <button
                key={subCat.id}
                onClick={() => setSelectedSubCategoryId(subCat.id)}
                className="flex-shrink-0"
              >
                <div
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedSubCategoryId === subCat.id
                      ? "border-gray-900 bg-gray-900"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`font-medium text-sm whitespace-nowrap ${
                      selectedSubCategoryId === subCat.id ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {subCat.customName || subCat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="p-4 space-y-4 pb-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No services available in this category at the moment.
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-row min-h-[140px]"
            >
              {service.image && (
                <div className="w-32 min-h-[140px] relative bg-gray-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover"
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
                        : "Free"}
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
                  href={`/g/${hotelSlug}/${roomCode}/service/${service.id}`}
                  className="mt-2 w-full"
                >
                  <Button
                    size="sm"
                    className="w-full rounded-md h-8 text-xs font-semibold"
                    style={{ backgroundColor: primaryColor || undefined }}
                  >
                    Order Now
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

