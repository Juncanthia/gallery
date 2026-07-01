import type { ComponentProps, HTMLAttributes } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ServiceStatus = "online" | "offline" | "maintenance" | "degraded";
type SemanticStatus = "default" | "success" | "error" | "warning" | "info";

const statusToneClasses: Record<ServiceStatus | SemanticStatus, string> = {
  online: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  offline: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  maintenance: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  degraded: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  default: "border-transparent bg-muted text-muted-foreground",
  success: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
  error: "border-destructive/20 bg-destructive/10 text-destructive",
  warning: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

const statusDotClasses: Record<ServiceStatus | SemanticStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-red-500",
  maintenance: "bg-blue-500",
  degraded: "bg-amber-500",
  default: "bg-muted-foreground",
  success: "bg-green-500",
  error: "bg-destructive",
  warning: "bg-orange-500",
  info: "bg-blue-500",
};

export type StatusProps = Omit<ComponentProps<typeof Badge>, "status"> & {
  status: ServiceStatus | SemanticStatus;
};

export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    className={cn(
      "flex items-center gap-2 border",
      "group",
      status,
      statusToneClasses[status],
      className
    )}
    variant="outline"
    {...props}
  />
);

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className={cn("relative flex h-2 w-2", className)} {...props}>
    <span
      className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-red-500",
        "group-[.maintenance]:bg-blue-500",
        "group-[.degraded]:bg-amber-500",
        "group-[.default]:bg-muted-foreground",
        "group-[.success]:bg-green-500",
        "group-[.error]:bg-destructive",
        "group-[.warning]:bg-orange-500",
        "group-[.info]:bg-blue-500"
      )}
    />
    <span
      className={cn(
        "relative inline-flex h-2 w-2 rounded-full",
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-red-500",
        "group-[.maintenance]:bg-blue-500",
        "group-[.degraded]:bg-amber-500",
        "group-[.default]:bg-muted-foreground",
        "group-[.success]:bg-green-500",
        "group-[.error]:bg-destructive",
        "group-[.warning]:bg-orange-500",
        "group-[.info]:bg-blue-500",
        className
      )}
    />
  </span>
);

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn("text-muted-foreground", className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.online]:block">Online</span>
        <span className="hidden group-[.offline]:block">Offline</span>
        <span className="hidden group-[.maintenance]:block">Maintenance</span>
        <span className="hidden group-[.degraded]:block">Degraded</span>
        <span className="hidden group-[.default]:block">Default</span>
        <span className="hidden group-[.success]:block">Success</span>
        <span className="hidden group-[.error]:block">Error</span>
        <span className="hidden group-[.warning]:block">Warning</span>
        <span className="hidden group-[.info]:block">Info</span>
      </>
    )}
  </span>
);

export { statusDotClasses, statusToneClasses };
export type { SemanticStatus, ServiceStatus };
