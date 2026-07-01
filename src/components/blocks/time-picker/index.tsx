"use client"

import * as React from "react"
import { Clock, X } from "lucide-react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export type TimePickerFormat = "HH:mm:ss" | "HH:mm"
export type TimePickerPeriod = "AM" | "PM"

export type TimePickerSegmentPlaceholder =
  | string
  | {
      hour?: string
      minute?: string
      second?: string
      period?: string
    }

export type TimePickerProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  format?: TimePickerFormat
  use12Hours?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openOnFocus?: boolean
  name?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  placeholder?: string
  segmentPlaceholder?: TimePickerSegmentPlaceholder
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  allowClear?: boolean
  className?: string
  inputGroupClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

type ParsedTime = {
  hours: number
  minutes: number
  seconds: number
}

type TimeColumnProps = {
  label: string
  options: Array<number | TimePickerPeriod>
  value: number | TimePickerPeriod
  disabled?: boolean
  onChange: (value: number | TimePickerPeriod) => void
}

const PERIODS: TimePickerPeriod[] = ["AM", "PM"]

function padZero(value: number): string {
  return String(value).padStart(2, "0")
}

function normalizeStep(step: number | undefined): number {
  return Number.isInteger(step) && step > 0 ? step : 1
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function parseTime(value: string | undefined): ParsedTime {
  if (!value) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }

  const [rawHours, rawMinutes, rawSeconds] = value.split(":")
  const hours = clamp(Number.parseInt(rawHours ?? "0", 10) || 0, 0, 23)
  const minutes = clamp(Number.parseInt(rawMinutes ?? "0", 10) || 0, 0, 59)
  const seconds = clamp(Number.parseInt(rawSeconds ?? "0", 10) || 0, 0, 59)

  return { hours, minutes, seconds }
}

function formatTime(
  hours: number,
  minutes: number,
  seconds: number,
  format: TimePickerFormat
): string {
  const base = `${padZero(hours)}:${padZero(minutes)}`
  return format === "HH:mm:ss" ? `${base}:${padZero(seconds)}` : base
}

function to12Hour(hours: number): { hour: number; period: TimePickerPeriod } {
  return {
    hour: hours % 12 || 12,
    period: hours >= 12 ? "PM" : "AM",
  }
}

function to24Hour(hour: number, period: TimePickerPeriod): number {
  if (hour === 12) {
    return period === "AM" ? 0 : 12
  }

  return period === "PM" ? hour + 12 : hour
}

function getSegmentPlaceholder(
  placeholder: TimePickerSegmentPlaceholder | undefined,
  segment: "hour" | "minute" | "second" | "period"
): string {
  if (!placeholder) return segment === "period" ? "--" : "--"
  if (typeof placeholder === "string") return placeholder
  return placeholder[segment] ?? (segment === "period" ? "--" : "--")
}

function buildNumberOptions(max: number, step: number, start = 0): number[] {
  const values: number[] = []
  for (let value = start; value <= max; value += step) {
    values.push(value)
  }
  return values
}

