import { cn } from "@/lib/utils"
import * as React from "react"

type KbdProps = React.ComponentProps<"kbd"> & {
}

function Kbd({ className, ...props }: KbdProps) {
  const useDefaultVariant = false
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5.5 w-fit min-w-5.5 items-center justify-center gap-1 rounded px-1.5 font-sans text-[10px] font-bold select-none [&_svg:not([class*='size-'])]:size-3 transition-all duration-200",
        useDefaultVariant
          ? "bg-linear-to-b from-white to-neutral-100 dark:from-zinc-700 dark:to-zinc-800 border border-neutral-300 dark:border-zinc-600 shadow-[0_2px_0_#d4d4d8,0_2.5px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_0_#27272a,0_2.5px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] text-neutral-800 dark:text-zinc-200"
          : "bg-muted text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
