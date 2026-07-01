import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

interface PopoverHandle {
  close: () => void
  getAnchorElement: () => HTMLElement | null
  isOpen: () => boolean
  open: () => void
  setAnchorElement: (element: HTMLElement | null) => void
  toggleOpen: () => void
}

interface PopoverOpenChangeDetails {
  preventUnmountOnClose: () => void
}

const popoverOpenChangeDetails: PopoverOpenChangeDetails = {
  preventUnmountOnClose: () => undefined,
}

type PopoverProps = Omit<
  React.ComponentProps<typeof PopoverPrimitive.Root>,
  "onOpenChange"
> & {
  handle?: PopoverHandle
  onOpenChange?: (
    open: boolean,
    eventDetails: PopoverOpenChangeDetails
  ) => void
}

function Popover({ children, handle, onOpenChange, ...props }: PopoverProps) {
  const virtualRef = React.useMemo(
    () => ({
      current: {
        getBoundingClientRect: () =>
          handle?.getAnchorElement()?.getBoundingClientRect() ?? new DOMRect(),
      },
    }),
    [handle]
  )

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen, popoverOpenChangeDetails)
      }}
      {...props}
    >
      {handle ? <PopoverPrimitive.Anchor virtualRef={virtualRef} /> : null}
      {children}
    </PopoverPrimitive.Root>
  )
}

type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
> & {
  closeDelay?: number
  delay?: number
  handle?: PopoverHandle
  nativeButton?: boolean
  openOnHover?: boolean
  payload?: unknown
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  (
    {
      closeDelay = 0,
      delay = 300,
      handle,
      nativeButton,
      onClick,
      onPointerEnter,
      onPointerLeave,
      openOnHover = false,
      payload,
      type,
      ...props
    },
    ref
  ) => {
    void nativeButton
    void payload
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

    React.useEffect(
      () => () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      },
      []
    )

    if (!handle) {
      return (
        <PopoverPrimitive.Trigger
          data-slot="popover-trigger"
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <button
        aria-expanded={handle.isOpen()}
        aria-haspopup="dialog"
        data-slot="popover-trigger"
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return

          handle.setAnchorElement(event.currentTarget)
          handle.toggleOpen()
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          if (!openOnHover || event.defaultPrevented) return

          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
          handle.setAnchorElement(event.currentTarget)
          hoverTimeoutRef.current = setTimeout(() => {
            handle.open()
          }, delay)
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          if (!openOnHover || event.defaultPrevented) return

          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = setTimeout(() => {
            handle.close()
          }, closeDelay)
        }}
        ref={ref}
        type={type ?? "button"}
        {...props}
      />
    )
  }
)

PopoverTrigger.displayName = "PopoverTrigger"

type RadixPopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>

type PopoverContentProps = Omit<RadixPopoverContentProps, "sticky"> & {
  container?: React.ComponentProps<typeof PopoverPrimitive.Portal>["container"]
  positionMethod?: "absolute" | "fixed"
  sticky?: RadixPopoverContentProps["sticky"] | boolean
}

function PopoverContent({
  className,
  container,
  align = "center",
  alignOffset = 0,
  positionMethod,
  side = "bottom",
  sideOffset = 4,
  sticky,
  ...props
}: PopoverContentProps) {
  const radixSticky = sticky === true ? "partial" : sticky || undefined
  void positionMethod

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        sticky={radixSticky}
        className={cn(
          "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-4 rounded-md bg-popover p-4 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverContent as PopoverPopup,
  PopoverDescription,
  PopoverHeader,
  PopoverPrimitive,
  PopoverTitle,
  PopoverTrigger,
  type PopoverHandle,
  type PopoverOpenChangeDetails,
}
