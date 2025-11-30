import { ChevronRight, Home } from "lucide-react";

interface MapBreadcrumbProps {
  level: string;
  breadcrumbs?: { code: string; name: string }[];
  currentRegionName?: string;
  onBreadcrumbClick?: (code: string, name: string, index: number) => void;
}

export function MapBreadcrumb({
  level,
  breadcrumbs,
  currentRegionName,
  onBreadcrumbClick,
}: MapBreadcrumbProps) {
  
  const handleHomeClick = () => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick("pulau", "Indonesia", -1);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-md p-2 rounded-lg shadow-md border border-border animate-in fade-in slide-in-from-top-2">
      <button
        onClick={handleHomeClick}
        className={`flex items-center gap-1 text-xs font-bold transition-colors ${
          level === "pulau" || level === "indonesia"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Indonesia</span>
      </button>

      {breadcrumbs &&
        breadcrumbs.map((crumb, index) => {
          if (crumb.code === "pulau" || crumb.code === "indonesia") return null;

          return (
            <div key={`${crumb.code}-${index}`} className="flex items-center gap-1 animate-in slide-in-from-left-2 fade-in">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              <button
                onClick={() => onBreadcrumbClick && onBreadcrumbClick(crumb.code, crumb.name, index)}
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors hover:underline max-w-[100px] truncate"
              >
                {crumb.name}
              </button>
            </div>
          );
        })}

      {level !== "pulau" && level !== "indonesia" && currentRegionName && (
        <div className="flex items-center gap-1 animate-in slide-in-from-left-2 fade-in">
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-xs font-black text-primary max-w-[140px] truncate">
            {currentRegionName}
          </span>
        </div>
      )}
    </div>
  );
}