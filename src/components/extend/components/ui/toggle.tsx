"use client"

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  Toggle as BaseToggle,
  toggleVariants,
  type ToggleProps as BaseToggleProps,
} from "@/components/ui/toggle"
import {
  ToggleGroup as BaseToggleGroup,
  ToggleGroupItem as BaseToggleGroupItem,
} from "@/components/ui/toggle-group"
import { cn } from "@/components/extend/lib/utils"

export { toggleVariants }

export function Toggle({
  className,
  ...props
}: BaseToggleProps): React.ReactElement {
  return (
    <BaseToggle
      className={cn(className)}
      data-slot="toggle"
      {...props}
    />
  )
}

export const toggleGroupVariants = cva("inline-flex w-fit", {
  defaultVariants: {
    orientation: "horizontal",
    spacing: "default",
  },
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    spacing: {
      default: "gap-1",
      none: "gap-0",
    },
  },
})

type ToggleGroupSingleProps = {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ToggleGroupMultipleProps = {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = Omit<
  React.ComponentProps<typeof BaseToggleGroup>,
  "type" | "value" | "defaultValue" | "onValueChange" | "direction"
> & {
  spacing?: VariantProps<typeof toggleGroupVariants>["spacing"]
} & (ToggleGroupSingleProps | ToggleGroupMultipleProps)

export function ToggleGroup({
  className,
  orientation = "horizontal",
  spacing,
  multiple,
  value,
  defaultValue,
  onValueChange,
  ...props
}: ToggleGroupProps): React.ReactElement {
  const resolvedSpacing = spacing ?? "default"
  const sharedProps = {
    className: cn(
      toggleGroupVariants({ orientation, spacing: resolvedSpacing }),
      className
    ),
    "data-orientation": orientation,
    "data-slot": "toggle-group",
    "data-spacing": resolvedSpacing,
    direction: orientation,
    orientation,
    ...props,
  }

  if (multiple) {
    return (
      <BaseToggleGroup
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        type="multiple"
        value={value}
        {...sharedProps}
      />
    )
  }

  return (
    <BaseToggleGroup
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      type="single"
      value={value}
      {...sharedProps}
    />
  )
}

export type ToggleGroupItemProps = React.ComponentProps<
  typeof BaseToggleGroupItem
>

export function ToggleGroupItem({
  className,
  ...props
}: ToggleGroupItemProps): React.ReactElement {
  return (
    <BaseToggleGroupItem
      className={cn(
        "in-data-[spacing=none]:rounded-none in-data-[spacing=none]:shadow-none in-data-[orientation=horizontal]:in-data-[spacing=none]:first:rounded-l-lg in-data-[orientation=horizontal]:in-data-[spacing=none]:last:rounded-r-lg in-data-[orientation=vertical]:in-data-[spacing=none]:first:rounded-t-lg in-data-[orientation=vertical]:in-data-[spacing=none]:last:rounded-b-lg",
        className
      )}
      data-slot="toggle-group-item"
      {...props}
    />
  )
}
