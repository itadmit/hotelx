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
    <section className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
              {t("title")}
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              {t("subtitle")}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-5">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${benefit.bg} shadow-sm`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-[2.5rem] transform rotate-3 scale-95 blur-2xl opacity-40"></div>
            <div className="relative bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-900/20 text-white overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div>
                    <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">{t("chart_title")}</p>
                    <p className="text-3xl font-bold mt-2 font-heading">$42,500</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-500/20">
                    +24% ↗
                  </div>
                </div>
                
                <div className="space-y-5">
                  <p className="text-slate-400 text-sm font-medium">{t("chart_top_services")}</p>
                  {[
                    { name: t("service_breakfast"), count: 145, w: "85%", color: "bg-blue-500" },
                    { name: t("service_spa"), count: 82, w: "60%", color: "bg-purple-500" },
                    { name: t("service_taxi"), count: 64, w: "45%", color: "bg-indigo-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span>{item.name}</span>
                        <span className="text-slate-400">{item.count} {t("orders")}</span>
                      </div>
                      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.w }}></div>
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

