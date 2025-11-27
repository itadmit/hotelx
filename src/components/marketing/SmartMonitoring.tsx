"use client";

import { Clock, AlertTriangle, Star, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function SmartMonitoring() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`smart_monitoring.${key}`);
  
  const features = [
    {
      icon: Clock,
      title: t("estimated_time_title"),
      description: t("estimated_time_desc"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: AlertTriangle,
      title: t("auto_complaint_title"),
      description: t("auto_complaint_desc"),
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Star,
      title: t("reviews_title"),
      description: t("reviews_desc"),
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: TrendingUp,
      title: t("tracking_title"),
      description: t("tracking_desc"),
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Shield,
      title: t("proactive_title"),
      description: t("proactive_desc"),
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: CheckCircle2,
      title: t("improvement_title"),
      description: t("improvement_desc"),
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group"
            >
              <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t("how_it_works_title")}
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t("step_1_title")}</h4>
              <p className="text-sm text-gray-600">{t("step_1_desc")}</p>
            </div>
            <div className="hidden md:block text-blue-500 text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t("step_2_title")}</h4>
              <p className="text-sm text-gray-600">{t("step_2_desc")}</p>
            </div>
            <div className="hidden md:block text-orange-500 text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t("step_3_title")}</h4>
              <p className="text-sm text-gray-600">{t("step_3_desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

