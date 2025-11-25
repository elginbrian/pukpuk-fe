import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Layers, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";


export default function Heatmap() {
  const [viewMode, setViewMode] = useState<"live" | "forecast">("forecast");
  const [selectedLayer, setSelectedLayer] = useState("demand");
  const [zoomLevel, setZoomLevel] = useState("kecamatan");
  const [timeRange, setTimeRange] = useState(0);

  const layerOptions = [
    { value: "demand", label: "Forecast Demand", color: "from-primary to-secondary" },
    { value: "stock", label: "Live Stock", color: "from-info to-primary" },
    { value: "shortage", label: "Shortage Risk", color: "from-warning to-destructive" },
    { value: "dead-stock", label: "Dead-Stock Intensity", color: "from-purple-500 to-pink-500" },
  ];

  const mockRegions = [
    { name: "Kec. Bantul", demand: "12.3 tons", confidence: 92, trend: "up", risk: "low" },
    { name: "Kec. Sleman", demand: "18.7 tons", confidence: 88, trend: "up", risk: "medium" },
    { name: "Kec. Yogyakarta", demand: "9.1 tons", confidence: 95, trend: "stable", risk: "low" },
    { name: "Kec. Kulon Progo", demand: "15.2 tons", confidence: 85, trend: "down", risk: "high" },
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Multi-Scale Demand Heatmap</h1>
        <p className="text-muted-foreground">
          Visualize fertilizer demand across territorial levels with AI-powered forecasting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control Panel */}
        <Card className="lg:col-span-1 glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Map Controls</CardTitle>
            <CardDescription>Configure layers and view settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Live/Forecast Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Data Mode</label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "live" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setViewMode("live")}
                >
                  Live
                </Button>
                <Button
                  variant={viewMode === "forecast" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setViewMode("forecast")}
                >
                  Forecast
                </Button>
              </div>
            </div>

            {/* Layer Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Data Layer</label>
              <Select value={selectedLayer} onValueChange={setSelectedLayer}>
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

            {/* Zoom Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Territorial Level</label>
              <Select value={zoomLevel} onValueChange={setZoomLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desa">Desa (Village)</SelectItem>
                  <SelectItem value="kecamatan">Kecamatan (District)</SelectItem>
                  <SelectItem value="kabupaten">Kabupaten (Regency)</SelectItem>
                  <SelectItem value="provinsi">Provinsi (Province)</SelectItem>
                  <SelectItem value="pulau">Pulau (Island)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Slider */}
            {viewMode === "forecast" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium mb-1">Forecast Period</label>
                  <span className="text-xs text-muted-foreground">Week {timeRange + 1}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.currentTarget.value))}
                  className="w-full py-4 h-2 accent-primary"
                />
              </div>
            )}

            {/* Legend */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="block text-sm font-medium mb-1">Intensity Scale</label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Low</span>
                  <span className="text-muted-foreground">High</span>
                </div>
                <div className={`h-4 rounded bg-linear-to-r ${layerOptions.find(l => l.value === selectedLayer)?.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map View */}
        <Card className="lg:col-span-3 glass-panel overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-[600px] bg-linear-to-br from-navy-deep/10 to-navy-medium/10">
              {/* Mock Map Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Layers className="h-16 w-16 mx-auto text-primary/40" />
                  <p className="text-muted-foreground">
                    Interactive map would be rendered here
                  </p>
                  <p className="text-xs text-muted-foreground max-w-md">
                    In production, integrate with Mapbox GL JS or Google Maps API to display
                    geospatial heatmaps with drill-down capabilities across territorial levels
                  </p>
                </div>
              </div>

              {/* Floating Info Cards */}
              <div className="absolute top-4 right-4 space-y-2 max-w-xs">
                <Card className="glass-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Current Selection</CardTitle>
                      {viewMode === "live" && (
                        <Badge variant="outline" className="status-healthy">
                          <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse-glow" />
                          Live
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="font-medium">Yogyakarta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium capitalize">{zoomLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layer:</span>
                      <span className="font-medium">
                        {layerOptions.find(l => l.value === selectedLayer)?.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Details */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Region Details</CardTitle>
          <CardDescription>Detailed forecast information for selected areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRegions.map((region) => (
              <Card key={region.name} className="hover-glow cursor-pointer transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{region.name}</CardTitle>
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
    </div>
  );
}
