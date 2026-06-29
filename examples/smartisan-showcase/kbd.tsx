import { Kbd, KbdGroup } from "@/components/base/kbd"
import * as React from "react"

export default function SmartisanKbdExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平键帽 (Standard Flat Kbd)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化键帽 (Smartisan Skeuomorphic Kbd)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <KbdGroup>
            <Kbd variant="skeuomorphic">⌘</Kbd>
            <Kbd variant="skeuomorphic">K</Kbd>
          </KbdGroup>
          <Kbd variant="skeuomorphic">Shift</Kbd>
          <Kbd variant="skeuomorphic">Enter ↵</Kbd>
        </div>
      </div>
    </div>
  )
}
