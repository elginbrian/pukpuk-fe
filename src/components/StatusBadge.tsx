import { cn } from "../utils/utils";


interface StatusBadgeProps {
  status: "Healthy" | "Warning" | "Danger" | "Info" | "Dead-Stock";
  children: React.ReactNode;
  className?: string;
  showPulse?: boolean;
}

export function StatusBadge({ status, children, className, showPulse }: StatusBadgeProps) {
  const statusStyles = {
    Healthy: "status-healthy",
    Warning: "status-warning",
    Danger: "status-danger",
    Info: "status-info",
    "Dead-Stock": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {showPulse && (
        <span className={cn("h-2 w-2 rounded-full animate-pulse-glow", {
          "bg-success": status === "Healthy",
          "bg-warning": status === "Warning",
          "bg-destructive": status === "Danger",
          "bg-info": status === "Info",
          "bg-purple-500": status === "Dead-Stock",
        })} />
      )}
      {children}
    </div>
  );
}
