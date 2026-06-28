"use client"

import * as React from "react"
import { Star as StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type RateProps = {
  /** Current value (controlled). */
  value?: number
  /** Default value (uncontrolled). */
  defaultValue?: number
  /** Callback when value changes. */
  onChange?: (value: number) => void
  /** Number of stars. @default 5 */
  count?: number
  /** Whether to allow half-star selection. */
  allowHalf?: boolean
  /** Whether clicking the current value clears it. */
  allowClear?: boolean
  /** Whether the rate is disabled. */
  disabled?: boolean
  /** Custom star character render. */
  character?: React.ReactNode | ((props: { index: number; filled: boolean; half: boolean }) => React.ReactNode)
  /** Tooltip texts for each star. */
  tooltips?: string[]
  className?: string
  style?: React.CSSProperties
}

function Rate({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  count = 5,
  allowHalf,
  allowClear,
  disabled,
  character,
  tooltips,
  className,
  style,
}: RateProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const setValue = React.useCallback(
    (nextValue: number) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  const handleClick = (starIndex: number, half?: "left") => {
    if (disabled) return
    const nextValue = half ? starIndex + 0.5 : starIndex + 1
    if (allowClear && value === nextValue) {
      setValue(0)
    } else {
      setValue(nextValue)
    }
  }

  const activeValue = hoverValue ?? value

  const renderCharacter = (index: number) => {
    const filled = index < Math.floor(activeValue)
    const half = !filled && index === Math.floor(activeValue) && activeValue % 1 !== 0

    if (typeof character === "function") {
      return character({ index, filled, half })
    }

    return (
      <span className="relative inline-flex">
        <StarIcon
          className={cn(
            "size-4 transition-colors duration-150",
            (filled || half) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
            !disabled && "cursor-pointer",
          )}
        />
        {half && (
          <span className="absolute inset-0 overflow-hidden w-1/2">
            <StarIcon className="size-4 fill-amber-400 text-amber-400" />
          </span>
        )}
      </span>
    )
  }

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      style={style}
      role="radiogroup"
      aria-label="Rating"
      data-slot="rate"
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            disabled && "cursor-not-allowed opacity-50",
          )}
          disabled={disabled}
          onClick={(e) => {
            if (allowHalf) {
              const rect = e.currentTarget.getBoundingClientRect()
              const half = e.clientX - rect.left < rect.width / 2 ? "left" : undefined
              handleClick(i, half)
            } else {
              handleClick(i)
            }
          }}
          onMouseEnter={() => !disabled && setHoverValue(i + 1)}
          onMouseMove={(e) => {
            if (!disabled && allowHalf) {
              const rect = e.currentTarget.getBoundingClientRect()
              const half = e.clientX - rect.left < rect.width / 2 ? 0.5 : 1
              setHoverValue(i + half)
            }
          }}
          onMouseLeave={() => setHoverValue(null)}
          title={tooltips?.[i]}
        >
          {character ? renderCharacter(i) : renderCharacter(i)}
        </button>
      ))}
    </div>
  )
}

export { Rate }
export type { RateProps }
