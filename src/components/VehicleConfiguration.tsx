"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Truck } from "lucide-react";

interface VehicleConfigurationProps {
  vehicleType: string;
  loadCapacity: string;
  onVehicleTypeChange: (value: string) => void;
  onLoadCapacityChange: (value: string) => void;
}

export function VehicleConfiguration({ vehicleType, loadCapacity, onVehicleTypeChange, onLoadCapacityChange }: VehicleConfigurationProps) {
  return (
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
          <Select value={vehicleType} onValueChange={onVehicleTypeChange}>
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
          <Input type="number" value={loadCapacity} onChange={(e) => onLoadCapacityChange(e.target.value)} min="1" max="15" />
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
  );
}
