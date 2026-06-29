import { Switch } from "@/components/base/switch"
import * as React from "react"

export default function SmartisanSwitchExample() {
  const [checked, setChecked] = React.useState(true)

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平开关 (Standard Flat Switch)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Switch defaultChecked />
          <Switch size="small" defaultChecked />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化开关 (Smartisan Skeuomorphic Switch)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Switch variant="skeuomorphic" checked={checked} onCheckedChange={setChecked} />
          <Switch variant="skeuomorphic" size="small" checked={checked} onCheckedChange={setChecked} />
        </div>
      </div>
    </div>
  )
}
