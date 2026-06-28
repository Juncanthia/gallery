import * as React from "react";
import { ArrowUp, FileText, Plus as PlusIcon, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge, type BadgeProps } from "@/components/base/badge";
import {
  Tooltip,
  TooltipProvider,
} from "@/components/base/tooltip";
import { cn } from "@/lib/utils";
import { floatButtonVariants, type FloatButtonShape, type FloatButtonSize, type FloatButtonType } from "./float-button-variants";

type FloatButtonBadge = string | number | Omit<BadgeProps, "children" | "text" | "status">;
type FloatButtonElement = HTMLButtonElement | HTMLAnchorElement;
type FloatButtonTooltipConfig = {
  title?: React.ReactNode;
  content?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  open?: boolean;
};
type FloatButtonTooltip =
  | React.ReactNode
  | FloatButtonTooltipConfig;

export type FloatButtonProps = Omit<React.ComponentProps<"button">, "children" | "type" | "onClick"> & {
  type?: FloatButtonType;
  size?: FloatButtonSize;
  shape?: FloatButtonShape;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  tooltip?: FloatButtonTooltip;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  badge?: FloatButtonBadge;
  htmlType?: React.ComponentProps<"button">["type"];
  onClick?: React.MouseEventHandler<FloatButtonElement>;
}

function renderBadge(badge?: FloatButtonBadge) {
  if (badge === undefined || badge === null) {
    return null;
  }

  const badgeProps = typeof badge === "object" ? badge : { count: badge };

  return <Badge {...badgeProps} className={cn("absolute -top-1 -right-1", badgeProps.className)} />;
}

function isTooltipConfig(tooltip: FloatButtonTooltip): tooltip is FloatButtonTooltipConfig {
  return Boolean(
    tooltip &&
    typeof tooltip === "object" &&
    !React.isValidElement(tooltip) &&
    ("title" in tooltip || "content" in tooltip || "placement" in tooltip || "open" in tooltip)
  );
}

export const FloatButton = React.forwardRef<FloatButtonElement, FloatButtonProps>(
  (
    {
      type = "default",
      size = "default",
      shape = "circle",
      icon,
      content,
      tooltip,
      href,
      target,
      badge,
      htmlType = "button",
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const iconOnly = content === undefined || content === null;
    const mergedIcon = iconOnly && !icon ? <FileText className="size-5" /> : icon;
    const inner = (
      <>
        {renderBadge(badge)}
        {mergedIcon ? <span data-slot="float-button-icon">{mergedIcon}</span> : null}
        {content !== undefined && content !== null ? <span data-slot="float-button-content">{content}</span> : null}
      </>
    );

    const sharedClassName = cn(floatButtonVariants({ type, size, shape, iconOnly }), className);
    const node = href ? (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-slot="float-button"
        href={disabled ? undefined : href}
        target={target}
        aria-disabled={disabled || undefined}
        className={sharedClassName}
        onClick={disabled ? undefined : (onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>)}
        {...(props as Omit<React.ComponentProps<"a">, "type">)}
      >
        {inner}
      </a>
    ) : (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        data-slot="float-button"
        type={htmlType}
        disabled={disabled}
        className={sharedClassName}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...props}
      >
        {inner}
      </button>
    );

    if (tooltip) {
      const tooltipConfig = isTooltipConfig(tooltip) ? tooltip : undefined;
      const tooltipTitle = tooltipConfig ? tooltipConfig.title ?? tooltipConfig.content : tooltip as React.ReactNode;

      return (
        <TooltipProvider>
          <Tooltip title={tooltipTitle} placement={tooltipConfig?.placement} open={tooltipConfig?.open}>
            {node}
          </Tooltip>
        </TooltipProvider>
      );
    }

    return node;
  }
);

FloatButton.displayName = "FloatButton";

export interface FloatButtonGroupProps extends Omit<React.ComponentProps<"div">, "children"> {
  trigger?: "click" | "hover";
  triggerIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  items?: Array<FloatButtonProps & { key?: React.Key }>;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "right" | "bottom" | "left";
  shape?: FloatButtonShape;
  type?: FloatButtonType;
}

