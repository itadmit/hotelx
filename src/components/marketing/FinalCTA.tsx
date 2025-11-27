"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Star, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FinalCTA() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`final_cta.${key}`);
  
  const stats = [
    { label: "Average Revenue Increase", value: "30%", icon: TrendingUp, color: "bg-white/20 text-white" },
    { label: "Faster Response Time", value: "40%", icon: CheckCircle2, color: "bg-white/20 text-white" },
    { label: "Guest Satisfaction", value: "95%", icon: Star, color: "bg-white/20 text-white" },
  ];
  
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
      </div>
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-all text-center group hover:-translate-y-1">
              <div className={`h-14 w-14 rounded-2xl ${stat.color} flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 shadow-lg`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 leading-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto hover:scale-105">
                {t("cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-14 px-8 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto backdrop-blur-sm">
                Book a Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-blue-100">
            {t("trust").split("•").map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span>{item.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


