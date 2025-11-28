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
        minHeight: 400,
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

interface RouteMapSectionProps {
  origin: string;
  destination: string;
}

export function RouteMapSection({ origin, destination }: RouteMapSectionProps) {
  return (
    <Card className="border-border/50 overflow-hidden lg:flex-1 lg:flex lg:flex-col max-h-[600px] lg:max-h-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Route Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:flex-1 lg:flex lg:flex-col pb-6 max-h-[500px] lg:max-h-none">
        <RouteMap origin={origin} destination={destination} />
      </CardContent>
    </Card>
  );
}
