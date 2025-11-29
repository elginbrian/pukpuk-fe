interface MapLegendProps {
  viewMode: "live" | "forecast";
}

export function MapLegend({ viewMode }: MapLegendProps) {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-md p-3 rounded-lg border shadow-xl text-xs">
      <p className="font-bold mb-2 text-card-foreground tracking-tight">{viewMode === "forecast" ? "Risk Index (AI Prediction)" : "Real-time Stock Level"}</p>
      <div className="space-y-1.5 text-muted-foreground font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded-full shadow-sm border border-border"></div>
          <span>Critical (Defisit)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-warning rounded-full shadow-sm border border-border"></div>
          <span>Warning (Menipis)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full shadow-sm border border-border"></div>
          <span>Safe (Aman)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full shadow-sm border border-border"></div>
          <span>Overstock (Dead Stock)</span>
        </div>
      </div>
    </div>
  );
}
