"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function Header() {
  const { setTheme, theme } = useTheme();

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full animate-pulse-glow" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
