import * as React from "react";
import { cn } from "@/lib/utils";

type SpaceSize = "sm" | "small" | "default" | "middle" | "lg" | "large" | number;
type SpaceOrientation = "horizontal" | "vertical";
type SpaceProps = React.ComponentProps<"div"> & {
  direction?: SpaceOrientation;
  orientation?: SpaceOrientation;
  vertical?: boolean;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: "start" | "center" | "end" | "baseline";
  split?: React.ReactNode;
  separator?: React.ReactNode;
  block?: boolean;
  wrap?: boolean;
}

const sizeClassMap: Record<Exclude<SpaceSize, number>, string> = {
  sm: "0.375rem",
  small: "0.375rem",
  default: "0.625rem",
  middle: "0.625rem",
  lg: "1rem",
  large: "1rem",
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
};

function getGapValue(size: SpaceSize) {
  return typeof size === "number" ? size : sizeClassMap[size];
}

function Space({
  children,
  className,
  direction,
  orientation,
  vertical,
  size = "default",
  align,
  split,
  separator,
  block,
  wrap,
  style,
  ...props
}: SpaceProps) {
  const isVertical = vertical || orientation === "vertical" || direction === "vertical";
  const [horizontalSize, verticalSize] = Array.isArray(size) ? size : [size, size];
  const childArray = React.Children.toArray(children).filter(Boolean);
  const mergedSeparator = separator ?? split;

  if (childArray.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="space"
      className={cn(
        block ? "flex" : "inline-flex",
        isVertical ? "flex-col" : "flex-row",
        !isVertical && wrap && "flex-wrap",
        alignMap[align ?? (isVertical ? "start" : "center")],
        block && "w-full",
        className
      )}
      style={{ columnGap: getGapValue(horizontalSize), rowGap: getGapValue(verticalSize), ...style }}
      {...props}
    >
      {childArray.map((child, index) => (
        <React.Fragment key={(child as React.ReactElement).key ?? index}>
          {index > 0 && mergedSeparator ? (
            <span data-slot="space-separator" className={cn(isVertical ? "my-1" : "mx-1", "text-border")}>
              {mergedSeparator}
            </span>
          ) : null}
          <div data-slot="space-item">{child}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

export { Space };
export type { SpaceOrientation, SpaceProps, SpaceSize };
