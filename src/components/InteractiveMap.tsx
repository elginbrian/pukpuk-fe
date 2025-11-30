"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, Home, ChevronRight } from "lucide-react";
import { apiService } from "../services/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MapData {
  [regionCode: string]: { status: string; value: number; label: string };
}

export interface MapProps {
  level: string;
  layerType: string;
  onClickRegion: (regionCode: string, regionName: string) => void;
  mapAnalytics?: MapData;
  breadcrumbs?: { code: string; name: string }[];
  onBreadcrumbClick?: (code: string, name: string, index: number) => void;
  currentRegionName?: string;
}

function ZoomHandler({ bounds }: { bounds: any }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && Object.keys(bounds).length > 0) map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);
  return null;
}

export default function InteractiveMap({ 
  level, 
  onClickRegion, 
  mapAnalytics, 
  breadcrumbs,
  onBreadcrumbClick,
  currentRegionName
}: MapProps) {
  
  const [geoData, setGeoData] = useState<any>(null);
  const [bounds, setBounds] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [fileMapping, setFileMapping] = useState<Record<string, string>>({});
  const [nameMapping, setNameMapping] = useState<Record<string, string>>({});
  const [isMappingLoaded, setIsMappingLoaded] = useState(false);

  useEffect(() => {
    apiService.getRegionMappings().then((data) => {
      setFileMapping(data.files);
      setNameMapping(data.names);
      setIsMappingLoaded(true);
    }).catch(err => console.error("Gagal load mapping:", err));
  }, []);

  useEffect(() => {
    let filename = "";
    if (level === "indonesia" || level === "pulau") {
      filename = "indonesia";
    } else {
      if (!isMappingLoaded) return;
      if (fileMapping[level]) filename = fileMapping[level];
    }

    if (!filename) return;

    setIsLoading(true);
    setGeoData(null);

    const url = filename === "indonesia" 
        ? "/maps/indonesia.geojson" 
        : `${API_BASE_URL}/demand-heatmap/maps/${filename}.geojson`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          const L = require("leaflet");
          const layer = L.geoJSON(data);
          if (layer.getLayers().length > 0) setBounds(layer.getBounds());
          setGeoData(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

  }, [level, fileMapping, isMappingLoaded]);

  const getSmartId = (props: any) => {
    if (!props) return null;
    const isProvinceView = level.length === 2; 
    const isNationalView = level === "indonesia" || level === "pulau";

    let code = props.district_code || props.regency_code || props.bps_code || props.prov_id || props.id || props.ID;
    if (code) code = String(code).replace(/^id/i, "");

    if (isNationalView) {
    } else if (isProvinceView) {
        if (code === level) code = null;
    }

    if (!code && props.name) {
        const cleanName = props.name.toUpperCase().replace("KABUPATEN ", "").replace("KOTA ", "").trim();
        if (nameMapping[cleanName]) code = nameMapping[cleanName];
        else if (nameMapping[`KOTA ${cleanName}`]) code = nameMapping[`KOTA ${cleanName}`];
    }
    return code;
  };

  const getSmartName = (props: any) => {
    const isNationalView = level === "indonesia" || level === "pulau";
    const isProvinceView = level.length === 2;

    if (isNationalView) return props.prov_name || props.NAME_1 || props.name || "Provinsi";
    if (isProvinceView) return props.regency_name || props.name || props.NAMOBJ || "Kota/Kabupaten";
    return props.district_name || props.name || props.NAMOBJ || "Wilayah";
  };

  const style = (feature: any) => {
    const code = getSmartId(feature.properties);
    const data = code && mapAnalytics ? mapAnalytics[code] : null;
    let fillColor = "#E2E8F0"; 
    
    if (data?.status === "critical") fillColor = "#EF4444";
    else if (data?.status === "warning") fillColor = "#F59E0B";
    else if (data?.status === "safe") fillColor = "#10B981";
    else if (data?.status === "overstock") fillColor = "#8B5CF6";
    
    return { fillColor, weight: 1, color: "white", fillOpacity: 0.8 };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const name = getSmartName(props);
    const code = getSmartId(props);
    
    const analytics = code && mapAnalytics ? mapAnalytics[code] : null;
    const info = analytics ? `<br/><b>${analytics.label}</b>` : "";
    
    layer.bindTooltip(`<div class="text-center font-sans"><b>${name}</b>${info}</div>`, { sticky: true });

    layer.on({
      mouseover: (e: any) => e.target.setStyle({ weight: 3, color: "#333", fillOpacity: 1 }),
      mouseout: (e: any) => e.target.setStyle({ weight: 1, color: "white", fillOpacity: 0.8 }),
      click: () => {
        if (code) onClickRegion(code, name);
      }
    });
  };

  return (
    <div className="relative h-full w-full bg-muted/20 rounded-lg overflow-hidden border border-border">
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md border animate-in fade-in slide-in-from-top-2">
      <button
        onClick={() => onBreadcrumbClick && onBreadcrumbClick("pulau", "Indonesia", -1)}
        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${level === "pulau" || level === "indonesia" ? "text-logo-primary" : "hover:text-logo-primary text-muted-foreground"}`}
      >
        {/* Asumsikan Anda mengimpor Home dan ChevronRight dari lucide-react */}
        <Home className="w-3 h-3" /> Indonesia
      </button>

      {breadcrumbs &&
        breadcrumbs.map((crumb, index) => (
          <div key={`${crumb.code}-${index}`} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
            <button onClick={() => onBreadcrumbClick && onBreadcrumbClick(crumb.code, crumb.name, index)} className="text-xs font-medium text-muted-foreground hover:text-logo-primary transition-colors">
              {crumb.name}
            </button>
          </div>
        ))}

      {/* Current Region */}
      {level !== "pulau" && level !== "indonesia" && currentRegionName && (
        <div className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-xs font-bold text-logo-primary">{currentRegionName}</span>
        </div>
      )}
    </div>
      {isLoading && (
        <div className="absolute inset-0 z-[1001] bg-background/60 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}
      <MapContainer
        key={level}
        center={[-2.5489, 118.0149]} // Titik Tengah Indonesia
        zoom={4.5}               
        zoomSnap={0.5}          
        zoomDelta={0.5}          
        minZoom={4}               
        maxZoom={18}              
        maxBounds={[              
          [-11.0, 94.0],          
          [6.0, 141.0]            
        ]}
        maxBoundsViscosity={1.0}  
        style={{ height: "100%", width: "100%", background: "transparent" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/"></a>'
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={style} 
            onEachFeature={onEachFeature} 
          />
        )}
        
        {bounds && <ZoomHandler bounds={bounds} />}
      </MapContainer>
    </div>
  );
}