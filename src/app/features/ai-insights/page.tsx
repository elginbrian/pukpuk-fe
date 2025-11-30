"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../../../components/ui/card";
import { MessageList, ChatInput, QuickActions, RecentInsights } from "../../../components";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { apiService } from "../../../services/api";
import { AIInsightRequest } from "../../../types";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

interface DataStatus {
  metrics: boolean;
  forecast: boolean;
  locations: boolean;
  vehicles: boolean;
  routes: boolean;
}

const getInitialMessage = (status: DataStatus): Message => {
  let content = "Hello! I'm your AI assistant for supply chain intelligence. ";
  const availableFeatures = [];

  if (status.metrics) availableFeatures.push("demand forecasting analysis");
  if (status.forecast) availableFeatures.push("performance metrics review");
  if (status.locations && status.vehicles) availableFeatures.push("route optimization");
  if (status.routes) availableFeatures.push("logistics planning");

  if (availableFeatures.length > 0) {
    content += `I currently have access to: ${availableFeatures.join(", ")}. `;
  } else {
    content += "I'm connecting to your supply chain data. ";
  }

  content += "What would you like to explore?";

  const suggestions = [];
  if (status.metrics) suggestions.push("What's the demand trend?");
  if (status.forecast) suggestions.push("Show forecasting accuracy");
  if (status.routes) suggestions.push("Analyze routes");
  if (status.vehicles) suggestions.push("Optimize fleet");
  suggestions.push("Check data status");

  return {
    role: "assistant",
    content,
    suggestions,
    timestamp: new Date(),
  };
};

export default function Insights() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>({
    metrics: false,
    forecast: false,
    locations: false,
    vehicles: false,
    routes: false,
  });
  const [isCheckingData, setIsCheckingData] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await apiService.createChatSession();
        setSessionId(session.session_id);
      } catch (error) {
        console.error("Failed to create chat session:", error);
      }
    };

    const checkDataAvailability = async () => {
      setIsCheckingData(true);
      const status: DataStatus = {
        metrics: false,
        forecast: false,
        locations: false,
        vehicles: false,
        routes: false,
      };

      try {
        await apiService.getMetrics();
        status.metrics = true;
      } catch (error) {
        console.log("Metrics not available:", error);
      }

      try {
        await apiService.runForecast({
          crop_type: "rice",
          region: "malang regency",
          season: "wet-season",
        });
        status.forecast = true;
      } catch (error) {
        console.log("Forecast data not available:", error);
      }

      try {
        await apiService.getLocations();
        status.locations = true;
      } catch (error) {
        console.log("Locations not available:", error);
      }

      try {
        await apiService.getVehicles();
        status.vehicles = true;
      } catch (error) {
        console.log("Vehicles not available:", error);
      }

      status.routes = status.locations && status.vehicles;

      setDataStatus(status);
      setIsCheckingData(false);

      const initialMessage = getInitialMessage(status);
      setMessages([initialMessage]);
    };

    initializeSession();
    checkDataAvailability();
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const request: AIInsightRequest = {
        query: textToSend,
        crop_type: "rice",
        region: "malang regency",
        season: "wet-season",
        session_id: sessionId || undefined,
      };

      const response = await apiService.generateAIInsight(request);

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                role: "assistant",
                content: response.response,
                suggestions: response.suggestions,
                timestamp: new Date(),
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error generating AI insight:", error);
      // Replace loading message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                role: "assistant",
                content: "Sorry, I encountered an error while processing your request. Please try again.",
                timestamp: new Date(),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await handleSend(suggestion);
  };

  const handleQuickActionClick = async (action: string) => {
    await handleSend(action);
  };

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:pl-6 md:pr-6 md:pt-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">AI Insights & Recommendations</h1>
        <p className="text-sm md:text-base text-muted-foreground">Conversational intelligence powered by supply chain analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-6">
        {/* Main Chat Area */}
        <Card className="lg:col-span-3 glass-panel flex flex-col max-h-[90vh]">
          <CardHeader className="border-b border-border">
            <CardDescription className="text-xs md:text-sm">Tip: Ask questions about your supply chain data!</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <MessageList messages={messages} onSuggestionClick={handleSuggestionClick} />
            <ChatInput input={input} onInputChange={setInput} onSend={handleSend} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <ScrollArea className="max-h-[90vh] bg-transparent">
          <div className="space-y-4">
            <QuickActions onActionClick={handleQuickActionClick} />

            <Card className="glass-panel">
              <RecentInsights />
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
