"use client";

import { Map, Package, MessageSquare, TrendingUp, Navigation, Zap } from "lucide-react";
import Image from "next/image";
import { NavLink } from "./NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";

const navigationItems = [
  { title: "Demand Forecasting", url: "/features/forecasting-demand", icon: TrendingUp },
  { title: "Route Optimization", url: "/features/route-optimization", icon: Navigation },
  { title: "Demand Chloropleth", url: "/features/demand-chloropleth", icon: Map },
  { title: "Inventory Monitor", url: "/features/inventory-monitor", icon: Package },
  { title: "Create Action", url: "/features/create-action", icon: Zap},
  { title: "AI Insights", url: "/features/ai-insights", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-28" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className={`h-16 border-b border-sidebar-border flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-6'} py-4`}>
          <Image src="/Logo_PukPuk.png" alt="PukPuk Logo" width={40} height={40} className="object-contain" />
          {!isCollapsed && <h1 className="text-2xl font-bold" style={{ color: '#a8d945' }}>Pukpuk</h1>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink href={item.url} className="hover:bg-sidebar-accent transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
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
