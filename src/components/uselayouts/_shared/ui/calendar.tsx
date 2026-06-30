import * as React from "react"

interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  mode?: string
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
}

function Calendar({ className, mode, selected, onSelect, initialFocus, ...props }: CalendarProps) {
  return <div className={className} {...props}>Calendar</div>
}
Calendar.displayName = "Calendar"

export { Calendar }
