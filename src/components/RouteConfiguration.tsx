"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

interface RouteConfigurationProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

export function RouteConfiguration({ origin, destination, onOriginChange, onDestinationChange }: RouteConfigurationProps) {
  return (
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
          <Select value={origin} onValueChange={onOriginChange}>
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
          <Select value={destination} onValueChange={onDestinationChange}>
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
  );
}
