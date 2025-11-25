"use client";

import { TrendingUp, Clock, Smile, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Benefits() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`benefits.${key}`);
  
  const benefits = [
    {
      icon: TrendingUp,
      title: t("item_1_title"),
      description: t("item_1_desc"),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Clock,
      title: t("item_2_title"),
      description: t("item_2_desc"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Smile,
      title: t("item_3_title"),
      description: t("item_3_desc"),
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Shield,
      title: t("item_4_title"),
      description: t("item_4_desc"),
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${benefit.bg}`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-95"></div>
            <div className="relative bg-gray-900 rounded-3xl p-8 shadow-2xl text-white overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <p className="text-gray-400 text-sm">{t("chart_title")}</p>
                    <p className="text-2xl font-bold mt-1">$42,500</p>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    +24% ↗
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">{t("chart_top_services")}</p>
                  {[
                    { name: t("service_breakfast"), count: 145, w: "85%" },
                    { name: t("service_spa"), count: 82, w: "60%" },
                    { name: t("service_taxi"), count: 64, w: "45%" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="text-gray-400">{item.count} {t("orders")}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: item.w }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

