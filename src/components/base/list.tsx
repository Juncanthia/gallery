"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Spin } from "@/components/base/spin"
import { Empty } from "@/components/base/empty-state"

type ListSize = "small" | "default" | "large"

type ListProps<T = unknown> = {
  /** Data source array. */
  dataSource?: T[]
  /** Render function for each item. */
  renderItem?: (item: T, index: number) => React.ReactNode
  /** Header content rendered above the list. */
  header?: React.ReactNode
  /** Footer content rendered below the list. */
  footer?: React.ReactNode
  /** Whether each item has a bottom border. @default true */
  split?: boolean
  /** Whether the list has an outer border. @default false */
  bordered?: boolean
  /** List size. @default "default" */
  size?: ListSize
  /** Whether the list is loading. Shows Spin overlay. */
  loading?: boolean
  /** Text shown when dataSource is empty. */
  emptyText?: React.ReactNode
  /** Children (alternative to dataSource+renderItem). */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const sizeMap: Record<ListSize, string> = {
  small: "px-3 py-2",
  default: "px-4 py-3",
  large: "px-4 py-4",
}

function List<T>({
  dataSource,
  renderItem,
  header,
  footer,
  split = true,
  bordered = false,
  size = "default",
  loading = false,
  emptyText,
  children,
  className,
  style,
}: ListProps<T>) {
  const items = children ?? dataSource?.map((item, index) => renderItem?.(item, index))

  const isEmpty = !items || (Array.isArray(items) && items.length === 0)

  return (
    <Spin spinning={loading}>
      <div
        className={cn(
          "flex flex-col",
          bordered && "rounded border",
          className,
        )}
        style={style}
        data-slot="list"
      >
        {header && (
          <div className={cn("border-b px-4 py-2 text-sm font-medium", sizeMap[size])}>
            {header}
          </div>
        )}
        <div className="flex flex-col">
          {isEmpty && emptyText ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : isEmpty ? (
            <Empty simple className="py-6" />
          ) : (
            <div className="flex flex-col">
              {Array.isArray(items) &&
                items.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      sizeMap[size],
                      split && index < items.length - 1 && "border-b",
                    )}
                  >
                    {item}
                  </div>
                ))}
              {!Array.isArray(items) && items}
            </div>
          )}
        </div>
        {footer && (
          <div className={cn("border-t px-4 py-2 text-sm", sizeMap[size])}>
            {footer}
          </div>
        )}
      </div>
    </Spin>
  )
}

export { List }
export type { ListProps, ListSize }
