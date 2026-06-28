import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TimelineColor = "default" | "success" | "warning" | "error" | "blue" | "red" | "green" | "gray";
type TimelineMode = "left" | "right" | "start" | "end" | "alternate";
type TimelinePlacement = "start" | "end";

const colorMap: Record<TimelineColor, string> = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-destructive",
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  gray: "bg-muted-foreground",
};

export interface TimelineItemProps {
  dot?: React.ReactNode;
  icon?: React.ReactNode;
  color?: TimelineColor;
  label?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  placement?: TimelinePlacement;
  children?: React.ReactNode;
  pending?: boolean;
  loading?: boolean;
  className?: string;
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      dot,
      icon,
      color = "default",
      label,
      title,
      content,
      placement,
      children,
      pending,
      loading,
      className,
    },
    ref
  ) => {
    const dotColor = pending || loading
      ? "border-2 border-muted-foreground bg-background animate-pulse"
      : colorMap[color];
    const mergedContent = content ?? children;

    return (
      <li
        ref={ref}
        data-placement={placement}
        className={cn("relative flex gap-4 pb-8 last:pb-0", className)}
      >
        {label && (
          <div className="w-28 shrink-0 text-right text-sm text-muted-foreground">
            {label}
          </div>
        )}
        <div className="relative flex flex-col items-center after:absolute after:top-4 after:bottom-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-border last:after:hidden">
          <div
            className={cn(
              "z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-background [&_svg]:size-3",
              (dot || icon) && "h-5 w-5 bg-background text-foreground ring-1 ring-border",
              dotColor
            )}
          >
            {icon ?? dot ?? null}
          </div>
        </div>
        <div className="min-w-0 flex-1 pb-2 text-sm">
          {title && <div className="font-medium text-foreground">{title}</div>}
          {mergedContent && <div className="text-muted-foreground">{mergedContent}</div>}
        </div>
      </li>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

export interface TimelineItemConfig extends TimelineItemProps {
  key?: React.Key;
}

export interface TimelineProps {
  pending?: React.ReactNode;
  pendingDot?: React.ReactNode;
  reverse?: boolean;
  items?: TimelineItemConfig[];
  mode?: TimelineMode;
  children?: React.ReactNode;
  className?: string;
}

function getPlacement(mode: TimelineMode, index: number, item?: TimelineItemConfig): TimelinePlacement {
  if (item?.placement) return item.placement;
  if (mode === "right" || mode === "end") return "end";
  if (mode === "alternate") return index % 2 === 0 ? "start" : "end";
  return "start";
}

function getModeClassName(placement: TimelinePlacement) {
  return placement === "end" ? "[&_li]:flex-row-reverse [&_li>div:first-child]:text-left" : undefined;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ pending, pendingDot, reverse, items, mode = "left", children, className }, ref) => {
    const normalizedItems = items ? [...items] : [];
    if (pending) {
      normalizedItems.push({ key: "__pending", pending: true, dot: pendingDot, content: pending });
    }

    const itemsToRender = reverse ? normalizedItems.reverse() : normalizedItems;

    return (
      <div ref={ref} data-slot="timeline" className={cn(className)}>
        {itemsToRender.map((item, index) => {
          const placement = getPlacement(mode, index, item);

          return (
            <motion.div
              key={item.key ?? index}
              className={getModeClassName(placement)}
              initial={{ opacity: 0, x: placement === "end" ? 16 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07, ease: "easeOut" }}
            >
              <TimelineItem
                dot={item.dot}
                icon={item.icon}
                color={item.color}
                label={item.label}
                title={item.title}
                content={item.content}
                placement={placement}
                pending={item.pending}
                loading={item.loading}
                className={item.className}
              >
                {item.children}
              </TimelineItem>
            </motion.div>
          );
        })}
        {children}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
