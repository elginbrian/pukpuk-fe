import axios, { AxiosInstance } from "axios";
import {
  ForecastData,
  Metrics,
  ForecastRequest,
  ScenarioRequest,
  AIInsightRequest,
  AIInsightResponse,
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

  async getRouteConfigurations(): Promise<RouteConfiguration[]> {
    const response = await this.axiosInstance.get<RouteConfiguration[]>("/route-optimization/configurations");
    return response.data;
  }
}

export const apiService = new ApiService();
