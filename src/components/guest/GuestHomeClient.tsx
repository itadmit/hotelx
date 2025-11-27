"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, LucideIcon, HelpCircle, Clock, Timer, CheckCircle2, Check, XCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { ServiceTags } from "./ServiceTags";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmptyState } from "./EmptyState";
import { PullToRefresh } from "./PullToRefresh";
import { TimeAgo } from "@/components/TimeAgo";
import { GuestSidebar } from "./GuestSidebar";
import { AutoReviewPopup } from "./AutoReviewPopup";

interface Category {
  id: string;
  name: string;
  customName: string | null;
  icon: string | null;
  emoji: string | null;
  bgImage: string | null;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  price: any;
  estimatedTime: string | null;
  isRecommended?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

interface ActiveRequest {
  id: string;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  serviceName: string;
  createdAt: Date;
  quantity: number;
  estimatedTime: string | null;
}

interface CompletedOrderForReview {
  id: string;
  serviceName: string;
  hasReview: boolean;
}

interface GuestHomeClientProps {
  hotelSlug: string;
  roomCode: string;
  hotelName: string;
  roomNumber: string;
  primaryColor: string | null;
  coverImage: string | null;
  logo: string | null;
  categories: Category[];
  services: Service[];
  activeRequests?: ActiveRequest[];
  completedOrdersForReview?: CompletedOrderForReview[];
}

// Category name translations
const categoryTranslations: Record<string, Record<string, string>> = {
  "Food & Drinks": {
    en: "Food & Drinks",
    es: "Comida y bebidas",
    pt: "Comida e bebidas",
    ru: "Еда и напитки",
    zh: "餐饮",
    ja: "飲食",
    ko: "음식 및 음료",
    ar: "الطعام والمشروبات",
    he: "אוכל ומשקאות",
    nl: "Eten en drinken",
    pl: "Jedzenie i napoje",
    bg: "Храна и напитки",
    de: "Essen & Getränke",
    fr: "Nourriture et boissons",
    it: "Cibo e bevande",
  },
  "Room Service": {
    en: "Room Service",
    es: "Servicio a la habitación",
    pt: "Serviço de quarto",
    ru: "Обслуживание номеров",
    zh: "客房服务",
    ja: "ルームサービス",
    ko: "룸 서비스",
    ar: "خدمة الغرف",
    he: "שירות חדרים",
    nl: "Kamerservice",
    pl: "Obsługa pokojowa",
    bg: "Обслужване в стаята",
    de: "Zimmerservice",
    fr: "Service en chambre",
    it: "Servizio in camera",
  },
  "Spa & Wellness": {
    en: "Spa & Wellness",
    es: "Spa y bienestar",
    pt: "Spa e bem-estar",
    ru: "Спа и велнес",
    zh: "水疗与健康",
    ja: "スパ＆ウェルネス",
    ko: "스파 및 웰니스",
    ar: "السبا والعافية",
    he: "ספא ובריאות",
    nl: "Spa & Wellness",
    pl: "Spa i wellness",
    bg: "Спа и уелнес",
    de: "Spa & Wellness",
    fr: "Spa et bien-être",
    it: "Spa e benessere",
  },
  "Concierge": {
    en: "Concierge",
    es: "Conserjería",
    pt: "Concierge",
    ru: "Консьерж",
    zh: "礼宾服务",
    ja: "コンシェルジュ",
    ko: "컨시어지",
    ar: "الكونسيرج",
    he: "קונסיירז'",
    nl: "Concierge",
    pl: "Concierge",
    bg: "Консиерж",
    de: "Concierge",
    fr: "Conciergerie",
    it: "Concierge",
  },
  "Maintenance": {
    en: "Maintenance",
    es: "Mantenimiento",
    pt: "Manutenção",
    ru: "Техническое обслуживание",
    zh: "维护",
    ja: "メンテナンス",
    ko: "유지보수",
    ar: "الصيانة",
    he: "תחזוקה",
    nl: "Onderhoud",
    pl: "Konserwacja",
    bg: "Поддръжка",
    de: "Wartung",
    fr: "Maintenance",
    it: "Manutenzione",
  },
  "Entertainment": {
    en: "Entertainment",
    es: "Entretenimiento",
    pt: "Entretenimento",
    ru: "Развлечения",
    zh: "娱乐",
    ja: "エンターテインメント",
    ko: "엔터테인먼트",
    ar: "الترفيه",
    he: "בידור",
    nl: "Vermakelijkheden",
    pl: "Rozrywka",
    bg: "Развлечения",
    de: "Unterhaltung",
    fr: "Divertissement",
    it: "Intrattenimento",
  },
  "Breakfast": {
    en: "Breakfast",
    es: "Desayuno",
    pt: "Café da manhã",
    ru: "Завтрак",
    zh: "早餐",
    ja: "朝食",
    ko: "아침 식사",
    ar: "الإفطار",
    he: "ארוחת בוקר",
    nl: "Ontbijt",
    pl: "Śniadanie",
    bg: "Закуска",
    de: "Frühstück",
    fr: "Petit-déjeuner",
    it: "Colazione",
  },
  "Lunch": {
    en: "Lunch",
    es: "Almuerzo",
    pt: "Almoço",
    ru: "Обед",
    zh: "午餐",
    ja: "昼食",
    ko: "점심 식사",
    ar: "الغداء",
    he: "ארוחת צהריים",
    nl: "Lunch",
    pl: "Obiad",
    bg: "Обяд",
    de: "Mittagessen",
    fr: "Déjeuner",
    it: "Pranzo",
  },
  "Dinner": {
    en: "Dinner",
    es: "Cena",
    pt: "Jantar",
    ru: "Ужин",
    zh: "晚餐",
    ja: "夕食",
    ko: "저녁 식사",
    ar: "العشاء",
    he: "ארוחת ערב",
    nl: "Diner",
    pl: "Kolacja",
    bg: "Вечеря",
    de: "Abendessen",
    fr: "Dîner",
    it: "Cena",
  },
  "Beverages": {
    en: "Beverages",
    es: "Bebidas",
    pt: "Bebidas",
    ru: "Напитки",
    zh: "饮料",
    ja: "飲み物",
    ko: "음료",
    ar: "المشروبات",
    he: "משקאות",
    nl: "Dranken",
    pl: "Napoje",
    bg: "Напитки",
    de: "Getränke",
    fr: "Boissons",
    it: "Bevande",
  },
};

export function GuestHomeClient({
  hotelSlug,
  roomCode,
  hotelName,
  roomNumber,
  primaryColor,
  coverImage,
  logo,
  categories,
  services,
  activeRequests = [],
  completedOrdersForReview = [],
}: GuestHomeClientProps) {
  const { translate, language } = useLanguage();
  const router = useRouter();
  const t = (key: string) => translate(`app.guest.${key}`);
  
  const handleRefresh = async () => {
    router.refresh();
  };

  // Translate category name
  const translateCategoryName = (name: string, customName: string | null): string => {
    if (customName) return customName; // Custom names are not translated
    const translations = categoryTranslations[name];
    if (translations && translations[language]) {
      return translations[language];
    }
    return name; // Fallback to original name
  };

  // Helper to get icon
  const getIcon = (name: string | null) => {
    if (!name) return HelpCircle;
    // @ts-ignore
    const Icon = Icons[name];
    return Icon || HelpCircle;
  };

  const bgColors = [
    "bg-orange-100 text-orange-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-green-100 text-green-600",
    "bg-gray-100 text-gray-600",
    "bg-indigo-100 text-indigo-600",
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {/* Sidebar */}
      <GuestSidebar 
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        hotelName={hotelName}
        primaryColor={primaryColor}
      />
      
      <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-48 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${coverImage || logo || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 text-white text-left w-full">
          <p className="text-sm font-medium opacity-90 mb-1">Welcome to</p>
          <h1 className="text-2xl font-bold font-heading">{hotelName}</h1>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
            {t("room")} {roomNumber}
          </div>
        </div>
      </div>

      {/* Active Requests */}
      {activeRequests.length > 0 && (
        <div className="px-6 mt-4 mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">{t("recent_orders")}</h3>
          <div className="space-y-2">
            {activeRequests.map((request) => {
              const statusConfig = request.status === 'NEW' 
                ? { 
                    label: t("order_received"), 
                    color: "bg-blue-50 border-blue-200 text-blue-700",
                    iconBg: "bg-blue-100 text-blue-600",
                    icon: Clock
                  }
                : request.status === 'IN_PROGRESS'
                ? { 
                    label: t("in_progress"), 
                    color: "bg-orange-50 border-orange-200 text-orange-700",
                    iconBg: "bg-orange-100 text-orange-600",
                    icon: Timer
                  }
                : request.status === 'COMPLETED'
                ? { 
                    label: t("completed"), 
                    color: "bg-green-50 border-green-200 text-green-700",
                    iconBg: "bg-green-100 text-green-600",
                    icon: CheckCircle2
                  }
                : { 
                    label: t("cancelled"), 
                    color: "bg-red-50 border-red-200 text-red-700",
                    iconBg: "bg-red-100 text-red-600",
                    icon: XCircle
                  };
              
              const StatusIcon = statusConfig.icon;
              const isCompleted = request.status === 'COMPLETED' || request.status === 'CANCELLED';
              
              return (
                <Link
                  key={request.id}
                  href={`/g/${hotelSlug}/${roomCode}/request/${request.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 active:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${statusConfig.iconBg}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {request.quantity > 1 && <span className="font-bold">{request.quantity}x </span>}
                        {request.serviceName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        {(request.status === 'NEW' || request.status === 'IN_PROGRESS') && request.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Timer className="h-3 w-3" />
                            <span>{t("estimated_arrival").replace("{time}", request.estimatedTime)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("ordered_time_ago").replace("{time}", "")}
                        <TimeAgo date={request.createdAt} language={language} />
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
          {activeRequests.some(req => req.status === 'NEW' || req.status === 'IN_PROGRESS') && (
            <p className="text-xs text-gray-400 mt-2 text-center italic">{t("time_estimated")}</p>
          )}
        </div>
      )}

      {/* Greeting */}
      <div className="p-6 pb-2 text-left">
        <h2 className="text-lg font-semibold text-gray-900">{t("how_can_help")}</h2>
        <p className="text-sm text-gray-500">{t("choose_category")}</p>
      </div>

      {/* Categories Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              type="empty"
              title={t("no_categories")}
              description={t("no_categories_desc") || "No categories available at the moment"}
            />
          </div>
        ) : (
          categories.map((category, index) => {
            const Icon = getIcon(category.icon);
            const colorClass = bgColors[index % bgColors.length];
            
            return (
              <Link 
                key={category.id}
                href={`/g/${hotelSlug}/${roomCode}/category/${category.slug}`}
                className={`relative flex flex-col items-center justify-center rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 text-center group overflow-hidden active:scale-[0.97] animate-in fade-in slide-in-from-bottom-4 ${
                  category.bgImage ? 'min-h-[160px] h-[160px]' : 'bg-white p-6 min-h-[140px]'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category.bgImage ? (
                  <>
                    {/* Cover Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${category.bgImage})` }}
                    />
                    {/* Uniform Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    {/* Category Name - Centered */}
                    <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
                      <span className="font-heading font-bold text-white text-lg text-center drop-shadow-2xl">
                        {translateCategoryName(category.name, category.customName)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {category.emoji ? (
                      <div className="text-4xl mb-3">
                        {category.emoji}
                      </div>
                    ) : (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${colorClass} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    )}
                    <span className="font-heading font-semibold text-gray-900 text-sm">{translateCategoryName(category.name, category.customName)}</span>
                  </>
                )}
              </Link>
            );
          })
        )}
      </div>

      {/* Quick Actions / Popular */}
      <div className="px-6 mt-2 mb-8">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 text-left">{t("popular_services")}</h3>
        <div className="space-y-3">
          {services.map((service, index) => (
            <Link 
              key={service.id}
              href={`/g/${hotelSlug}/${roomCode}/service/${service.slug || service.id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 active:bg-gray-50 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200 animate-in fade-in slide-in-from-right-4"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{service.name}</p>
                </div>
                <ServiceTags
                  isRecommended={service.isRecommended}
                  isNew={service.isNew}
                  isHot={service.isHot}
                  isVegetarian={service.isVegetarian}
                  isVegan={service.isVegan}
                />
                <p className="text-xs text-gray-500 mt-1">{service.estimatedTime || "15-30 mins"}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {service.price ? `$${Number(service.price).toFixed(2)}` : t("free")}
                </span>
                <div 
                  className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center"
                  style={{ color: primaryColor || undefined }}
                >
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-4 mt-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Language Switcher */}
          <div className="w-full flex justify-center">
            <LanguageSwitcher mode="modal" />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400 mb-0.5">{t("powered_by")}</p>
            <div className="scale-75 -mt-1">
              <Logo size="sm" href="https://hotelx.app" />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Auto Review Popup */}
      <AutoReviewPopup 
        hotelSlug={hotelSlug}
        roomCode={roomCode}
        completedOrders={completedOrdersForReview}
      />
    </PullToRefresh>
  );
}

