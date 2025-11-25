"use client";

import { Map, Package, MessageSquare, LayoutDashboard, TrendingUp, Navigation } from "lucide-react";
import { NavLink } from "./NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Forecasting", url: "/features/forecasting-demand", icon: TrendingUp },
  { title: "Demand Heatmap", url: "/features/demand-heatmap", icon: Map },
  { title: "Route Optimization", url: "/features/route-optimization", icon: Navigation },
  { title: "Inventory Monitor", url: "/features/inventory-monitor", icon: Package },
  { title: "AI Insights", url: "/features/ai-insights", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AgriSupply AI
            </h1>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={item.url}
                      className="hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
