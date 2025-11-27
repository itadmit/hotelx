"use client";

import { QrCode, Smartphone, LayoutDashboard, Globe, ShieldCheck, Zap, Users, BarChart, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Features() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`features.${key}`);
  
  const features = [
    {
      icon: Smartphone,
      title: t("f1_title"),
      description: t("f1_desc"),
    },
    {
      icon: LayoutDashboard,
      title: t("f2_title"),
      description: t("f2_desc"),
    },
    {
      icon: Globe,
      title: t("f3_title"),
      description: t("f3_desc"),
    },
    {
      icon: QrCode,
      title: t("f4_title"),
      description: t("f4_desc"),
    },
    {
      icon: BarChart,
      title: t("f5_title"),
      description: t("f5_desc"),
    },
    {
      icon: Users,
      title: t("f6_title"),
      description: t("f6_desc"),
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">{t("title")}</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-blue-900/5 transition-all hover:-translate-y-1 group">
              <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

