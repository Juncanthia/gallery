import * as React from "react"
import cn from "clsx"

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: { label: string; value: string | null }[]
  value?: string | null
  onValueChange?: (value: string) => void
}
const Select = ({ children, className, items, value, onValueChange, ...props }: SelectProps) => (
  <div className={className} {...props}>{children}</div>
)

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  id?: string
}
const SelectTrigger = ({ className, children, id, ...props }: SelectTriggerProps) => (
  <button
    id={id}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}>
    {children}
  </button>
)

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}
const SelectValue = ({ className, placeholder, ...props }: SelectValueProps) => (
  <span className={cn("flex-1 text-left text-sm", className)} {...props}>{placeholder}</span>
)

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const SelectContent = ({ className, ...props }: SelectContentProps) => (
  <div
    className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
)

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string | null
}
const SelectItem = ({ className, children, value, ...props }: SelectItemProps) => (
  <div
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    {children}
  </div>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