function TimeColumn({
  label,
  options,
  value,
  disabled = false,
  onChange,
}: TimeColumnProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const selectedItem = scrollRef.current?.querySelector(
      '[data-selected="true"]'
    )
    selectedItem?.scrollIntoView({ behavior: "auto", block: "center" })
  }, [value])

  return (
    <div data-slot="time-picker-column" className="flex flex-1 flex-col items-center">
      <div className="mb-2 text-xs text-muted-foreground">{label}</div>
      <ScrollArea className="h-48 w-full">
        <div ref={scrollRef} className="flex flex-col divide-y">
          {options.map((option, index) => {
            const selected = option === value
            const label = typeof option === "number" ? padZero(option) : option

            return (
              <button
                key={String(option)}
                type="button"
                data-slot="time-picker-option"
                data-selected={selected || undefined}
                aria-selected={selected}
                disabled={disabled}
                onClick={() => onChange(option)}
                onKeyDown={(event) => {
                  if (disabled) return
                  const targetIndex =
                    event.key === "ArrowDown"
                      ? Math.min(index + 1, options.length - 1)
                      : event.key === "ArrowUp"
                        ? Math.max(index - 1, 0)
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? options.length - 1
                            : -1

                  if (targetIndex === -1) return
                  event.preventDefault()
                  onChange(options[targetIndex])
                }}
                className={cn(
                  "py-2 text-center text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  selected && "bg-primary/10 font-medium text-primary"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  format = "HH:mm:ss",
  use12Hours = false,
  open,
  defaultOpen = false,
  onOpenChange,
  openOnFocus = false,
  name,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  placeholder = "选择时间",
  segmentPlaceholder,
  hourStep,
  minuteStep,
  secondStep,
  allowClear = true,
  className,
  inputGroupClassName,
  triggerClassName,
  contentClassName,
}: TimePickerProps) {
  const [internalValue = "", setInternalValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue ?? "",
    onChange,
  })
  const [internalOpen = false, setInternalOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  const parsed = React.useMemo(() => parseTime(internalValue), [internalValue])
  const { hour: displayHour, period } = to12Hour(parsed.hours)
  const showSeconds = format === "HH:mm:ss"
  const interactiveDisabled = disabled || readOnly
  const selectedValue = internalValue
    ? formatTime(parsed.hours, parsed.minutes, parsed.seconds, format)
    : ""

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (interactiveDisabled && nextOpen) return
      setInternalOpen(nextOpen)
    },
    [interactiveDisabled, setInternalOpen]
  )

  const commitValue = React.useCallback(
    (next: ParsedTime) => {
      if (interactiveDisabled) return
      setInternalValue(formatTime(next.hours, next.minutes, next.seconds, format))
    },
    [format, interactiveDisabled, setInternalValue]
  )

  const clearValue = React.useCallback(() => {
    if (interactiveDisabled) return
    setInternalValue("")
    setInternalOpen(false)
  }, [interactiveDisabled, setInternalOpen, setInternalValue])

  const displayValue = selectedValue || placeholder
  const previewValue = selectedValue
    ? use12Hours
      ? `${padZero(displayHour)}:${padZero(parsed.minutes)}${
          showSeconds ? `:${padZero(parsed.seconds)}` : ""
        } ${period}`
      : selectedValue
    : `${getSegmentPlaceholder(segmentPlaceholder, "hour")}:${getSegmentPlaceholder(
        segmentPlaceholder,
        "minute"
      )}${showSeconds ? `:${getSegmentPlaceholder(segmentPlaceholder, "second")}` : ""}${
        use12Hours ? ` ${getSegmentPlaceholder(segmentPlaceholder, "period")}` : ""
      }`

  const hoursOptions = use12Hours
    ? buildNumberOptions(12, normalizeStep(hourStep), 1)
    : buildNumberOptions(23, normalizeStep(hourStep))
  const minuteOptions = buildNumberOptions(59, normalizeStep(minuteStep))
  const secondOptions = buildNumberOptions(59, normalizeStep(secondStep))

  return (
    <div
      data-slot="time-picker"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={invalid || undefined}
      className={cn("relative", className)}
    >
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
          disabled={disabled}
        />
      ) : null}
      <Popover open={internalOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outlined"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-required={required || undefined}
            className={cn(
              "w-full justify-start gap-2",
              allowClear && selectedValue && !interactiveDisabled && "pr-8",
              inputGroupClassName,
              triggerClassName
            )}
            onFocus={() => {
              if (openOnFocus) setOpen(true)
            }}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Clock size={16} />
              <span
                data-slot="time-picker-value"
                className={cn(
                  "truncate font-normal",
                  !selectedValue && "text-muted-foreground"
                )}
              >
                {displayValue}
              </span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          data-slot="time-picker-content"
          className={cn("w-80 p-4", contentClassName)}
          align="start"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div
                data-slot="time-picker-preview"
                className={cn(
                  "font-mono text-2xl font-semibold",
                  !selectedValue && "text-muted-foreground"
                )}
              >
                {previewValue}
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <TimeColumn
                label="时"
                options={hoursOptions}
                value={use12Hours ? displayHour : parsed.hours}
                disabled={interactiveDisabled}
                onChange={(nextHour) => {
                  const hours = use12Hours
                    ? to24Hour(nextHour as number, period)
                    : (nextHour as number)
                  commitValue({ ...parsed, hours })
                }}
              />
              <TimeColumn
                label="分"
                options={minuteOptions}
                value={parsed.minutes}
                disabled={interactiveDisabled}
                onChange={(minutes) => {
                  commitValue({ ...parsed, minutes: minutes as number })
                }}
              />
              {showSeconds ? (
                <TimeColumn
                  label="秒"
                  options={secondOptions}
                  value={parsed.seconds}
                  disabled={interactiveDisabled}
                  onChange={(seconds) => {
                    commitValue({ ...parsed, seconds: seconds as number })
                  }}
                />
              ) : null}
              {use12Hours ? (
                <TimeColumn
                  label="时段"
                  options={PERIODS}
                  value={period}
                  disabled={interactiveDisabled}
                  onChange={(nextPeriod) => {
                    commitValue({
                      ...parsed,
                      hours: to24Hour(displayHour, nextPeriod as TimePickerPeriod),
                    })
                  }}
                />
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {allowClear && selectedValue && !interactiveDisabled ? (
        <button
          type="button"
          data-slot="time-picker-clear"
          aria-label="清空时间"
          className="absolute right-2 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={clearValue}
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  )
}
