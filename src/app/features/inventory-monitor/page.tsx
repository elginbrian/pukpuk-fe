"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/ui/button";
import { AlertCircle, ArrowRight, Package, TrendingDown, Warehouse, X, Calendar, TrendingUp, MapPin, Truck } from "lucide-react";
import { Progress } from "../../../components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "../../../components/ui/sheet";
import { useState } from "react";
import { Separator } from "../../../components/ui/separator";

export default function Inventory() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<number | null>(null);

  const inventoryData = [
    {
      location: "Plant A - Jakarta",
      type: "plant",
      stock: 1250,
      capacity: 2000,
      status: "healthy" as const,
      lastMovement: "2 hours ago",
      alerts: 0,
    },
    {
      location: "Warehouse A - Bandung",
      type: "warehouse",
      stock: 450,
      capacity: 800,
      status: "warning" as const,
      lastMovement: "5 days ago",
      alerts: 1,
    },
    {
      location: "Warehouse B - Surabaya",
      type: "warehouse",
      stock: 680,
      capacity: 1000,
      status: "dead-stock" as const,
      lastMovement: "18 days ago",
      alerts: 2,
    },
    {
      location: "Kios Bantul",
      type: "kios",
      stock: 45,
      capacity: 200,
      status: "danger" as const,
      lastMovement: "1 hour ago",
      alerts: 1,
    },
    {
      location: "Kios Sleman",
      type: "kios",
      stock: 180,
      capacity: 200,
      status: "healthy" as const,
      lastMovement: "3 hours ago",
      alerts: 0,
    },
  ];

  const alerts = [
    {
      type: "dead-stock",
      location: "Warehouse B - Surabaya",
      message: "18 days no movement detected",
      action: "Reallocation recommended",
    },
    {
      type: "stockout",
      location: "Kios Bantul",
      message: "Stock critically low (22.5% capacity)",
      action: "Emergency refill required",
    },
    {
      type: "slow-movement",
      location: "Warehouse A - Bandung",
      message: "5 days since last movement",
      action: "Monitor for dead-stock risk",
    },
  ];

  const getStockPercentage = (stock: number, capacity: number) => (stock / capacity) * 100;

  return (
    <div className="space-y-2 md:space-y-6 p-2 md:p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Inventory Monitoring</h1>
        <p className="text-sm md:text-base text-muted-foreground">Real-time stock levels and dead-stock detection across the supply chain</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover-glow">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.type === "dead-stock" ? "dead-stock" : alert.type === "stockout" ? "danger" : "warning"} showPulse>
                    {alert.type === "dead-stock" ? "Dead Stock" : alert.type === "stockout" ? "Stockout Risk" : "Low Activity"}
                  </StatusBadge>
                  <span className="font-medium">{alert.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-sm text-primary font-medium">{alert.action}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(index)}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Stock levels across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 md:hidden gap-2">
            {inventoryData.map((item, index) => {
              const percentage = getStockPercentage(item.stock, item.capacity);
              return (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {item.type === "plant" && <Package className="h-4 w-4 text-primary" />}
                          {item.type === "warehouse" && <Warehouse className="h-4 w-4 text-secondary" />}
                          {item.type === "kios" && <Package className="h-4 w-4 text-accent" />}
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
                          <StatusBadge status={item.status} showPulse={item.status === "dead-stock" || item.status === "danger"}>
                            {item.status === "dead-stock" ? "Dead Stock" : item.status}
                          </StatusBadge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedInventory(index)}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.stock} tons</span>
                        <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Capacity: {item.capacity} tons</span>
                        <span>Last: {item.lastMovement}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Movement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-background">
                {inventoryData.map((item, index) => {
                  const percentage = getStockPercentage(item.stock, item.capacity);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.type === "plant" && <Package className="h-4 w-4 text-primary" />}
                          {item.type === "warehouse" && <Warehouse className="h-4 w-4 text-secondary" />}
                          {item.type === "kios" && <Package className="h-4 w-4 text-accent" />}
                          {item.location}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.stock} tons</span>
                            <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{item.capacity} tons</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} showPulse={item.status === "dead-stock" || item.status === "danger"}>
                          {item.status === "dead-stock" ? "Dead Stock" : item.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.lastMovement}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedInventory(index)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alert Detail Sheet */}
      <Sheet open={selectedAlert !== null} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <SheetContent className="max-h-[85vh] overflow-y-auto">
          {selectedAlert !== null && (
            <>
              <SheetHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <SheetTitle className="text-2xl">Alert Details</SheetTitle>
                    <SheetDescription>{alerts[selectedAlert].location}</SheetDescription>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Alert Status */}
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg">Alert Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Alert Type</span>
                      <StatusBadge status={alerts[selectedAlert].type === "dead-stock" ? "dead-stock" : alerts[selectedAlert].type === "stockout" ? "danger" : "warning"} showPulse>
                        {alerts[selectedAlert].type === "dead-stock" ? "Dead Stock" : alerts[selectedAlert].type === "stockout" ? "Stockout Risk" : "Low Activity"}
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
                    <div className="grid grid-cols-2 gap-2 pt-3">
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
        </SheetContent>
      </Sheet>

      {/* Inventory Detail Sheet */}
      <Sheet open={selectedInventory !== null} onOpenChange={(open) => !open && setSelectedInventory(null)}>
        <SheetContent className="max-h-[85vh] overflow-y-auto">
          {selectedInventory !== null && (
            <>
              <SheetHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <SheetTitle className="text-2xl">{inventoryData[selectedInventory].location}</SheetTitle>
                    <SheetDescription className="capitalize">{inventoryData[selectedInventory].type} Facility</SheetDescription>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Stock Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                        <StatusBadge status={inventoryData[selectedInventory].status} showPulse={inventoryData[selectedInventory].status === "dead-stock" || inventoryData[selectedInventory].status === "danger"}>
                          {inventoryData[selectedInventory].status === "dead-stock" ? "Dead Stock" : inventoryData[selectedInventory].status}
                        </StatusBadge>
                      </div>
                      <Progress value={getStockPercentage(inventoryData[selectedInventory].stock, inventoryData[selectedInventory].capacity)} className="h-2" />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
