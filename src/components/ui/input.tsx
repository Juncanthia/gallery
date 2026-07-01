import * as React from "react"

import { cn } from "@/lib/utils"

type InputSize = "sm" | "small" | "default" | "middle" | "lg" | "large"

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: InputSize | number
  nativeInput?: boolean
  unstyled?: boolean
}

function Input({
  className,
  type,
  size,
  nativeInput,
  unstyled,
  ...props
}: InputProps) {
  void nativeInput
  void unstyled
  const stringSize = typeof size === "string" ? size : undefined

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        (stringSize === "sm" || stringSize === "small") && "h-8 px-2 text-sm",
        (stringSize === "lg" || stringSize === "large") && "h-10 px-3",
        className
      )}
      size={typeof size === "number" ? size : undefined}
      {...props}
    />
  )
}

export { Input }
export type { InputProps, InputSize }
