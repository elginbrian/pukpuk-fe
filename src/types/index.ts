// Export all types from this folder

export interface ForecastData {
  month: string;
  actual: number | null;
  predicted: number;
}

export interface Metrics {
  mae: number;
  rmse: number;
  demand_trend: number;
  volatility_score: number;
}

export interface ForecastRequest {
  crop_type: string;
  region: string;
  season: string;
}

export interface ScenarioRequest {
  rainfall_change: number;
}
