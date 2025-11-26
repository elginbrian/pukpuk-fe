'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { 
  Navigation, 
  Fuel, 
  DollarSign, 
  Leaf, 
  MapPin, 
  Truck, 
  Send,
  Clock,
  TrendingDown,
  Zap
} from "lucide-react";

// Mock route data
const routeOptions = {
  fastest: {
    distance: 245,
    duration: "3h 45min",
    fuelCost: 180000,
    tollCost: 45000,
    co2: 85,
    path: "Plant A → Warehouse B → Kios Bandung → Kios Garut"
  },
  cheapest: {
    distance: 280,
    duration: "4h 20min",
    fuelCost: 155000,
    tollCost: 25000,
    co2: 92,
    path: "Plant A → Warehouse A → Kios Tasikmalaya → Kios Garut"
  },
  greenest: {
    distance: 260,
    duration: "4h 10min",
    fuelCost: 165000,
    tollCost: 35000,
    co2: 78,
    path: "Plant A → Warehouse B → Kios Sumedang → Kios Garut"
  }
};

const Routing = () => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "greenest">("fastest");
  const [vehicleType, setVehicleType] = useState("truck-medium");
  const [loadCapacity, setLoadCapacity] = useState("8");

  const currentRoute = routeOptions[selectedRoute];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Route Optimization</h1>
          <p className="text-muted-foreground">Cost-aware, Fuel-aware, Toll-aware Planning</p>
        </div>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Send to Logistics Team
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Origin & Destination */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Route Configuration</CardTitle>
              <CardDescription>Define origin and waypoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Origin
                </Label>
                <Select defaultValue="plant-a">
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
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">2. Kios Bandung</span>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-success" />
                  Final Destination
                </Label>
                <Select defaultValue="kios-garut">
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
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Configuration</CardTitle>
              <CardDescription>Select vehicle and load capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Input 
                  type="number" 
                  value={loadCapacity}
                  onChange={(e) => setLoadCapacity(e.target.value)}
                  min="1"
                  max="15"
                />
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

          {/* Route Options */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Route Optimization Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={selectedRoute === "fastest" ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setSelectedRoute("fastest")}
              >
                <Zap className="h-4 w-4" />
                Fastest Route
              </Button>
              <Button 
                variant={selectedRoute === "cheapest" ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setSelectedRoute("cheapest")}
              >
                <DollarSign className="h-4 w-4" />
                Cheapest Route
              </Button>
              <Button 
                variant={selectedRoute === "greenest" ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setSelectedRoute("greenest")}
              >
                <Leaf className="h-4 w-4" />
                Lowest Emission
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right - Map & Route Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map Placeholder */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map Placeholder with Route Lines */}
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-navy-deep to-muted/20">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 right-0 h-px bg-border animate-pulse" style={{ top: '25%' }} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-border animate-pulse" style={{ top: '50%' }} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-border animate-pulse" style={{ top: '75%' }} />
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-border animate-pulse" style={{ left: '25%' }} />
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-border animate-pulse" style={{ left: '50%' }} />
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-border animate-pulse" style={{ left: '75%' }} />
                </div>

                {/* Route Points */}
                <div className="absolute top-[20%] left-[15%] flex flex-col items-center gap-1 z-10">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse-glow shadow-lg" />
                  <Badge className="text-xs bg-background/90 backdrop-blur">Plant A</Badge>
                </div>

                <div className="absolute top-[40%] left-[40%] flex flex-col items-center gap-1 z-10">
                  <div className="w-3 h-3 rounded-full bg-info shadow-lg" />
                  <Badge variant="outline" className="text-xs bg-background/90 backdrop-blur">Warehouse B</Badge>
                </div>

                <div className="absolute top-[60%] left-[65%] flex flex-col items-center gap-1 z-10">
                  <div className="w-3 h-3 rounded-full bg-info shadow-lg" />
                  <Badge variant="outline" className="text-xs bg-background/90 backdrop-blur">Kios Bandung</Badge>
                </div>

                <div className="absolute top-[75%] left-[85%] flex flex-col items-center gap-1 z-10">
                  <div className="w-4 h-4 rounded-full bg-success animate-pulse-glow shadow-lg" />
                  <Badge className="text-xs bg-background/90 backdrop-blur">Kios Garut</Badge>
                </div>

                {/* Route Line Visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 15% 20% Q 30% 30%, 40% 40% T 65% 60% T 85% 75%"
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8 4"
                    className="animate-pulse"
                  />
                </svg>

                {/* Floating Info Card */}
                <div className="absolute top-4 right-4 p-3 max-w-[200px]">
                  <p className="text-xs font-semibold text-primary mb-1">Selected Route</p>
                  <p className="text-xs text-muted-foreground">{currentRoute.path}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(routeOptions).map(([key, route]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover-glow ${
                  selectedRoute === key ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
                }`}
                onClick={() => setSelectedRoute(key as typeof selectedRoute)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {key === 'fastest' && <Zap className="h-4 w-4 text-info" />}
                    {key === 'cheapest' && <TrendingDown className="h-4 w-4 text-success" />}
                    {key === 'greenest' && <Leaf className="h-4 w-4 text-success" />}
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
                    <div className="text-xs font-semibold text-foreground">
                      Total Cost: Rp {(route.fuelCost + route.tollCost).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Route Analysis */}
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
                      <span className="text-lg font-bold text-primary">
                        Rp {(currentRoute.fuelCost + currentRoute.tollCost + 120000).toLocaleString()}
                      </span>
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
                        {currentRoute.co2 < 80 
                          ? 'This route has the lowest environmental impact' 
                          : currentRoute.co2 < 90 
                          ? 'Moderate environmental impact'
                          : 'Consider the greenest route for lower emissions'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Routing;
