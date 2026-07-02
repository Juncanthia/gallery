"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  arrow as arrowMiddleware,
  type Placement,
} from "@floating-ui/react-dom"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/_internals/foundations/utils/cn"
import { Button } from "@/components/core/button"

export type TourPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end"
  | "center"

export type TourTarget =
  | string
  | HTMLElement
  | React.RefObject<HTMLElement | null>
  | (() => HTMLElement | null)

export type TourStepConfig = {
  title?: React.ReactNode
  description?: React.ReactNode
  target?: TourTarget
  placement?: TourPlacement
  cover?: React.ReactNode
  nextButtonProps?: { children?: React.ReactNode; className?: string }
  prevButtonProps?: { children?: React.ReactNode; className?: string }
  onClose?: () => void
  onStepEnter?: () => void
  onStepLeave?: () => void
}

export type TourProps = {
  open?: boolean
  onClose?: () => void
  onFinish?: () => void
  onSkip?: () => void
  current?: number
  onChange?: (current: number) => void
  defaultCurrent?: number
  steps: TourStepConfig[]
  mask?: boolean
  zIndex?: number
  gap?: { offset?: number; radius?: number }
  arrow?: boolean
  autoScroll?: boolean
  scrollOffset?: number
  scrollIntoViewOptions?: ScrollIntoViewOptions
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  className?: string
}

type SpotlightRect = {
  left: number
  top: number
  width: number
  height: number
}

const CARD_WIDTH = 288
const CARD_HEIGHT_ESTIMATE = 180

function resolveTarget(target: TourTarget | undefined): HTMLElement | null {
  if (!target) return null
  if (typeof target === "function") return target()
  if (typeof target === "string") return document.querySelector(target)
  if ("current" in target) return target.current
  return target
}

function normalizePlacement(placement: TourPlacement | undefined): Placement {
  if (!placement || placement === "center") return "bottom"
  return placement
}

function getCenterPosition() {
  return {
    top: Math.max(16, window.innerHeight / 2 - CARD_HEIGHT_ESTIMATE / 2),
    left: Math.max(16, window.innerWidth / 2 - CARD_WIDTH / 2),
  }
}

function getSpotlightRect(
  target: HTMLElement | null,
  offsetValue: number
): SpotlightRect | null {
  if (!target) return null
  const rect = target.getBoundingClientRect()

  return {
    left: Math.max(0, rect.left - offsetValue),
    top: Math.max(0, rect.top - offsetValue),
    width: rect.width + offsetValue * 2,
    height: rect.height + offsetValue * 2,
  }
}

function isReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function TourArrow({
  placement,
  x,
  y,
  arrowRef,
}: {
  placement: Placement
  x?: number
  y?: number
  arrowRef: React.Ref<HTMLDivElement>
}) {
  const side = placement.split("-")[0] as "top" | "right" | "bottom" | "left"
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side]

  return (
    <div
      ref={arrowRef}
      data-slot="tour-arrow"
      className="absolute size-2 rotate-45 border bg-popover"
      style={{
        left: x != null ? `${x}px` : undefined,
        top: y != null ? `${y}px` : undefined,
        [staticSide]: "-5px",
        borderLeftColor: side === "right" ? "transparent" : undefined,
        borderTopColor: side === "bottom" ? "transparent" : undefined,
      }}
    />
  )
}

