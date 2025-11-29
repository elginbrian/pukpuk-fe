"use client";

import { useState, useEffect } from "react";
import { RouteOptimizationHeader } from "../../../components/RouteOptimizationHeader";
import { RouteConfiguration } from "../../../components/RouteConfiguration";
import { VehicleConfiguration } from "../../../components/VehicleConfiguration";
import { RouteMapSection } from "../../../components/RouteMapSection";
import { RouteComparisonCards } from "../../../components/RouteComparisonCards";
import { RouteDetailsAnalysis } from "../../../components/RouteDetailsAnalysis";
import { apiService } from "../../../services/api";
import { RouteOptimizationResponse, RouteOption } from "../../../types";

const Routing = () => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "greenest">("fastest");
  const [vehicleType, setVehicleType] = useState("truck-medium");
  const [loadCapacity, setLoadCapacity] = useState("8");
  const [origin, setOrigin] = useState("plant-surabaya");
  const [destination, setDestination] = useState("kios-malang");
  const [routeOptions, setRouteOptions] = useState<RouteOptimizationResponse | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  const fetchRouteOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.optimizeRoute({
        origin,
        destination,
        vehicle_type: vehicleType,
        load_capacity: parseFloat(loadCapacity),
      });
      setRouteOptions(response);
    } catch (err) {
      setError("Failed to optimize route. Please try again.");
      console.error("Route optimization error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteOptimization();
  }, [origin, destination, vehicleType, loadCapacity]);

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route as "fastest" | "cheapest" | "greenest");
  };

  const currentRoute = routeOptions ? routeOptions[selectedRoute] : null;

  return (
    <div className="space-y-4 md:space-y-8 p-4 md:p-8 animate-fade-in">
      <RouteOptimizationHeader />

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 lg:h-auto">
        {/* Left Panel - Controls */}
        <div className="space-y-6 lg:h-auto lg:flex lg:flex-col">
          <RouteConfiguration origin={origin} destination={destination} onOriginChange={setOrigin} onDestinationChange={setDestination} />

          <VehicleConfiguration vehicleType={vehicleType} loadCapacity={loadCapacity} onVehicleTypeChange={setVehicleType} onLoadCapacityChange={setLoadCapacity} />
        </div>

        {/* Right Panel - Map & Route Comparison */}
        <div className="lg:col-span-2 space-y-6 lg:h-auto lg:flex lg:flex-col">
          <RouteMapSection origin={origin} destination={destination} routeOptions={routeOptions} selectedRoute={selectedRoute} />

          <RouteComparisonCards routeOptions={routeOptions} selectedRoute={selectedRoute} onRouteSelect={handleRouteSelect} loading={loading} />
        </div>
      </div>

      {/* Detailed Route Analysis - Full Width */}
      <div className="mt-4 md:mt-8">
        <RouteDetailsAnalysis currentRoute={currentRoute} loading={loading} />
      </div>
    </div>
  );
};

export default Routing;
