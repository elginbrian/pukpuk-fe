"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { apiService } from "../services/api";
import { AutomaticInsight } from "../types";

export function RecentInsights() {
  const [insights, setInsights] = useState<AutomaticInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutomaticInsights = async () => {
      try {
        setLoading(true);
        const automaticInsights = await apiService.getAutomaticInsights("rice", "malang regency", "wet-season", 3);
        setInsights(automaticInsights);
      } catch (err) {
        console.error("Failed to fetch automatic insights:", err);
        setError("Failed to load recent insights");
      } finally {
        setLoading(false);
      }
    };

    fetchAutomaticInsights();
  }, []);

  const getBorderColor = (type: string, priority: string) => {
    if (priority === "high") return "border-l-red-500";
    if (type === "demand") return "border-l-primary";
    if (type === "inventory") return "border-l-warning";
    if (type === "route") return "border-l-secondary";
    return "border-l-muted";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="default" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <CardHeader className="pt-4">
          <CardTitle className="text-lg">Recent Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-l-4 border-l-muted animate-pulse">
              <CardContent className="p-3 space-y-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </>
    );
  }

  if (error || insights.length === 0) {
    return (
      <>
        <CardHeader className="pt-4">
          <CardTitle className="text-lg">Recent Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Card className="border-l-4 border-l-muted">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-medium">No Recent Insights</p>
              <p className="text-xs text-muted-foreground">Start a conversation to generate insights</p>
            </CardContent>
          </Card>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader className="pt-4">
        <CardTitle className="text-lg">Recent Insights</CardTitle>
        <CardDescription className="text-xs">AI-generated insights from recent conversations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${getBorderColor(insight.type, insight.priority)}`}>
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{insight.title}</p>
                {getPriorityBadge(insight.priority)}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
              <Badge variant="outline" className="text-xs capitalize">
                {insight.type}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </>
  );
}
