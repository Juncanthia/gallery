import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/_internals/foundations/utils/cn"

export type TimelinePresetColor =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "blue"
  | "red"
  | "green"
  | "gray"
export type TimelineColor = TimelinePresetColor | (string & {})
export type TimelineMode = "left" | "right" | "start" | "end" | "alternate"
export type TimelinePlacement = "start" | "end"
export type TimelineOrientation = "vertical" | "horizontal"
export type TimelineStatus = "completed" | "active" | "pending"

const colorMap: Record<TimelinePresetColor, string> = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-destructive",
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  gray: "bg-muted-foreground",
}

export interface TimelineItemProps {
  dot?: React.ReactNode
  icon?: React.ReactNode
  color?: TimelineColor
  label?: React.ReactNode
  time?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  placement?: TimelinePlacement
  children?: React.ReactNode
  status?: TimelineStatus
  pending?: boolean
  loading?: boolean
  connector?: boolean
  connectorStatus?: TimelineStatus
  className?: string
  style?: React.CSSProperties
  position?: TimelinePlacement | "left" | "right"
}

export interface TimelineItemConfig extends TimelineItemProps {
  key?: React.Key
}

export interface TimelineProps {
  pending?: React.ReactNode
  pendingDot?: React.ReactNode
  reverse?: boolean
  items?: TimelineItemConfig[]
  activeIndex?: number
  mode?: TimelineMode
  orientation?: TimelineOrientation
  animated?: boolean
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function getItemStatus(
  index: number,
  item: TimelineItemConfig | TimelineItemProps,
  activeIndex?: number
): TimelineStatus | undefined {
  if (item.status) return item.status
  if (item.pending || item.loading) return "pending"
  if (activeIndex === undefined) return undefined
  if (index < activeIndex) return "completed"
  if (index === activeIndex) return "active"
  return "pending"
}

function getPlacement(
  mode: TimelineMode,
  index: number,
  item?: TimelineItemConfig
): TimelinePlacement {
  if (item?.placement) return item.placement
  if (item?.position === "right" || item?.position === "end") return "end"
  if (item?.position === "left" || item?.position === "start") return "start"
  if (mode === "right" || mode === "end") return "end"
  if (mode === "alternate") return index % 2 === 0 ? "start" : "end"
  return "start"
}

function getDotClassName(item: TimelineItemProps, status?: TimelineStatus) {
  if (item.pending || item.loading || status === "pending") {
    return "border-2 border-muted-foreground bg-background animate-pulse"
  }

  if (status === "completed" || status === "active") {
    return "bg-primary"
  }

  if (item.color && !(item.color in colorMap)) {
    return "bg-[var(--timeline-dot-color)]"
  }

  return colorMap[(item.color ?? "default") as TimelinePresetColor]
}

function getConnectorClassName(status?: TimelineStatus) {
  if (status === "completed") return "bg-primary"
  if (status === "active") return "bg-primary/50"
  return "bg-border"
}

function getConnectorStatus(
  currentStatus?: TimelineStatus,
  nextStatus?: TimelineStatus
): TimelineStatus | undefined {
  if (currentStatus === "completed" && nextStatus !== "pending") {
    return "completed"
  }
  if (currentStatus === "active") return "active"
  return nextStatus ? "pending" : undefined
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      dot,
      icon,
      color = "default",
      label,
      time,
      title,
      content,
      placement = "start",
      children,
      status,
      pending,
      loading,
      connector = false,
      connectorStatus,
      className,
      style,
    },
    ref
  ) => {
    const itemForState = { color, pending, loading, status }
    const resolvedStatus = getItemStatus(0, itemForState, undefined)
    const mergedStatus = status ?? resolvedStatus
    const mergedContent = content ?? children
    const dotColor = getDotClassName(
      { color, pending, loading, status: mergedStatus },
      mergedStatus
    )
    const connectorState = connectorStatus ?? mergedStatus

    return (
      <li
        ref={ref}
        role="listitem"
        aria-current={mergedStatus === "active" ? "step" : undefined}
        data-slot="timeline-item"
        data-placement={placement}
        data-status={mergedStatus}
        className={cn(
          "relative flex gap-4 pb-8 last:pb-0",
          placement === "end" && "flex-row-reverse [&_[data-slot=timeline-label]]:text-left",
          className
        )}
        style={{ "--timeline-dot-color": color, ...style } as React.CSSProperties}
      >
        {label || time ? (
          <div
            data-slot="timeline-label"
            className="w-28 shrink-0 text-right text-sm text-muted-foreground"
          >
            {time ? (
              <time data-slot="timeline-time" className="block">
                {time}
              </time>
            ) : (
              label
            )}
          </div>
        ) : null}
        <div data-slot="timeline-axis" className="relative flex flex-col items-center">
          <div
            data-slot="timeline-dot"
            data-status={mergedStatus}
            className={cn(
              "z-10 mt-1 flex size-3 shrink-0 items-center justify-center rounded-full text-background [&_svg]:size-3",
              (dot || icon) && "size-5 bg-background text-foreground ring-1 ring-border",
              dotColor
            )}
          >
            {icon ?? dot ?? null}
          </div>
          {connector ? (
            <div
              data-slot="timeline-connector"
              data-status={connectorState}
              className={cn(
                "absolute bottom-0 top-4 w-0.5",
                getConnectorClassName(connectorState)
              )}
            />
          ) : null}
        </div>
        <div data-slot="timeline-content" className="min-w-0 flex-1 pb-2 text-sm">
          {title ? (
            <div data-slot="timeline-title" className="font-medium text-foreground">
              {title}
            </div>
          ) : null}
          {mergedContent ? (
            <div data-slot="timeline-description" className="text-muted-foreground">
              {mergedContent}
            </div>
          ) : null}
        </div>
      </li>
    )
  }
)

