"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RefreshCw, Download } from "lucide-react";
import { ForecastRequest } from "../types";
import { apiService } from "../services";

interface ModelConfigurationProps {
  onRunForecast?: (request: ForecastRequest) => void;
  loading?: boolean;
}

interface ModelConfigurationProps {
  onRunForecast?: (request: ForecastRequest) => void;
  loading?: boolean;
}

export function ModelConfiguration({ onRunForecast, loading = false }: ModelConfigurationProps) {
  const [cropType, setCropType] = useState("rice");
  const [region, setRegion] = useState("malang regency");
  const [season, setSeason] = useState("wet-season");
  const [exportLoading, setExportLoading] = useState(false);

  // Run forecast once on mount
  useEffect(() => {
    if (onRunForecast) {
      onRunForecast({ crop_type: cropType, region, season });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-run when any parameter changes
  useEffect(() => {
    const t = setTimeout(() => {
      if (onRunForecast) {
        onRunForecast({ crop_type: cropType, region, season });
      }
    }, 450);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropType, region, season]);

  const handleRunForecast = () => {
    if (onRunForecast) {
      onRunForecast({
        crop_type: cropType,
        region,
        season,
      });
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await apiService.exportForecastResults(cropType, region, season, "csv");

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `forecast_${cropType}_${region}_${season}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export forecast results:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Model Configuration</CardTitle>
        <p className="text-xs text-muted-foreground">Forecast runs automatically when parameters change</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Crop Type</label>
          <Select value={cropType} onValueChange={setCropType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="corn">Corn</SelectItem>
              <SelectItem value="sugarcane">Sugarcane</SelectItem>
              <SelectItem value="soybean">Soybean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malang regency">Malang Regency</SelectItem>
              <SelectItem value="blitar regency">Blitar Regency</SelectItem>
              <SelectItem value="kediri regency">Kediri Regency</SelectItem>
              <SelectItem value="madiun regency">Madiun Regency</SelectItem>
              <SelectItem value="jember regency">Jember Regency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Season</label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wet-season">Wet Season</SelectItem>
              <SelectItem value="dry-season">Dry Season</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-4">
          <Button className="w-full" onClick={handleRunForecast} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Running..." : "Refresh Forecast"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleExport} disabled={exportLoading}>
            <Download className={`w-4 h-4 mr-2 ${exportLoading ? "animate-spin" : ""}`} />
            {exportLoading ? "Exporting..." : "Export Results"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
