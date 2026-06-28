import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type DescriptionsVariant = "default" | "bordered";
type DescriptionsSize = "sm" | "default" | "lg";
type DescriptionsLayout = "horizontal" | "vertical";

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
  span?: number;
  labelClassName?: string;
  contentClassName?: string;
  className?: string;
}

const sizeClasses: Record<DescriptionsSize, string> = {
  sm: "px-3 py-1.5",
  default: "px-4 py-2.5",
  lg: "px-5 py-4",
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

    if (context.variant === "bordered") {
      if (context.layout === "vertical") {
        return (
          <td
            ref={ref as React.Ref<HTMLTableCellElement>}
            className={cn("border-r border-b border-border text-sm", sizeClasses[context.size], className)}
            colSpan={Math.max(1, span)}
          >
            {label && (
              <div className={cn("mb-1 font-medium text-muted-foreground", mergedLabelClassName)}>
                {renderLabel(label, context.colon)}
              </div>
            )}
            <div className={mergedContentClassName}>{mergedContent}</div>
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
          >
            {renderLabel(label, context.colon)}
          </td>
          <td
            className={cn(
              "border-r border-b border-border text-sm",
              sizeClasses[context.size],
              mergedContentClassName
            )}
            colSpan={Math.max(1, span * 2 - 1)}
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
        style={{ gridColumn: span > 1 ? `span ${span} / span ${span}` : undefined }}
      >
        {label && (
          <div className={cn("shrink-0 font-medium text-muted-foreground", mergedLabelClassName)}>
            {renderLabel(label, context.colon)}
          </div>
        )}
        <div className={cn("min-w-0", mergedContentClassName)}>{mergedContent}</div>
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
  column?: number;
  bordered?: boolean;
  colon?: boolean;
  layout?: DescriptionsLayout;
  size?: DescriptionsSize;
  items?: DescriptionsItemConfig[];
  children?: React.ReactNode;
  labelClassName?: string;
  contentClassName?: string;
  className?: string;
}

function chunkItems(items: DescriptionsItemConfig[], column: number) {
  const rows: DescriptionsItemConfig[][] = [];
  let currentRow: DescriptionsItemConfig[] = [];
  let usedSpan = 0;

  items.forEach((item) => {
    const span = Math.min(Math.max(item.span ?? 1, 1), column);
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
      labelClassName,
      contentClassName,
      className,
    },
    ref
  ) => {
    const variant = bordered ? "bordered" : "default";
    const safeColumn = Math.max(1, column);
    const rows = items ? chunkItems(items, safeColumn) : [];

    return (
      <div ref={ref} data-slot="descriptions" className={className}>
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
                ? items.map((item, index) => (
                    <DescriptionsItem
                      key={item.key ?? index}
                      label={item.label}
                      span={item.span}
                      className={item.className}
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
