import { type ReactNode, Children } from "react";
import { cn } from "@/lib/utils";

interface SpaceProps {
  children: ReactNode[];
  className?: string;
  direction?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
  align?: "start" | "center" | "end" | "baseline";
  split?: ReactNode;
  block?: boolean;
}

function Space({
  children,
  className,
  direction = "horizontal",
  size = "default",
  align = "start",
  split,
  block,
}: SpaceProps) {
  const sizeMap = {
    sm: "gap-1.5",
    default: "gap-2.5",
    lg: "gap-4",
  };

  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
  };

  const isHorizontal = direction === "horizontal";
  const baseClasses = isHorizontal ? "flex-wrap" : "flex-col";
  const flexType = block ? "flex" : "inline-flex";
  const width = block ? "w-full" : "";

  const childArray = Children.toArray(children).filter(Boolean);

  return (
    <div
      data-slot="space"
      className={cn(
        flexType,
        baseClasses,
        alignMap[align],
        sizeMap[size],
        width,
        className
      )}
    >
      {childArray.map((child, index) => (
        <div key={index}>
          {index > 0 && split && (
            <span className="mx-1 text-border">{split}</span>
          )}
          {child}
        </div>
      ))}
    </div>
  );
}

export { Space };
export type { SpaceProps };
