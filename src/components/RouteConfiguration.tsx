"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { MapPin } from "lucide-react";
import { apiService } from "../services/api";
import { Location } from "../types";

interface RouteConfigurationProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

export function RouteConfiguration({ origin, destination, onOriginChange, onDestinationChange }: RouteConfigurationProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await apiService.getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const origins = locations.filter((loc) => loc.type === "plant");
  const destinations = locations.filter((loc) => loc.type === "kiosk");

  return (
    <Card className="border-border/50 lg:flex-1 lg:flex lg:flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Route Configuration</CardTitle>
        <CardDescription>Define origin and destination</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Origin
          </Label>
          <Select value={origin} onValueChange={onOriginChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading..." : "Select origin"} />
            </SelectTrigger>
            <SelectContent>
              {origins.map((loc) => (
                <SelectItem key={loc.code} value={loc.code}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-success" />
            Destination
          </Label>
          <Select value={destination} onValueChange={onDestinationChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading..." : "Select destination"} />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((loc) => (
                <SelectItem key={loc.code} value={loc.code}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
