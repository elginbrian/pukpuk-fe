"use client";

import { useState } from "react";
import { useAlerts } from "../../../context/AlertContext";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/ui/button";
import { AlertCircle, ArrowRight, Package, TrendingDown, Warehouse, Calendar, TrendingUp, MapPin, Truck } from "lucide-react";
import { Progress } from "../../../components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../../components/ui/sheet";
import { Separator } from "../../../components/ui/separator";
import { useRouter } from "next/navigation";

export default function Inventory() {
  const router = useRouter();
  const { alerts, selectedAlert, setSelectedAlert } = useAlerts();
  const { toast } = useToast();
  const [selectedInventory, setSelectedInventory] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const suggestedActions = [
    {
      id: 0,
      title: "Reallocate Stock",
      description: "Transfer 120 tons from Warehouse A",
      detail: "Estimated cost: Rp 8,500,000"
    },
    {
      id: 1,
      title: "Schedule Emergency Delivery",
      description: "Priority shipment within 24 hours",
      detail: "Via fastest route (Route B)"
    }
  ];

  const handleNewAction = () => {
    router.push("/features/create-action");
  }

  const handleApprove = () => {
    if (selectedAction === null) {
      toast({
        title: "No Action Selected",
        description: "Please select an action before approving.",
        variant: "destructive",
      });
      return;
    }
    
    const action = suggestedActions.find(a => a.id === selectedAction);
    toast({
      title: "Action Approved",
      description: `"${action?.title}" has been approved successfully.`,
    });
  };

  const handleViewOnMap = () =>{
    router.push("/features/demand-chloropleth")
  }

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

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Inventory Overview</CardTitle>
          <CardDescription className="text-xs md:text-sm">Stock levels across all locations</CardDescription>
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
                          <StatusBadge status={item.status} showPulse={item.status === "Dead-Stock" || item.status === "Danger"}>
                            {item.status === "Dead-Stock" ? "Dead Stock" : item.status}

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
                        <StatusBadge status={item.status} showPulse={item.status === "Dead-Stock" || item.status === "Danger"}>
                          {item.status === "Dead-Stock" ? "Dead Stock" : item.status}

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
        <SheetContent className="h-[90vh] w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-4xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg flex flex-col p-0" side="bottom">
          {selectedAlert !== null && (
            <>
              <SheetHeader className="border-b border-border px-6 py-4 shrink-0">
                <div className="space-y-2">
                  <SheetTitle className="text-2xl">Alert Details</SheetTitle>
                  <SheetDescription>{alerts[selectedAlert].location}</SheetDescription>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-6 overflow-y-auto overflow-x-hidden flex-1">
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
                    {suggestedActions.map((action) => {
                      const isSelected = selectedAction === action.id;
                      const IconComponent = action.title.toLowerCase().includes('reallocate') 
                        ? Truck 
                        : action.title.toLowerCase().includes('schedule') || action.title.toLowerCase().includes('reschedule')
                        ? Calendar
                        : Truck;
                      
                      return (
                        <div 
                          key={action.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-green-500/20 border-green-500' 
                              : 'bg-card/50 border-border hover:bg-card/70'
                          }`}
                          onClick={() => {
                            setSelectedAction(isSelected ? null : action.id);
                          }}
                        >
                          <IconComponent className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-green-500' : 'text-primary'}`} />
                          <div className="flex-1 space-y-1">
                            <p className={`text-sm font-medium ${isSelected ? 'text-green-500' : ''}`}>{action.title}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                            <p className={`text-xs ${isSelected ? 'text-green-500' : 'text-primary'}`}>{action.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col fle gap-3">
                  <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleApprove}>Approve</Button>
                  <Button variant="outline" className="flex-1">
                    Review
                  </Button>
                  </div>
                  <div>
                    <Button variant="secondary"className="flex w-full" onClick={handleNewAction}>New Action</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Inventory Detail Sheet */}
      <Sheet open={selectedInventory !== null} onOpenChange={(open) => !open && setSelectedInventory(null)}>
        <SheetContent className="h-[90vh] w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-4xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg flex flex-col p-0" side="bottom">
          {selectedInventory !== null && (
            <>
              <SheetHeader className="border-b border-border px-6 py-4 shrink-0">
                <div className="space-y-2">
                  <SheetTitle className="text-2xl">{inventoryData[selectedInventory].location}</SheetTitle>
                  <SheetDescription className="capitalize">{inventoryData[selectedInventory].type} Facility</SheetDescription>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-6 overflow-y-auto overflow-x-hidden flex-1">
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
                        <StatusBadge status={inventoryData[selectedInventory].status} showPulse={inventoryData[selectedInventory].status === "Dead-Stock" || inventoryData[selectedInventory].status === "Danger"}>
                          {inventoryData[selectedInventory].status === "Dead-Stock" ? "Dead Stock" : inventoryData[selectedInventory].status}
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
                  <Button variant="outline" className="flex-1" onClick ={handleViewOnMap}>
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
