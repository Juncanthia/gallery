"use client"

import { Checkbox } from "@/components/ui/dice-checkbox"
import { useState } from "react"

export default function Demo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
        id="demo-checkbox"
      />
      <label htmlFor="demo-checkbox" className="text-sm text-foreground">
        同意服务条款
      </label>
    </div>
  )
}
