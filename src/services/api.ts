import axios, { AxiosInstance } from "axios";
import {
  ForecastData,
  Metrics,
  ForecastRequest,
  ScenarioRequest,
  AIInsightRequest,
  AIInsightResponse,
  AIInsight,
  AutomaticInsight,
  ChatRequest,
  ChatResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  ChatMessage,
  RouteOptimizationRequest,
  RouteOptimizationResponse,
  Location,
  Vehicle,
  RouteConfiguration,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getMetrics(): Promise<Metrics> {
    const response = await this.axiosInstance.get<Metrics>("/forecasting/metrics");
    return response.data;
  }

  async runForecast(request: ForecastRequest): Promise<ForecastData[]> {
    const response = await this.axiosInstance.post<ForecastData[]>("/forecasting/forecast", request);
    return response.data;
  }

  async simulateScenario(request: ScenarioRequest): Promise<ForecastData[]> {
    const response = await this.axiosInstance.post<ForecastData[]>("/forecasting/scenario", request);
    return response.data;
  }

  async exportForecastResults(cropType: string, region: string, season: string, format: "csv" | "json" = "csv"): Promise<Blob> {
    const response = await this.axiosInstance.get(`/forecasting/export`, {
      params: { crop_type: cropType, region, season, format },
      responseType: "blob",
    });
    return response.data;
  }

  async generateAIInsight(request: AIInsightRequest): Promise<AIInsightResponse> {
    const response = await this.axiosInstance.post<AIInsightResponse>("/ai-insight/chat", {
      message: request.query,
      session_id: request.session_id,
      crop_type: request.crop_type || "rice",
      region: request.region || "jawa-barat",
      season: request.season || "wet-season",
    });
    return response.data;
  }

  async createChatSession(request: CreateSessionRequest = {}): Promise<CreateSessionResponse> {
    const response = await this.axiosInstance.post<CreateSessionResponse>("/ai-insight/session", {
      crop_type: request.crop_type || "rice",
      region: request.region || "jawa-barat",
      season: request.season || "wet-season",
    });
    return response.data;
  }

  async getChatHistory(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    const response = await this.axiosInstance.get<ChatMessage[]>(`/ai-insight/session/${sessionId}/history`, {
      params: { limit },
    });
    return response.data;
  }

  async getRecentInsights(limit: number = 10): Promise<AIInsight[]> {
    const response = await this.axiosInstance.get<AIInsight[]>("/ai-insight/recent-insights", {
      params: { limit },
    });
    return response.data;
  }

  async getAutomaticInsights(cropType: string = "rice", region: string = "malang regency", season: string = "wet-season", limit: number = 3): Promise<AutomaticInsight[]> {
    const response = await this.axiosInstance.get<AutomaticInsight[]>("/ai-insight/automatic-insights", {
      params: { crop_type: cropType, region, season, limit },
    });
    return response.data;
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimizationResponse> {
    const response = await this.axiosInstance.post<RouteOptimizationResponse>("/route-optimization/optimize", request);
    return response.data;
  }

  async getLocations(): Promise<Location[]> {
    const response = await this.axiosInstance.get<Location[]>("/route-optimization/locations");
    return response.data;
  }

  async getVehicles(): Promise<Vehicle[]> {
    const response = await this.axiosInstance.get<Vehicle[]>("/route-optimization/vehicles");
    return response.data;
  }

  async getRouteDirections(originCoords: [number, number], destCoords: [number, number], routeType: string = "fastest"): Promise<any> {
    const response = await this.axiosInstance.post("/route-optimization/directions", {
      origin_coords: originCoords,
      dest_coords: destCoords,
      route_type: routeType,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
