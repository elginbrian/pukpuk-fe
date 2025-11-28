// Export all types from this folder

export interface ForecastData {
  month: string;
  actual: number | null;
  predicted: number;
  upper_ci?: number;
  lower_ci?: number;
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

export interface Location {
  code: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  type: string;
  address: string;
  icon_url: string;
}

// Route Optimization Types
export interface RouteOption {
  id: string;
  distance: number;
  duration: string;
  fuel_cost: number;
  toll_cost: number;
  co2: number;
  path: string;
}

export interface RouteOptimizationRequest {
  origin: string;
  destination: string;
  vehicle_type: string;
  load_capacity: number;
}

export interface RouteOptimizationResponse {
  fastest: RouteOption;
  cheapest: RouteOption;
  greenest: RouteOption;
}

export interface Vehicle {
  code: string;
  name: string;
  min_capacity: number;
  max_capacity: number;
  fuel_consumption: number;
  average_speed: number;
  co2_factor: number;
  type: string;
}

export interface RouteConfiguration {
  origin: string;
  destination: string;
  vehicle_type: string;
  load_capacity: number;
  fastest_distance: number;
  cheapest_distance: number;
  greenest_distance: number;
  fastest_path: string[];
  cheapest_path: string[];
  greenest_path: string[];
}
