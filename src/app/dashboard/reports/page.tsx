"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardPageLoading } from "@/components/dashboard/DashboardPageLoading";

type AnalyticsResponse = {
  stats: {
    totalRequests: number;
    openRequests: number;
    completedRequests: number;
    avgResponseMinutes: number | null;
    topService: string | null;
  };
  requestsByDay: Array<{ date: string; count: number }>;
};

export default function ReportsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsInitialLoading(true);
      try {
        const response = await fetch("/api/analytics/overview", { cache: "no-store" });
        const json = await response.json();
        setData(json);
      } finally {
        setIsInitialLoading(false);
      }
    }
    load();
  }, []);

  const chartMax = Math.max(...(data?.requestsByDay.map((point) => point.count) ?? [1]), 1);

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <DashboardPageLoading variant="analytics" />
      ) : (
        <>
      <DashboardPageHeader
        eyebrow="Insights · analytics"
        title="Reports"
        description="Operational metrics from your live database — refreshed on load."
      >
        <Button variant="outline" className="gap-2 h-9 text-xs rounded-md">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </DashboardPageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total requests", value: String(data?.stats.totalRequests ?? 0) },
          { title: "Open", value: String(data?.stats.openRequests ?? 0) },
          { title: "Completed", value: String(data?.stats.completedRequests ?? 0) },
          {
            title: "Avg response",
            value:
              data?.stats.avgResponseMinutes !== null && data?.stats.avgResponseMinutes !== undefined
                ? `${data.stats.avgResponseMinutes} min`
                : "—",
          },
        ].map((stat) => (
          <div key={stat.title} className="card-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50">
              {stat.title}
            </p>
            <p className="numeral text-3xl text-ink mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h3 className="font-display text-lg text-ink">Requests over time</h3>
            <p className="text-sm text-foreground/55 mt-0.5">Last 30 days (sample)</p>
          </div>
          <span className="text-sm text-foreground/55 font-mono">
            Top: {data?.stats.topService ?? "—"}
          </span>
        </div>

        <div className="h-56 flex items-end gap-1.5 sm:gap-2">
          {(data?.requestsByDay ?? []).slice(-14).map((point) => (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="w-full bg-surface rounded-sm h-40 relative overflow-hidden border border-[color:var(--border)]">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-sm"
                  style={{
                    height: `${Math.max(8, (point.count / chartMax) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-foreground/45 truncate w-full text-center">
                {point.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface p-4 flex items-start gap-3 border-l-2 border-primary">
        <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Data loads from your production database on each visit. For scheduled exports, wire a job
          later.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
