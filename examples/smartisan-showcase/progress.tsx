import { Progress } from "@/components/base/progress"
import * as React from "react"

export default function SmartisanProgressExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平进度条 (Standard Flat Progress)
        </h4>
        <div className="space-y-4 max-w-md">
          <Progress percent={45} />
          <Progress percent={80} status="success" />
          <Progress percent={30} status="exception" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化进度条 (Smartisan Skeuomorphic Progress)
        </h4>
        <div className="space-y-4 max-w-md">
          <Progress variant="skeuomorphic" percent={45} />
          <Progress variant="skeuomorphic" percent={80} status="success" />
          <Progress variant="skeuomorphic" percent={30} status="exception" />
        </div>
      </div>
    </div>
  )
}
