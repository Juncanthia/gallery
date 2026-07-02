import * as React from "react"

import { Separator } from "@/components/core/separator"
import { cn } from "@/kit/utils"
import {
  TableOfContentsHeader,
  TableOfContentsList,
  TableOfContentsRoot,
} from "./table-of-contents-core"
import {
  type TableOfContentsItem as TocItem,
  useScrollSpy,
} from "./use-table-of-contents"

type DocTableOfContentsProps = {
  items: TocItem[]
  title?: string
  className?: string
  mobile?: boolean
}

export function DocTableOfContents({
  items,
  title = "On this page",
  className,
  mobile = false,
}: DocTableOfContentsProps) {
  const ids = React.useMemo(() => items.map((item) => item.id), [items])
  const activeId = useScrollSpy(ids, { rootMargin: "80px 0px -80% 0px" })
  const [open, setOpen] = React.useState(false)

  if (items.length === 0) {
    return null
  }

  if (mobile) {
    return (
      <div
        className={cn(
          "not-prose rounded border border-border/60 bg-background/90 text-sm",
          className
        )}
      >
        <button
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between px-3 text-left font-medium text-foreground"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span>本页目录</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {items.length}
          </span>
        </button>

        {open ? (
          <TableOfContentsRoot
            activeId={activeId}
            className="px-3 pb-3"
            items={items}
            onItemClick={() => setOpen(false)}
          >
            <Separator className="mb-3 opacity-30" />
            <div className="scrollbar-mini max-h-64 overflow-y-auto pr-1">
              <TableOfContentsList />
            </div>
          </TableOfContentsRoot>
        ) : null}
      </div>
    )
  }

  return (
    <TableOfContentsRoot
      activeId={activeId}
      className={cn("text-sm", className)}
      items={items}
    >
      <div className="relative pl-1">
        <TableOfContentsHeader title={title} />
        <Separator className="mb-3 opacity-30" />
        <TableOfContentsList />
      </div>
    </TableOfContentsRoot>
  )
}

export type { TocItem }
