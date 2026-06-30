"use client"

import {
  TimePicker as TimePickerBase,
  type TimePickerProps,
} from "@/components/blocks/time-picker"

function TimePicker(props: TimePickerProps) {
  return <TimePickerBase {...props} />
}

export { TimePicker }
export type { TimePickerProps }
