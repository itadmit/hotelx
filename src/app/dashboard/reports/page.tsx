import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, TrendingDown, Users, Clock, CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into your hotel's operational performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Requests", value: "1,234", trend: "+12%", trendUp: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Avg Response", value: "8m 30s", trend: "-15%", trendUp: true, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { title: "Completion Rate", value: "94%", trend: "+2%", trendUp: true, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { title: "Top Service", value: "Room Service", sub: "45% of total", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
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
                <h3 className="font-bold text-lg text-gray-900">Requests Over Time</h3>
                <p className="text-sm text-gray-500">Daily request volume</p>
             </div>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium flex items-center gap-2">
               <TrendingUp className="h-5 w-5" />
               Chart: Requests per day (Last 7 days)
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="font-bold text-lg text-gray-900">Service Distribution</h3>
                <p className="text-sm text-gray-500">Breakdown by category</p>
             </div>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium flex items-center gap-2">
               <Users className="h-5 w-5" />
               Chart: Top services breakdown
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}