"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Check, Trash2, Filter, Search, CheckCheck } from "lucide-react";
import { useAlerts } from "../../../context/AlertContext";
import { StatusBadge } from "../../../components/StatusBadge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

export default function NotificationPage() {
  const router = useRouter();
  const { alerts, setSelectedAlert } = useAlerts();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  // Filter notifications based on search and type
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      filterType === "all" || 
      (filterType === "dead-stock" && alert.type === "Dead-Stock") ||
      (filterType === "stockout" && alert.type === "Stockout") ||
      (filterType === "warning" && alert.type === "Low-Activity");
    
    return matchesSearch && matchesType;
  });

  // Separate read and unread notifications
  const unreadAlerts = filteredAlerts.filter((_, index) => !readNotifications.includes(index));
  const readAlertsData = filteredAlerts.filter((_, index) => readNotifications.includes(index));

  const handleMarkAsRead = (index: number) => {
    if (!readNotifications.includes(index)) {
      setReadNotifications([...readNotifications, index]);
      toast({
        title: "Marked as Read",
        description: "Notification marked as read.",
      });
    }
  };

  const handleMarkAllAsRead = () => {
    const allIndices = alerts.map((_, index) => index);
    setReadNotifications(allIndices);
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select notifications to delete.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Deleted",
      description: `${selectedNotifications.length} notification(s) deleted.`,
    });
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (index: number) => {
    if (selectedNotifications.includes(index)) {
      setSelectedNotifications(selectedNotifications.filter(i => i !== index));
    } else {
      setSelectedNotifications([...selectedNotifications, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredAlerts.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredAlerts.map((_, index) => index));
    }
  };

  const handleViewDetails = (index: number) => {
    setSelectedAlert(index);
    router.push("/features/inventory-monitor");
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {alerts.length} total notification{alerts.length !== 1 ? "s" : ""}, {unreadAlerts.length} unread
            </p>
          </div>
        </div>
        <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{alerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{unreadAlerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">
              {alerts.filter(a => a.type === "Stockout").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dead Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">
              {alerts.filter(a => a.type === "Dead-Stock").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stockout">Stockout Risk</SelectItem>
                <SelectItem value="dead-stock">Dead Stock</SelectItem>
                <SelectItem value="warning">Low Activity</SelectItem>
              </SelectContent>
            </Select>

            {/* Bulk Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedNotifications.length === filteredAlerts.length ? "Deselect All" : "Select All"}
              </Button>
              {selectedNotifications.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedNotifications.length})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List with Tabs */}
      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="unread">
            Unread ({unreadAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readAlertsData.length})
          </TabsTrigger>
        </TabsList>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="space-y-4 mt-6">
          {unreadAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No unread notifications</p>
                <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            unreadAlerts.map((alert) => {
              const originalIndex = alerts.indexOf(alert);
              const isSelected = selectedNotifications.includes(originalIndex);
              
              return (
                <Card
                  key={originalIndex}
                  className={`transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectNotification(originalIndex)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
                            <div>
                              <p className="font-semibold">{alert.location}</p>
                              <p className="text-xs text-muted-foreground">Just now</p>
                            </div>
                          </div>
                          <StatusBadge
                            status={
                              alert.type === "Dead-Stock"
                                ? "Dead-Stock"
                                : alert.type === "Stockout"
                                ? "Danger"
                                : "Warning"
                            }
                            showPulse
                          >
                            {alert.type === "Dead-Stock"
                              ? "Dead Stock"
                              : alert.type === "Stockout"
                              ? "Stockout"
                              : "Low Activity"}
                          </StatusBadge>
                        </div>

                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-sm text-primary font-medium">{alert.action}</p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(originalIndex)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(originalIndex)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Read Notifications */}
        <TabsContent value="read" className="space-y-4 mt-6">
          {readAlertsData.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No read notifications</p>
                <p className="text-sm text-muted-foreground">Read notifications will appear here</p>
              </CardContent>
            </Card>
          ) : (
            readAlertsData.map((alert) => {
              const originalIndex = alerts.indexOf(alert);
              const isSelected = selectedNotifications.includes(originalIndex);
              
              return (
                <Card
                  key={originalIndex}
                  className={`transition-all opacity-75 ${
                    isSelected ? "ring-2 ring-primary opacity-100" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectNotification(originalIndex)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-muted-foreground">{alert.location}</p>
                              <p className="text-xs text-muted-foreground">Read</p>
                            </div>
                          </div>
                          <StatusBadge
                            status={
                              alert.type === "Dead-Stock"
                                ? "Dead-Stock"
                                : alert.type === "Stockout"
                                ? "Danger"
                                : "Warning"
                            }
                          >
                            {alert.type === "Dead-Stock"
                              ? "Dead Stock"
                              : alert.type === "Stockout"
                              ? "Stockout"
                              : "Low Activity"}
                          </StatusBadge>
                        </div>

                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-sm text-muted-foreground font-medium">{alert.action}</p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(originalIndex)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};