"use client"

import * as React from "react"
import { cn } from "@/_internals/foundations/utils/cn"

type AnchorLink = {
  key: string
  href: string
  title: React.ReactNode
}

type AnchorProps = {
  /** Navigation items. */
  items: AnchorLink[]
  /** Currently active anchor key (controlled). */
  activeKey?: string
  /** Default active anchor key. */
  defaultActiveKey?: string
  /** Callback when active anchor changes. */
  onChange?: (key: string) => void
  /** Whether to show ink ball indicator. @default true */
  showInk?: boolean
  /** Offset from top when scrolling. @default 0 */
  offsetTop?: number
  className?: string
}

function Anchor({
  items,
  activeKey: controlledKey,
  defaultActiveKey,
  onChange,
  showInk = true,
  offsetTop = 0,
  className,
}: AnchorProps) {
  const isControlled = controlledKey !== undefined
  const [internalKey, setInternalKey] = React.useState(defaultActiveKey ?? "")
  const activeKey = isControlled ? controlledKey : internalKey

  const scrollTo = React.useCallback(
    (href: string, key: string) => {
      if (!isControlled) setInternalKey(key)
      onChange?.(key)
      const el = document.querySelector(href)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offsetTop
        window.scrollTo({ top, behavior: "smooth" })
      }
    },
    [isControlled, onChange, offsetTop],
  )

  return (
    <div className={cn("flex flex-col gap-0.5", className)} data-slot="anchor">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={cn(
            "relative flex items-center gap-2 py-1 pr-3 pl-3 text-left text-sm transition-colors",
            "hover:text-foreground",
            activeKey === item.key
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => scrollTo(item.href, item.key)}
        >
          {showInk && activeKey === item.key && (
            <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
          )}
          {item.title}
        </button>
      ))}
    </div>
  )
}

export { Anchor }
export type { AnchorLink, AnchorProps }
