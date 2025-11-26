"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Sparkles, Send, TrendingUp, Package, MapPin, AlertTriangle } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

export default function Insights() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI supply chain assistant. I can help you analyze demand forecasts, optimize distribution routes, and identify inventory risks. What would you like to know?",
      suggestions: [
        "Why is Kecamatan X showing high demand next month?",
        "Recommend redistribution from Warehouse B",
        "Explain the dead-stock alert for Warehouse B",
        "What's driving demand in Yogyakarta region?"
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Simulate AI response
    const aiResponse: Message = {
      role: "assistant",
      content: generateMockResponse(input),
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
  };

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("high demand") || query.toLowerCase().includes("kecamatan")) {
      return "Based on the CatBoost multivariate forecasting model, Kecamatan X shows elevated demand due to three key factors:\n\n1. **Seasonal patterns**: Rice planting season begins in 3 weeks\n2. **Weather forecast**: 15% above-average rainfall predicted\n3. **Historical trends**: Last year showed 18% demand spike in this period\n\nRecommended action: Increase stock allocation by 12% (approx. 2.1 tons) to meet projected demand of 19.4 tons.";
    }
    
    if (query.toLowerCase().includes("warehouse b") || query.toLowerCase().includes("dead-stock")) {
      return "Warehouse B dead-stock analysis:\n\n**Issue**: 680 tons with no movement for 18 days indicates dead-stock risk.\n\n**Root cause**: Overstocking during low-demand period, regional demand shift to neighboring areas.\n\n**Recommended actions**:\n1. Transfer 250 tons to Warehouse A (cost: Rp 2.1M via Route B)\n2. Redistribute 150 tons to Kios network in high-demand areas\n3. Reduce next month's allocation by 40%\n\n**Cost savings**: Estimated Rp 8.5M in storage and opportunity costs.";
    }

    if (query.toLowerCase().includes("redistribution") || query.toLowerCase().includes("recommend")) {
      return "Optimal redistribution plan from Warehouse B:\n\n**Route Analysis** (via cost optimization engine):\n• **Route B-1**: Warehouse B → Warehouse A (250 tons)\n  - Distance: 180 km\n  - Estimated fuel: 85L\n  - Cost: Rp 2.1M\n  - CO₂: 225 kg\n\n• **Route B-2**: Warehouse B → Kios Network (150 tons)\n  - 6 delivery points\n  - Total distance: 240 km\n  - Cost: Rp 3.2M\n\n**Total cost**: Rp 5.3M | **Time**: 2-3 days | **Risk mitigation**: High";
    }

    return "I've analyzed your query using the latest supply chain data. Could you provide more specific details about what aspect you'd like me to focus on? I can help with demand forecasting, route optimization, inventory analysis, or risk detection.";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const quickActions = [
    { icon: TrendingUp, label: "Forecast Summary", color: "text-primary" },
    { icon: Package, label: "Inventory Status", color: "text-secondary" },
    { icon: MapPin, label: "Route Analysis", color: "text-accent" },
    { icon: AlertTriangle, label: "Risk Alerts", color: "text-warning" },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] p-6 flex gap-6 animate-fade-in">
      {/* Main Chat Area */}
      <Card className="flex-1 glass-panel flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Insights & Recommendations</CardTitle>
          </div>
          <CardDescription>
            Conversational intelligence powered by supply chain analytics
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] space-y-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        {message.suggestions && (
                          <div className="space-y-2 pt-2">
                            <p className="text-xs text-muted-foreground">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, i) => (
                                <Button
                                  key={i}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs opacity-60">
                      <span>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && (
                        <Badge variant="outline" className="text-xs">
                          Source: Analytics Engine
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about forecasts, routes, inventory..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Sidebar */}
      <Card className="w-80 glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Jump to key insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start hover-glow"
              onClick={() => setInput(`Show me ${action.label.toLowerCase()}`)}
            >
              <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
              {action.label}
            </Button>
          ))}
        </CardContent>

        <CardHeader className="pt-0">
          <CardTitle className="text-lg">Recent Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-medium">High Demand Alert</p>
              <p className="text-xs text-muted-foreground">
                Kec. Bantul demand projected +18% next week
              </p>
              <Badge variant="outline" className="text-xs">2 hours ago</Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-medium">Dead-Stock Detection</p>
              <p className="text-xs text-muted-foreground">
                Warehouse B: 680 tons, 18 days idle
              </p>
              <Badge variant="outline" className="text-xs">5 hours ago</Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-medium">Route Optimization</p>
              <p className="text-xs text-muted-foreground">
                New route saves 12% fuel cost
              </p>
              <Badge variant="outline" className="text-xs">1 day ago</Badge>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
