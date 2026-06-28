"use client"

import {
  TimePicker as TimePickerBase,
  type TimePickerProps,
} from "@/components/composite/time-picker"

function TimePicker(props: TimePickerProps) {
  return <TimePickerBase {...props} />
}

export { TimePicker }
export type { TimePickerProps }
