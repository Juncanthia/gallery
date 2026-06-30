import * as React from "react"

import { Skeleton } from "@/components/base/skeleton"
import { cn } from "@/lib/utils"

type CardSize = "default" | "sm" | "small"
type CardVariant = "outlined" | "borderless"
type CardType = "inner"

type CardTabItem = {
  key: string
  label?: React.ReactNode
  tab?: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

type CardProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  extra?: React.ReactNode
  cover?: React.ReactNode
  actions?: React.ReactNode[]
  tabList?: CardTabItem[]
  tabBarExtraContent?: React.ReactNode
  activeTabKey?: string
  defaultActiveTabKey?: string
  onTabChange?: (key: string) => void
  tabProps?: React.ComponentProps<"div">
  loading?: boolean
  hoverable?: boolean
  size?: CardSize
  variant?: CardVariant
  type?: CardType
  bordered?: boolean
  headStyle?: React.CSSProperties
  bodyStyle?: React.CSSProperties
  headerClassName?: string
  bodyClassName?: string
  actionsClassName?: string
}

type CardMetaProps = React.ComponentProps<"div"> & {
  avatar?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}

type CardGridProps = React.ComponentProps<"div"> & {
  hoverable?: boolean
}

function Card({
  className,
  title,
  description,
  extra,
  cover,
  actions,
  tabList,
  tabBarExtraContent,
  activeTabKey,
  defaultActiveTabKey,
  onTabChange,
  tabProps,
  loading,
  hoverable,
  size = "default",
  variant = "outlined",
  type,
  bordered,
  headStyle,
  bodyStyle,
  headerClassName,
  bodyClassName,
  actionsClassName,
  children,
  ...props
}: CardProps) {
  const mergedSize = size === "small" ? "sm" : size
  const mergedVariant = bordered === false ? "borderless" : variant
  const [innerActiveTabKey, setInnerActiveTabKey] = React.useState(
    defaultActiveTabKey ?? tabList?.[0]?.key
  )
  const mergedActiveTabKey = activeTabKey ?? innerActiveTabKey
  const handleTabChange = (key: string) => {
    if (activeTabKey === undefined) {
      setInnerActiveTabKey(key)
    }
    onTabChange?.(key)
  }
  const hasApiContent =
    title !== undefined ||
    description !== undefined ||
    extra !== undefined ||
    cover !== undefined ||
    actions !== undefined ||
    tabList !== undefined ||
    tabBarExtraContent !== undefined ||
    loading !== undefined

  return (
    <div
      data-slot="card"
      data-size={mergedSize}
      data-variant={mergedVariant}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded bg-card py-(--card-spacing) text-sm text-card-foreground [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded *:[img:last-child]:rounded",
        mergedVariant === "outlined" && "ring-1 ring-foreground/10 shadow-xs",
        mergedVariant === "borderless" && "shadow-none ring-0",
        type === "inner" && "[--card-spacing:--spacing(4)] bg-muted/20",
        hoverable && "transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {hasApiContent ? (
        <>
          {cover && <div data-slot="card-cover">{cover}</div>}
          {(title || description || extra || tabList?.length || tabBarExtraContent) && (
            <CardHeader
              className={cn(type === "inner" && "border-b pb-(--card-spacing)", headerClassName)}
              style={headStyle}
            >
              {(title || description || extra) && (
                <div>
                  {title && <CardTitle>{title}</CardTitle>}
                  {description && <CardDescription>{description}</CardDescription>}
                </div>
              )}
              {(extra || tabBarExtraContent) && (
                <CardAction>{extra ?? tabBarExtraContent}</CardAction>
              )}
              {tabList?.length ? (
                <div
                  role="tablist"
                  data-slot="card-tabs"
                  {...tabProps}
                  className={cn("col-span-full mt-2 flex items-center gap-1 border-b", tabProps?.className)}
                >
                  {tabList.map((item) => {
                    const active = item.key === mergedActiveTabKey
                    return (
                      <button
                        key={item.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        data-state={active ? "active" : "inactive"}
                        disabled={item.disabled}
                        className={cn(
                          "inline-flex items-center gap-1.5 border-b-2 border-transparent px-2 py-1.5 text-sm text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-50",
                          active && "border-foreground text-foreground"
                        )}
                        onClick={() => handleTabChange(item.key)}
                      >
                        {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
                        {item.label ?? item.tab}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </CardHeader>
          )}
          <CardContent className={bodyClassName} style={bodyStyle}>
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
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
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
        "flex items-center rounded-b px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardMeta({
  className,
  avatar,
  title,
  description,
  children,
  ...props
}: CardMetaProps) {
  return (
    <div
      data-slot="card-meta"
      className={cn("flex items-start gap-3", className)}
      {...props}
    >
      {avatar && <div data-slot="card-meta-avatar" className="shrink-0">{avatar}</div>}
      <div className="min-w-0 flex-1">
        {title && <div data-slot="card-meta-title" className="font-medium">{title}</div>}
        {description && (
          <div data-slot="card-meta-description" className="text-sm text-muted-foreground">
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

function CardGrid({
  className,
  hoverable = true,
  ...props
}: CardGridProps) {
  return (
    <div
      data-slot="card-grid"
      className={cn(
        "border-b border-r p-4",
        hoverable && "transition-colors hover:bg-muted/50",
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
  CardMeta,
  CardGrid,
}
export type { CardProps, CardSize, CardVariant, CardType, CardTabItem, CardMetaProps, CardGridProps }