const placementClasses: Record<NonNullable<FloatButtonGroupProps["placement"]>, string> = {
  top: "flex-col-reverse",
  bottom: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

const listPlacementClasses: Record<NonNullable<FloatButtonGroupProps["placement"]>, string> = {
  top: "flex-col-reverse",
  bottom: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

export const FloatButtonGroup = React.forwardRef<
  HTMLDivElement,
  FloatButtonGroupProps
>(
  (
    {
      trigger = "click",
      triggerIcon,
      closeIcon,
      items,
      children,
      open: controlledOpen,
      onOpenChange,
      placement = "top",
      shape = "circle",
      type = "primary",
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = React.useCallback((value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    }, [isControlled, onOpenChange]);

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

    const itemNodes = items
      ? items.map(({ key, ...item }, index) => (
          <FloatButton key={key ?? index} shape={item.shape ?? shape} type={item.type ?? type} {...item} />
        ))
      : children;
    const childArray = React.Children.toArray(itemNodes).map((child) => {
      if (!React.isValidElement<FloatButtonProps>(child)) {
        return child;
      }

      return React.cloneElement(child, {
        shape: child.props.shape ?? shape,
        type: child.props.type ?? type,
      });
    });

    React.useEffect(() => {
      if (trigger !== "click" || !open) {
        return;
      }

      const close = () => setOpen(false);
      document.addEventListener("click", close, { capture: true });
      return () => document.removeEventListener("click", close, { capture: true });
    }, [open, setOpen, trigger]);

    return (
      <div
        ref={ref}
        data-slot="float-button-group"
        className={cn("relative inline-flex items-center gap-2", placementClasses[placement], className)}
        onMouseEnter={() => handleTriggerHover(true)}
        onMouseLeave={() => handleTriggerHover(false)}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        <AnimatePresence>
          {open && (
            <div data-slot="float-button-group-list" className={cn("flex gap-2", listPlacementClasses[placement])}>
              {childArray.map((child, index) => (
                <motion.div
                  key={(child as React.ReactElement).key ?? index}
                  initial={{ opacity: 0, y: placement === "top" ? 10 : 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: placement === "top" ? 10 : 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {child}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <FloatButton
            type={type}
            shape={shape}
            icon={open ? closeIcon ?? <CloseIcon className="size-5" /> : triggerIcon ?? <PlusIcon className="size-5" />}
            onClick={handleTriggerClick}
            aria-expanded={open}
          />
        </motion.div>
      </div>
    );
  }
);

FloatButtonGroup.displayName = "FloatButtonGroup";

export type FloatButtonBackTopProps = Omit<FloatButtonProps, "onClick"> & {
  visibilityHeight?: number;
  target?: () => Window | HTMLElement | Document;
  duration?: number;
  onClick?: React.MouseEventHandler<FloatButtonElement>;
}

function isWindow(target: Window | HTMLElement | Document): target is Window {
  return typeof window !== "undefined" && target === window;
}

function isDocument(target: Window | HTMLElement | Document): target is Document {
  return typeof Document !== "undefined" && target instanceof Document;
}

function getScrollTop(target: Window | HTMLElement | Document) {
  if (isWindow(target)) {
    return window.scrollY || document.documentElement.scrollTop;
  }

  if (isDocument(target)) {
    return target.documentElement.scrollTop;
  }

  return target.scrollTop;
}

function scrollToTop(target: Window | HTMLElement | Document, behavior: ScrollBehavior) {
  if (isWindow(target)) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  if (isDocument(target)) {
    target.documentElement.scrollTo({ top: 0, behavior });
    return;
  }

  target.scrollTo({ top: 0, behavior });
}

export const FloatButtonBackTop = React.forwardRef<FloatButtonElement, FloatButtonBackTopProps>(
  ({ visibilityHeight = 400, target, duration = 450, icon, tooltip = "Back to top", onClick, ...props }, ref) => {
    const [visible, setVisible] = React.useState(visibilityHeight === 0);

    React.useEffect(() => {
      const targetNode = target?.() ?? window;
      const handleScroll = () => setVisible(getScrollTop(targetNode) >= visibilityHeight);
      handleScroll();
      targetNode.addEventListener("scroll", handleScroll);
      return () => targetNode.removeEventListener("scroll", handleScroll);
    }, [target, visibilityHeight]);

    return (
      <AnimatePresence>
        {visible ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <FloatButton
              ref={ref}
              icon={icon ?? <ArrowUp className="size-5" />}
              tooltip={tooltip}
              onClick={(event) => {
                scrollToTop(target?.() ?? window, duration > 0 ? "smooth" : "auto");
                onClick?.(event);
              }}
              {...props}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);

FloatButtonBackTop.displayName = "FloatButtonBackTop";

export type { FloatButtonBadge, FloatButtonElement, FloatButtonShape, FloatButtonSize, FloatButtonTooltip, FloatButtonType };
