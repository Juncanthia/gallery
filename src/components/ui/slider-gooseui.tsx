"use client"

import * as React from "react"

import {
  Slider as BaseSlider,
  type SliderProps as BaseSliderProps,
} from "@/components/ui/slider"

type GooseuiSliderProps = Omit<
  BaseSliderProps,
  | "defaultValue"
  | "formatValue"
  | "onChange"
  | "onChangeComplete"
  | "onValueChange"
  | "range"
  | "size"
  | "value"
  | "valueFormatter"
> & {
  defaultValue?: number
  formatValue?: (value: number) => React.ReactNode
  onChangeComplete?: (value: number) => void
  onValueChange?: (value: number) => void
  size?: "sm" | "md" | "lg"
  value?: number
}

function Slider({
  defaultValue = 50,
  formatValue,
  onValueChange,
  size = "md",
  value,
  ...props
}: GooseuiSliderProps): React.ReactElement {
  return (
    <BaseSlider
      defaultValue={defaultValue}
      formatValue={formatValue}
      onChange={onValueChange}
      range={false}
      size={size}
      value={value}
      {...props}
    />
  )
}

export { Slider, type GooseuiSliderProps }
