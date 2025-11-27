"use client";

import { useEffect, useState } from "react";
import { Moon, Sun} from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { NotificationDropdown } from "./ui/notification-dropdown";
import { useAlerts } from "../context/AlertContext";  

export function Header() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { alerts, setSelectedAlert } = useAlerts();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Fertilizer Supply Chain Analytics</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown 
            alerts={alerts} 
            onAlertClick={(index) => setSelectedAlert(index)} 
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {mounted && resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
