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

export interface AIInsightRequest {
  query: string;
  crop_type?: string;
  region?: string;
  season?: string;
  session_id?: string;
}

export interface AIInsightResponse {
  response: string;
  suggestions: string[];
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  crop_type?: string;
  region?: string;
  season?: string;
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
}

export interface CreateSessionRequest {
  crop_type?: string;
  region?: string;
  season?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  crop_type: string;
  region: string;
  season: string;
  created_at: string;
}
