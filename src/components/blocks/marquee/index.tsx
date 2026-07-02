"use client";

import {
  useCallback,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import type { MarqueeProps as FastMarqueeProps } from "react-fast-marquee";
import FastMarquee from "react-fast-marquee";
import { cn } from "@/_internals/foundations/utils/cn";

type MarqueeSide = "left" | "right" | "top" | "bottom";

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  pauseOnKeyboard?: boolean;
  side?: MarqueeSide;
};

export const Marquee = ({
  className,
  onKeyDown,
  pauseOnKeyboard = false,
  side = "left",
  ...props
}: MarqueeProps) => {
  const [paused, setPaused] = useState(false);
  const isVertical = side === "top" || side === "bottom";

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !pauseOnKeyboard || event.key !== " ") {
        return;
      }
      event.preventDefault();
      setPaused((value) => !value);
    },
    [onKeyDown, pauseOnKeyboard]
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isVertical ? "h-full" : "w-full",
        pauseOnKeyboard &&
          "rounded focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        paused && "[&_*]:[animation-play-state:paused]",
        className
      )}
      data-orientation={isVertical ? "vertical" : "horizontal"}
      data-slot="marquee"
      onKeyDown={handleKeyDown}
      tabIndex={pauseOnKeyboard ? 0 : props.tabIndex}
      {...props}
    />
  );
};

export type MarqueeContentProps = FastMarqueeProps & {
  gap?: number | string;
  side?: MarqueeSide;
};

export const MarqueeContent = ({
  className,
  direction,
  gap,
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  side,
  style,
  ...props
}: MarqueeContentProps) => (
  <FastMarquee
    autoFill={autoFill}
    className={cn(className)}
    direction={
      direction ??
      (side === "right"
        ? "right"
        : side === "top"
          ? "up"
          : side === "bottom"
            ? "down"
            : "left")
    }
    loop={loop}
    pauseOnHover={pauseOnHover}
    style={
      gap === undefined
        ? style
        : ({
            "--gap": typeof gap === "number" ? `${gap}px` : gap,
            ...style,
          } as CSSProperties)
    }
    {...props}
  />
);

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: MarqueeSide;
  size?: "sm" | "default" | "lg";
};

export const MarqueeFade = ({
  className,
  size = "default",
  side,
  ...props
}: MarqueeFadeProps) => (
  <div
    className={cn(
      "pointer-events-none absolute z-10 from-background to-transparent",
      side === "left" && "top-0 bottom-0 left-0 h-full bg-gradient-to-r",
      side === "right" && "top-0 right-0 bottom-0 h-full bg-gradient-to-l",
      side === "top" && "top-0 left-0 w-full bg-gradient-to-b",
      side === "bottom" && "bottom-0 left-0 w-full bg-gradient-to-t",
      (side === "left" || side === "right") &&
        (size === "sm" ? "w-1/6" : size === "lg" ? "w-1/3" : "w-1/4"),
      (side === "top" || side === "bottom") &&
        (size === "sm" ? "h-1/6" : size === "lg" ? "h-1/3" : "h-1/4"),
      className
    )}
    {...props}
  />
);

export const MarqueeEdge = MarqueeFade;

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
  <div
    className={cn("mx-2 shrink-0 object-contain", className)}
    {...props}
  />
);

export type { MarqueeSide };
