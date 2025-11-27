"use client";

import Link from "next/link";
import { ArrowRight, QrCode, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`hero.${key}`);
  
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-blue-700 text-xs font-semibold mb-6 md:mb-8 border border-blue-100 shadow-lg hover:shadow-xl transition-all cursor-default hover:scale-105 whitespace-nowrap">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="leading-none">{t("new_badge")}</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-slate-900 tracking-tight mb-6 max-w-5xl leading-[1.1]">
          {t("title_start")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative inline-block pb-2 animate-gradient">
            {t("title_highlight")}
            <svg 
              className="absolute bottom-0 left-0 w-full h-2 overflow-visible"
              viewBox="0 0 100 6" 
              fill="none"
              preserveAspectRatio="none"
            >
              <path 
                d="M 0 3 Q 25 0, 50 3 T 100 3" 
                stroke="url(#hero-gradient)" 
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#4f46e5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
          <Link 
            href="/signup"
            className="group inline-flex items-center justify-center h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center">
              {t("cta_primary")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link 
            href="/demo"
            className="inline-flex items-center justify-center h-14 px-8 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-semibold text-lg hover:bg-slate-50 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            {t("cta_secondary")}
          </Link>
        </div>


        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {t("trust_1")}
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {t("trust_2")}
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {t("trust_3")}
          </div>
        </div>

        {/* Mockup Placeholder - Hidden on Mobile */}
        <div className="hidden md:block mt-12 relative w-full max-w-5xl mx-auto group perspective-1000">
          {/* Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          {/* Main Dashboard Container */}
          <div className="aspect-[16/9] rounded-3xl bg-white border border-slate-200/60 shadow-2xl shadow-slate-200/50 flex overflow-hidden relative z-10 transform transition-transform duration-700 group-hover:scale-[1.01]">
            
            {/* Sidebar Skeleton */}
            <div className="w-20 lg:w-64 bg-slate-50/50 border-r border-slate-100 p-6 flex flex-col gap-8">
              <div className="h-8 w-8 lg:w-32 bg-blue-600/10 rounded-lg flex items-center justify-center lg:justify-start lg:px-3">
                <div className="w-5 h-5 bg-blue-600 rounded-md lg:mr-3"></div>
                <div className="hidden lg:block h-2 w-16 bg-blue-600/20 rounded-full"></div>
              </div>
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-10 w-full rounded-xl flex items-center px-3 gap-3 ${i === 1 ? 'bg-white shadow-sm ring-1 ring-slate-100' : 'hover:bg-white/50'}`}>
                    <div className={`w-5 h-5 rounded-md ${i === 1 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <div className={`hidden lg:block h-2 w-24 rounded-full ${i === 1 ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-slate-200/50">
                 <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div className="hidden lg:block space-y-1.5">
                       <div className="h-2 w-20 bg-slate-300 rounded-full"></div>
                       <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white flex flex-col min-w-0">
              {/* Top Header */}
              <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100"></div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 overflow-hidden bg-slate-50/30 flex-1">
                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Revenue', val: 'w-24', trend: 'text-green-500' },
                    { label: 'Orders', val: 'w-16', trend: 'text-blue-500' },
                    { label: 'Time', val: 'w-20', trend: 'text-orange-500' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="h-2 w-16 bg-slate-200 rounded-full mb-4"></div>
                      <div className="flex items-end justify-between">
                        <div className={`h-6 ${stat.val} bg-slate-800 rounded-lg`}></div>
                        <div className={`h-4 w-12 rounded-full bg-slate-100`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-8 h-full pb-8">
                  {/* Main Chart Area */}
                  <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-3 w-32 bg-slate-300 rounded-full"></div>
                      <div className="h-8 w-24 bg-slate-50 rounded-lg"></div>
               </div>
                    {/* Abstract Chart */}
                    <div className="flex-1 flex items-end gap-4 px-2 pb-2">
                      {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 50, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-50 rounded-t-lg relative group/bar overflow-hidden" style={{ height: `${h}%` }}>
                           <div className="absolute bottom-0 left-0 w-full bg-blue-500/20 h-0 group-hover/bar:h-full transition-all duration-500"></div>
                           <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 opacity-0 group-hover/bar:opacity-100"></div>
                  </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="h-3 w-24 bg-slate-300 rounded-full mb-6"></div>
                    <div className="space-y-5">
                      {[1,2,3,4].map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${i%2===0 ? 'bg-green-50' : 'bg-orange-50'}`}></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
            </div>

            {/* Floating Center Card (Now slightly smaller and animated) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200 border border-white/60 ring-1 ring-slate-200/60 transform transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-10px]">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-900 text-xl font-bold font-heading">{t("mockup_title")}</p>
                <p className="text-slate-500 mt-1 text-sm font-medium">{t("mockup_subtitle")}</p>
                
                {/* Decorative elements behind card */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

