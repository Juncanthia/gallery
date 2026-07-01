import { useState } from "react"

import { LegacySlider } from "@/components/ui/slider-sabraman"

export default function Demo() {
  const [value, setValue] = useState(50)

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex w-full max-w-xs items-center gap-3">
        <span className="text-sm text-muted-foreground tabular-nums w-8 text-right">
          {value}
        </span>
        <LegacySlider
          max={100}
          min={0}
          onValueChange={setValue}
          value={value}
        />
      </div>
      <LegacySlider defaultValue={30} max={100} min={0} />
      <LegacySlider defaultValue={20} max={50} min={10} />
    </div>
  )
}
