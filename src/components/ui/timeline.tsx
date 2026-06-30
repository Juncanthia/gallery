import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TimelinePresetColor = "default" | "success" | "warning" | "error" | "blue" | "red" | "green" | "gray";
type TimelineColor = TimelinePresetColor | (string & {});
type TimelineMode = "left" | "right" | "start" | "end" | "alternate";
type TimelinePlacement = "start" | "end";
type TimelineOrientation = "vertical" | "horizontal";

const colorMap: Record<TimelinePresetColor, string> = {
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
  style?: React.CSSProperties;
  position?: TimelinePlacement | "left" | "right";
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
      style,
    },
    ref
  ) => {
    const dotColor = pending || loading
      ? "border-2 border-muted-foreground bg-background animate-pulse"
      : color in colorMap
        ? colorMap[color as TimelinePresetColor]
        : "bg-[var(--timeline-dot-color)]";
    const mergedContent = content ?? children;

    return (
      <li
        ref={ref}
        data-placement={placement}
        className={cn("relative flex gap-4 pb-8 last:pb-0", className)}
        style={{ "--timeline-dot-color": color, ...style } as React.CSSProperties}
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
  orientation?: TimelineOrientation;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function getPlacement(mode: TimelineMode, index: number, item?: TimelineItemConfig): TimelinePlacement {
  if (item?.placement) return item.placement;
  if (item?.position === "right" || item?.position === "end") return "end";
  if (item?.position === "left" || item?.position === "start") return "start";
  if (mode === "right" || mode === "end") return "end";
  if (mode === "alternate") return index % 2 === 0 ? "start" : "end";
  return "start";
}

function getModeClassName(placement: TimelinePlacement) {
  return placement === "end" ? "[&_li]:flex-row-reverse [&_li>div:first-child]:text-left" : undefined;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ pending, pendingDot, reverse, items, mode = "left", orientation = "vertical", children, className, style }, ref) => {
    const normalizedItems = items ? [...items] : [];
    if (pending) {
      normalizedItems.push({ key: "__pending", pending: true, dot: pendingDot, content: pending });
    }

    const itemsToRender = reverse ? normalizedItems.reverse() : normalizedItems;

    return (
      <div
        ref={ref}
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(orientation === "horizontal" && "flex items-start gap-6", className)}
        style={style}
      >
        {itemsToRender.map((item, index) => {
          const placement = getPlacement(mode, index, item);

          return (
            <motion.div
              key={item.key ?? index}
              className={cn(
                orientation === "horizontal" ? "min-w-36 flex-1" : getModeClassName(placement)
              )}
              initial={{ opacity: 0, x: orientation === "horizontal" ? 0 : placement === "end" ? 16 : -16, y: orientation === "horizontal" ? 8 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07, ease: "easeOut" }}
            >
              {orientation === "horizontal" ? (
                <div
                  className={cn("relative flex flex-col gap-2 pb-0", item.className)}
                  style={{ "--timeline-dot-color": item.color, ...item.style } as React.CSSProperties}
                >
                  <div className="relative flex items-center">
                    <div
                      className={cn(
                        "z-10 flex size-3 items-center justify-center rounded-full text-background [&_svg]:size-3",
                        (item.dot || item.icon) && "size-5 bg-background text-foreground ring-1 ring-border",
                        item.pending || item.loading
                          ? "border-2 border-muted-foreground bg-background animate-pulse"
                          : item.color && !(item.color in colorMap)
                            ? "bg-[var(--timeline-dot-color)]"
                            : colorMap[(item.color ?? "default") as TimelinePresetColor]
                      )}
                    >
                      {item.icon ?? item.dot ?? null}
                    </div>
                    {index < itemsToRender.length - 1 && (
                      <div className="ml-2 h-0.5 flex-1 bg-border" />
                    )}
                  </div>
                  {item.label && <div className="text-xs text-muted-foreground">{item.label}</div>}
                  {item.title && <div className="text-sm font-medium">{item.title}</div>}
                  {(item.content ?? item.children) && (
                    <div className="text-sm text-muted-foreground">{item.content ?? item.children}</div>
                  )}
                </div>
              ) : (
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
                  style={item.style}
                >
                  {item.children}
                </TimelineItem>
              )}
            </motion.div>
          );
        })}
        {children}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
