"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Utensils, 
  Sparkles, 
  Car, 
  Filter,
  Clock,
  DollarSign,
  ChefHat,
  Languages
} from "lucide-react";
import Link from "next/link";
import { languages, useLanguage } from "@/contexts/LanguageContext";
import { createService } from "@/app/actions/hotel";
import { useToast } from "@/hooks/useToast";

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  time: string;
  status: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ServicesClientProps {
  services: Service[];
  categories: Category[];
}

// Category name translations
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
};

export function ServicesClient({ services, categories }: ServicesClientProps) {
  const { translate, language } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError, showTranslatedWarning } = useToast();
  const t = (key: string) => translate(`app.dashboard.services.${key}`);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const allServicesText = translate("app.dashboard.services.all_services");
  const [selectedCategory, setSelectedCategory] = useState<string>(allServicesText);
  const [isPending, startTransition] = useTransition();
  
  // Form state
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({});

  // Translate category name
  const translateCategoryName = (name: string): string => {
    const translations = categoryTranslations[name];
    if (translations && translations[language]) {
      return translations[language];
    }
    return name; // Fallback to original name
  };

  const filteredServices = selectedCategory === allServicesText 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const getIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      "Food & Drinks": Utensils,
      "Room Service": ChefHat,
      "Spa & Wellness": Sparkles,
      "Concierge": Car,
    };
    return iconMap[category] || Utensils;
  };

  const getColor = (category: string) => {
    const colorMap: Record<string, { color: string; bg: string }> = {
      "Food & Drinks": { color: "text-orange-500", bg: "bg-orange-50" },
      "Room Service": { color: "text-blue-500", bg: "bg-blue-50" },
      "Spa & Wellness": { color: "text-purple-500", bg: "bg-purple-50" },
      "Concierge": { color: "text-indigo-500", bg: "bg-indigo-50" },
    };
    return colorMap[category] || { color: "text-gray-500", bg: "bg-gray-50" };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Button 
          onClick={() => setIsAddServiceOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
        >
          <Plus className="h-4 w-4" />
          {t("add_service")}
        </Button>
      </div>

      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("add_service")}</DialogTitle>
            <DialogDescription>{t("service_name")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!serviceName || !serviceCategory) {
              showTranslatedWarning("app.toast.warning.required_fields");
              return;
            }
            
            startTransition(async () => {
              try {
                await createService({
                  name: serviceName,
                  description: serviceDescription || undefined,
                  categoryId: serviceCategory,
                  price: servicePrice ? parseFloat(servicePrice) : undefined,
                  estimatedTime: serviceTime || undefined,
                  translations: translations,
                });
                
                // Reset form
                setServiceName("");
                setServiceDescription("");
                setServiceCategory("");
                setServicePrice("");
                setServiceTime("");
                setTranslations({});
                setIsAddServiceOpen(false);
                showTranslatedSuccess("app.toast.success.service_created");
              } catch (error) {
                console.error("Failed to create service:", error);
                showTranslatedError("app.toast.error.service_create_failed");
              }
            });
          }} className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("basic_information")}
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t("service_name")} *</Label>
                  <Input 
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder={t("service_name_placeholder")} 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("category")} *</Label>
                  <Select 
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    required
                  >
                    <option value="">{t("select_category")}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{translateCategoryName(cat.name)}</option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t("price")}</Label>
                    <Input 
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="$0.00" 
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("estimated_time")}</Label>
                    <Input 
                      value={serviceTime}
                      onChange={(e) => setServiceTime(e.target.value)}
                      placeholder={t("estimated_time_placeholder")} 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>{t("description")}</Label>
                  <Input 
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder={t("description_placeholder")} 
                  />
                </div>
              </div>
            </div>

            {/* Translations */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("translations_required")}
              </h3>
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.code} className="p-4 border border-gray-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium text-gray-900">{lang.name}</span>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm">{t("service_name")} *</Label>
                      <Input
                        value={translations[lang.code]?.name || ""}
                        onChange={(e) => setTranslations({
                          ...translations,
                          [lang.code]: {
                            ...translations[lang.code],
                            name: e.target.value,
                            description: translations[lang.code]?.description || ""
                          }
                        })}
                        placeholder={`${lang.name} ${t("name_placeholder")}...`}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm">{t("description")}</Label>
                      <Input
                        value={translations[lang.code]?.description || ""}
                        onChange={(e) => setTranslations({
                          ...translations,
                          [lang.code]: {
                            ...translations[lang.code],
                            name: translations[lang.code]?.name || "",
                            description: e.target.value
                          }
                        })}
                        placeholder={`${lang.name} description...`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? translate("app.dashboard.services.creating") : translate("app.dashboard.services.create_service")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Categories Sidebar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <div>
             <h3 className="font-bold text-gray-900 px-4 mb-2">Categories</h3>
             <nav className="space-y-1">
               <button 
                 onClick={() => setSelectedCategory(allServicesText)}
                 className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                   selectedCategory === allServicesText 
                     ? 'bg-indigo-50 text-indigo-700' 
                     : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                 }`}
               >
                 <div className="flex items-center justify-between">
                    {allServicesText}
                    <span className={`bg-white text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                      selectedCategory === allServicesText ? "" : "hidden"
                    }`}>
                      {services.length}
                    </span>
                 </div>
               </button>
               {categories.map((cat) => {
                 const count = services.filter(s => s.category === cat.name).length;
                 return (
                   <button 
                     key={cat.id}
                     onClick={() => setSelectedCategory(cat.name)}
                     className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                       selectedCategory === cat.name 
                         ? 'bg-indigo-50 text-indigo-700' 
                         : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                     }`}
                   >
                     {translateCategoryName(cat.name)}
                   </button>
                 );
               })}
             </nav>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
             <h3 className="font-bold text-gray-900 px-4 mb-2">{t("quick_stats")}</h3>
             <div className="grid grid-cols-2 gap-2 px-2">
                <div className="bg-gray-50 p-3 rounded-2xl">
                   <div className="text-xs text-gray-500 mb-1">{t("active_items")}</div>
                   <div className="text-xl font-bold text-gray-900">{services.filter(s => s.status === "Active").length}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl">
                   <div className="text-xs text-gray-500 mb-1">{t("categories")}</div>
                   <div className="text-xl font-bold text-gray-900">{categories.length}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-2 rounded-2xl shadow-sm flex gap-2">
             <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search for services, food, or amenities..." 
                 className="pl-10 border-transparent bg-transparent focus:bg-gray-50 rounded-xl" 
              />
            </div>
            <Button variant="ghost" className="text-gray-500 hover:bg-gray-50 rounded-xl gap-2">
               <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No services found in this category.
              </div>
            ) : (
              filteredServices.map((service) => {
                const Icon = getIcon(service.category);
                const colors = getColor(service.category);
                return (
                  <Link key={service.id} href={`/dashboard/services/${service.id}`}>
                    <div className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-indigo-100 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                         </Button>
                      </div>

                      <div className="flex items-start gap-4 mb-4">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                           <p className="text-sm text-gray-500">{service.category}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{service.price}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{service.time}</span>
                         </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Badge className={`${service.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} border-none rounded-lg px-3`}>
                          {service.status === 'Active' ? t("active") : t("inactive")}
                        </Badge>
                        <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                           {t("edit_details")} <MoreHorizontal className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
            
            {/* Add New Placeholder Card */}
            <button 
              onClick={() => setIsAddServiceOpen(true)}
              className="rounded-3xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 transition-all h-full min-h-[200px]"
            >
               <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Plus className="h-6 w-6" />
               </div>
               <span className="font-medium">Create New Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

