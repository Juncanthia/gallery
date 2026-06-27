import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type DescriptionsVariant = "default" | "bordered";
type DescriptionsSize = "sm" | "default" | "lg";
type DescriptionsLayout = "horizontal" | "vertical";

interface DescriptionsContextType {
  variant: DescriptionsVariant;
  size: DescriptionsSize;
  layout: DescriptionsLayout;
  column: number;
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
  span?: number;
  labelClassName?: string;
  contentClassName?: string;
  className?: string;
}

export const DescriptionsItem = React.forwardRef<
  HTMLTableCellElement,
  DescriptionsItemProps
>(
  (
    {
      label,
      children,
      span = 1,
      labelClassName,
      contentClassName,
      className,
    },
    ref
  ) => {
    const { variant, size } = useDescriptionsContext();

    const sizeClasses = {
      sm: "px-3 py-1.5",
      default: "px-4 py-2.5",
      lg: "px-5 py-4",
    };

    if (variant === "bordered") {
      return (
        <>
          <td
            ref={ref}
            className={cn(
              "border-r border-b border-border bg-muted/40 font-medium text-sm text-muted-foreground",
              sizeClasses[size],
              labelClassName,
              className
            )}
          >
            {label}
          </td>
          <td
            className={cn(
              "border-r border-b border-border text-sm",
              sizeClasses[size],
              contentClassName
            )}
            colSpan={span}
          >
            {children}
          </td>
        </>
      );
    }

    return (
      <div className={cn("flex py-2", className)}>
        {label && (
          <div className={cn("text-muted-foreground mr-2 font-medium", labelClassName)}>
            {label}
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    );
  }
);

DescriptionsItem.displayName = "DescriptionsItem";

export interface DescriptionsItemConfig {
  key?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  span?: number;
}

export interface DescriptionsProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  column?: number;
  bordered?: boolean;
  size?: DescriptionsSize;
  items?: DescriptionsItemConfig[];
  children?: React.ReactNode;
  className?: string;
}

export const Descriptions = React.forwardRef<HTMLDivElement, DescriptionsProps>(
  (
    {
      title,
      extra,
      column = 3,
      bordered = false,
      size = "default",
      items,
      children,
      className,
    },
    ref
  ) => {
    const variant = bordered ? "bordered" : "default";
    const layout = "horizontal";

    return (
      <div ref={ref} data-slot="descriptions" className={className}>
        {(title || extra) && (
          <div className="flex justify-between mb-3">
            {title && <h3 className="font-semibold text-base">{title}</h3>}
            {extra && <div>{extra}</div>}
          </div>
        )}

        <DescriptionsContext.Provider
          value={{ variant, size, layout, column }}
        >
          {bordered ? (
            <table className="border border-border rounded-lg overflow-hidden w-full border-collapse">
              <tbody>
                {items ? (
                  Array.from({ length: Math.ceil(items.length / column) }).map(
                    (_, rowIndex) => (
                      <tr key={rowIndex}>
                        {items
                          .slice(
                            rowIndex * column,
                            rowIndex * column + column
                          )
                          .map((item, colIndex) => (
                            <React.Fragment key={item.key || colIndex}>
                              <DescriptionsItem
                                label={item.label}
                                span={item.span}
                              >
                                {item.children}
                              </DescriptionsItem>
                            </React.Fragment>
                          ))}
                      </tr>
                    )
                  )
                ) : (
                  <tr>{children}</tr>
                )}
              </tbody>
            </table>
          ) : (
            <div>{items ? items.map((item) => (
              <DescriptionsItem key={item.key} label={item.label}>
                {item.children}
              </DescriptionsItem>
            )) : children}</div>
          )}
        </DescriptionsContext.Provider>
      </div>
    );
  }
);

Descriptions.displayName = "Descriptions";
