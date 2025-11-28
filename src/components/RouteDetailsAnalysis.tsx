"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Leaf } from "lucide-react";
import { RouteOption } from "../types";

interface RouteDetailsAnalysisProps {
  currentRoute: RouteOption | null;
  loading?: boolean;
}

export function RouteDetailsAnalysis({ currentRoute, loading = false }: RouteDetailsAnalysisProps) {
  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <div className="h-6 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!currentRoute) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6 text-center text-muted-foreground">Select a route to view details</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Route Details & Cost Breakdown</CardTitle>
        <CardDescription>{currentRoute.path}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cost">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
            <TabsTrigger value="environment">Environmental</TabsTrigger>
          </TabsList>

          <TabsContent value="cost" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Fuel Cost</span>
                <span className="font-semibold">Rp {currentRoute.fuel_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Toll Cost</span>
                <span className="font-semibold">Rp {currentRoute.toll_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Driver Cost (estimated)</span>
                <span className="font-semibold">Rp 120,000</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-semibold text-foreground">Total Estimated Cost</span>
                <span className="text-lg font-bold text-primary">Rp {(currentRoute.fuel_cost + currentRoute.toll_cost + 120000).toLocaleString()}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Total Distance</span>
                <span className="font-semibold">{currentRoute.distance} km</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Fuel Consumption Rate</span>
                <span className="font-semibold">2.8 km/L</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Predicted Fuel Usage</span>
                <span className="font-semibold">{(currentRoute.distance / 2.8).toFixed(1)} L</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Fuel Price (avg)</span>
                <span className="font-semibold">Rp 7,650/L</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Total CO₂ Emission</span>
                <span className="font-semibold">{currentRoute.co2} kg</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">Emission per km</span>
                <span className="font-semibold">0.35 kg/km</span>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-success">
                  <Leaf className="h-4 w-4 inline mr-1" />
                  {currentRoute.co2 < 80 ? "This route has the lowest environmental impact" : currentRoute.co2 < 90 ? "Moderate environmental impact" : "Consider the greenest route for lower emissions"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
