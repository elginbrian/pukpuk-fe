"use client";

import { useState } from 'react';
import { Layers, Bell, Moon, Menu, TrendingUp, Package, BarChart3 } from 'lucide-react';

// Domain Layer - Entities
interface RegionForecast {
  id: string;
  name: string;
  demand: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
}

// Application Layer - Use Cases
const useForecastData = () => {
  const [selectedRegion, setSelectedRegion] = useState('Yogyakarta');
  const [dataMode, setDataMode] = useState<'live' | 'forecast'>('forecast');
  const [territorialLevel, setTerritorialLevel] = useState('Provinsi');
  const [forecastPeriod, setForecastPeriod] = useState(1);
  const [intensityScale, setIntensityScale] = useState(50);

  return {
    selectedRegion,
    setSelectedRegion,
    dataMode,
    setDataMode,
    territorialLevel,
    setTerritorialLevel,
    forecastPeriod,
    setForecastPeriod,
    intensityScale,
    setIntensityScale,
  };
};

// Infrastructure Layer - Data
const regionData: RegionForecast[] = [
  { id: '1', name: 'Kec. Bantul', demand: 12.3, confidence: 92, risk: 'low' },
  { id: '2', name: 'Kec. Sleman', demand: 18.7, confidence: 88, risk: 'medium' },
  { id: '3', name: 'Kec. Yogyakarta', demand: 9.1, confidence: 95, risk: 'low' },
  { id: '4', name: 'Kec. Kulon Progo', demand: 15.2, confidence: 85, risk: 'high' },
];

// Presentation Layer - Components
const Sidebar = ({ activeNav }: { activeNav: string }) => {
  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'dashboard' },
    { icon: Layers, label: 'Demand Heatmap', path: 'heatmap' },
    { icon: Package, label: 'Inventory Monitor', path: 'inventory' },
    { icon: TrendingUp, label: 'AI Insights', path: 'insights' },
  ];

  return (
    <div className="w-52 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-emerald-400 text-xl font-bold">AgriSupply AI</h1>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 mb-4 text-xs text-slate-500 uppercase tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={`#${item.path}`}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              activeNav === item.path
                ? 'bg-emerald-900/30 text-emerald-400 border-l-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Menu size={20} className="text-slate-400" />
        <h2 className="text-slate-300 font-medium">Fertilizer Supply Chain Analytics</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-200">
          <Moon size={20} />
        </button>
      </div>
    </header>
  );
};

const MapControls = ({ state, handlers }: any) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-slate-200 text-lg font-semibold mb-2">Map Controls</h3>
      <p className="text-slate-500 text-sm mb-6">Configure layers and view settings</p>

      {/* Data Mode */}
      <div className="mb-6">
        <label className="text-slate-400 text-sm mb-3 block">Data Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => handlers.setDataMode('live')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              state.dataMode === 'live'
                ? 'bg-slate-800 text-slate-200'
                : 'bg-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => handlers.setDataMode('forecast')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              state.dataMode === 'forecast'
                ? 'bg-emerald-500 text-white'
                : 'bg-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Forecast
          </button>
        </div>
      </div>

      {/* Data Layer */}
      <div className="mb-6">
        <label className="text-slate-400 text-sm mb-3 block">Data Layer</label>
        <select className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
          <option>Forecast Demand</option>
          <option>Historical Data</option>
          <option>Current Inventory</option>
        </select>
      </div>

      {/* Territorial Level */}
      <div className="mb-6">
        <label className="text-slate-400 text-sm mb-3 block">Territorial Level</label>
        <select 
          value={state.territorialLevel}
          onChange={(e) => handlers.setTerritorialLevel(e.target.value)}
          className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-4 py-2.5 text-sm"
        >
          <option>Provinsi (Province)</option>
          <option>Kabupaten (Regency)</option>
          <option>Kecamatan (District)</option>
        </select>
      </div>

      {/* Forecast Period */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-slate-400 text-sm">Forecast Period</label>
          <span className="text-emerald-400 text-sm font-medium">Week {state.forecastPeriod}</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          value={state.forecastPeriod}
          onChange={(e) => handlers.setForecastPeriod(Number(e.target.value))}
          className="w-full h-2 bg-linear-to-r from-emerald-500 to-cyan-500 rounded-full appearance-none cursor-pointer"
        />
      </div>

      {/* Intensity Scale */}
      <div>
        <label className="text-slate-400 text-sm mb-3 block">Intensity Scale</label>
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Low</span>
          <span>High</span>
        </div>
        <div className="h-2 bg-linear-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

const MapPlaceholder = ({ selectedRegion }: { selectedRegion: string }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 flex-1 flex flex-col items-center justify-center min-h-[400px]">
      <Layers size={64} className="text-cyan-500 mb-4 opacity-50" />
      <h3 className="text-slate-300 text-lg font-semibold mb-2">Interactive map would be rendered here</h3>
      <p className="text-slate-500 text-sm text-center max-w-md mb-8">
        In production, integrate with Mapbox GL JS or Google Maps API to display
        geospatial heatmaps with drill-down capabilities across territorial levels
      </p>
      
      {selectedRegion && (
        <div className="bg-slate-800 rounded-lg px-6 py-3 border border-cyan-500/30">
          <div className="text-xs text-slate-500 mb-1">Current Selection</div>
          <div className="text-emerald-400 font-semibold">
            Region: {selectedRegion}
            <span className="mx-2 text-slate-600">|</span>
            <span className="text-slate-400">Level: Provinsi</span>
            <span className="mx-2 text-slate-600">|</span>
            <span className="text-slate-400">Layer: Forecast Demand</span>
          </div>
        </div>
      )}
    </div>
  );
};

const RegionCard = ({ region }: { region: RegionForecast }) => {
  const riskColors = {
    low: 'bg-cyan-500',
    medium: 'bg-blue-500',
    high: 'bg-red-500',
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors">
      <div className="text-slate-400 text-sm mb-3">{region.name}</div>
      
      <div className="text-emerald-400 text-3xl font-bold mb-1">
        {region.demand} tons
      </div>
      <div className="text-slate-500 text-sm mb-4">Forecasted demand</div>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">Confidence:</span>
        <span className="text-slate-200 font-semibold">{region.confidence}%</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <span>~</span>
          <span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>
        </div>
        <span className={`${riskColors[region.risk]} text-white text-xs font-medium px-3 py-1 rounded-full`}>
          {region.risk} risk
        </span>
      </div>
    </div>
  );
};

const RegionDetails = () => {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
      <h3 className="text-slate-200 text-lg font-semibold mb-2">Region Details</h3>
      <p className="text-slate-500 text-sm mb-6">Detailed forecast information for selected areas</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionData.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};

// Main App Component
export default function DemandHeatmap() {
  const state = useForecastData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar activeNav="heatmap" />
      
      <div className="ml-52">
        <Header />
        
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 mb-2">
              Multi-Scale Demand Heatmap
            </h1>
            <p className="text-slate-400">
              Visualize fertilizer demand across territorial levels with AI-powered forecasting
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MapControls state={state} handlers={state} />
              </div>

              <div className="lg:col-span-2 flex flex-col">
                <MapPlaceholder selectedRegion={state.selectedRegion} />
              </div>
            </div>
          </div>

          <RegionDetails />
        </main>
      </div>
    </div>
  );
}