import { useState } from "react"
import { Rate } from "@/components/core/rate"

export default function RateBasicExample() {
  const [value, setValue] = useState(3)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Rate value={value} onChange={setValue} />
      <Rate defaultValue={2.5} allowHalf />
      <Rate defaultValue={4} disabled />
    </div>
  )
}
