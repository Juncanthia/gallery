"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";
import { useLegendItem } from "./legend-context";

export interface LegendProgressProps {
  /** Track class name */
  trackClassName?: string;
  /** Indicator class name */
  indicatorClassName?: string;
  /** Track height. Default: "h-1.5" */
  height?: string;
}

export function LegendProgress({
  trackClassName = "",
  indicatorClassName = "",
  height = "h-1.5",
}: LegendProgressProps) {
  const { item } = useLegendItem();

  if (!item.maxValue) {
    return null;
  }

  const percentage = (item.value / item.maxValue) * 100;
  const progressWidth = Math.max(0, Math.min(100, percentage));

  // Note: item.color must remain inline style as it's dynamic data
  return (
    <ProgressPrimitive.Root max={item.maxValue} value={item.value}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-legend-track",
          height,
          trackClassName
        )}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-500",
            indicatorClassName
          )}
          style={{ backgroundColor: item.color, width: `${progressWidth}%` }}
        />
      </div>
    </ProgressPrimitive.Root>
  );
}

LegendProgress.displayName = "LegendProgress";
