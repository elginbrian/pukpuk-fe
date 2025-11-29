"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Truck } from "lucide-react";
import { apiService } from "../services/api";
import { Vehicle } from "../types";

interface VehicleConfigurationProps {
  vehicleType: string;
  loadCapacity: string;
  onVehicleTypeChange: (value: string) => void;
  onLoadCapacityChange: (value: string) => void;
}

export function VehicleConfiguration({ vehicleType, loadCapacity, onVehicleTypeChange, onLoadCapacityChange }: VehicleConfigurationProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await apiService.getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const selectedVehicle = vehicles.find((v) => v.code === vehicleType);

  return (
    <Card className="border-border/50 lg:flex-1 lg:flex lg:flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Vehicle Configuration</CardTitle>
        <CardDescription>Select vehicle and load capacity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Type
          </Label>
          <Select value={vehicleType} onValueChange={onVehicleTypeChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading..." : "Select vehicle"} />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.code} value={vehicle.code}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Load Capacity (tons)</Label>
          <Input type="number" value={loadCapacity} onChange={(e) => onLoadCapacityChange(e.target.value)} min={selectedVehicle?.min_capacity || 1} max={selectedVehicle?.max_capacity || 15} />
        </div>

        {selectedVehicle && (
          <div className="p-3 rounded-lg bg-muted/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fuel Consumption</span>
              <span className="font-medium">{selectedVehicle.fuel_consumption} km/L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Speed</span>
              <span className="font-medium">{selectedVehicle.average_speed} km/h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CO₂ Factor</span>
              <span className="font-medium">{selectedVehicle.co2_factor} kg/km</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
