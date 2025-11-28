"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Navigation, Fuel, DollarSign, Leaf, Clock, Zap, TrendingDown } from "lucide-react";

interface RouteOption {
  distance: number;
  duration: string;
  fuelCost: number;
  tollCost: number;
  co2: number;
  path: string;
}

interface RouteComparisonCardsProps {
  routeOptions: Record<string, RouteOption>;
  selectedRoute: string;
  onRouteSelect: (route: string) => void;
}

export function RouteComparisonCards({ routeOptions, selectedRoute, onRouteSelect }: RouteComparisonCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-shrink-0">
      {Object.entries(routeOptions).map(([key, route]) => (
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
              <span className="font-medium">{route.distance} km</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Duration
              </span>
              <span className="font-medium">{route.duration}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                Fuel Cost
              </span>
              <span className="font-medium">Rp {route.fuelCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Toll Cost
              </span>
              <span className="font-medium">Rp {route.tollCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                CO₂
              </span>
              <span className="font-medium">{route.co2} kg</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/50">
              <div className="text-xs font-semibold text-foreground">Total Cost: Rp {(route.fuelCost + route.tollCost).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
