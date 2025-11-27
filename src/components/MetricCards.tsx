"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { apiService } from "../services";
import { Metrics } from "../types";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold">{value}</p>
          {change && <span className={`text-sm flex items-center ${trend === "up" ? "text-green-600" : trend === "down" ? "text-destructive" : ""}`}>{change}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{title === "Volatility Score" ? "moderate" : title.includes("Error") ? "tons" : title.includes("Trend") ? "next quarter" : ""}</p>
      </CardContent>
    </Card>
  );
}

export function MetricCards() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-panel">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <div>Failed to load metrics</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard title="Mean Absolute Error" value={metrics.mae.toFixed(0)} change="↓ 8.2%" icon={<Activity className="w-4 h-4 text-primary" />} trend="down" />
      <MetricCard title="RMSE" value={metrics.rmse.toFixed(0)} change="↓ 5.4%" icon={<Activity className="w-4 h-4 text-primary" />} trend="down" />
      <MetricCard title="Demand Trend" value={`${metrics.demand_trend.toFixed(1)}%`} change="↑ 1.21%" icon={<TrendingUp className="w-4 h-4 text-primary" />} trend="up" />
      <MetricCard title="Volatility Score" value={metrics.volatility_score.toFixed(2)} icon={<AlertTriangle className="w-4 h-4 text-warning" />} />
    </div>
  );
}
