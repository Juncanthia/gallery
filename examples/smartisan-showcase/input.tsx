import { Input } from "@/components/base/input"
import * as React from "react"

export default function SmartisanInputExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平输入框 (Standard Flat Input)
        </h4>
        <div className="space-y-4 max-w-md">
          <Input placeholder="请输入用户名..." />
          <Input.TextArea placeholder="请输入详细描述..." />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化输入框 (Smartisan Skeuomorphic Input)
        </h4>
        <div className="space-y-4 max-w-md">
          <Input variant="skeuomorphic" placeholder="请输入用户名 (内阴影与雕刻质感)..." />
          <Input.TextArea variant="skeuomorphic" placeholder="请输入详细描述 (内阴影与雕刻质感)..." />
        </div>
      </div>
    </div>
  )
}
