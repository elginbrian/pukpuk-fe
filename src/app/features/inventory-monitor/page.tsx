"use client";

import { useState } from "react";
import { useAlerts } from "../../../context/AlertContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/ui/button";
import { AlertCircle, ArrowRight, Package, TrendingDown, Warehouse, X, Calendar, TrendingUp, MapPin, Truck } from "lucide-react";
import { Progress } from "../../../components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "../../../components/ui/drawer";
import { Separator } from "../../../components/ui/separator";

export default function Inventory() {
  const { alerts, selectedAlert, setSelectedAlert } = useAlerts();
  const [selectedInventory, setSelectedInventory] = useState<number | null>(null);

  const inventoryData = [
    {
      location: "Plant A - Jakarta",
      type: "plant",
      stock: 1250,
      capacity: 2000,
      status: "Healthy" as const,
      lastMovement: "2 hours ago",
      alerts: 0,
    },
    {
      location: "Warehouse A - Bandung",
      type: "warehouse",
      stock: 450,
      capacity: 800,
      status: "Warning" as const,
      lastMovement: "5 days ago",
      alerts: 1,
    },
    {
      location: "Warehouse B - Surabaya",
      type: "warehouse",
      stock: 680,
      capacity: 1000,
      status: "Dead-Stock" as const,
      lastMovement: "18 days ago",
      alerts: 2,
    },
    {
      location: "Kios Bantul",
      type: "kios",
      stock: 45,
      capacity: 200,
      status: "Danger" as const,
      lastMovement: "1 hour ago",
      alerts: 1,
    },
    {
      location: "Kios Sleman",
      type: "kios",
      stock: 180,
      capacity: 200,
      status: "Healthy" as const,
      lastMovement: "3 hours ago",
      alerts: 0,
    },
  ];

  const getStockPercentage = (stock: number, capacity: number) => (stock / capacity) * 100;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Monitoring</h1>
        <p className="text-muted-foreground">Real-time stock levels and dead-stock detection across the supply chain</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
            <p className="text-xs text-muted-foreground mt-1">Across supply chain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">3</p>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dead-Stock Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">1</p>
            <p className="text-xs text-muted-foreground mt-1">18+ days no movement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">62%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="border-l-10 border-l-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle>Active Alerts</CardTitle>
          </div>
          <CardDescription>Immediate actions required</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover-glow">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.type === "Dead-Stock" ? "Dead-Stock" : alert.type === "Stockout" ? "Danger" : "Warning"} showPulse>
                      {alert.type === "Dead-Stock" ? "Dead Stock" : alert.type === "Stockout" ? "Stockout Risk" : "Low Activity"}
                    </StatusBadge>
                  <span className="text-xs md:text-md font-medium">{alert.location}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-sm text-primary font-medium">{alert.action}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(index)}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Inventory Overview</CardTitle>
          <CardDescription className="text-xs md:text-sm">Stock levels across all locations</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs md:text-sm">Location</TableHead>
                <TableHead className="text-xs md:text-sm">Type</TableHead>
                <TableHead className="text-xs md:text-sm">Stock Level</TableHead>
                <TableHead className="text-xs md:text-sm">Capacity</TableHead>
                <TableHead className="text-xs md:text-sm">Status</TableHead>
                <TableHead className="text-xs md:text-sm">Last Movement</TableHead>
                <TableHead className="text-right text-xs md:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background">
              {inventoryData.map((item, index) => {
                const percentage = getStockPercentage(item.stock, item.capacity);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        {item.type === "plant" && <Package className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />}
                        {item.type === "warehouse" && <Warehouse className="h-3 w-3 md:h-4 md:w-4 text-secondary flex-shrink-0" />}
                        {item.type === "kios" && <Package className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />}
                        <span className="truncate max-w-[120px] md:max-w-none">{item.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-xs md:text-sm">{item.type}</TableCell>
                    <TableCell className="min-w-[100px] md:min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] md:text-sm">
                          <span className="font-medium">{item.stock} tons</span>
                          <span className="text-[8px] md:text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={percentage} className="h-1.5 md:h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{item.capacity} tons</TableCell>
                    <TableCell className="min-w-[120px] md:min-w-[100px]">
                      <StatusBadge 
                        status={item.status} 
                        className="text-[10px] md:text-xs"
                      >
                        {item.status === "Dead-Stock" ? "Dead Stock" : item.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="min-w-[80px] md:min-w-[100px] text-[10px] md:text-sm text-muted-foreground whitespace-nowrap">{item.lastMovement}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedInventory(index)}
                        className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                      >
                        <span className="hidden md:inline">View Details</span>
                        <span className="md:hidden">Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Detail Drawer */}
      <Drawer open={selectedAlert !== null} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DrawerContent className="max-h-[85vh]">
          {selectedAlert !== null && (
            <>
              <DrawerHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <DrawerTitle className="text-2xl">Alert Details</DrawerTitle>
                    <DrawerDescription>{alerts[selectedAlert].location}</DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Alert Status */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Alert Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Alert Type</span>
                      <StatusBadge status={alerts[selectedAlert].type === "Dead-Stock" ? "Dead-Stock" : alerts[selectedAlert].type === "Stockout" ? "Danger" : "Warning"} showPulse>
                        {alerts[selectedAlert].type === "Dead-Stock" ? "Dead Stock" : alerts[selectedAlert].type === "Stockout" ? "Stockout Risk" : "Low Activity"}
                      </StatusBadge>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Issue</p>
                      <p className="text-sm text-muted-foreground">{alerts[selectedAlert].message}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recommended Action</p>
                      <p className="text-sm text-primary">{alerts[selectedAlert].action}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Details */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Location Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{alerts[selectedAlert].location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Distance from Plant</p>
                        <p className="text-sm font-medium">142 km</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Est. Transfer Time</p>
                        <p className="text-sm font-medium">3.5 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Analysis */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Impact Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Financial Impact</span>
                        <span className="font-medium text-warning">Rp 45,000,000</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk Score</span>
                        <span className="font-medium text-danger">High (8.2/10)</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Affected Areas</p>
                      <p className="text-sm text-muted-foreground">3 kecamatan, 12 desa, ~450 farmers</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Actions */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">Suggested Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Reallocate Stock</p>
                        <p className="text-xs text-muted-foreground">Transfer 120 tons from Warehouse A</p>
                        <p className="text-xs text-primary">Estimated cost: Rp 8,500,000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Schedule Emergency Delivery</p>
                        <p className="text-xs text-muted-foreground">Priority shipment within 24 hours</p>
                        <p className="text-xs text-primary">Via fastest route (Route B)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">Approve Reallocation</Button>
                  <Button variant="outline" className="flex-1">
                    Schedule Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Inventory Detail Drawer */}
      <Drawer open={selectedInventory !== null} onOpenChange={(open) => !open && setSelectedInventory(null)}>
        <DrawerContent className="max-h-[85vh]">
          {selectedInventory !== null && (
            <>
              <DrawerHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <DrawerTitle className="text-2xl">{inventoryData[selectedInventory].location}</DrawerTitle>
                    <DrawerDescription className="capitalize">{inventoryData[selectedInventory].type} Facility</DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Stock Overview */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  <Card className="">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Current Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{inventoryData[selectedInventory].stock}</p>
                      <p className="text-xs text-muted-foreground mt-1">tons</p>
                    </CardContent>
                  </Card>
                  <Card className="">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{inventoryData[selectedInventory].capacity}</p>
                      <p className="text-xs text-muted-foreground mt-1">tons</p>
                    </CardContent>
                  </Card>
                  <Card className="">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{getStockPercentage(inventoryData[selectedInventory].stock, inventoryData[selectedInventory].capacity).toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground mt-1">of capacity</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stock Level Detail */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Stock Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Status</span>
                        <StatusBadge status={inventoryData[selectedInventory].status} showPulse={inventoryData[selectedInventory].status === "Dead-Stock" || inventoryData[selectedInventory].status === "Danger"}>
                          {inventoryData[selectedInventory].status === "Dead-Stock" ? "Dead Stock" : inventoryData[selectedInventory].status}
                        </StatusBadge>
                      </div>
                      <Progress value={getStockPercentage(inventoryData[selectedInventory].stock, inventoryData[selectedInventory].capacity)} className="h-2" />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Last Movement</p>
                        <p className="text-sm font-medium">{inventoryData[selectedInventory].lastMovement}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Active Alerts</p>
                        <p className="text-sm font-medium">
                          {inventoryData[selectedInventory].alerts} alert{inventoryData[selectedInventory].alerts !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Movement History */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Movements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border">
                      <TrendingDown className="h-5 w-5 text-danger mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium">Outbound Transfer</p>
                          <span className="text-xs text-muted-foreground">{inventoryData[selectedInventory].lastMovement}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">45 tons to Kios Sleman</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border">
                      <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium">Inbound Delivery</p>
                          <span className="text-xs text-muted-foreground">3 days ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">200 tons from Plant A</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border">
                      <TrendingDown className="h-5 w-5 text-danger mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium">Outbound Transfer</p>
                          <span className="text-xs text-muted-foreground">5 days ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">80 tons to Kios Bantul</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Forecast & Recommendations */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    <CardDescription>Based on demand forecast & current stock levels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium mb-1">Predicted demand next 7 days</p>
                      <p className="text-sm text-muted-foreground">Expected outflow: 180-220 tons</p>
                      <p className="text-sm text-primary mt-2">Recommendation: Schedule refill in 4 days</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="text-sm font-medium mb-1">Dead-stock risk detected</p>
                      <p className="text-sm text-muted-foreground">No movement in {inventoryData[selectedInventory].lastMovement}</p>
                      <p className="text-sm text-warning mt-2">Consider reallocation to high-demand areas</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">Request Transfer</Button>
                  <Button variant="outline" className="flex-1">
                    View on Map
                  </Button>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
