"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RefreshCw, Download } from "lucide-react";

export function ModelConfiguration() {
  const [cropType, setCropType] = useState("rice");
  const [region, setRegion] = useState("jawa-barat");
  const [season, setSeason] = useState("wet-season");

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg">Model Configuration</CardTitle>
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
              <SelectItem value="wheat">Wheat</SelectItem>
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
              <SelectItem value="jawa-barat">Jawa Barat</SelectItem>
              <SelectItem value="jawa-tengah">Jawa Tengah</SelectItem>
              <SelectItem value="jawa-timur">Jawa Timur</SelectItem>
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
          <Button className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Forecast
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
