import { Rate } from "@/components/base/rate"
import * as React from "react"

export default function SmartisanRateExample() {
  const [val, setVal] = React.useState(4)

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平评分星星 (Standard Flat Rate)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <Rate value={val} onChange={setVal} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化评分星星 (Smartisan Skeuomorphic Rate)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <Rate variant="skeuomorphic" value={val} onChange={setVal} />
        </div>
      </div>
    </div>
  )
}
