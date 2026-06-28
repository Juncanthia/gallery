import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type DescriptionsVariant = "default" | "bordered";
type DescriptionsSize = "sm" | "small" | "default" | "middle" | "lg" | "large";
type DescriptionsLayout = "horizontal" | "vertical";
type DescriptionsBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface DescriptionsContextType {
  variant: DescriptionsVariant;
  size: DescriptionsSize;
  layout: DescriptionsLayout;
  colon: boolean;
  labelClassName?: string;
  contentClassName?: string;
}

const DescriptionsContext = createContext<DescriptionsContextType | undefined>(
  undefined
);

const useDescriptionsContext = () => {
  const context = useContext(DescriptionsContext);
  if (!context) {
    throw new Error("useDescriptionsContext must be used within Descriptions");
  }
  return context;
};

export interface DescriptionsItemProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  content?: React.ReactNode;
  span?: number | "filled" | Partial<Record<DescriptionsBreakpoint, number>>;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  labelClassName?: string;
  contentClassName?: string;
  className?: string;
}

const sizeClasses: Record<DescriptionsSize, string> = {
  sm: "px-3 py-1.5",
  small: "px-3 py-1.5",
  default: "px-4 py-2.5",
  middle: "px-4 py-2.5",
  lg: "px-5 py-4",
  large: "px-5 py-4",
};

const breakpointMinWidth: Record<DescriptionsBreakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

function renderLabel(label: React.ReactNode, colon: boolean) {
  if (!label) return null;
  return colon ? <>{label}:</> : label;
}

export const DescriptionsItem = React.forwardRef<
  HTMLTableCellElement | HTMLDivElement,
  DescriptionsItemProps
>(
  (
    {
      label,
      children,
      content,
      span = 1,
      labelStyle,
      contentStyle,
      labelClassName,
      contentClassName,
      className,
    },
    ref
  ) => {
    const context = useDescriptionsContext();
    const mergedContent = content ?? children;
    const mergedLabelClassName = cn(context.labelClassName, labelClassName);
    const mergedContentClassName = cn(context.contentClassName, contentClassName);
    const numericSpan = typeof span === "number" ? span : 1;

    if (context.variant === "bordered") {
      if (context.layout === "vertical") {
        return (
          <td
            ref={ref as React.Ref<HTMLTableCellElement>}
            className={cn("border-r border-b border-border text-sm", sizeClasses[context.size], className)}
            colSpan={Math.max(1, numericSpan)}
          >
            {label && (
              <div className={cn("mb-1 font-medium text-muted-foreground", mergedLabelClassName)} style={labelStyle}>
                {renderLabel(label, context.colon)}
              </div>
            )}
            <div className={mergedContentClassName} style={contentStyle}>{mergedContent}</div>
          </td>
        );
      }

      return (
        <>
          <td
            ref={ref as React.Ref<HTMLTableCellElement>}
            className={cn(
              "border-r border-b border-border bg-muted/40 text-sm font-medium text-muted-foreground",
              sizeClasses[context.size],
              mergedLabelClassName,
              className
            )}
            style={labelStyle}
          >
            {renderLabel(label, context.colon)}
          </td>
          <td
            className={cn(
              "border-r border-b border-border text-sm",
              sizeClasses[context.size],
              mergedContentClassName
            )}
            style={contentStyle}
            colSpan={Math.max(1, numericSpan * 2 - 1)}
          >
            {mergedContent}
          </td>
        </>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(
          context.layout === "vertical" ? "space-y-1 py-2" : "flex gap-2 py-2",
          className
        )}
        style={{ gridColumn: numericSpan > 1 ? `span ${numericSpan} / span ${numericSpan}` : undefined }}
      >
        {label && (
          <div className={cn("shrink-0 font-medium text-muted-foreground", mergedLabelClassName)} style={labelStyle}>
            {renderLabel(label, context.colon)}
          </div>
        )}
        <div className={cn("min-w-0", mergedContentClassName)} style={contentStyle}>{mergedContent}</div>
      </div>
    );
  }
);

DescriptionsItem.displayName = "DescriptionsItem";

export interface DescriptionsItemConfig extends DescriptionsItemProps {
  key?: React.Key;
}