TimelineItem.displayName = "TimelineItem"

function TimelineMotion({
  animated,
  children,
  index,
  orientation,
  placement,
}: {
  animated: boolean
  children: React.ReactNode
  index: number
  orientation: TimelineOrientation
  placement: TimelinePlacement
}) {
  if (!animated) return <>{children}</>

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: orientation === "horizontal" ? 0 : placement === "end" ? 16 : -16,
        y: orientation === "horizontal" ? 8 : 0,
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      pending,
      pendingDot,
      reverse,
      items,
      activeIndex,
      mode = "left",
      orientation = "vertical",
      animated = true,
      children,
      className,
      style,
    },
    ref
  ) => {
    const normalizedItems = items ? [...items] : []
    if (pending) {
      normalizedItems.push({
        key: "__pending",
        pending: true,
        dot: pendingDot,
        content: pending,
      })
    }

    const itemsToRender = reverse ? normalizedItems.reverse() : normalizedItems
    const statuses = itemsToRender.map((item, index) =>
      getItemStatus(index, item, activeIndex)
    )

    return (
      <div
        ref={ref}
        role="list"
        aria-orientation={orientation}
        data-slot="timeline"
        data-orientation={orientation}
        data-mode={mode}
        className={cn(
          orientation === "horizontal" && "flex items-start gap-6",
          className
        )}
        style={style}
      >
        {itemsToRender.map((item, index) => {
          const placement = getPlacement(mode, index, item)
          const status = statuses[index]
          const nextStatus = statuses[index + 1]
          const connectorStatus = getConnectorStatus(status, nextStatus)
          const connector = index < itemsToRender.length - 1
          const key = item.key ?? index

          return (
            <TimelineMotion
              key={key}
              animated={animated}
              index={index}
              orientation={orientation}
              placement={placement}
            >
              {orientation === "horizontal" ? (
                <div
                  role="listitem"
                  aria-current={status === "active" ? "step" : undefined}
                  data-slot="timeline-item"
                  data-orientation="horizontal"
                  data-status={status}
                  className={cn("relative flex min-w-36 flex-1 flex-col gap-2 pb-0", item.className)}
                  style={{ "--timeline-dot-color": item.color, ...item.style } as React.CSSProperties}
                >
                  <div data-slot="timeline-axis" className="relative flex items-center">
                    <div
                      data-slot="timeline-dot"
                      data-status={status}
                      className={cn(
                        "z-10 flex size-3 items-center justify-center rounded-full text-background [&_svg]:size-3",
                        (item.dot || item.icon) && "size-5 bg-background text-foreground ring-1 ring-border",
                        getDotClassName(item, status)
                      )}
                    >
                      {item.icon ?? item.dot ?? null}
                    </div>
                    {connector ? (
                      <div
                        data-slot="timeline-connector"
                        data-status={connectorStatus}
                        className={cn("ml-2 h-0.5 flex-1", getConnectorClassName(connectorStatus))}
                      />
                    ) : null}
                  </div>
                  {item.time || item.label ? (
                    <div data-slot="timeline-label" className="text-xs text-muted-foreground">
                      {item.time ? <time data-slot="timeline-time">{item.time}</time> : item.label}
                    </div>
                  ) : null}
                  {item.title ? (
                    <div data-slot="timeline-title" className="text-sm font-medium">
                      {item.title}
                    </div>
                  ) : null}
                  {item.content ?? item.children ? (
                    <div data-slot="timeline-description" className="text-sm text-muted-foreground">
                      {item.content ?? item.children}
                    </div>
                  ) : null}
                </div>
              ) : (
                <TimelineItem
                  dot={item.dot}
                  icon={item.icon}
                  color={item.color}
                  label={item.label}
                  time={item.time}
                  title={item.title}
                  content={item.content}
                  placement={placement}
                  status={status}
                  pending={item.pending}
                  loading={item.loading}
                  connector={connector}
                  connectorStatus={connectorStatus}
                  className={item.className}
                  style={item.style}
                >
                  {item.children}
                </TimelineItem>
              )}
            </TimelineMotion>
          )
        })}
        {children}
      </div>
    )
  }
)

Timeline.displayName = "Timeline"
