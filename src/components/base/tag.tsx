"use client"

import * as React from "react"
import { X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TagColor = "default" | "blue" | "green" | "red" | "orange" | "purple" | "cyan" | "magenta"

type TagProps = {
  /** Tag color. @default "default" */
  color?: TagColor | string
  /** Whether to show a close button. */
  closable?: boolean
  /** Custom close icon. */
  closeIcon?: React.ReactNode
  /** Callback when close button is clicked. */
  onClose?: () => void
  /** Custom icon before the label. */
  icon?: React.ReactNode
  /** Whether to show border. @default true */
  bordered?: boolean
  /** Content (label text). */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const tagColorMap: Record<TagColor, string> = {
  default: "border-border/60 bg-muted/50 text-foreground",
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
  purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  magenta: "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300",
}

function resolveTagColor(color?: TagColor | string) {
  if (!color) return tagColorMap.default
  return tagColorMap[color as TagColor] ?? tagColorMap.default
}

function Tag({
  color = "default",
  closable,
  closeIcon,
  onClose,
  icon,
  bordered = true,
  children,
  className,
  style,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
        bordered ? "border" : "border-transparent",
        resolveTagColor(color),
        closable && "pr-1",
        className,
      )}
      style={style}
      data-slot="tag"
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {closable && (
        <span
          className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs opacity-60 transition-opacity hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          role="button"
          aria-label="Remove tag"
        >
          {closeIcon ?? <XIcon className="size-3" />}
        </span>
      )}
    </span>
  )
}

export { Tag }
export type { TagColor, TagProps }
