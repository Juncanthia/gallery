import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === "function") {
        ref(node)
        return
      }
      ref.current = node
    })
  }
}

function useScrollAreaState(
  rootRef: React.RefObject<HTMLDivElement | null>,
  viewportRef: React.RefObject<HTMLDivElement | null>,
  scrollbarRefs: React.RefObject<HTMLDivElement | null>[]
) {
  React.useEffect(() => {
    const root = rootRef.current
    const viewport = viewportRef.current
    if (!root || !viewport) return

    let scrollingTimeout: ReturnType<typeof setTimeout> | undefined

    const updateOverflow = () => {
      const hasOverflowX = viewport.scrollWidth > viewport.clientWidth + 1
      const hasOverflowY = viewport.scrollHeight > viewport.clientHeight + 1

      viewport.toggleAttribute("data-has-overflow-x", hasOverflowX)
      viewport.toggleAttribute("data-has-overflow-y", hasOverflowY)

      const overflowXStart = Math.max(viewport.scrollLeft, 0)
      const overflowXEnd = Math.max(
        viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft,
        0
      )
      const overflowYStart = Math.max(viewport.scrollTop, 0)
      const overflowYEnd = Math.max(
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop,
        0
      )

      viewport.style.setProperty(
        "--scroll-area-overflow-x-start",
        `${overflowXStart}px`
      )
      viewport.style.setProperty(
        "--scroll-area-overflow-x-end",
        `${overflowXEnd}px`
      )
      viewport.style.setProperty(
        "--scroll-area-overflow-y-start",
        `${overflowYStart}px`
      )
      viewport.style.setProperty(
        "--scroll-area-overflow-y-end",
        `${overflowYEnd}px`
      )
    }

    const setScrolling = (scrolling: boolean) => {
      for (const ref of scrollbarRefs) {
        ref.current?.toggleAttribute("data-scrolling", scrolling)
      }
    }

    const setHovering = (hovering: boolean) => {
      for (const ref of scrollbarRefs) {
        ref.current?.toggleAttribute("data-hovering", hovering)
      }
    }

    const handleScroll = () => {
      updateOverflow()
      setScrolling(true)
      if (scrollingTimeout) clearTimeout(scrollingTimeout)
      scrollingTimeout = setTimeout(() => setScrolling(false), 200)
    }

    const handlePointerEnter = () => setHovering(true)
    const handlePointerLeave = () => setHovering(false)

    updateOverflow()

    const resizeObserver = new ResizeObserver(updateOverflow)
    resizeObserver.observe(viewport)
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild)
    }

    viewport.addEventListener("scroll", handleScroll, { passive: true })
    root.addEventListener("pointerenter", handlePointerEnter)
    root.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      resizeObserver.disconnect()
      viewport.removeEventListener("scroll", handleScroll)
      root.removeEventListener("pointerenter", handlePointerEnter)
      root.removeEventListener("pointerleave", handlePointerLeave)
      if (scrollingTimeout) clearTimeout(scrollingTimeout)
    }
  })
}

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  scrollFade = false,
  scrollbarGutter = false,
  scrollbarOverflowOnly = false,
  viewportClassName,
  viewportProps,
  viewportRef,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: "vertical" | "horizontal" | "both"
  scrollFade?: boolean
  scrollbarGutter?: boolean
  scrollbarOverflowOnly?: boolean
  viewportClassName?: string
  viewportProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>
  viewportRef?: React.Ref<HTMLDivElement>
}) {
  const {
    className: viewportPropsClassName,
    key: viewportKey,
    ref: viewportPropsRef,
    ...resolvedViewportProps
  } = viewportProps ?? {}

  const rootRef = React.useRef<HTMLDivElement>(null)
  const localViewportRef = React.useRef<HTMLDivElement>(null)
  const verticalScrollbarRef = React.useRef<HTMLDivElement>(null)
  const horizontalScrollbarRef = React.useRef<HTMLDivElement>(null)

  useScrollAreaState(rootRef, localViewportRef, [
    verticalScrollbarRef,
    horizontalScrollbarRef,
  ])

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        "relative size-full min-h-0",
        scrollbarOverflowOnly && "scrollbar-overflow-only",
        className
      )}
      ref={rootRef}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        key={viewportKey}
        {...resolvedViewportProps}
        data-slot="scroll-area-viewport"
        ref={composeRefs(localViewportRef, viewportPropsRef, viewportRef)}
        className={cn(
          "h-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain",
          scrollFade &&
            "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] [--fade-size:1.5rem]",
          scrollbarGutter &&
            "data-has-overflow-x:pb-2.5 data-has-overflow-y:pe-2.5",
          viewportPropsClassName,
          viewportClassName
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" ? (
        <ScrollBar orientation="vertical" ref={verticalScrollbarRef} />
      ) : null}
      {orientation !== "vertical" ? (
        <ScrollBar orientation="horizontal" ref={horizontalScrollbarRef} />
      ) : null}
      {orientation === "both" ? (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      ) : null}
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ref,
  ...props
}: React.ComponentProps<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      ref={ref}
      className={cn(
        "m-1 flex touch-none opacity-0 transition-opacity delay-300 select-none data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-1.5",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar, ScrollAreaPrimitive }
