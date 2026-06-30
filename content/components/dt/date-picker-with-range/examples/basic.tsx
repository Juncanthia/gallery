"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/ui/dt-date-picker-with-range"

export default function Demo() {
  const [date, setDate] = useState<DateRange | undefined>(undefined)

  return (
    <div className="w-full max-w-sm">
      <DatePickerWithRange date={date} setDate={setDate} />
    </div>
  )
}
