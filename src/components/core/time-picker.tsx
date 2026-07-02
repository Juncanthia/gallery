"use client"

import {
  TimePicker as TimePickerBase,
  type TimePickerFormat,
  type TimePickerPeriod,
  type TimePickerProps,
  type TimePickerSegmentPlaceholder,
} from "@/components/blocks/time-picker"

function TimePicker(props: TimePickerProps) {
  return <TimePickerBase {...props} />
}

export { TimePicker }
export type {
  TimePickerFormat,
  TimePickerPeriod,
  TimePickerProps,
  TimePickerSegmentPlaceholder,
}
