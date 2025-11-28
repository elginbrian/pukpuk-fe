"use client";

import { useState } from "react";
import { RouteOptimizationHeader } from "../../../components/RouteOptimizationHeader";
import { RouteConfiguration } from "../../../components/RouteConfiguration";
import { VehicleConfiguration } from "../../../components/VehicleConfiguration";
import { RouteMapSection } from "../../../components/RouteMapSection";
import { RouteComparisonCards } from "../../../components/RouteComparisonCards";
import { RouteDetailsAnalysis } from "../../../components/RouteDetailsAnalysis";

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

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route as "fastest" | "cheapest" | "greenest");
  };

  const currentRoute = routeOptions[selectedRoute];

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      <RouteOptimizationHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6 lg:h-[calc(100vh-12rem)] lg:flex lg:flex-col">
          <RouteConfiguration origin={origin} destination={destination} onOriginChange={setOrigin} onDestinationChange={setDestination} />

          <VehicleConfiguration vehicleType={vehicleType} loadCapacity={loadCapacity} onVehicleTypeChange={setVehicleType} onLoadCapacityChange={setLoadCapacity} />
        </div>

        {/* Right Panel - Map & Route Comparison */}
        <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-12rem)] lg:flex lg:flex-col">
          <RouteMapSection origin={origin} destination={destination} />

          <RouteComparisonCards routeOptions={routeOptions} selectedRoute={selectedRoute} onRouteSelect={handleRouteSelect} />
        </div>
      </div>

      {/* Detailed Route Analysis - Full Width */}
      <RouteDetailsAnalysis currentRoute={currentRoute} />
    </div>
  );
};

export default Routing;
