"use client";

import { useState } from "react";
import { MetricCards } from "../../../components/MetricCards";
import { ForecastChart } from "../../../components/ForecastChart";
import { ModelConfiguration } from "../../../components/ModelConfiguration";
import { ScenarioSimulation } from "../../../components/ScenarioSimulation";
import { ForecastData, ForecastRequest, ScenarioRequest } from "../../../types";
import { apiService } from "../../../services";

export default function DemandForecasting() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRunForecast = async (request: ForecastRequest) => {
    setLoading(true);
    try {
      const data = await apiService.runForecast(request);
      setForecastData(data);
    } catch (error) {
      console.error("Failed to run forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSimulation = async (request: ScenarioRequest) => {
    setLoading(true);
    try {
      const data = await apiService.simulateScenario(request);
      setForecastData(data);
    } catch (error) {
      console.error("Failed to simulate scenario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Demand Forecasting</h1>
        <p className="text-sm md:text-base text-muted-foreground">AI-powered multivariate demand prediction using CatBoost model</p>
      </div>

      <MetricCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
        <ForecastChart data={forecastData} loading={loading} />
        <ModelConfiguration onRunForecast={handleRunForecast} loading={loading} />
      </div>

      <ScenarioSimulation onSimulate={handleScenarioSimulation} loading={loading} />
    </div>
  );
}
