import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

type CheckboxSize = "sm" | "default" | "lg"
type CheckboxIntent = "default" | "destructive" | "success"

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  intent?: CheckboxIntent
  label?: React.ReactNode
  size?: CheckboxSize
  variant?: CheckboxIntent
}

const checkboxSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-3.5 [&_[data-slot=checkbox-indicator]>svg]:size-3",
  default: "size-4 [&_[data-slot=checkbox-indicator]>svg]:size-3.5",
  lg: "size-5 [&_[data-slot=checkbox-indicator]>svg]:size-4",
}

const checkboxIntentClasses: Record<CheckboxIntent, string> = {
  default: "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
  destructive: "data-checked:border-destructive data-checked:bg-destructive data-checked:text-destructive-foreground dark:data-checked:bg-destructive",
  success: "data-checked:border-green-600 data-checked:bg-green-600 data-checked:text-white dark:data-checked:border-green-500 dark:data-checked:bg-green-500",
}

function Checkbox({
  className,
  id,
  intent,
  label,
  size = "default",
  variant,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? (label ? generatedId : undefined)
  const mergedIntent = intent ?? variant ?? "default"
  const checkbox = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      data-slot="checkbox"
      data-size={size}
      data-intent={mergedIntent}
      className={cn(
        "peer relative flex shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        checkboxSizeClasses[size],
        checkboxIntentClasses[mergedIntent],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) {
    return checkbox
  }

  return (
    <label
      htmlFor={checkboxId}
      data-slot="checkbox-label"
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2 text-sm text-foreground has-disabled:cursor-not-allowed has-disabled:opacity-50",
        props.disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {checkbox}
      <span>{label}</span>
    </label>
  )
}

export { Checkbox, type CheckboxIntent, type CheckboxProps, type CheckboxSize }
