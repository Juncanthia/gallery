import { Badge } from "@/components/base/badge"
import * as React from "react"

export default function SmartisanBadgeExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平徽标 (Standard Flat Badge)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Badge count={5}>
            <div className="size-10 rounded bg-muted border" />
          </Badge>
          <Badge dot>
            <div className="size-10 rounded bg-muted border" />
          </Badge>
          <Badge status="success" text="在线" />
          <Badge status="processing" text="运行中" />
          <Badge status="error" text="错误" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化徽标 (Smartisan Skeuomorphic Badge)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Badge variant="skeuomorphic" count={5}>
            <div className="size-10 rounded bg-muted border border-neutral-300 dark:border-zinc-700" />
          </Badge>
          <Badge variant="skeuomorphic" dot>
            <div className="size-10 rounded bg-muted border border-neutral-300 dark:border-zinc-700" />
          </Badge>
          <Badge variant="skeuomorphic" status="success" text="在线 (LED指示灯)" />
          <Badge variant="skeuomorphic" status="processing" text="运行中 (LED呼吸灯)" />
          <Badge variant="skeuomorphic" status="error" text="错误 (LED指示灯)" />
        </div>
      </div>
    </div>
  )
}
