"use client";

import React, { createContext, useContext, useState } from "react";

interface Alert {
  type: string;
  location: string;
  message: string;
  action: string;
}

interface AlertContextType {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  selectedAlert: number | null;
  setSelectedAlert: (index: number | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      type: "Dead-Stock",
      location: "Warehouse B - Surabaya",
      message: "18 days no movement detected",
      action: "Reallocation recommended",
    },
    {
      type: "Stockout",
      location: "Kios Bantul",
      message: "Stock critically low (22.5% capacity)",
      action: "Emergency refill required",
    },
    {
      type: "Slow-Movement",
      location: "Warehouse A - Bandung",
      message: "5 days since last movement",
      action: "Monitor for dead-stock risk",
    },
    {
      type: "Slow-Movement",
      location: "Warehouse A - Bandung",
      message: "5 days since last movement",
      action: "Monitor for dead-stock risk",
    },
    {
      type: "Slow-Movement",
      location: "Warehouse A - Bandung",
      message: "5 days since last movement",
      action: "Monitor for dead-stock risk",
    },
    {
      type: "Slow-Movement",
      location: "Warehouse A - Bandung",
      message: "5 days since last movement",
      action: "Monitor for dead-stock risk",
    },
  ]);
  
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  return (
    <AlertContext.Provider value={{ alerts, setAlerts, selectedAlert, setSelectedAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
}