export interface DescriptionsProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  column?: number | Partial<Record<DescriptionsBreakpoint, number>>;
  bordered?: boolean;
  colon?: boolean;
  layout?: DescriptionsLayout;
  size?: DescriptionsSize;
  items?: DescriptionsItemConfig[];
  children?: React.ReactNode;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  labelClassName?: string;
  contentClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

function useViewportWidth() {
  const [width, setWidth] = React.useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth
  );

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function getResponsiveValue(
  value: number | Partial<Record<DescriptionsBreakpoint, number>> | undefined,
  width: number,
  fallback: number
) {
  if (typeof value === "number") return value;
  if (!value) return fallback;

  const active = (Object.entries(breakpointMinWidth) as Array<[DescriptionsBreakpoint, number]>)
    .filter(([breakpoint, minWidth]) => width >= minWidth && value[breakpoint] !== undefined)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  return active ? value[active] ?? fallback : fallback;
}

function resolveSpan(
  span: DescriptionsItemConfig["span"],
  column: number,
  usedSpan: number,
  width: number
) {
  if (span === "filled") return Math.max(1, column - usedSpan);
  return Math.min(Math.max(getResponsiveValue(span, width, 1), 1), column);
}

function chunkItems(items: DescriptionsItemConfig[], column: number, width: number) {
  const rows: DescriptionsItemConfig[][] = [];
  let currentRow: DescriptionsItemConfig[] = [];
  let usedSpan = 0;

  items.forEach((item) => {
    const span = resolveSpan(item.span, column, usedSpan, width);
    if (usedSpan + span > column && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      usedSpan = 0;
    }
    currentRow.push({ ...item, span });
    usedSpan += span;
  });

  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}

export const Descriptions = React.forwardRef<HTMLDivElement, DescriptionsProps>(
  (
    {
      title,
      extra,
      column = 3,
      bordered = false,
      colon = true,
      layout = "horizontal",
      size = "default",
      items,
      children,
      labelStyle,
      contentStyle,
      labelClassName,
      contentClassName,
      className,
      style,
    },
    ref
  ) => {
    const variant = bordered ? "bordered" : "default";
    const viewportWidth = useViewportWidth();
    const safeColumn = Math.max(1, getResponsiveValue(column, viewportWidth, 3));
    const rows = items ? chunkItems(items, safeColumn, viewportWidth) : [];
    const normalizedItems = rows.flat();

    return (
      <div ref={ref} data-slot="descriptions" className={className} style={style}>
        {(title || extra) && (
          <div className="mb-3 flex items-center justify-between gap-3">
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {extra && <div>{extra}</div>}
          </div>
        )}

        <DescriptionsContext.Provider
          value={{
            variant,
            size,
            layout,
            colon,
            labelClassName,
            contentClassName,
          }}
        >
          {bordered ? (
            <table className="w-full overflow-hidden rounded border border-collapse border-border">
              <tbody>
                {items ? (
                  rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((item, colIndex) => (
                        <DescriptionsItem
                          key={item.key ?? colIndex}
                          label={item.label}
                          span={item.span}
                          className={item.className}
                          labelStyle={item.labelStyle ?? labelStyle}
                          contentStyle={item.contentStyle ?? contentStyle}
                          labelClassName={item.labelClassName}
                          contentClassName={item.contentClassName}
                        >
                          {item.content ?? item.children}
                        </DescriptionsItem>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>{children}</tr>
                )}
              </tbody>
            </table>
          ) : (
            <div
              className="grid gap-x-6"
              style={{ gridTemplateColumns: `repeat(${safeColumn}, minmax(0, 1fr))` }}
            >
              {items
                ? normalizedItems.map((item, index) => (
                    <DescriptionsItem
                      key={item.key ?? index}
                      label={item.label}
                      span={item.span}
                      className={item.className}
                      labelStyle={item.labelStyle ?? labelStyle}
                      contentStyle={item.contentStyle ?? contentStyle}
                      labelClassName={item.labelClassName}
                      contentClassName={item.contentClassName}
                    >
                      {item.content ?? item.children}
                    </DescriptionsItem>
                  ))
                : children}
            </div>
          )}
        </DescriptionsContext.Provider>
      </div>
    );
  }
);

Descriptions.displayName = "Descriptions";
