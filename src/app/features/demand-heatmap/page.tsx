"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Layers, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { MapData, MapProps } from "../../../components/InteractiveMap";

const MapView = dynamic<MapProps>(() => import("../../../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground animate-pulse gap-2">
      <Layers className="h-8 w-8 opacity-50" />
      <span className="text-sm">Initializing AI Map Engine...</span>
    </div>
  ),
});

export default function Heatmap() {
  const [viewMode, setViewMode] = useState<"live" | "forecast">("forecast");
  const [selectedLayer, setSelectedLayer] = useState("demand");
  const [timeRange, setTimeRange] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("pulau"); 
  const [regionName, setRegionName] = useState("Indonesia");
  const [breadcrumbs, setBreadcrumbs] = useState<{ code: string; name: string }[]>([]);
  const [mapData, setMapData] = useState<MapData>({});

  const layerOptions = [
    { value: "demand", label: "Forecast (AI)", color: "from-primary to-secondary" },
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

  const generateMockData = (level: string, mode: string, layer: string) => {
    const newData: MapData = {};
    const prefixes = level === "pulau" 
        ? ["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "31", "32", "33", "34", "35", "36", "51", "52", "53", "61", "62", "63", "64", "65", "71", "72", "73", "74", "75", "76", "81", "82", "91", "94"] 
        : ["3501", "3502", "3507", "3573", "3578", "3204", "3273", "1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108", "1171"];

    prefixes.forEach(id => {
        const value = Math.floor(Math.random() * 1000) + 50; 
        let status: any = "safe";
        let label = "Aman";
        if (mode === "forecast") {
            const risk = Math.random();
            if (risk < 0.15) { status = "critical"; label = "Defisit (Urgent)"; }
            else if (risk < 0.35) { status = "warning"; label = "Menipis (Waspada)"; }
            else if (risk > 0.85) { status = "overstock"; label = "Overstock (Bahaya)"; }
        } else {
             if (value < 200) { status = "warning"; label = "Restock Needed"; }
             else { status = "safe"; label = "Stock Healthy"; }
        }
        newData[id] = { status, value, label };
    });

    if (level === "35") { 
         newData["3507"] = { status: "critical", value: 120, label: "Lonjakan Permintaan (CatBoost)" }; 
         newData["3573"] = { status: "safe", value: 500, label: "Stok Aman" }; 
         newData["3501"] = { status: "overstock", value: 950, label: "Risk: Dead Stock" }; 
    }
    setMapData(newData);
  };

  useEffect(() => {
    generateMockData(currentLevel, viewMode, selectedLayer);
  }, [currentLevel, viewMode, selectedLayer]);

  const handleRegionClick = (code: string, name: string) => {
    if (code) {
      if (currentLevel !== "pulau" && currentLevel !== "indonesia") {
          setBreadcrumbs((prev) => [...prev, { code: currentLevel, name: regionName }]);
      }
      setCurrentLevel(code);
      setRegionName(name);
    }
  };

  const handleBreadcrumbClick = (code: string, name: string, index: number) => {
    if (index === -1) {
        setBreadcrumbs([]);
        setCurrentLevel("pulau");
        setRegionName("Indonesia");
    } else {
        const newBreadcrumbs = breadcrumbs.slice(0, index);
        setBreadcrumbs(newBreadcrumbs);
        setCurrentLevel(code);
        setRegionName(name);
    }
  };

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Multi-Scale Demand Heatmap</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitoring Area: <span className="font-semibold text-primary">{regionName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-6">
        {/* Control Panel */}
        <Card className="lg:col-span-1 glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Map Controls</CardTitle>
            <CardDescription>Configure AI forecast parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ... (Bagian Control Panel TETAP SAMA, tidak perlu diubah) ... */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Data Mode</label>
              <div className="flex gap-2">
                <Button variant={viewMode === "live" ? "default" : "outline"} className="flex-1" onClick={() => setViewMode("live")}>Live</Button>
                <Button variant={viewMode === "forecast" ? "default" : "outline"} className="flex-1" onClick={() => setViewMode("forecast")}>Forecast (AI)</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Data Layer</label>
              <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <div className="p-2 bg-muted/50 rounded-md text-sm font-mono text-center border">
                 {currentLevel === "pulau" ? "National View" : `ID: ${currentLevel}`}
              </div>
            </div>
            {viewMode === "forecast" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium mb-1">Forecast Period</label>
                  <span className="text-xs text-muted-foreground">Week {timeRange + 1}</span>
                </div>
                <input type="range" min={0} max={12} step={1} value={timeRange} onChange={(e) => setTimeRange(Number(e.currentTarget.value))} className="w-full py-4 h-2 accent-primary" />
              </div>
            )}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="block text-sm font-medium mb-1">Intensity Scale</label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Low Risk</span>
                  <span className="text-muted-foreground">High Risk</span>
                </div>
                <div className={`h-4 rounded bg-linear-to-r ${layerOptions.find((l) => l.value === selectedLayer)?.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MAP VIEW */}
        <Card className="lg:col-span-3 glass-panel overflow-hidden h-[600px]"> 
          <CardContent className="p-0 h-full relative">
            <div className="absolute inset-0 z-0">
               <MapView 
                  level={currentLevel} 
                  layerType={selectedLayer} 
                  onClickRegion={handleRegionClick}
                  breadcrumbs={breadcrumbs} 
                  onBreadcrumbClick={handleBreadcrumbClick}
                  mapAnalytics={mapData}
                  currentRegionName={regionName}
               />
            </div>

            {/* --- OVERLAY INFO CARD (TEXT HITAM TEGAS) --- */}
            <div className="absolute top-4 right-4 space-y-2 max-w-xs z-[1000]">
              {/* Background: Putih Transparan (Glass Light) */}
              <Card className="bg-white/90 backdrop-blur-md border border-white/40 shadow-xl"> 
                <CardHeader className="pb-2 pt-3 px-4 border-b border-gray-200/50">
                  <div className="flex items-center justify-between gap-4">
                    {/* Title: Abu Tua */}
                    <CardTitle className="text-xs uppercase tracking-wider text-gray-600 font-bold">Active View</CardTitle>
                    <Badge variant={viewMode === "live" ? "outline" : "default"} className="text-[10px] h-5 px-1.5">
                        {viewMode === "live" && <span className="h-1.5 w-1.5 rounded-full bg-success mr-1 animate-pulse-glow" />} 
                        {viewMode === "live" ? "Live Data" : "AI Forecast"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Region</span>
                    {/* Value: Hitam Pekat */}
                    <span className="font-black text-black truncate max-w-[140px] uppercase">{regionName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Layer</span>
                    <span className="font-bold text-slate-800">
                      {layerOptions.find((l) => l.value === selectedLayer)?.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- LEGEND (TEXT HITAM TEGAS) --- */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-lg border border-white/40 shadow-xl text-xs">
                <p className="font-bold mb-2 text-black tracking-tight">
                    {viewMode === "forecast" ? "Risk Index (AI Prediction)" : "Real-time Stock Level"}
                </p>
                <div className="space-y-1.5 text-slate-800 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#EF4444] rounded-full shadow-sm border border-slate-300"></div> 
                        <span>Critical (Defisit)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full shadow-sm border border-slate-300"></div> 
                        <span>Warning (Menipis)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#10B981] rounded-full shadow-sm border border-slate-300"></div> 
                        <span>Safe (Aman)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#8B5CF6] rounded-full shadow-sm border border-slate-300"></div> 
                        <span>Overstock (Dead Stock)</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Details */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Regional Insights</CardTitle>
          <CardDescription>AI-detected anomalies in current view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRegions.map((region) => (
              <Card key={region.name} className="hover-glow cursor-pointer transition-all border-primary/10">
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