"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../../../components/ui/card";
import { MessageList, ChatInput, QuickActions, RecentInsights } from "../../../components";
import { apiService } from "../../../services/api";
import { AIInsightRequest } from "../../../types";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

export default function Insights() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for supply chain intelligence. I can help you with demand forecasting, inventory optimization, route planning, and data analysis. I have access to your current supply chain data and can provide insights based on real metrics and forecasts. What would you like to explore?",
      suggestions: ["What's the current demand trend?", "Show me inventory optimization suggestions", "Analyze route efficiency", "Check forecasting accuracy"],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await apiService.createChatSession();
        setSessionId(session.session_id);
      } catch (error) {
        console.error("Failed to create chat session:", error);
      }
    };

    initializeSession();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
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
        query: input,
        crop_type: "rice",
        region: "jawa-barat",
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleQuickActionClick = (action: string) => {
    setInput(action);
  };

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">AI Insights & Recommendations</h1>
        <p className="text-sm md:text-base text-muted-foreground">Conversational intelligence powered by supply chain analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-6">
        {/* Main Chat Area */}
        <Card className="lg:col-span-3 glass-panel flex flex-col">
          <CardHeader className="border-b border-border">
            <CardDescription className="text-xs md:text-sm">Tip: Ask questions about your supply chain data!</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <MessageList messages={messages} onSuggestionClick={handleSuggestionClick} />
            <ChatInput input={input} onInputChange={setInput} onSend={handleSend} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <QuickActions onActionClick={handleQuickActionClick} />
          <Card className="glass-panel">
            <RecentInsights />
          </Card>
        </div>
      </div>
    </div>
  );
}
