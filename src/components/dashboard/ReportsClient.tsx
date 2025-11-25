"use client";

import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, TrendingDown, Users, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReportsClientProps {
  totalRequests: number;
  completionRate: number;
  topServiceName: string;
  topServiceCount: number;
}

export function ReportsClient({ 
  totalRequests, 
  completionRate, 
  topServiceName, 
  topServiceCount 
}: ReportsClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.dashboard.reports.${key}`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl">
            <Calendar className="h-4 w-4" />
            {t("last_30_days")}
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200">
            <Download className="h-4 w-4" />
            {t("export_report")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("total_requests"), value: totalRequests.toString(), trend: "+12%", trendUp: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: t("avg_response"), value: "8m 30s", trend: "-15%", trendUp: true, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { title: t("completion_rate"), value: `${completionRate}%`, trend: "+2%", trendUp: true, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { title: t("top_service"), value: topServiceName, sub: translate("app.dashboard.reports.requests_count").replace("{count}", topServiceCount.toString()), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className="h-6 w-6" />
                </div>
                {stat.trend && (
                   <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.trend.replace('-', '')}
                   </div>
                )}
             </div>
             <div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">{stat.title}</p>
                {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
             </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="font-bold text-lg text-gray-900">{t("requests_over_time")}</h3>
                <p className="text-sm text-gray-500">{t("daily_request_volume")}</p>
             </div>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium flex items-center gap-2">
               <TrendingUp className="h-5 w-5" />
               {t("chart_requests_per_day")}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="font-bold text-lg text-gray-900">{t("service_distribution")}</h3>
                <p className="text-sm text-gray-500">{t("breakdown_by_category")}</p>
             </div>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium flex items-center gap-2">
               <Users className="h-5 w-5" />
               {t("chart_top_services")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

