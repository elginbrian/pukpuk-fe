"use client";

import * as React from "react";
import { Bell, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { StatusBadge } from "../StatusBadge";
import { cn } from "../../utils/utils";
import { useRouter } from "next/navigation";

interface Alert {
  type: string;
  location: string;
  message: string;
  action: string;
}

interface NotificationDropdownProps {
  alerts: Alert[];
  onAlertClick?: (index: number) => void;
}

export function NotificationDropdown({ alerts, onAlertClick }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleViewAll = () => {
    router.push("/features/notifications");
    setIsOpen(false);
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = alerts.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="icon"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Card */}
      {isOpen && (
        <Card
          className={cn(
            "absolute right-0 mt-2 w-[380px] md:w-[420px] shadow-lg z-50",
            "animate-in fade-in slide-in-from-top-2 duration-200",
            "max-h-[calc(100vh-8rem)]", // Limit height based on viewport
            "flex flex-col" // Make it flex container
          )}
        >
          <CardHeader className="pb-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription className="text-xs">
                  {unreadCount} active alert{unreadCount !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No active alerts
              </div>
            ) : (
              <div className="divide-y divide-border">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      onAlertClick?.(index);
                      setIsOpen(false);
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{alert.location}</span>
                        </div>
                        <StatusBadge
                          status={
                            alert.type === "Dead-Stock"
                              ? "Dead-Stock"
                              : alert.type === "Stockout"
                              ? "Danger"
                              : "Warning"
                          }
                          className="text-[10px] flex-shrink-0"
                        >
                          {alert.type === "Dead-Stock"
                            ? "Dead Stock"
                            : alert.type === "Stockout"
                            ? "Stockout"
                            : "Warning"}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-primary font-medium">{alert.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {alerts.length > 0 && (
            <div className="p-3 border-t flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={ handleViewAll}
              >
                View All Alerts
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}