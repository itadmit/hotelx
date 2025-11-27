"use client";

import { ScanLine, MessageSquare, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HowItWorks() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`how_it_works.${key}`);
  
  const steps = [
    {
      icon: ScanLine,
      title: t("step_1_title"),
      description: t("step_1_desc"),
    },
    {
      icon: MessageSquare,
      title: t("step_2_title"),
      description: t("step_2_desc"),
    },
    {
      icon: BarChart3,
      title: t("step_3_title"),
      description: t("step_3_desc"),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-blue-100 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-blue-50 shadow-lg flex items-center justify-center mb-8 relative z-10 group-hover:border-blue-100 group-hover:scale-110 transition-all duration-300">
                <step.icon className="h-10 w-10 text-primary" />
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-2 border-white shadow-md">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

