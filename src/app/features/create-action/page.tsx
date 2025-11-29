"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Action() {
  const router = useRouter();
  const [actionType, setActionType] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actionType || !location || !priority || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Custom action created successfully");
    
    // Reset form
    setActionType("");
    setLocation("");
    setPriority("");
    setDescription("");
    setQuantity("");
  };

  const handleSaveDraft = () => {
    toast.success("Action saved as draft");
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
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
          <h1 className="text-3xl font-bold">Create Custom Action</h1>
          <p className="text-muted-foreground">
            Define and execute custom actions for inventory management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Action Details</CardTitle>
              <CardDescription>Fill in the details for your custom action</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Action Type */}
                <div className="space-y-2">
                  <Label htmlFor="actionType">Action Type *</Label>
                  <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger id="actionType">
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Stock Transfer</SelectItem>
                      <SelectItem value="reallocation">Reallocation</SelectItem>
                      <SelectItem value="emergency-delivery">Emergency Delivery</SelectItem>
                      <SelectItem value="quality-check">Quality Check</SelectItem>
                      <SelectItem value="disposal">Stock Disposal</SelectItem>
                      <SelectItem value="purchase-order">Purchase Order</SelectItem>
                      <SelectItem value="inventory-audit">Inventory Audit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Target Location *</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plant-a">Plant A - Jakarta</SelectItem>
                      <SelectItem value="warehouse-a">Warehouse A - Bandung</SelectItem>
                      <SelectItem value="warehouse-b">Warehouse B - Surabaya</SelectItem>
                      <SelectItem value="kios-bantul">Kios Bantul</SelectItem>
                      <SelectItem value="kios-sleman">Kios Sleman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Immediate Action</SelectItem>
                      <SelectItem value="high">High - Within 24 hours</SelectItem>
                      <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                      <SelectItem value="low">Low - Within 1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (tons)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Action Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the action in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Action
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Guidelines Card */}
          <Card className="glass-panel border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Action Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">Before creating an action:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Check current stock levels</li>
                  <li>Review suggested actions</li>
                  <li>Consider cost implications</li>
                  <li>Verify location capacity</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Priority Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><span className="text-danger">Critical:</span> Stockout risk</li>
                  <li><span className="text-warning">High:</span> Dead stock</li>
                  <li><span className="text-primary">Medium:</span> Optimization</li>
                  <li><span className="text-muted-foreground">Low:</span> Routine</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Actions</span>
                <span className="text-lg font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Approval</span>
                <span className="text-lg font-bold text-warning">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <span className="text-lg font-bold text-primary">7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
