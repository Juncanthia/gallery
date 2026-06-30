"use client"

import { Switch } from "@/components/ui/dice-switch"
import { useState } from "react"

export default function Demo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm text-muted-foreground">
          {checked ? "开" : "关"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <span className="text-sm text-muted-foreground">默认开启</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled />
        <span className="text-sm text-muted-foreground">禁用</span>
      </div>
    </div>
  )
}
