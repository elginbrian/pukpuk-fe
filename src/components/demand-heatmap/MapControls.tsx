import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface MapControlsProps {
  viewMode: "live" | "forecast";
  selectedLayer: string;
  currentLevel: string;
  timeRange: number;
  onViewModeChange: (mode: "live" | "forecast") => void;
  onLayerChange: (layer: string) => void;
  onTimeRangeChange: (range: number) => void;
}

const layerOptions = [
  { value: "demand", label: "Forecast (AI)", color: "from-primary to-secondary" },
  { value: "stock", label: "Live Stock", color: "from-info to-primary" },
  { value: "shortage", label: "Shortage Risk", color: "from-warning to-destructive" },
  { value: "dead-stock", label: "Dead-Stock Intensity", color: "from-purple-500 to-pink-500" },
];

export function MapControls({ viewMode, selectedLayer, currentLevel, timeRange, onViewModeChange, onLayerChange, onTimeRangeChange }: MapControlsProps) {
  return (
    <Card className="lg:col-span-1 glass-panel">
      <CardHeader>
        <CardTitle className="text-lg">Map Controls</CardTitle>
        <CardDescription>Configure AI forecast parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Data Mode</label>
          <div className="flex gap-2">
            <Button variant={viewMode === "live" ? "default" : "outline"} className="flex-1" onClick={() => onViewModeChange("live")}>
              Live
            </Button>
            <Button variant={viewMode === "forecast" ? "default" : "outline"} className="flex-1" onClick={() => onViewModeChange("forecast")}>
              Forecast (AI)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Data Layer</label>
          <Select value={selectedLayer} onValueChange={onLayerChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full bg-linear-to-r ${option.color}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Current Level ID</label>
          <div className="p-2 bg-muted/50 rounded-md text-sm font-mono text-center border">{currentLevel === "pulau" ? "National View" : `ID: ${currentLevel}`}</div>
        </div>

        {viewMode === "forecast" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Forecast Period</label>
              <span className="text-xs text-muted-foreground">Week {timeRange + 1}</span>
            </div>
            <input type="range" min={0} max={12} step={1} value={timeRange} onChange={(e) => onTimeRangeChange(Number(e.currentTarget.value))} className="w-full py-4 h-2 accent-primary" />
          </div>
        )}

        
      </CardContent>
    </Card>
  );
}
