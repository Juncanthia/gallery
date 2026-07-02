import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/_internals/foundations/utils/cn"

import { badgeVariants } from "@/components/core/variants/badge-variants"


type BadgeStatus = "success" | "processing" | "default" | "error" | "warning"
type BadgeSize = "default" | "small"
type BadgeRibbonPlacement = "start" | "end"

type BadgeProps = Omit<React.ComponentProps<"span">, "title" | "color"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    count?: React.ReactNode
    showZero?: boolean
    overflowCount?: number
    dot?: boolean
    status?: BadgeStatus
    color?: string
    text?: React.ReactNode
    size?: BadgeSize
    offset?: [number | string, number | string]
    title?: string | null | false
  }

type BadgeRibbonProps = Omit<React.ComponentProps<"div">, "color"> & {
  text?: React.ReactNode
  color?: string
  placement?: BadgeRibbonPlacement
  ribbonClassName?: string
  ribbonStyle?: React.CSSProperties
}

const statusClasses: Record<BadgeStatus, string> = {
  success: "bg-green-500",
  processing: "bg-blue-500 before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-blue-500/50",
  default: "bg-muted-foreground",
  error: "bg-destructive",
  warning: "bg-yellow-500",
}

function isZero(value: React.ReactNode) {
  return value === 0 || value === "0"
}

function getDisplayCount(count: React.ReactNode, overflowCount: number) {
  return typeof count === "number" && count > overflowCount ? `${overflowCount}+` : count
}

function getOffsetStyle(offset?: [number | string, number | string]) {
  if (!offset) {
    return undefined
  }

  const [x, y] = offset
  return {
    marginTop: y,
    right: typeof x === "number" ? -x : `calc(-1 * ${x})`,
  } satisfies React.CSSProperties
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  count = null,
  showZero = false,
  overflowCount = 99,
  dot = false,
  status,
  color,
  text,
  size = "default",
  offset,
  title,
  children,
  style,
  ...props
}: BadgeProps) {
  const hasAntdIndicator =
    count !== null || dot || status !== undefined || color !== undefined || text !== undefined || offset !== undefined

  if (!hasAntdIndicator) {
    const Comp = asChild ? Slot.Root : "span"

    return (
      <Comp
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        style={style}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  const useDefaultVariant = false
  const displayCount = dot ? null : getDisplayCount(count, overflowCount)
  const hidden = !dot && (displayCount === null || displayCount === undefined || displayCount === false || (isZero(displayCount) && !showZero))
  const titleValue = title === false || title === null ? undefined : title ?? (typeof displayCount === "string" || typeof displayCount === "number" ? String(displayCount) : undefined)
  const indicatorStyle = {
    ...getOffsetStyle(offset),
    ...(color ? { backgroundColor: color } : undefined),
  } satisfies React.CSSProperties
  const indicator = hidden ? null : (
    <span
      data-slot="badge-indicator"
      title={titleValue}
      className={cn(
        "absolute z-10 inline-flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-medium text-white",
        useDefaultVariant
          ? "bg-linear-to-b from-red-400 to-red-600 border border-red-500 shadow-[0_1.5px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] ring-0"
          : "ring-2 ring-background bg-destructive",
        dot ? "top-0 right-0 size-2.5 p-0" : "top-0 right-0 h-5 min-w-5 px-1.5",
        size === "small" && !dot && "h-4 min-w-4 px-1 text-[10px]",
        !useDefaultVariant && (status ? statusClasses[status] : "bg-destructive")
      )}
      style={indicatorStyle}
    >
      {dot ? null : displayCount}
    </span>
  )

  if (!children) {
    if (status || color) {
      return (
        <span
          data-slot="badge-status"
          className={cn("inline-flex items-center gap-1.5 text-sm", className)}
          style={style}
          {...props}
        >
          <span
            data-slot="badge-status-dot"
            className={cn(
              "relative inline-flex size-2 rounded-full",
              useDefaultVariant
                ? cn(
                    "border shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_0.5px_0_rgba(255,255,255,0.4)]",
                    status === "success" && "bg-linear-to-b from-emerald-400 to-emerald-600 border-emerald-500",
                    status === "error" && "bg-linear-to-b from-red-400 to-red-600 border-red-500",
                    status === "warning" && "bg-linear-to-b from-amber-400 to-amber-600 border-amber-500",
                    status === "processing" && "bg-linear-to-b from-blue-400 to-blue-600 border-blue-500 animate-pulse",
                    status === "default" && "bg-linear-to-b from-neutral-300 to-neutral-500 border-neutral-400"
                  )
                : (status ? statusClasses[status] : "")
            )}
            style={color ? { backgroundColor: color } : undefined}
          />
          {text !== undefined && text !== true ? <span>{text}</span> : null}
        </span>
      )
    }

    return (
      <span
        data-slot="badge"
        className={cn(
          "relative inline-flex min-h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium text-white px-1.5",
          useDefaultVariant
            ? "bg-linear-to-b from-red-400 to-red-600 border border-red-500 shadow-[0_1.5px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[0_1.5px_3px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
            : "bg-destructive",
          size === "small" && "min-h-4 min-w-4 text-[10px]",
          className
        )}
        title={titleValue}
        style={{ ...indicatorStyle, ...style }}
        {...props}
      >
        {dot ? null : displayCount}
      </span>
    )
  }

  return (
    <span
      data-slot="badge-wrapper"
      className={cn("relative inline-flex w-fit", className)}
      style={style}
      {...props}
    >
      {children}
      {indicator}
      {!hidden && text !== undefined && text !== true ? (
        <span data-slot="badge-text" className="ml-2 text-sm">
          {text}
        </span>
      ) : null}
    </span>
  )
}

function BadgeRibbon({
  className,
  children,
  text,
  color,
  placement = "end",
  ribbonClassName,
  ribbonStyle,
  ...props
}: BadgeRibbonProps) {
  const ribbonColorStyle = color ? { backgroundColor: color } : undefined
  const cornerColorStyle = color ? { borderTopColor: color } : undefined

  return (
    <div
      data-slot="badge-ribbon-wrapper"
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
      <div
        data-slot="badge-ribbon"
        data-placement={placement}
        className={cn(
          "absolute top-2 z-10 inline-flex h-6 items-center bg-primary px-2 text-xs font-medium text-primary-foreground",
          placement === "start" ? "-left-2 rounded-r" : "-right-2 rounded-l",
          ribbonClassName
        )}
        style={{ ...ribbonColorStyle, ...ribbonStyle }}
      >
        {text}
        <span
          data-slot="badge-ribbon-corner"
          className={cn(
            "absolute top-full size-0 border-t-[4px] border-t-primary border-b-0 border-x-[4px] border-x-transparent",
            placement === "start" ? "left-0 -scale-x-100" : "right-0"
          )}
          style={cornerColorStyle}
        />
      </div>
    </div>
  )
}

export { Badge, BadgeRibbon, badgeVariants }
export type { BadgeProps, BadgeRibbonProps, BadgeRibbonPlacement, BadgeSize, BadgeStatus }
