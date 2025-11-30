import { forwardRef } from "react";
import { Card, CardContent } from "../../components/ui/card";

interface MapTooltipProps {
  visible: boolean;
  name: string;
  data: { status: string; value: number; label: string } | null;
}

// Gunakan forwardRef agar InteractiveMap bisa mengontrol posisi div ini
export const MapTooltip = forwardRef<HTMLDivElement, MapTooltipProps>(
  ({ visible, name, data }, ref) => {
    
    // Sembunyikan lewat CSS opacity agar transisi mulus
    const opacityClass = visible ? "opacity-100" : "opacity-0";
    const pointerEvents = visible ? "pointer-events-none" : "pointer-events-none";

    let borderColor = "border-slate-200";
    let statusColor = "text-muted-foreground";
    let statusBg = "bg-slate-100";

    if (data) {
      switch (data.status) {
        case "critical":
          borderColor = "border-red-500";
          statusColor = "text-red-600";
          statusBg = "bg-red-50";
          break;
        case "warning":
          borderColor = "border-amber-500";
          statusColor = "text-amber-600";
          statusBg = "bg-amber-50";
          break;
        case "safe":
          borderColor = "border-emerald-500";
          statusColor = "text-emerald-600";
          statusBg = "bg-emerald-50";
          break;
        case "overstock":
          borderColor = "border-violet-500";
          statusColor = "text-violet-600";
          statusBg = "bg-violet-50";
          break;
      }
    }

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          transform: "translate3d(0,0,0)", // Hardware acceleration
        }}
        className={`fixed transition-opacity duration-75 ease-out ${opacityClass} ${pointerEvents}`}
      >
        {/* Offset visual agar tidak menutupi kursor */}
        <div className="translate-x-4 translate-y-4">
            <Card className={`w-56 shadow-2xl bg-white/95 backdrop-blur-sm border-l-4 ${borderColor} rounded-r-lg`}>
            <CardContent className="p-3">
                <p className="text-sm font-bold text-slate-800 truncate mb-2 border-b pb-1 border-slate-100">
                {name}
                </p>

                {data ? (
                <div className="space-y-1">
                    <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500 font-medium">Demand:</span>
                    <span className="text-lg font-black tracking-tight text-slate-800">
                        {data.value.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">Ton</span>
                    </span>
                    </div>
                    
                    <div className={`text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full w-fit ${statusBg} ${statusColor}`}>
                    ● {data.status}
                    </div>
                </div>
                ) : (
                <p className="text-xs text-slate-400 italic">Data belum tersedia</p>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    );
  }
);

MapTooltip.displayName = "MapTooltip";