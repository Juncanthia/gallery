import * as React from "react"
import { X } from "lucide-react"
import { Drawer as DrawerPrimitive } from "vaul"

import { Button, type ButtonProps } from "@/components/core/button"
import { cn } from "@/_internals/foundations/utils/cn"

type DrawerPlacement = "top" | "bottom" | "left" | "right"
type DrawerSize = "default" | "large" | number | string
type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content> & {
  direction?: DrawerPlacement
  mask?: boolean
  size?: DrawerSize
}

function getDrawerSizeStyle(
  direction: DrawerPlacement,
  size?: DrawerSize
): React.CSSProperties | undefined {
  if (size === undefined) return undefined

  const value = size === "large" ? 736 : size === "default" ? 378 : size
  const cssValue = typeof value === "number" ? `${value}px` : value

  return direction === "left" || direction === "right"
    ? { width: cssValue }
    : { height: cssValue }
}

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  extra?: React.ReactNode
  placement?: DrawerPlacement
  size?: DrawerSize
  closable?: boolean
  closeIcon?: React.ReactNode
  closeText?: React.ReactNode
  mask?: boolean
  maskClosable?: boolean
  closeButtonProps?: ButtonProps
  contentProps?: DrawerContentProps
}

function renderDrawerTrigger(trigger: React.ReactNode) {
  if (trigger === undefined) return null

  return (
    <DrawerTrigger asChild>
      {React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
    </DrawerTrigger>
  )
}

function Drawer({
  trigger,
  title,
  description,
  footer,
  extra,
  placement,
  size,
  closable = true,
  closeIcon,
  closeText,
  mask,
  maskClosable,
  closeButtonProps,
  contentProps,
  children,
  ...props
}: DrawerProps) {
  const direction = placement ?? props.direction ?? "bottom"
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    extra !== undefined ||
    placement !== undefined ||
    size !== undefined ||
    closable !== true ||
    closeIcon !== undefined ||
    closeText !== undefined ||
    mask !== undefined ||
    maskClosable !== undefined ||
    closeButtonProps !== undefined ||
    contentProps !== undefined

  if (!hasApiContent) {
    return (
      <DrawerPrimitive.Root data-slot="drawer" {...props}>
        {children}
      </DrawerPrimitive.Root>
    )
  }

  const footerNode = footer === null
    ? null
    : footer ??
      (closeText !== undefined && (
        <DrawerClose asChild>
          <Button variant="outlined" className="w-full" {...closeButtonProps}>
            {closeText}
          </Button>
        </DrawerClose>
      ))

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      {...props}
      direction={direction}
      dismissible={maskClosable === false ? false : props.dismissible}
    >
      {renderDrawerTrigger(trigger)}
      <DrawerContent
        direction={direction}
        mask={mask}
        size={size}
        {...contentProps}
      >
        {(title !== undefined ||
          description !== undefined ||
          extra !== undefined ||
          closable) && (
          <DrawerHeader>
            <div className="flex min-w-0 items-start justify-between gap-3">
              {closable && (
                <DrawerClose className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none">
                  {closeIcon ?? <X className="size-4" />}
                  <span className="sr-only">Close</span>
                </DrawerClose>
              )}
              <div className="min-w-0 flex-1 space-y-1">
                {title !== undefined && <DrawerTitle>{title}</DrawerTitle>}
                {description !== undefined && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </div>
              {extra !== undefined && <div className="shrink-0">{extra}</div>}
            </div>
          </DrawerHeader>
        )}
        <div className="px-4 pb-4">{children}</div>
        {footerNode !== null && footerNode !== false && footerNode !== undefined && (
          <DrawerFooter>{footerNode}</DrawerFooter>
        )}
      </DrawerContent>
    </DrawerPrimitive.Root>
  )
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  direction = "bottom",
  mask = true,
  size,
  style,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      {mask && <DrawerOverlay />}
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
          className
        )}
        style={{
          ...getDrawerSizeStyle(direction, size),
          ...style,
        }}
        {...props}
      >
        <div className="mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading font-medium text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerProps,
  type DrawerContentProps,
  type DrawerPlacement,
  type DrawerSize,
}
