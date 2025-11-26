"use client";

import { MetricCards } from "../../components/MetricCards";
import { ForecastChart } from "../../components/ForecastChart";
import { ModelConfiguration } from "../../components/ModelConfiguration";
import { ScenarioSimulation } from "../../components/ScenarioSimulation";

export default function DemandForecasting() {
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Demand Forecasting</h1>
        <p className="text-muted-foreground">AI-powered multivariate demand prediction using CatBoost model</p>
      </div>

      <MetricCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ForecastChart />
        <ModelConfiguration />
      </div>

      <ScenarioSimulation />
    </div>
  );
}
