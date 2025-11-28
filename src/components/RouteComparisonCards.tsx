"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Navigation, Fuel, DollarSign, Leaf, Clock, Zap, TrendingDown } from "lucide-react";
import { RouteOptimizationResponse } from "../types";

interface RouteComparisonCardsProps {
  routeOptions: RouteOptimizationResponse | null;
  selectedRoute: string;
  onRouteSelect: (route: string) => void;
  loading?: boolean;
}

export function RouteComparisonCards({ routeOptions, selectedRoute, onRouteSelect, loading = false }: RouteComparisonCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-shrink-0">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!routeOptions) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-shrink-0">
        <Card className="border-border/50 col-span-3">
          <CardContent className="p-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-spin border-2 border-primary border-t-transparent"></div>
              <p>Loading route options from server...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-shrink-0">
      {Object.entries(routeOptions).map(([key, route]) => {
        const routeOption = route as any; // Type assertion since we know the structure
        return (
          <Card key={key} className={`cursor-pointer transition-all hover-glow ${selectedRoute === key ? "border-primary ring-2 ring-primary/20" : "border-border/50"}`} onClick={() => onRouteSelect(key)}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {key === "fastest" && <Zap className="h-4 w-4 text-info" />}
                {key === "cheapest" && <TrendingDown className="h-4 w-4 text-success" />}
                {key === "greenest" && <Leaf className="h-4 w-4 text-success" />}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  Distance
                </span>
                <span className="font-medium">{routeOption.distance} km</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </span>
                <span className="font-medium">{routeOption.duration}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  Fuel Cost
                </span>
                <span className="font-medium">Rp {routeOption.fuel_cost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Toll Cost
                </span>
                <span className="font-medium">Rp {routeOption.toll_cost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  CO₂
                </span>
                <span className="font-medium">{routeOption.co2} kg</span>
              </div>
              <div className="pt-2 mt-2 border-t border-border/50">
                <div className="text-xs font-semibold text-foreground">Total Cost: Rp {(routeOption.fuel_cost + routeOption.toll_cost).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
