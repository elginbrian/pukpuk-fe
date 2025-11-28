"use client";

import { useEffect, useRef } from "react";
import L, { Map } from "leaflet";
import "leaflet-routing-machine";

interface RouteMapProps {
  origin: string;
  destination: string;
}

const RouteMap = ({ origin, destination }: RouteMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const routingControlRef = useRef<any>(null);

  // Location coordinates mapping
  const locations = {
    "plant-a": [-6.3074, 107.3103], // Karawang
    "plant-b": [-7.1612, 112.6535], // Gresik
    "warehouse-a": [-6.2088, 106.8166], // Jakarta
    "warehouse-b": [-6.595, 106.8166], // Bogor
    "kios-bandung": [-6.9175, 107.6191], // Bandung
    "kios-tasikmalaya": [-7.3156, 108.2048], // Tasikmalaya
    "kios-sumedang": [-6.9858, 107.8148], // Sumedang
    "kios-garut": [-7.207, 107.9177], // Garut
    "kios-sukabumi": [-6.9271, 106.9297], // Sukabumi
    "kios-cianjur": [-6.7223, 107.0472], // Cianjur
  };

  // Update routing when selections change
  const updateRouting = () => {
    if (!mapRef.current) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Create waypoints based on current selections
    const waypoints = [
      L.latLng(locations[origin as keyof typeof locations] as [number, number]),
      L.latLng(locations["warehouse-b" as keyof typeof locations] as [number, number]), // Fixed waypoint
      L.latLng(locations["kios-bandung" as keyof typeof locations] as [number, number]), // Fixed waypoint
      L.latLng(locations[destination as keyof typeof locations] as [number, number]),
    ];

    // Create new routing control
    routingControlRef.current = (L as any).Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      createMarker: () => null, // Don't create default markers, we have our own
      lineOptions: {
        styles: [{ color: "hsl(var(--primary))", weight: 4, opacity: 0.8 }],
      },
      show: false, // Hide the routing instructions panel
      addWaypoints: false, // Disable adding waypoints by clicking
    }).addTo(mapRef.current);
  };

  useEffect(() => {
    let map: Map | undefined;
    if (!(document.getElementById("route-map") as any)?._leaflet_id) {
      map = L.map("route-map").setView([-7.5, 112.5], 8);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add custom markers for all locations
      const plantIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const warehouseIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const kiosIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Plant locations
      L.marker([-6.3074, 107.3103], { icon: plantIcon }).addTo(map).bindPopup("Plant A - Karawang");

      L.marker([-7.1612, 112.6535], { icon: plantIcon }).addTo(map).bindPopup("Plant B - Gresik");

      // Warehouse locations
      L.marker([-6.2088, 106.8166], { icon: warehouseIcon }).addTo(map).bindPopup("Warehouse A - Jakarta");

      L.marker([-6.595, 106.8166], { icon: warehouseIcon }).addTo(map).bindPopup("Warehouse B - Bogor");

      // Kios locations
      L.marker([-6.9175, 107.6191], { icon: kiosIcon }).addTo(map).bindPopup("Kios Bandung");

      L.marker([-7.3156, 108.2048], { icon: kiosIcon }).addTo(map).bindPopup("Kios Tasikmalaya");

      L.marker([-6.9858, 107.8148], { icon: kiosIcon }).addTo(map).bindPopup("Kios Sumedang");

      L.marker([-7.207, 107.9177], { icon: kiosIcon }).addTo(map).bindPopup("Kios Garut");

      L.marker([-6.9271, 106.9297], { icon: kiosIcon }).addTo(map).bindPopup("Kios Sukabumi");

      L.marker([-6.7223, 107.0472], { icon: kiosIcon }).addTo(map).bindPopup("Kios Cianjur");

      // Initial routing
      updateRouting();
    }
    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateRouting();
  }, [origin, destination]);

  return (
    <div
      id="route-map"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    />
  );
};

export default RouteMap;
