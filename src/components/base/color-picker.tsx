"use client"

import {
  ColorPicker as ColorPickerBase,
  type ColorPickerProps,
} from "@/components/composite/color-picker"

function ColorPicker(props: ColorPickerProps) {
  return <ColorPickerBase {...props} />
}

export { ColorPicker }
export type { ColorPickerProps }
