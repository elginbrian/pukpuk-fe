import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface RegionalInsight {
  name: string;
  code: string;
  demand: string;
  confidence: number;
  trend: "up" | "down" | "stable";
  risk: "low" | "medium" | "high";
}

interface RegionalInsightsProps {
  regions: RegionalInsight[];
  onRegionClick?: (code: string, name: string) => void;
  isDistrictLevel?: boolean;
}

export function RegionalInsights({ regions, onRegionClick, isDistrictLevel = false }: RegionalInsightsProps) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Regional Insights</CardTitle>
        <CardDescription>AI-detected anomalies in current view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region) => (
            <Card
              key={region.name}
              className={`hover-glow transition-all border-primary/10 ${!isDistrictLevel && onRegionClick ? "cursor-pointer" : ""}`}
              onClick={() => !isDistrictLevel && onRegionClick && onRegionClick(region.code, region.name)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{region.name.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-primary">{region.demand}</p>
                  <p className="text-xs text-muted-foreground">Forecasted demand</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-medium">{region.confidence}%</span>
                </div>
                <div className="flex items-center gap-2">
                  {region.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                  {region.trend === "down" && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                  {region.risk === "high" && <AlertTriangle className="h-3 w-3 text-warning" />}
                  <Badge variant={region.risk === "high" ? "destructive" : "secondary"} className="text-xs">
                    {region.risk} risk
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
