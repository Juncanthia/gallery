import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export default function SliderBasicExample() {
  const [value, setValue] = useState(30)

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">基础: {value}</p>
        <Slider value={value} onChange={setValue} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">范围</p>
        <Slider range defaultValue={[20, 60]} />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">刻度标记</p>
        <Slider marks={{ 0: "0", 25: "25", 50: "50", 75: "75", 100: "100" }} defaultValue={40} />
      </div>
    </div>
  )
}
