import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const forecastData = [
  { month: "Jan", actual: 4000, predicted: 4100 },
  { month: "Feb", actual: 4500, predicted: 4400 },
  { month: "Mar", actual: 4200, predicted: 4300 },
  { month: "Apr", actual: 4800, predicted: 4700 },
  { month: "May", actual: 4600, predicted: 4800 },
  { month: "Jun", actual: 4900, predicted: 5000 },
  { month: "Jul", actual: null, predicted: 5200 },
  { month: "Aug", actual: null, predicted: 5400 },
  { month: "Sep", actual: null, predicted: 5600 },
];

export function ForecastChart() {
  return (
    <Card className="lg:col-span-2 glass-panel">
      <CardHeader>
        <CardTitle>Demand Forecast - Time Series</CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-xs">Actual Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs">Predicted Demand</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} label={{ value: "Demand (tons)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} fill="url(#colorActual)" dot={{ fill: "#06b6d4", r: 4 }} />
              <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorPredicted)" dot={{ fill: "#10b981", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">Confidence Interval</p>
        </div>
      </CardContent>
    </Card>
  );
}
