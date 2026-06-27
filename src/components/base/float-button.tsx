import React, { type ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus as PlusIcon, Bone as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/base/tooltip";

export const floatButtonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center transition-all hover:shadow-xl active:scale-95",
  {
    variants: {
      type: {
        default:
          "bg-background border border-border text-foreground hover:bg-muted shadow-lg",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
      },
      size: {
        default: "h-12 w-12",
        sm: "h-9 w-9",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      type: "default",
      size: "default",
    },
  }
);

export type FloatButtonProps = Omit<ComponentProps<"button">, "children" | "type"> &
  VariantProps<typeof floatButtonVariants> & {
  shape?: "circle" | "square";
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  href?: string;
  badge?: string | number;
}

export const FloatButton = React.forwardRef<HTMLButtonElement, FloatButtonProps>(
  (
    {
      type = "default",
      size = "default",
      shape = "circle",
      icon,
      tooltip,
      href,
      badge,
      className,
      ...props
    },
    ref
  ) => {
    const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

    const button = (
      <button
        ref={ref}
        data-slot="float-button"
        className={cn(
          floatButtonVariants({ type, size }),
          shapeClass,
          className
        )}
        {...props}
      >
        {badge !== undefined && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
            {badge}
          </span>
        )}
        {icon}
      </button>
    );

    const content = href ? (
      <a href={href} className="inline-flex">
        {button}
      </a>
    ) : (
      button
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    }

    return content;
  }
);

FloatButton.displayName = "FloatButton";

export interface FloatButtonGroupProps extends Omit<ComponentProps<"div">, "children"> {
  trigger?: "click" | "hover";
  triggerIcon?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const FloatButtonGroup = React.forwardRef<
  HTMLDivElement,
  FloatButtonGroupProps
>(
  (
    {
      trigger = "click",
      triggerIcon,
      children,
      open: controlledOpen,
      onOpenChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    };

    const handleTriggerClick = () => {
      if (trigger === "click") {
        setOpen(!open);
      }
    };

    const handleTriggerHover = (isHovering: boolean) => {
      if (trigger === "hover") {
        setOpen(isHovering);
      }
    };

    const childArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        data-slot="float-button-group"
        className={cn("relative inline-flex flex-col items-center gap-2", className)}
        onMouseEnter={() => handleTriggerHover(true)}
        onMouseLeave={() => handleTriggerHover(false)}
        {...props}
      >
        <AnimatePresence>
          {open && (
            <>
              {childArray.map((child, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {child}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <FloatButton
            type="primary"
            size="default"
            icon={
              triggerIcon || (open ? <XIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />)
            }
            onClick={handleTriggerClick}
          />
        </motion.div>
      </div>
    );
  }
);

FloatButtonGroup.displayName = "FloatButtonGroup";
