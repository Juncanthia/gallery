import * as React from "react"
import { Dialog as DialogPrimitive, Slot } from "radix-ui"

import { cn } from "@/_internals/foundations/utils/cn"
import { Button } from "@/components/core/button"
import { ScrollArea } from "@/components/core/scroll-area"
import { XIcon } from "lucide-react"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="text"
              className="absolute top-4 right-4"
              size="small"
              shape="square"
            >
              <XIcon
              />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogPopup({
  className,
  children,
  showCloseButton = true,
  bottomStickOnMobile = true,
  closeProps,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  bottomStickOnMobile?: boolean
  closeProps?: React.ComponentProps<typeof DialogPrimitive.Close>
}) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogViewport
        className={cn(
          bottomStickOnMobile &&
            "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12"
        )}
      >
        <DialogPrimitive.Content
          data-slot="dialog-popup"
          className={cn(
            "relative row-start-2 flex max-h-full min-h-0 w-full max-w-lg min-w-0 flex-col rounded-2xl border bg-popover text-popover-foreground shadow-lg/5 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            bottomStickOnMobile &&
              "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:data-open:slide-in-from-bottom max-sm:data-closed:slide-out-to-bottom",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              aria-label="Close"
              asChild
              className="absolute end-2 top-2"
              {...closeProps}
            >
              <Button variant="text" size="small" shape="square">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogViewport>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
  variant?: "default" | "bare"
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        variant === "default" && "in-[[data-slot=dialog-popup]]:border-t in-[[data-slot=dialog-popup]]:bg-muted/72 in-[[data-slot=dialog-popup]]:px-6 in-[[data-slot=dialog-popup]]:py-4",
        variant === "bare" &&
          "in-[[data-slot=dialog-popup]]:px-6 in-[[data-slot=dialog-popup]]:pt-4 in-[[data-slot=dialog-popup]]:pb-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pt-3",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outlined">Close</Button>
        </DialogPrimitive.Close>
      )}
    </Comp>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("leading-none font-medium", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DialogPanel({
  className,
  scrollFade = true,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  scrollFade?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <ScrollArea scrollFade={scrollFade}>
      <Comp
        data-slot="dialog-panel"
        className={cn(
          "p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1",
          className
        )}
        {...props}
      />
    </ScrollArea>
  )
}

export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPanel,
  DialogPopup,
  DialogPortal,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
}
