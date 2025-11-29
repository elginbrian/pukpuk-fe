"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, ChevronRight, Home } from "lucide-react";
import { apiService } from "../services/api";

export interface MapData {
  [regionCode: string]: {
    status: "critical" | "warning" | "safe" | "overstock" | "unknown";
    value: number;
    label: string;
  };
}

export interface MapProps {
  level: string;
  layerType: string;
  onClickRegion: (regionCode: string, regionName: string) => void;
  breadcrumbs?: { code: string; name: string }[];
  onBreadcrumbClick?: (code: string, name: string, index: number) => void;
  mapAnalytics?: MapData;
  currentRegionName?: string;
}

const getRegionCode = (props: any) => {
  if (!props) return null;
  return props.prov_id || (props.regency_code ? props.regency_code.replace("id", "") : null) || (props.district_code ? props.district_code.replace("id", "") : null) || props.ID || props.id || props.KODE || props.kode || props.bps_code
    ? String(props.prov_id || props.ID || props.id || props.KODE || props.kode)
    : null;
};

// Helper Zoom
function ZoomHandler({ bounds }: { bounds: any }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && Object.keys(bounds).length > 0) {
      try {
        map.fitBounds(bounds);
      } catch (e) {
        console.error(e);
      }
    }
  }, [bounds, map]);
  return null;
}

export default function InteractiveMap({ level, layerType, onClickRegion, breadcrumbs, onBreadcrumbClick, mapAnalytics, currentRegionName }: MapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [bounds, setBounds] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regionFiles, setRegionFiles] = useState<Record<string, string>>({});

  useEffect(() => {
    apiService
      .getRegionMappings()
      .then((data) => setRegionFiles(data))
      .catch((err) => console.error("Failed to fetch region mappings:", err));
  }, []);

  useEffect(() => {
    let filename = regionFiles[level];

    if (!filename) {
      if (level === "indonesia" || level === "pulau") filename = "indonesia";
      else {
        console.warn(`Mapping hilang: ${level}`);
        return;
      }
    }

    setIsLoading(true);

    const fetchPromise = filename === "indonesia" ? fetch("/maps/indonesia.geojson").then((res) => res.json()) : apiService.getGeoJson(`${filename}.geojson`);

    fetchPromise
      .then((data) => {
        let finalData = data;

        setTimeout(() => {
          setGeoData(finalData);
          const L = require("leaflet");
          const tempLayer = L.geoJSON(finalData);
          if (tempLayer.getLayers().length > 0) {
            setBounds(tempLayer.getBounds());
          }
          setIsLoading(false);
        }, 300);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [level]);

  const style = (feature: any) => {
    const code = getRegionCode(feature.properties);

    let key = code;
    if (!mapAnalytics?.[key || ""]) {
      const name = feature.properties.name || feature.properties.NAMOBJ;
      if (name && regionFiles[name.toUpperCase()]) {
        const fileId = regionFiles[name.toUpperCase()];
        key = fileId.match(/\d+/)?.[0] || key;
      }
    }

    const data = mapAnalytics && key ? mapAnalytics[key] : null;

    let fillColor = "#E2E8F0";
    if (data) {
      switch (data.status) {
        case "critical":
          fillColor = "#EF4444";
          break;
        case "warning":
          fillColor = "#F59E0B";
          break;
        case "safe":
          fillColor = "#10B981";
          break;
        case "overstock":
          fillColor = "#8B5CF6";
          break;
      }
    } else {
      const hash = (key || "0").split("").reduce((a: any, b: string) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
      const pseudoRandom = Math.abs(Math.sin(hash));
      fillColor = pseudoRandom > 0.5 ? "#FFEDA0" : "#FFF7BC";
    }
    return { fillColor, weight: 1, opacity: 1, color: "white", dashArray: "3", fillOpacity: 0.7 };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;

    let regionName = "Wilayah";
    let nextKey = "";
    let nextLevelName = "";

    // Klik Provinsi -> Masuk ke Level 2
    if (level === "indonesia" || level === "pulau") {
      // Di level ini, kita ambil Nama Provinsi
      regionName = props.prov_name || props.NAME_1 || "Provinsi";
      const provId = props.prov_id || props.id;

      if (provId) {
        nextKey = provId;
        nextLevelName = regionName;
      }
    }

    // Klik Kabupaten -> Masuk ke Level 3
    else if (!isNaN(Number(level)) && level.length === 2) {
      // Di level ini, kita ambil Nama Kabupaten
      regionName = props.name || props.NAMOBJ || props.NAME_2 || "Kabupaten";

      if (regionName) {
        nextKey = regionName.toUpperCase();
        nextLevelName = regionName;
      }
    } else {
      regionName = props.district || props.name || "Kecamatan";
      nextKey = "";
    }

    // Popup Info
    const code = getRegionCode(props);
    let key = code;
    if (!mapAnalytics?.[key || ""] && regionName) {
      if (regionFiles[regionName.toUpperCase()]) {
        key = regionFiles[regionName.toUpperCase()].match(/\d+/)?.[0] || key;
      }
    }
    const data = mapAnalytics && key ? mapAnalytics[key] : null;
    const statusText = data ? `<br/>Status: <b>${data.label}</b>` : "";
    const valueText = data ? `<br/>Volume: ${data.value.toLocaleString()} Ton` : "";

    layer.bindPopup(`
      <div style="text-align:center">
        <strong>${regionName}</strong>
        ${valueText}
        ${statusText}
      </div>
    `);

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 3, color: "#666", dashArray: "" });
        e.target.bringToFront();
      },
      mouseout: (e: any) => e.target.setStyle({ weight: 1, color: "white", dashArray: "3" }),
      click: (e: any) => {
        if (nextKey) {
          if (!isNaN(Number(nextKey)) || regionFiles[nextKey]) {
            onClickRegion(nextKey, nextLevelName);
          } else {
            alert(`Peta detail untuk ${regionName} belum tersedia.`);
          }
        } else {
          alert(`Kecamatan: ${regionName}`);
        }
      },
    });
  };

  return (
    <div className="relative h-full w-full">
      {/* BREADCRUMB */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md border animate-in fade-in slide-in-from-top-2">
        <button
          onClick={() => onBreadcrumbClick && onBreadcrumbClick("pulau", "Indonesia", -1)}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${level === "pulau" || level === "indonesia" ? "text-primary" : "hover:text-primary text-muted-foreground"}`}
        >
          <Home className="w-3 h-3" /> Indonesia
        </button>

        {breadcrumbs &&
          breadcrumbs.map((crumb, index) => (
            <div key={crumb.code} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              <button onClick={() => onBreadcrumbClick && onBreadcrumbClick(crumb.code, crumb.name, index)} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                {crumb.name}
              </button>
            </div>
          ))}

        {/* Current Region */}
        {level !== "pulau" && level !== "indonesia" && currentRegionName && (
          <div className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-xs font-bold text-primary">{currentRegionName}</span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[1001] bg-background/40 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="bg-background p-4 rounded-full shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-2 text-sm font-semibold text-primary bg-background/80 px-3 py-1 rounded-md">Memuat Wilayah...</p>
        </div>
      )}

      <MapContainer key={level + layerType} center={[-2.5, 118]} zoom={5} style={{ height: "100%", width: "100%", background: "transparent" }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && !isLoading && <GeoJSON key={level + layerType} data={geoData} style={style} onEachFeature={onEachFeature} />}
        {bounds && <ZoomHandler bounds={bounds} />}
      </MapContainer>
    </div>
  );
}
