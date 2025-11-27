"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { ScenarioRequest } from "../types";

interface ScenarioSimulationProps {
  onSimulate?: (request: ScenarioRequest) => void;
  loading?: boolean;
}

export function ScenarioSimulation({ onSimulate, loading = false }: ScenarioSimulationProps) {
  const [rainfallChange, setRainfallChange] = useState([0]);

  const handleSimulate = () => {
    if (onSimulate) {
      onSimulate({
        rainfall_change: rainfallChange[0],
      });
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Scenario Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Rainfall Change</label>
              <span className="text-sm text-muted-foreground">{rainfallChange[0]}%</span>
            </div>
            <Slider value={rainfallChange} onValueChange={setRainfallChange} min={-50} max={50} step={1} className="w-full" />
          </div>
          <Button onClick={handleSimulate} disabled={loading} className="w-full">
            {loading ? "Simulating..." : "Run Simulation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
