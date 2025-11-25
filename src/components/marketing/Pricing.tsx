"use client";

import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

export function Pricing() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`pricing.${key}`);
  const [rooms, setRooms] = useState([50]);
  
  const roomCount = rooms[0];
  
  const plans = [
    {
      name: t("plans.basic.name"),
      description: t("plans.basic.desc"),
      pricePerRoom: 2.0,
      features: [
        { name: t("features.qr"), included: true },
        { name: t("features.dashboard"), included: true },
        { name: t("features.webapp"), included: true },
        { name: t("features.basic_analytics"), included: true },
        { name: t("features.multilang"), included: false },
        { name: t("features.setup"), included: false },
        { name: t("features.support_basic"), included: false },
      ],
      cta: t("plans.basic.cta"),
      highlight: false,
    },
    {
      name: t("plans.pro.name"),
      description: t("plans.pro.desc"),
      pricePerRoom: 3.5,
      features: [
        { name: t("features.qr"), included: true },
        { name: t("features.dashboard"), included: true },
        { name: t("features.webapp"), included: true },
        { name: t("features.adv_analytics"), included: true },
        { name: t("features.multilang"), included: true },
        { name: t("features.setup"), included: false },
        { name: t("features.support_std"), included: true },
      ],
      cta: t("plans.pro.cta"),
      highlight: true,
    },
    {
      name: t("plans.premium.name"),
      description: t("plans.premium.desc"),
      pricePerRoom: 6.0,
      features: [
        { name: t("features.qr"), included: true },
        { name: t("features.dashboard"), included: true },
        { name: t("features.webapp"), included: true },
        { name: t("features.adv_analytics"), included: true },
        { name: t("features.multilang"), included: true },
        { name: t("features.setup"), included: true, tooltip: t("features.setup_tooltip") },
        { name: t("features.support_vip"), included: true },
      ],
      cta: t("plans.premium.cta"),
      highlight: false,
    }
  ];

  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            {t("subtitle")}
          </p>

          {/* Slider Section */}
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-16">
            <div className="flex justify-between items-end mb-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t("slider_label")}</label>
                <div className="text-4xl font-bold text-primary mt-1">{roomCount} <span className="text-lg text-gray-400 font-medium">{t("rooms")}</span></div>
              </div>
            </div>
            <Slider
              value={rooms}
              onValueChange={setRooms}
              max={500}
              min={10}
              step={10}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
              <span>10 {t("rooms")}</span>
              <span>250 {t("rooms")}</span>
              <span>500+ {t("rooms")}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => {
            const monthlyPrice = Math.round(plan.pricePerRoom * roomCount);
            
            return (
              <div 
                key={index} 
                className={`relative p-8 rounded-3xl bg-white transition-all duration-300 ${
                  plan.highlight 
                    ? "border-2 border-primary shadow-xl scale-105 z-10" 
                    : "border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    {t("plans.pro.badge")}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{plan.description}</p>
                </div>

                <div className="mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">${monthlyPrice}</span>
                    <span className="text-gray-500 ml-2">{t("month")}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ${plan.pricePerRoom.toFixed(2)} {t("per_room")}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.name}
                      </span>
                      {feature.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full h-12 rounded-xl font-bold text-base ${
                    plan.highlight 
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-blue-200" 
                      : "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            {t("enterprise")} <a href="#" className="text-primary font-bold hover:underline">{t("contact_sales")}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

