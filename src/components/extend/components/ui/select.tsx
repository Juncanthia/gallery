"use client"

import type * as React from "react"
import { ChevronDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  Select,
  SelectContent as BaseSelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel as BaseSelectGroupLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger as BaseSelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/components/extend/lib/utils"

export const selectTriggerVariants = cva(
  "relative inline-flex min-h-9 w-full min-w-36 items-center justify-between gap-2 rounded-lg border border-input bg-background px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 sm:min-h-8 sm:text-sm dark:bg-input/32 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "",
        lg: "min-h-10 sm:min-h-9",
        sm: "min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7",
      },
    },
  }
)

export const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4"

export interface SelectButtonProps extends React.ComponentProps<"button"> {
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  asChild?: boolean
}

export function SelectButton({
  className,
  size,
  asChild,
  children,
  type = "button",
  ...props
}: SelectButtonProps): React.ReactElement {
  void asChild

  return (
    <button
      className={cn(selectTriggerVariants({ size }), "min-w-0", className)}
      data-slot="select-button"
      type={type}
      {...props}
    >
      <span className="flex-1 truncate in-data-placeholder:text-muted-foreground/72">
        {children}
      </span>
      <HugeiconsIcon className={selectTriggerIconClassName} icon={ChevronDown} />
    </button>
  )
}

export function SelectTrigger({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof BaseSelectTrigger> & {
  size?: VariantProps<typeof selectTriggerVariants>["size"]
}): React.ReactElement {
  return (
    <BaseSelectTrigger
      className={cn(selectTriggerVariants({ size }), className)}
      data-slot="select-trigger"
      size={size}
      {...props}
    />
  )
}

export function SelectContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelectContent>): React.ReactElement {
  return (
    <BaseSelectContent
      className={cn("rounded-lg", className)}
      data-slot="select-popup"
      position="popper"
      {...props}
    />
  )
}

export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"label">): React.ReactElement {
  return (
    <label
      className={cn(
        "inline-flex cursor-default items-center gap-2 text-base/4.5 font-medium text-foreground not-in-data-[slot=field]:mb-2 sm:text-sm/4",
        className
      )}
      data-slot="select-label"
      {...props}
    />
  )
}

export function SelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelectGroupLabel>): React.ReactElement {
  return (
    <BaseSelectGroupLabel
      className={cn("px-2 py-1.5 text-xs font-medium", className)}
      data-slot="select-group-label"
      {...props}
    />
  )
}

export {
  Select,
  SelectContent as SelectPopup,
  SelectGroup,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectValue,
}
