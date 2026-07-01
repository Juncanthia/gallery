"use client"

import { Slider } from "@/components/ui/slider-dice"
import { useState } from "react"

export default function Demo() {
  const [value, setValue] = useState([50])

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number[])}
        max={100}
        step={1}
      />
      <p className="text-center text-sm text-muted-foreground">
        当前值：{value[0]}
      </p>
    </div>
  )
}
