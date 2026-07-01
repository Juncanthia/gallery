"use client"

import { ClientOnly } from "@/components/ui/client-only"

export default function Demo() {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        SSR 阶段显示 fallback，客户端渲染 children：
      </div>
      <ClientOnly fallback={<div className="text-sm text-muted-foreground animate-pulse">加载中...</div>}>
        <div className="rounded-md border bg-card px-4 py-3 text-sm text-foreground">
          客户端已就绪 — 此内容仅在浏览器端渲染
        </div>
      </ClientOnly>
    </div>
  )
}
