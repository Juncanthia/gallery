"use client"

import { Scroller } from "@/components/layout/scroller"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">基础滚动</span>
        <Scroller className="h-40 w-48 rounded-md border p-3">
          <div className="flex flex-col gap-2 pr-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                className="flex h-8 shrink-0 items-center rounded bg-muted px-2 text-xs"
                key={i}
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </Scroller>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">隐藏滚动条</span>
        <Scroller className="h-40 w-48 rounded-md border p-3" hideScrollbar>
          <div className="flex flex-col gap-2 pr-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                className="flex h-8 shrink-0 items-center rounded bg-muted px-2 text-xs"
                key={i}
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </Scroller>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">带导航按钮</span>
        <Scroller className="h-40 w-48 rounded-md border p-3" withNavigation>
          <div className="flex flex-col gap-2 pr-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                className="flex h-8 shrink-0 items-center rounded bg-muted px-2 text-xs"
                key={i}
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </Scroller>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">水平滚动</span>
        <Scroller
          className="h-fit w-64 rounded-md border p-3"
          orientation="horizontal"
        >
          <div className="flex gap-2">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                className="flex h-8 w-16 shrink-0 items-center justify-center rounded bg-muted text-xs"
                key={i}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Scroller>
      </div>
    </div>
  )
}
