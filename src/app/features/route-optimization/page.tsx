"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Navigation, Fuel, DollarSign, Leaf, MapPin, Truck, Send, Clock, TrendingDown, Zap } from "lucide-react";

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import("../../../components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        borderRadius: '0.5rem',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  )
});

const routeOptions = {
  fastest: {
    distance: 245,
    duration: "3h 45min",
    fuelCost: 180000,
    tollCost: 45000,
    co2: 85,
    path: "Plant A → Warehouse B → Kios Bandung → Kios Garut",
  },
  cheapest: {
    distance: 280,
    duration: "4h 20min",
    fuelCost: 155000,
    tollCost: 25000,
    co2: 92,
    path: "Plant A → Warehouse A → Kios Tasikmalaya → Kios Garut",
  },
  greenest: {
    distance: 260,
    duration: "4h 10min",
    fuelCost: 165000,
    tollCost: 35000,
    co2: 78,
    path: "Plant A → Warehouse B → Kios Sumedang → Kios Garut",
  },
};

const Routing = () => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "greenest">("fastest");
  const [vehicleType, setVehicleType] = useState("truck-medium");
  const [loadCapacity, setLoadCapacity] = useState("8");
  const [origin, setOrigin] = useState("plant-a");
  const [destination, setDestination] = useState("kios-garut");

  const currentRoute = routeOptions[selectedRoute];

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Route Optimization</h1>
          <p className="text-sm md:text-base text-muted-foreground">Cost-aware, Fuel-aware, Toll-aware Planning</p>
        </div>
        <Button className="gap-2 self-start md:self-auto mb-4 mt-2">
          <Send className="h-4 w-4" />
          Send to Logistics Team
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6 lg:h-[calc(100vh-12rem)] lg:flex lg:flex-col">
          {/* Origin & Destination */}
          <Card className="border-border/50 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
            <CardHeader className="lg:flex-shrink-0">
              <CardTitle className="text-lg">Route Configuration</CardTitle>
              <CardDescription>Define origin and waypoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:flex-1 lg:overflow-y-auto">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Origin
                </Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant-a">Plant A - Karawang</SelectItem>
                    <SelectItem value="plant-b">Plant B - Gresik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-info" />
                  Waypoints
                </Label>
                <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">1. Warehouse B</span>
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">2. Kios Bandung</span>
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-success" />
                  Final Destination
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kios-garut">Kios Garut</SelectItem>
                    <SelectItem value="kios-sukabumi">Kios Sukabumi</SelectItem>
                    <SelectItem value="kios-cianjur">Kios Cianjur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Selector */}
          <Card className="border-border/50 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
            <CardHeader className="lg:flex-shrink-0">
              <CardTitle className="text-lg">Vehicle Configuration</CardTitle>
              <CardDescription>Select vehicle and load capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:flex-1 lg:overflow-y-auto">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehicle Type
                </Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck-small">Small Truck (3-5 tons)</SelectItem>
                    <SelectItem value="truck-medium">Medium Truck (6-10 tons)</SelectItem>
                    <SelectItem value="truck-large">Large Truck (11-15 tons)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Load Capacity (tons)</Label>
                <Input type="number" value={loadCapacity} onChange={(e) => setLoadCapacity(e.target.value)} min="1" max="15" />
              </div>

              <div className="p-3 rounded-lg bg-muted/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fuel Consumption</span>
                  <span className="font-medium">2.8 km/L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Speed</span>
                  <span className="font-medium">65 km/h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CO₂ Factor</span>
                  <span className="font-medium">0.35 kg/km</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Panel - Map & Route Comparison */}
        <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-12rem)] lg:flex lg:flex-col">
          {/* Interactive Map Placeholder */}
          <Card className="border-border/50 overflow-hidden lg:flex-1 lg:flex lg:flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="lg:flex-1 lg:flex lg:flex-col">
              {/* RouteMap Component */}
              <RouteMap origin={origin} destination={destination} />
            </CardContent>
          </Card>

          {/* Route Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-shrink-0">
        {Object.entries(routeOptions).map(([key, route]) => (
          <Card key={key} className={`cursor-pointer transition-all hover-glow ${selectedRoute === key ? "border-primary ring-2 ring-primary/20" : "border-border/50"}`} onClick={() => setSelectedRoute(key as typeof selectedRoute)}>
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
        </div>
      </div>

      {/* Detailed Route Analysis - Full Width */}
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
                      <span className="font-semibold">Rp {currentRoute.fuelCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                      <span className="text-sm text-muted-foreground">Toll Cost</span>
                      <span className="font-semibold">Rp {currentRoute.tollCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                      <span className="text-sm text-muted-foreground">Driver Cost (estimated)</span>
                      <span className="font-semibold">Rp 120,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-sm font-semibold text-foreground">Total Estimated Cost</span>
                      <span className="text-lg font-bold text-primary">Rp {(currentRoute.fuelCost + currentRoute.tollCost + 120000).toLocaleString()}</span>
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
    </div>
  );
};

export default Routing;