export function Tour({
  open = false,
  onClose,
  onFinish,
  onSkip,
  current: controlledCurrent,
  onChange,
  defaultCurrent = 0,
  steps,
  mask = true,
  zIndex = 1001,
  gap = { offset: 10, radius: 0 },
  arrow = false,
  autoScroll = true,
  scrollOffset = 80,
  scrollIntoViewOptions,
  closeOnEscape = true,
  closeOnOutsideClick = false,
  className,
}: TourProps) {
  const isControlled = controlledCurrent !== undefined
  const [uncontrolledCurrent, setUncontrolledCurrent] =
    React.useState(defaultCurrent)
  const current = isControlled ? controlledCurrent : uncontrolledCurrent
  const step = steps[current]
  const previousStepRef = React.useRef<TourStepConfig | null>(null)
  const arrowRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(
    null
  )
  const [spotlightRect, setSpotlightRect] =
    React.useState<SpotlightRect | null>(null)
  const [centerPosition, setCenterPosition] = React.useState({
    top: 0,
    left: 0,
  })

  const floating = useFloating({
    placement: normalizePlacement(step?.placement),
    strategy: "fixed",
    elements: { reference: targetElement },
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(gap.offset ?? 10),
      shift({ padding: 8 }),
      flip({ padding: 8 }),
      arrow ? arrowMiddleware({ element: arrowRef }) : undefined,
    ].filter(Boolean),
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open || !step) return

    previousStepRef.current?.onStepLeave?.()
    step.onStepEnter?.()
    previousStepRef.current = step

    return () => {
      step.onStepLeave?.()
      if (previousStepRef.current === step) previousStepRef.current = null
    }
  }, [open, step])

  React.useEffect(() => {
    if (!open || !step) {
      setTargetElement(null)
      setSpotlightRect(null)
      return
    }

    let frame = 0
    const update = () => {
      const nextTarget = resolveTarget(step.target)
      setTargetElement(nextTarget)
      setSpotlightRect(getSpotlightRect(nextTarget, gap.offset ?? 10))
      setCenterPosition(getCenterPosition())
      if (nextTarget && floating.refs.reference.current !== nextTarget) {
        floating.refs.setReference(nextTarget)
      }
    }
    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    update()

    window.addEventListener("resize", requestUpdate)
    window.addEventListener("scroll", requestUpdate, true)

    return () => {
      window.removeEventListener("resize", requestUpdate)
      window.removeEventListener("scroll", requestUpdate, true)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [floating.refs, gap.offset, open, step])

  React.useEffect(() => {
    if (!open || !step || !autoScroll) return
    const target = resolveTarget(step.target)
    if (!target) return

    if (scrollIntoViewOptions) {
      target.scrollIntoView(scrollIntoViewOptions)
      return
    }

    const rect = target.getBoundingClientRect()
    const isVisible =
      rect.top >= scrollOffset &&
      rect.bottom <= window.innerHeight - scrollOffset

    if (!isVisible) {
      target.scrollIntoView({
        behavior: isReducedMotion() ? "auto" : "smooth",
        block: "center",
      })
    }
  }, [autoScroll, current, open, scrollIntoViewOptions, scrollOffset, step])

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEscape || event.key !== "Escape") return
      handleClose("skip")
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  })

  const setCurrent = React.useCallback(
    (nextCurrent: number) => {
      if (!isControlled) setUncontrolledCurrent(nextCurrent)
      onChange?.(nextCurrent)
    },
    [isControlled, onChange]
  )

  const handleClose = React.useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization -- optional-chaining callback body defeats the compiler's memoization analysis
    (reason: "close" | "finish" | "skip" = "close") => {
      step?.onClose?.()
      if (reason === "finish") onFinish?.()
      if (reason === "skip") onSkip?.()
      onClose?.()
    },
    [onClose, onFinish, onSkip, step]
  )

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1)
      return
    }

    handleClose("finish")
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  if (!mounted || !open || !step) {
    return null
  }

  const isCentered = step.placement === "center" || !targetElement
  const arrowData = floating.middlewareData.arrow

  return createPortal(
    <AnimatePresence mode="wait">
      {open ? (
        <div
          key="tour-wrapper"
          data-slot="tour"
          onPointerDown={(event) => {
            if (!closeOnOutsideClick) return
            if (event.target === event.currentTarget) handleClose("skip")
          }}
        >
          {mask ? (
            <motion.div
              data-slot="tour-mask"
              className="fixed inset-0 bg-black/40"
              style={{
                zIndex: zIndex - 1,
                pointerEvents: closeOnOutsideClick ? "auto" : "none",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : null}

          {mask && spotlightRect ? (
            <div
              data-slot="tour-spotlight"
              className="pointer-events-none fixed bg-transparent"
              style={{
                zIndex: zIndex - 1,
                boxShadow: `0 0 0 ${Math.max(window.innerWidth, window.innerHeight)}px rgba(0, 0, 0, 0.4)`,
                left: spotlightRect.left,
                top: spotlightRect.top,
                width: spotlightRect.width,
                height: spotlightRect.height,
                borderRadius: `${gap.radius ?? 0}px`,
              }}
            />
          ) : null}

          <motion.div
            ref={floating.refs.setFloating}
            role="dialog"
            aria-modal={false}
            data-slot="tour-card"
            data-placement={isCentered ? "center" : floating.placement}
            className={cn(
              "fixed w-72 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-xl outline-none",
              className
            )}
            style={{
              zIndex,
              ...(isCentered
                ? centerPosition
                : {
                    left: floating.x ?? 0,
                    top: floating.y ?? 0,
                  }),
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {arrow && !isCentered ? (
              <TourArrow
                placement={floating.placement}
                x={arrowData?.x}
                y={arrowData?.y}
                arrowRef={arrowRef}
              />
            ) : null}

            {step.cover ? <div className="mb-3">{step.cover}</div> : null}

            {step.title ? (
              <div data-slot="tour-title" className="text-sm font-semibold text-foreground">
                {step.title}
              </div>
            ) : null}

            {step.description ? (
              <div
                data-slot="tour-description"
                className="mt-1 text-sm text-muted-foreground"
              >
                {step.description}
              </div>
            ) : null}

            <div data-slot="tour-footer" className="mt-4 flex items-center justify-between">
              <div data-slot="tour-indicators" className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    data-slot="tour-indicator"
                    data-active={index === current || undefined}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-muted-foreground/30 transition-all",
                      index === current && "w-3 bg-primary"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {current > 0 ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handlePrev}
                    className={step.prevButtonProps?.className}
                  >
                    {step.prevButtonProps?.children ?? "上一步"}
                  </Button>
                ) : null}
                <Button
                  size="small"
                  color="primary"
                  variant="solid"
                  onClick={handleNext}
                  className={step.nextButtonProps?.className}
                >
                  {step.nextButtonProps?.children ??
                    (current === steps.length - 1 ? "完成" : "下一步")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
