"use client"

import * as React from "react"
import { Loader2 as SpinnerIcon } from "lucide-react"
import { cn } from "@/_internals/foundations/utils/cn"

type SpinSize = "small" | "default" | "large"

type SpinProps = {
  /** Whether to show the spinner. @default true */
  spinning?: boolean
  /** Spinner size. @default "default" */
  size?: SpinSize
  /** Loading tip text. */
  tip?: React.ReactNode
  /** Custom spinner indicator. */
  indicator?: React.ReactNode
  /** Delay in ms before showing the spinner. */
  delay?: number
  /** Content to wrap. When provided, shows an overlay. */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const sizeMap: Record<SpinSize, string> = {
  small: "size-4",
  default: "size-6",
  large: "size-8",
}

function Spin({
  spinning = true,
  size = "default",
  tip,
  indicator,
  delay,
  children,
  className,
  style,
}: SpinProps) {
  const shouldDelay = delay && delay > 0
  const [showSpinner, setShowSpinner] = React.useState(!shouldDelay)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (!shouldDelay) return
    timerRef.current = setTimeout(() => setShowSpinner(true), delay)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [shouldDelay, delay])

  if (!spinning || !showSpinner) {
    return <>{children}</>
  }

  const spinner = indicator ?? (
    <SpinnerIcon className={cn(sizeMap[size], "animate-spin text-primary")} />
  )

  const spinnerElement = (
    <div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      style={style}
      data-slot="spin"
    >
      {spinner}
      {tip && <div className="text-sm text-muted-foreground">{tip}</div>}
    </div>
  )

  if (!children) {
    return spinnerElement
  }

  return (
    <div className="relative inline-block">
      <div className={cn("opacity-40 pointer-events-none select-none")}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {spinnerElement}
      </div>
    </div>
  )
}

export { Spin }
export type { SpinProps, SpinSize }
