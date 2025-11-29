import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ForecastData } from "../types";

const defaultData: ForecastData[] = [
  { month: "Jan", actual: 4000, predicted: 4100, upper_ci: 4715, lower_ci: 3485 },
  { month: "Feb", actual: 4500, predicted: 4400, upper_ci: 5060, lower_ci: 3740 },
  { month: "Mar", actual: 4200, predicted: 4300, upper_ci: 4945, lower_ci: 3655 },
  { month: "Apr", actual: 4800, predicted: 4700, upper_ci: 5410, lower_ci: 3990 },
  { month: "May", actual: 4600, predicted: 4800, upper_ci: 5520, lower_ci: 4080 },
  { month: "Jun", actual: 4900, predicted: 5000, upper_ci: 5750, lower_ci: 4250 },
  { month: "Jul", actual: null, predicted: 5200, upper_ci: 5980, lower_ci: 4420 },
  { month: "Aug", actual: null, predicted: 5400, upper_ci: 6210, lower_ci: 4590 },
  { month: "Sep", actual: null, predicted: 5600, upper_ci: 6440, lower_ci: 4760 },
];

interface ForecastChartProps {
  data?: ForecastData[];
  loading?: boolean;
}

export function ForecastChart({ data = defaultData, loading = false }: ForecastChartProps) {
  const chartData = data.length > 0 ? data : defaultData;

  // derive min/max for Y axis domain (consider predicted/actual and CI when present)
  const numericValues: number[] = chartData.flatMap((d) => [d.actual, d.predicted, d.upper_ci, d.lower_ci].filter((v) => typeof v === "number") as number[]);
  const dataMin = numericValues.length > 0 ? Math.min(...numericValues) : 0;
  const dataMax = numericValues.length > 0 ? Math.max(...numericValues) : 0;

  const computeNiceYMax = (maxVal: number) => {
    if (!maxVal || maxVal <= 0) return 1000;
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
    const step = magnitude * 2;
    return Math.ceil((maxVal + 1) / step) * step;
  };

  const yMax = computeNiceYMax(dataMax);
  const yDomain: [number, number] = [0, yMax];

  const preferredTicks = 9;
  const xInterval = chartData.length > preferredTicks ? Math.floor(chartData.length / preferredTicks) : 0;

  return (
    <Card className="lg:col-span-2 glass-panel">
      <CardHeader>
        <CardTitle>Demand Forecast - Time Series</CardTitle>
        <div className="flex items-center gap-4 mt-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-xs">Actual Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs">Predicted Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
            <span className="text-xs">95% Confidence Interval</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="h-[400px] px-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} tickMargin={8} interval={xInterval} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickMargin={8}
                    width={80}
                    domain={yDomain}
                    // Round and localize tick labels (no decimals)
                    tickFormatter={(val) => {
                      if (typeof val !== "number") return val as any;
                      return Math.round(val).toLocaleString();
                    }}
                    label={{ value: "Demand (tons)", angle: -90, position: "insideLeft", dx: -12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: string) => {
                      // Hide CI values from the tooltip
                      if (name === "upper_ci" || name === "lower_ci") return [null, null];
                      if (value == null) return [null, name === "actual" ? "Actual Demand" : "Predicted Demand"];
                      const rounded = Math.round(Number(value));
                      return [rounded.toLocaleString(), name === "actual" ? "Actual Demand" : "Predicted Demand"];
                    }}
                  />

                  <Area type="monotone" dataKey="upper_ci" stroke="none" fill="url(#colorConfidence)" stackId="ci" connectNulls />
                  <Area type="monotone" dataKey="lower_ci" stroke="none" fill="#ffffff" stackId="ci" connectNulls />
                  <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} fill="url(#colorActual)" dot={{ fill: "#06b6d4", r: 4 }} />
                  <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={{ fill: "#10b981", r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
