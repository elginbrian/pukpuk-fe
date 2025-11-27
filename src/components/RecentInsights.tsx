"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function RecentInsights() {
  return (
    <>
      <CardHeader className="pt-0">
        <CardTitle className="text-lg">Recent Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-3 space-y-1">
            <p className="text-sm font-medium">High Demand Alert</p>
            <p className="text-xs text-muted-foreground">Kec. Bantul demand projected +18% next week</p>
            <Badge variant="outline" className="text-xs">
              2 hours ago
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-3 space-y-1">
            <p className="text-sm font-medium">Dead-Stock Detection</p>
            <p className="text-xs text-muted-foreground">Warehouse B: 680 tons, 18 days idle</p>
            <Badge variant="outline" className="text-xs">
              5 hours ago
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-3 space-y-1">
            <p className="text-sm font-medium">Route Optimization</p>
            <p className="text-xs text-muted-foreground">New route saves 12% fuel cost</p>
            <Badge variant="outline" className="text-xs">
              1 day ago
            </Badge>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
}
