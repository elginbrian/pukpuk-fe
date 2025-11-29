import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface MapOverlayProps {
  viewMode: "live" | "forecast";
  regionName: string;
  selectedLayer: string;
}

const layerOptions = [
  { value: "demand", label: "Forecast (AI)" },
  { value: "stock", label: "Live Stock" },
  { value: "shortage", label: "Shortage Risk" },
  { value: "dead-stock", label: "Dead-Stock Intensity" },
];

export function MapOverlay({ viewMode, regionName, selectedLayer }: MapOverlayProps) {
  return (
    <div className="absolute top-4 right-4 space-y-2 max-w-xs z-[1000]">
      <Card className="bg-card/90 backdrop-blur-md border shadow-xl">
        <CardHeader className="pb-2 pt-3 px-4 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Active View</CardTitle>
            <Badge variant={viewMode === "live" ? "outline" : "default"} className="text-[10px] h-5 px-1.5">
              {viewMode === "live" && <span className="h-1.5 w-1.5 rounded-full bg-success mr-1 animate-pulse-glow" />}
              {viewMode === "live" ? "Live Data" : "AI Forecast"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-3 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Region</span>
            <span className="font-black text-foreground truncate max-w-[140px] uppercase">{regionName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Layer</span>
            <span className="font-bold text-foreground">{layerOptions.find((l) => l.value === selectedLayer)?.label}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
