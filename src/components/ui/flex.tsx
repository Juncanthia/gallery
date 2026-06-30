import * as React from "react";
import { cn } from "@/lib/utils";

type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse";
type FlexOrientation = "horizontal" | "vertical";
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline" | React.CSSProperties["alignItems"];
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly" | React.CSSProperties["justifyContent"];
type FlexGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | "small" | "middle" | "large" | React.CSSProperties["gap"];

type FlexProps<T extends React.ElementType = "div"> = Omit<React.ComponentPropsWithoutRef<T>, "as" | "wrap"> & {
  as?: T;
  direction?: FlexDirection;
  vertical?: boolean;
  orientation?: FlexOrientation;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean | React.CSSProperties["flexWrap"];
  gap?: FlexGap;
  flex?: React.CSSProperties["flex"];
  inline?: boolean;
}

const directionClasses: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  col: "flex-col",
  "col-reverse": "flex-col-reverse",
};

const alignClasses: Partial<Record<NonNullable<FlexAlign>, string>> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
  "flex-start": "items-start",
  "flex-end": "items-end",
};

const justifyClasses: Partial<Record<NonNullable<FlexJustify>, string>> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
  "flex-start": "justify-start",
  "flex-end": "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

const presetGapClasses: Partial<Record<NonNullable<FlexGap>, string>> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  small: "gap-2",
  middle: "gap-4",
  large: "gap-6",
};

function getWrapValue(wrap?: FlexProps["wrap"]) {
  if (wrap === true) {
    return "wrap";
  }

  if (!wrap) {
    return undefined;
  }

  return wrap;
}

function getCssValue<T extends string | number | undefined>(value: T, classMap: Partial<Record<NonNullable<T>, string>>) {
  if (value === undefined || classMap[value as NonNullable<T>]) {
    return undefined;
  }

  return value;
}

function Flex<T extends React.ElementType = "div">({
  as,
  children,
  className,
  direction = "row",
  vertical,
  orientation,
  align,
  justify,
  wrap,
  gap,
  flex,
  inline,
  style,
  ...props
}: FlexProps<T>) {
  const Component = as ?? "div";
  const mergedDirection = vertical || orientation === "vertical" ? "col" : direction;
  const wrapValue = getWrapValue(wrap);
  const gapClass = gap === undefined ? undefined : presetGapClasses[gap];

  return (
    <Component
      data-slot="flex"
      className={cn(
        inline ? "inline-flex" : "flex",
        directionClasses[mergedDirection],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrapValue === "wrap" && "flex-wrap",
        wrapValue === "nowrap" && "flex-nowrap",
        wrapValue === "wrap-reverse" && "flex-wrap-reverse",
        gapClass,
        className
      )}
      style={{
        alignItems: getCssValue(align, alignClasses),
        justifyContent: getCssValue(justify, justifyClasses),
        flexWrap: wrapValue && !["wrap", "nowrap", "wrap-reverse"].includes(wrapValue) ? wrapValue : undefined,
        gap: gap !== undefined && !gapClass ? gap : undefined,
        flex,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Flex };
export type { FlexAlign, FlexDirection, FlexGap, FlexJustify, FlexOrientation, FlexProps };
