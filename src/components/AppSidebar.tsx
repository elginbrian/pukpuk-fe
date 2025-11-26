"use client";

import { Map, Package, MessageSquare, TrendingUp, Navigation } from "lucide-react";
import { NavLink } from "./NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";

const navigationItems = [
  { title: "Demand Forecasting", url: "/features/forecasting-demand", icon: TrendingUp },
  { title: "Route Optimization", url: "/features/route-optimization", icon: Navigation },
  { title: "Demand Heatmap", url: "/features/demand-heatmap", icon: Map },
  { title: "Inventory Monitor", url: "/features/inventory-monitor", icon: Package },
  { title: "AI Insights", url: "/features/ai-insights", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">{!isCollapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PUKPUK.COM</h1>}</div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink href={item.url} className="hover:bg-sidebar-accent transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
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
