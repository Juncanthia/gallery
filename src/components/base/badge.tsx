import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

import { badgeVariants } from "./badge-variants"


type BadgeStatus = "success" | "processing" | "default" | "error" | "warning"
type BadgeSize = "default" | "small"

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
        "absolute z-10 inline-flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-background",
        dot ? "top-0 right-0 size-2 p-0" : "top-0 right-0 h-5 min-w-5 px-1.5",
        size === "small" && !dot && "h-4 min-w-4 px-1 text-[10px]",
        status ? statusClasses[status] : "bg-destructive"
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
            className={cn("relative inline-flex size-2 rounded-full", status ? statusClasses[status] : "")}
            style={color ? { backgroundColor: color } : undefined}
          />
          {text !== undefined && text !== true ? <span>{text}</span> : null}
        </span>
      )
    }

    return (
      <span
        data-slot="badge"
        className={cn("relative inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white", size === "small" && "min-h-4 min-w-4 text-[10px]", className)}
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

export { Badge }
export type { BadgeProps, BadgeSize, BadgeStatus }
