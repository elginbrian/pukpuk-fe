"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Navigation } from "lucide-react";

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 140,
        borderRadius: "0.5rem",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

import { RouteOptimizationResponse } from "../types";

interface RouteMapSectionProps {
  origin: string;
  destination: string;
  routeOptions: RouteOptimizationResponse | null;
  selectedRoute: "fastest" | "cheapest" | "greenest";
}

export function RouteMapSection({ origin, destination, routeOptions, selectedRoute }: RouteMapSectionProps) {
  const hasValidRouteData = routeOptions && routeOptions[selectedRoute];

  if (!hasValidRouteData) {
    return (
      <Card className="border-border/50 overflow-hidden lg:flex-1 lg:flex lg:flex-col relative">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="lg:flex-1 lg:flex lg:flex-col pb-2">
          <div className="w-full h-full min-h-[160px] md:min-h-[240px] lg:min-h-[320px] border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="text-center text-muted-foreground">
              <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No Route Data Available</p>
              <p className="text-sm">Please select valid origin, destination, and configuration to view the route</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden lg:flex-1 lg:flex lg:flex-col relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Route Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:flex-1 lg:flex lg:flex-col pb-2">
        <div className="w-full h-full min-h-[160px] md:min-h-[240px] lg:min-h-[320px]">
          <RouteMap origin={origin} destination={destination} routeOptions={routeOptions} selectedRoute={selectedRoute} />
        </div>
      </CardContent>
    </Card>
  );
}
