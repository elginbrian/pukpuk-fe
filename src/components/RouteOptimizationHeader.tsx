"use client";

import { Button } from "./ui/button";
import { Send } from "lucide-react";

interface RouteOptimizationHeaderProps {
  onSendToLogistics?: () => void;
}

export function RouteOptimizationHeader({ onSendToLogistics }: RouteOptimizationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Route Optimization</h1>
        <p className="text-sm md:text-base text-muted-foreground">Cost-aware, Fuel-aware, Toll-aware Planning</p>
      </div>
      <Button className="gap-2 self-start md:self-auto mb-4 mt-2" onClick={onSendToLogistics}>
        <Send className="h-4 w-4" />
        Send to Logistics Team
      </Button>
    </div>
  );
}
