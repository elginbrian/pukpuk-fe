"use client";

import { useEffect, useRef, useState } from "react";
import L, { Map, Polyline } from "leaflet";

import { RouteOptimizationResponse } from "../types";
import { apiService } from "../services/api";

interface RouteMapProps {
  origin: string;
  destination: string;
  routeOptions: RouteOptimizationResponse | null;
  selectedRoute: "fastest" | "cheapest" | "greenest";
}

const RouteMap = ({ origin, destination, routeOptions, selectedRoute }: RouteMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const routeLayerRef = useRef<Polyline | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await apiService.getLocations();
        setLocations(locationData);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  // Update routing when selections change
  const updateRouting = async () => {
    if (!mapRef.current || !routeOptions) {
      return;
    }

    if (routeLayerRef.current) {
      try {
        mapRef.current.removeLayer(routeLayerRef.current);
      } catch (error) {
        console.warn("Error removing route layer:", error);
      }
      routeLayerRef.current = null;
    }

    const originLoc = locations.find((loc) => loc.code === origin);
    const destLoc = locations.find((loc) => loc.code === destination);

    if (!originLoc || !destLoc) {
      console.warn("Origin or destination location not found");
      return;
    }

    try {
      const routeData = await apiService.getRouteDirections(originLoc.coordinates as [number, number], destLoc.coordinates as [number, number], selectedRoute);

      let routeCoordinates: [number, number][];

      if (routeData.geometry && routeData.geometry.coordinates) {
        // OSRM format: [lng, lat]
        routeCoordinates = routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
      } else {
        // Fallback to straight line
        routeCoordinates = [originLoc.coordinates, destLoc.coordinates];
      }

      const routePoints: L.LatLng[] = routeCoordinates.map((coord) => L.latLng(coord[0], coord[1]));

      // Use different colors/styles based on route type and whether it's a real route or fallback
      const isFallback = routeData.properties?.fallback;
      let routeColor = "hsl(var(--primary))";
      let weight = 4;

      if (selectedRoute === "fastest") {
        routeColor = isFallback ? "#ef4444" : "#3b82f6";
        weight = 5;
      } else if (selectedRoute === "cheapest") {
        routeColor = isFallback ? "#ef4444" : "#10b981";
      } else if (selectedRoute === "greenest") {
        routeColor = isFallback ? "#ef4444" : "#059669";
      }

      routeLayerRef.current = L.polyline(routePoints, {
        color: routeColor,
        weight: weight,
        opacity: 0.8,
        dashArray: isFallback ? "10, 10" : undefined,
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [20, 20] });
    } catch (error) {
      console.error("Error creating route polyline:", error);

      const routePoints: L.LatLng[] = [L.latLng(originLoc.coordinates), L.latLng(destLoc.coordinates)];

      routeLayerRef.current = L.polyline(routePoints, {
        color: "#ef4444", // Red to indicate error/fallback
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 10", // Dashed line to indicate fallback
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [20, 20] });
    }
  };

  useEffect(() => {
    if (!routeOptions) {
      return;
    }

    let map: Map | undefined;
    if (!(document.getElementById("route-map") as any)?._leaflet_id) {
      const originLoc = locations.find((loc) => loc.code === origin);
      const centerCoords = originLoc ? originLoc.coordinates : [-7.7956, 110.3695]; // Default to Yogyakarta if origin not found

      map = L.map("route-map").setView([centerCoords[0], centerCoords[1]], 8);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      locations.forEach((location) => {
        if (location.code === origin || location.code === destination) {
          const icon = L.icon({
            iconUrl: location.icon_url,
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          L.marker(location.coordinates, { icon }).addTo(map!).bindPopup(location.name);
        }
      });

      setTimeout(() => {
        try {
          map!.invalidateSize();
        } catch (err) {}
      }, 150);
    }

    updateRouting();

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (error) {
          console.warn("Error cleaning up map:", error);
        }
      }
    };
  }, [origin, destination, routeOptions, selectedRoute, locations]);

  return (
    <div
      id="route-map"
      className="w-full max-w-full rounded-lg overflow-hidden relative"
      style={{
        minHeight: 300,
      }}
    />
  );
};

export default RouteMap;
