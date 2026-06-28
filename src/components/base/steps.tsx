import React, { type ComponentProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Check as CheckIcon, X as XIcon } from "lucide-react";

export type StepStatus = "wait" | "process" | "finish" | "error";
export type StepsType = "default" | "navigation" | "dot";

export interface StepsProps extends Omit<ComponentProps<"div">, "onChange"> {
  current?: number;
  initial?: number;
  direction?: "horizontal" | "vertical";
  orientation?: "horizontal" | "vertical";
  size?: "default" | "small" | "sm";
  type?: StepsType;
  status?: StepStatus;
  onChange?: (index: number) => void;
  items: Array<{
    key?: string | number;
    title?: React.ReactNode;
    description?: React.ReactNode;
    content?: React.ReactNode;
    subTitle?: React.ReactNode;
    icon?: React.ReactNode;
    status?: StepStatus;
    disabled?: boolean;
  }>;
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      current = 0,
      initial = 0,
      direction = "horizontal",
      orientation,
      size = "default",
      type = "default",
      status = "process",
      onChange,
      items,
      className,
      ...props
    },
    ref
  ) => {
    const mergedOrientation = orientation ?? direction;
    const isHorizontal = mergedOrientation === "horizontal";
    const isSmall = size === "small" || size === "sm" || type === "dot";
    const iconSize = isSmall ? "h-6 w-6" : "h-8 w-8";

    const getStepStatus = (index: number): StepStatus => {
      if (items[index]?.status) return items[index].status!;
      const stepIndex = initial + index;
      if (stepIndex < current) return "finish";
      if (stepIndex === current) return status;
      return "wait";
    };

    const renderIcon = (index: number) => {
      const stepStatus = getStepStatus(index);
      const stepNumber = initial + index + 1;

      if (type === "dot") {
        return (
          <span
            className={cn(
              "block rounded-full transition-colors",
              stepStatus === "finish" || stepStatus === "process"
                ? "size-2.5 bg-primary"
                : stepStatus === "error"
                  ? "size-2.5 bg-destructive"
                  : "size-2.5 bg-muted-foreground/40"
            )}
          />
        );
      }

      if (stepStatus === "finish") {
        return (
          <motion.div
            key="finish"
            className={cn(iconSize, "rounded-full flex items-center justify-center bg-primary text-primary-foreground")}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <CheckIcon className="h-4 w-4" />
          </motion.div>
        );
      }

      if (stepStatus === "error") {
        return (
          <motion.div
            key="error"
            className={cn(iconSize, "rounded-full flex items-center justify-center bg-destructive/10 text-destructive")}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <XIcon className="h-4 w-4" />
          </motion.div>
        );
      }

      if (stepStatus === "process") {
        return (
          <motion.div
            key="process"
            className={cn(iconSize, "rounded-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium")}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            {items[index]?.icon || stepNumber}
          </motion.div>
        );
      }

      return (
        <div key="wait" className={cn(iconSize, "rounded-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-medium")}>
          {items[index]?.icon || stepNumber}
        </div>
      );
    };

    const getTitleColor = (index: number) => {
      const stepStatus = getStepStatus(index);
      if (stepStatus === "finish" || stepStatus === "process") return "text-foreground";
      if (stepStatus === "error") return "text-destructive";
      return "text-muted-foreground";
    };

    if (isHorizontal) {
      return (
        <div
          ref={ref}
          data-slot="steps"
          className={cn("flex flex-row items-start", className)}
          {...props}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.key ?? index}>
              <div className="flex-1 relative flex flex-col items-start gap-2">
                <button
                  onClick={() => onChange?.(initial + index)}
                  disabled={item.disabled}
                  className={cn(
                    "disabled:cursor-not-allowed",
                    onChange && !item.disabled && "hover:cursor-pointer",
                    type === "navigation" && "rounded border border-transparent p-1 hover:border-border"
                  )}
                  type="button"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {renderIcon(index)}
                  </AnimatePresence>
                </button>
                {item.title && (
                  <div className={cn("text-sm font-medium transition-colors duration-300", getTitleColor(index))}>
                    {item.title}
                  </div>
                )}
                {item.description && (
                  <div className="text-xs text-muted-foreground">{item.content ?? item.description}</div>
                )}
                {item.content && !item.description && (
                  <div className="text-xs text-muted-foreground">{item.content}</div>
                )}
              </div>
              {index < items.length - 1 && (
                <div
                  className={cn(
                    "flex-1 border-t-2 mt-4 transition-colors duration-500",
                    getStepStatus(index) === "finish" ? "border-primary" : "border-border"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="steps"
        className={cn("flex flex-col", className)}
        {...props}
      >
        {items.map((item, index) => (
          <div key={item.key ?? index} className="flex flex-row gap-3 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <button
                onClick={() => onChange?.(initial + index)}
                disabled={item.disabled}
                className={cn(
                  "disabled:cursor-not-allowed",
                  onChange && !item.disabled && "hover:cursor-pointer"
                )}
                type="button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {renderIcon(index)}
                </AnimatePresence>
              </button>
              {index < items.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 mt-2 transition-colors duration-500",
                    getStepStatus(index) === "finish" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="flex flex-col pt-1">
              {item.title && (
                <div className={cn("text-sm font-medium transition-colors duration-300", getTitleColor(index))}>
                  {item.title}
                </div>
              )}
              {item.description && (
                <div className="text-xs text-muted-foreground">{item.content ?? item.description}</div>
              )}
              {item.content && !item.description && (
                <div className="text-xs text-muted-foreground">{item.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Steps.displayName = "Steps";
