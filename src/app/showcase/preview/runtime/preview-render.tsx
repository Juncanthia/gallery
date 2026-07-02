import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PreviewRenderProps = {
  children: ReactNode
  align?: "center" | "start" | "end"
  className?: string
}

export function PreviewRender({
  children,
  align = "center",
  className,
}: PreviewRenderProps) {
  return (
    <div
      data-align={align}
      className={cn(
        "flex min-h-[18rem] w-full justify-center overflow-visible p-10",
        "data-[align=center]:items-center data-[align=start]:items-start data-[align=end]:items-end",
        className
      )}
    >
      {children}
    </div>
  )
}
