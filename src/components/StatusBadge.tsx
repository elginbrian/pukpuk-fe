import { cn } from "../utils/utils";


interface StatusBadgeProps {
  status: "healthy" | "warning" | "danger" | "info" | "dead-stock";
  children: React.ReactNode;
  className?: string;
  showPulse?: boolean;
}

export function StatusBadge({ status, children, className, showPulse }: StatusBadgeProps) {
  const statusStyles = {
    healthy: "status-healthy",
    warning: "status-warning",
    danger: "status-danger",
    info: "status-info",
    "dead-stock": "bg-purple-500/10 text-purple-500 border-purple-500/20",
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
          "bg-success": status === "healthy",
          "bg-warning": status === "warning",
          "bg-destructive": status === "danger",
          "bg-info": status === "info",
          "bg-purple-500": status === "dead-stock",
        })} />
      )}
      {children}
    </div>
  );
}
