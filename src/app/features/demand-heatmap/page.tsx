"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Layers } from "lucide-react";
import { MapData, MapProps } from "../../../components/InteractiveMap";
import { MapControls, MapOverlay, MapLegend, RegionalInsights } from "../../../components/demand-heatmap";
import { apiService } from "../../../services/api";

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
  const [regionalInsights, setRegionalInsights] = useState<
    Array<{
      name: string;
      demand: string;
      confidence: number;
      trend: "up" | "down" | "stable";
      risk: "low" | "medium" | "high";
    }>
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchDemandData = async (level: string, mode: string, layer: string) => {
    try {
      setIsLoadingData(true);
      const response = await apiService.getDemandHeatmapData(level, mode, layer);
      setMapData(response.mapAnalytics as MapData);
      setRegionalInsights(
        response.regionalInsights.map((insight) => ({
          ...insight,
          trend: insight.trend as "up" | "down" | "stable",
          risk: insight.risk as "low" | "medium" | "high",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch demand heatmap data:", error);
      // Fallback to empty data if API fails
      setMapData({});
      setRegionalInsights([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDemandData(currentLevel, viewMode, selectedLayer);
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
        <MapControls viewMode={viewMode} selectedLayer={selectedLayer} currentLevel={currentLevel} timeRange={timeRange} onViewModeChange={setViewMode} onLayerChange={setSelectedLayer} onTimeRangeChange={setTimeRange} />

        {/* MAP VIEW */}
        <Card className="lg:col-span-3 glass-panel overflow-hidden h-[600px]">
          <CardContent className="p-0 h-full relative">
            <div className="absolute inset-0 z-0">
              <MapView level={currentLevel} layerType={selectedLayer} onClickRegion={handleRegionClick} breadcrumbs={breadcrumbs} onBreadcrumbClick={handleBreadcrumbClick} mapAnalytics={mapData} currentRegionName={regionName} />
            </div>

            <MapOverlay viewMode={viewMode} regionName={regionName} selectedLayer={selectedLayer} />

            <MapLegend viewMode={viewMode} />
          </CardContent>
        </Card>
      </div>

      {/* Region Details */}
      <RegionalInsights regions={regionalInsights} />
    </div>
  );
}
