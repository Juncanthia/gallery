import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerBasicExample() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DatePicker value={date} onChange={setDate} placeholder="选择日期" />
      <DatePicker placeholder="禁用" disabled />
    </div>
  )
}
