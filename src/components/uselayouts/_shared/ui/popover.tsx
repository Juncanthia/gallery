import * as React from "react"
import cn from "clsx"

function Popover({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}
Popover.displayName = "Popover"

function PopoverTrigger({ children, render, ...props }: React.HTMLAttributes<HTMLDivElement> & { render?: React.ReactNode }) {
  return <div {...props}>{render ?? children}</div>
}
PopoverTrigger.displayName = "PopoverTrigger"

function PopoverContent({ className, children, align, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: string }) {
  return <div className={cn("z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)} {...props}>{children}</div>
}
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
