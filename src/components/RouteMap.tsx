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
  const updateRouting = () => {
    if (!mapRef.current || !routeOptions || !routeOptions[selectedRoute]?.waypoints) {
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

    const leafletWaypoints: L.LatLng[] = routeOptions[selectedRoute].waypoints!.map((coord) => L.latLng(coord));

    try {
      routeLayerRef.current = L.polyline(leafletWaypoints, {
        color: "hsl(var(--primary))",
        weight: 4,
        opacity: 0.8,
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [20, 20] });
    } catch (error) {
      console.error("Error creating route polyline:", error);
    }
  };

  useEffect(() => {
    if (!routeOptions || !routeOptions[selectedRoute]?.waypoints) {
      return;
    }

    let map: Map | undefined;
    if (!(document.getElementById("route-map") as any)?._leaflet_id) {
      const firstWaypoint = routeOptions[selectedRoute].waypoints![0];
      map = L.map("route-map").setView([firstWaypoint[0], firstWaypoint[1]], 8);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      routeOptions[selectedRoute].waypoints!.forEach((waypoint, index) => {
        const locationData = locations.find((loc) => loc.coordinates[0] === waypoint[0] && loc.coordinates[1] === waypoint[1]);

        let icon;
        let popupText = `Waypoint ${index + 1}`;

        if (locationData) {
          icon = L.icon({
            iconUrl: locationData.icon_url,
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          popupText = locationData.name;
        } else {
          icon = L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          popupText = `Waypoint ${index + 1}`;
        }

        L.marker([waypoint[0], waypoint[1]], { icon }).addTo(map!).bindPopup(popupText);
      });

      setTimeout(() => {
        try {
          map!.invalidateSize();
        } catch (err) {}
      }, 150);

      // Initial routing
      updateRouting();
    }
    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [routeOptions, selectedRoute, locations]); // Re-initialize when route data or locations change

  useEffect(() => {
    updateRouting();
  }, [origin, destination, selectedRoute, routeOptions]);

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
