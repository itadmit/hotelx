"use client";

import Link from "next/link";
import { QrCode, BarChart3, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all group"
    >
      <span className="text-xs text-blue-600 font-medium min-w-[60px] text-left">
        {label}:
      </span>
      <span className="text-xs font-mono text-blue-900 flex-1 text-left">
        {text}
      </span>
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

export function DemoSection() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`demo_section.${key}`);
  
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Two Cards Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Guest Experience Card */}
          <Link 
            href="/g/demo-hotel/201"
            target="_blank"
            className="group bg-white border-2 border-blue-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              {t("guest_title")}
            </h3>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t("guest_desc")}
            </p>
            
            <div className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              {t("guest_cta")}
              <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hotel Dashboard Card */}
          <div className="group bg-white border-2 border-blue-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all shadow-lg">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t("dashboard_title")}
            </h3>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t("dashboard_desc")}
            </p>

            {/* Demo credentials */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6">
              <div className="text-xs font-semibold text-blue-900 mb-3">{t("demo_login")}</div>
              <div className="space-y-2">
                <CopyButton text="demo@hotelx.app" label={t("email_label")} />
                <CopyButton text="demo123" label={t("password_label")} />
              </div>
            </div>
            
            <Link 
              href="/login"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 hover:gap-2 transition-all"
            >
              {t("dashboard_cta")}
              <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

