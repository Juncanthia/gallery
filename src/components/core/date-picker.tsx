"use client"

import * as React from "react"
import { format as formatDate } from "date-fns"
import { Calendar as CalendarIcon, X as XIcon } from "lucide-react"
import { cn } from "@/_internals/foundations/utils/cn"
import { Calendar } from "@/components/core/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/core/popover"
import {
  selectTriggerVariants,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
} from "@/components/core/variants/select-variants"

type DatePickerProps = {
  /** Controlled value. */
  value?: Date
  /** Default value (uncontrolled). */
  defaultValue?: Date
  /** Callback when date changes. */
  onChange?: (date: Date | undefined) => void
  /** Display format (date-fns format string). @default "yyyy-MM-dd" */
  format?: string
  /** Placeholder text. @default "Select date" */
  placeholder?: string
  /** Whether to show a clear button. @default true */
  allowClear?: boolean
  /** Whether the picker is disabled. */
  disabled?: boolean
  /** Disable specific dates. */
  disabledDate?: (date: Date) => boolean
  /** Visual variant. @default "outlined" */
  variant?: SelectVariant
  /** Size. @default "middle" */
  size?: SelectSize
  /** Validation status. */
  status?: SelectStatus
  /** Callback when the popup opens or closes. */
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

function DatePicker(props: DatePickerProps) {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    format: dateFormat = "yyyy-MM-dd",
    placeholder = "Select date",
    allowClear = true,
    disabled,
    disabledDate,
    variant = "outlined",
    size = "middle",
    status,
    onOpenChange,
    className,
    style,
  } = props
  const isControlled = "value" in props
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue)
  const value = isControlled ? controlledValue : internalValue
  const [open, setOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (date: Date) => {
      if (!isControlled) {
        setInternalValue(date)
      }
      onChange?.(date)
      setOpen(false)
    },
    [isControlled, onChange],
  )

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isControlled) {
      setInternalValue(undefined)
    }
    onChange?.(undefined)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return
    setOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  const displayText = value ? formatDate(value, dateFormat) : placeholder
  const canClear = allowClear && value && !disabled

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            selectTriggerVariants({ variant, size, status: status ?? "default" }),
            "justify-start gap-2 text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
          style={style}
          disabled={disabled}
          data-slot="date-picker-trigger"
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{displayText}</span>
          {canClear && (
            <span
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 hover:opacity-100"
              onClick={handleClear}
              role="button"
              aria-label="Clear date"
            >
              <XIcon className="size-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent sideOffset={4} className="p-0">
        <div className="p-1">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => date && handleSelect(date)}
            disabled={disabledDate}
            className="p-0"
          />
          {value && (
            <div className="border-t px-3 py-2">
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => {
                  if (!isControlled) setInternalValue(undefined)
                  onChange?.(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
export type { DatePickerProps }
