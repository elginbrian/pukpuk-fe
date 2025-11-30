"use client";

import { TrendingUp, Package, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const quickActions = [
    { icon: TrendingUp, label: "Forecast Summary", color: "text-primary" },
    { icon: Package, label: "Inventory Status", color: "text-secondary" },
    { icon: MapPin, label: "Route Analysis", color: "text-accent" },
    { icon: AlertTriangle, label: "Risk Alerts", color: "text-warning" },
  ];

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-xs md:text-sm">Jump to key insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button key={index} variant="outline" className="w-full justify-start hover-glow" onClick={() => onActionClick(`Show me ${action.label.toLowerCase()}`)}>
            <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
