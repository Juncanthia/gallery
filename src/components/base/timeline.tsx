import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TimelineColor = "default" | "success" | "warning" | "error";
type TimelineMode = "left" | "alternate";

const colorMap: Record<TimelineColor, string> = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-destructive",
};

export interface TimelineItemProps {
  dot?: React.ReactNode;
  color?: TimelineColor;
  label?: React.ReactNode;
  children?: React.ReactNode;
  pending?: boolean;
  className?: string;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ dot, color = "default", label, children, pending, className }, ref) => {
    const dotColor = pending ? "border-2 border-muted-foreground bg-background animate-pulse" : colorMap[color];

    return (
      <div
        ref={ref}
        className={cn("relative flex gap-4 pb-8 last:pb-0", className)}
      >
        {label && (
          <div className="w-28 shrink-0 text-right text-sm text-muted-foreground">
            {label}
          </div>
        )}
        <div className="relative flex flex-col items-center after:absolute after:left-1/2 after:top-4 after:bottom-0 after:w-0.5 after:bg-border after:-translate-x-1/2 last:after:hidden">
          <div
            className={cn(
              "z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full",
              dotColor
            )}
          >
            {dot || null}
          </div>
        </div>
        <div className="flex-1 pb-2 text-sm">{children}</div>
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

export interface TimelineItemConfig {
  key?: string;
  dot?: React.ReactNode;
  color?: TimelineColor;
  label?: React.ReactNode;
  children?: React.ReactNode;
  pending?: boolean;
}

export interface TimelineProps {
  pending?: React.ReactNode;
  reverse?: boolean;
  items?: TimelineItemConfig[];
  mode?: TimelineMode;
  children?: React.ReactNode;
  className?: string;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ pending, reverse, items, mode = "left", children, className }, ref) => {
    const itemsToRender = items || [];
    const shouldReverse = reverse || mode === "alternate";

    return (
      <div
        ref={ref}
        data-slot="timeline"
        className={cn(shouldReverse && "flex flex-col-reverse", className)}
      >
        {itemsToRender.map((item, index) => {
          const isEvenIndex = index % 2 === 0;
          const isAlternate = mode === "alternate";
          const shouldFlipRow = isAlternate && !isEvenIndex;

          return (
            <motion.div
              key={item.key || index}
              className={shouldFlipRow ? "flex flex-row-reverse" : undefined}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07, ease: "easeOut" }}
            >
              <TimelineItem
                dot={item.dot}
                color={item.color}
                label={item.label}
                pending={item.pending}
              >
                {item.children}
              </TimelineItem>
            </motion.div>
          );
        })}

        {children}

        {pending && (
          <TimelineItem pending>
            {pending}
          </TimelineItem>
        )}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
