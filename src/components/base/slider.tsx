"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/tooltip"
import { cn } from "@/lib/utils"

type SliderPrimitiveProps = React.ComponentProps<typeof SliderPrimitive.Root>

type SliderValue = number | number[]

type SliderMark =
  | React.ReactNode
  | {
      label: React.ReactNode
      className?: string
      style?: React.CSSProperties
    }

type SliderTooltip =
  | false
  | {
      open?: boolean
      formatter?: (value: number) => React.ReactNode
    }

type SliderSharedProps = Omit<
  SliderPrimitiveProps,
  | "className"
  | "defaultValue"
  | "inverted"
  | "onChange"
  | "onValueChange"
  | "onValueCommit"
  | "orientation"
  | "value"
> & {
  className?: string
  included?: boolean
  marks?: Record<number, SliderMark>
  reverse?: boolean
  tooltip?: SliderTooltip
  vertical?: boolean
}

type SliderSingleProps = SliderSharedProps & {
  defaultValue?: number
  onChange?: (value: number) => void
  onChangeComplete?: (value: number) => void
  range?: false
  value?: number
}

type SliderRangeProps = SliderSharedProps & {
  defaultValue?: number[]
  onChange?: (value: number[]) => void
  onChangeComplete?: (value: number[]) => void
  range: true
  value?: number[]
}

type SliderProps = SliderSingleProps | SliderRangeProps

function normalizeValue(
  value: SliderValue | undefined,
  range: boolean,
  min: number,
  max: number
) {
  if (Array.isArray(value)) {
    return range ? value : [value[0] ?? min]
  }

  if (typeof value === "number") {
    return range ? [min, value] : [value]
  }

  return range ? [min, max] : [min]
}

function formatValue(values: number[], range: boolean): SliderValue {
  return range ? values : (values[0] ?? 0)
}

function getMarkLabel(mark: SliderMark) {
  if (
    mark &&
    typeof mark === "object" &&
    !React.isValidElement(mark) &&
    "label" in mark
  ) {
    return mark.label
  }

  return mark
}

function getMarkClassName(mark: SliderMark) {
  if (
    mark &&
    typeof mark === "object" &&
    !React.isValidElement(mark) &&
    "className" in mark
  ) {
    return mark.className
  }

  return undefined
}

function getMarkStyle(mark: SliderMark) {
  if (
    mark &&
    typeof mark === "object" &&
    !React.isValidElement(mark) &&
    "style" in mark
  ) {
    return mark.style
  }

  return undefined
}

function getMarkPercent(value: number, min: number, max: number, reverse: boolean) {
  if (max === min) {
    return 0
  }

  const percent = ((value - min) / (max - min)) * 100
  return reverse ? 100 - percent : percent
}

function Slider({
  className,
  defaultValue,
  disabled,
  included = true,
  marks,
  max = 100,
  min = 0,
  onChange,
  onChangeComplete,
  range = false,
  reverse = false,
  tooltip,
  value,
  vertical = false,
  ...props
}: SliderProps) {
  const initialValues = React.useMemo(
    () => normalizeValue(defaultValue, range, min, max),
    [defaultValue, max, min, range]
  )
  const controlledValues = React.useMemo(
    () => normalizeValue(value, range, min, max),
    [max, min, range, value]
  )
  const [innerValues, setInnerValues] = React.useState(initialValues)
  const mergedValues = value === undefined ? innerValues : controlledValues
  const tooltipConfig = typeof tooltip === "object" ? tooltip : undefined
  const showTooltip = tooltip !== false
  const tooltipFormatter = tooltipConfig?.formatter
  const tooltipOpen = tooltipConfig?.open
  const markEntries = React.useMemo(
    () =>
      Object.entries(marks ?? {})
        .map(([markValue, mark]) => [Number(markValue), mark] as const)
        .filter(([markValue]) => Number.isFinite(markValue) && markValue >= min && markValue <= max)
        .sort(([a], [b]) => a - b),
    [marks, max, min]
  )

  const emitChange = onChange as ((value: SliderValue) => void) | undefined
  const emitChangeComplete = onChangeComplete as
    | ((value: SliderValue) => void)
    | undefined

  const handleValueChange = React.useCallback(
    (nextValues: number[]) => {
      if (value === undefined) {
        setInnerValues(nextValues)
      }

      emitChange?.(formatValue(nextValues, range))
    },
    [emitChange, range, value]
  )

  const handleValueCommit = React.useCallback(
    (nextValues: number[]) => {
      emitChangeComplete?.(formatValue(nextValues, range))
    },
    [emitChangeComplete, range]
  )

  return (
    <div
      data-slot="slider-wrapper"
      className={cn(
        "relative w-full",
        markEntries.length > 0 && !vertical && "pb-6",
        vertical && "flex h-full min-h-40 w-fit items-center",
        vertical && markEntries.length > 0 && "pl-12",
        className
      )}
    >
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={value === undefined ? initialValues : undefined}
        disabled={disabled}
        inverted={reverse}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        orientation={vertical ? "vertical" : "horizontal"}
        value={value === undefined ? undefined : controlledValues}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col"
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "absolute select-none data-horizontal:h-full data-vertical:w-full",
              included ? "bg-primary" : "bg-transparent"
            )}
          />
        </SliderPrimitive.Track>
        <TooltipProvider delayDuration={0}>
          {mergedValues.map((thumbValue, index) => {
            const thumb = (
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                key={index}
                className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              />
            )

            if (!showTooltip) {
              return thumb
            }

            return (
              <Tooltip key={index} open={tooltipOpen}>
                <TooltipTrigger asChild>{thumb}</TooltipTrigger>
                <TooltipContent side={vertical ? "right" : "top"}>
                  {tooltipFormatter ? tooltipFormatter(thumbValue) : thumbValue}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </SliderPrimitive.Root>

      {markEntries.length > 0 && (
        <div
          data-slot="slider-marks"
          className={cn(
            "pointer-events-none absolute text-xs text-muted-foreground",
            vertical ? "inset-y-0 left-0 w-10" : "inset-x-0 bottom-0 h-4"
          )}
        >
          {markEntries.map(([markValue, mark]) => {
            const percent = getMarkPercent(markValue, min, max, reverse)
            const markStyle = getMarkStyle(mark)

            return (
              <span
                data-slot="slider-mark"
                key={markValue}
                className={cn(
                  "absolute whitespace-nowrap",
                  vertical ? "right-0 translate-y-1/2" : "top-0 -translate-x-1/2",
                  getMarkClassName(mark)
                )}
                style={{
                  ...(vertical ? { bottom: `${percent}%` } : { left: `${percent}%` }),
                  ...markStyle,
                }}
              >
                {getMarkLabel(mark)}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { Slider, type SliderMark, type SliderProps, type SliderTooltip, type SliderValue }
