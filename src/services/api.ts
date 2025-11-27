import axios, { AxiosInstance } from "axios";
import { ForecastData, Metrics, ForecastRequest, ScenarioRequest } from "../types";

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
}

export const apiService = new ApiService();
