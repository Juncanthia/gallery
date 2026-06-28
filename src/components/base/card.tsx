import * as React from "react"

import { Skeleton } from "@/components/base/skeleton"
import { cn } from "@/lib/utils"

type CardSize = "default" | "sm" | "small"
type CardVariant = "outlined" | "borderless"

type CardProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  extra?: React.ReactNode
  cover?: React.ReactNode
  actions?: React.ReactNode[]
  loading?: boolean
  hoverable?: boolean
  size?: CardSize
  variant?: CardVariant
  headerClassName?: string
  bodyClassName?: string
  actionsClassName?: string
}

function Card({
  className,
  title,
  description,
  extra,
  cover,
  actions,
  loading,
  hoverable,
  size = "default",
  variant = "outlined",
  headerClassName,
  bodyClassName,
  actionsClassName,
  children,
  ...props
}: CardProps) {
  const mergedSize = size === "small" ? "sm" : size
  const hasApiContent =
    title !== undefined ||
    description !== undefined ||
    extra !== undefined ||
    cover !== undefined ||
    actions !== undefined ||
    loading !== undefined

  return (
    <div
      data-slot="card"
      data-size={mergedSize}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-xs [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        variant === "outlined" && "ring-1 ring-foreground/10",
        variant === "borderless" && "shadow-none ring-0",
        hoverable && "transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {hasApiContent ? (
        <>
          {cover && <div data-slot="card-cover">{cover}</div>}
          {(title || description || extra) && (
            <CardHeader className={headerClassName}>
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
              {extra && <CardAction>{extra}</CardAction>}
            </CardHeader>
          )}
          <CardContent className={bodyClassName}>
            {loading ? <Skeleton active paragraph={{ rows: 4 }} title={false} /> : children}
          </CardContent>
          {actions?.length ? (
            <CardFooter className={cn("border-t px-0 pt-0", actionsClassName)}>
              <div className="grid w-full grid-flow-col divide-x divide-border">
                {actions.map((action, index) => (
                  <div key={index} className="flex items-center justify-center px-3 py-2">
                    {action}
                  </div>
                ))}
              </div>
            </CardFooter>
          ) : null}
        </>
      ) : (
        children
      )}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
export type { CardProps, CardSize, CardVariant }
