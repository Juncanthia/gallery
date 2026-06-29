import { Slider } from "@/components/base/slider"
import * as React from "react"

export default function SmartisanSliderExample() {
  const [val, setVal] = React.useState(35)

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平滑动条 (Standard Flat Slider)
        </h4>
        <div className="max-w-md">
          <Slider value={val} onChange={setVal} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化滑动条 (Smartisan Skeuomorphic Slider)
        </h4>
        <div className="max-w-md">
          <Slider variant="skeuomorphic" value={val} onChange={setVal} />
        </div>
      </div>
    </div>
  )
}
