import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard title="Mean Absolute Error" value="142" change="↓ 8.2%" icon={<Activity className="w-4 h-4 text-primary" />} trend="down" />
      <MetricCard title="RMSE" value="218" change="↓ 5.4%" icon={<Activity className="w-4 h-4 text-primary" />} trend="down" />
      <MetricCard title="Demand Trend" value="+15.3%" change="↑ 1.21%" icon={<TrendingUp className="w-4 h-4 text-primary" />} trend="up" />
      <MetricCard title="Volatility Score" value="0.68" icon={<AlertTriangle className="w-4 h-4 text-warning" />} />
    </div>
  );
}
