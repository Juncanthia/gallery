"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/button"
import { buttonVariants } from "@/components/base/button-variants"
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon } from "lucide-react"

type CalendarCellInfo = {
  type: "date";
  originNode: React.ReactNode;
  today: Date;
}

type CalendarPanelMode = "month" | "year"

type CalendarHeaderRenderConfig = {
  value: Date;
  type: CalendarPanelMode;
  onChange: (date: Date) => void;
  onTypeChange: (type: CalendarPanelMode) => void;
}

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date) => void
  validRange?: [Date, Date]
  disabledDate?: (date: Date) => boolean
  dateCellRender?: (date: Date) => React.ReactNode
  cellRender?: (date: Date, info: CalendarCellInfo) => React.ReactNode
  fullCellRender?: (date: Date, info: CalendarCellInfo) => React.ReactNode
  headerRender?: (config: CalendarHeaderRenderConfig) => React.ReactNode
  fullscreen?: boolean
  panelMode?: CalendarPanelMode
  defaultPanelMode?: CalendarPanelMode
  onPanelChange?: (date: Date, mode: CalendarPanelMode) => void
  showWeek?: boolean
}

function isBeforeDay(date: Date, target: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()) < new Date(target.getFullYear(), target.getMonth(), target.getDate())
}

function isAfterDay(date: Date, target: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()) > new Date(target.getFullYear(), target.getMonth(), target.getDate())
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "text",
  locale,
  formatters,
  components,
  value,
  defaultValue,
  onChange,
  validRange,
  disabledDate,
  dateCellRender,
  cellRender,
  fullCellRender,
  headerRender,
  fullscreen = false,
  panelMode,
  defaultPanelMode = "month",
  onPanelChange,
  showWeek,
  disabled,
  onMonthChange,
  showWeekNumber,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()
  const isSingleApi = value !== undefined || defaultValue !== undefined || onChange !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? value ?? new Date())
  const [internalPanelMode, setInternalPanelMode] = React.useState(defaultPanelMode)
  const mergedValue = value ?? internalValue
  const mergedPanelMode = panelMode ?? internalPanelMode
  const mergedShowWeekNumber = showWeekNumber ?? showWeek

  const changeValue = React.useCallback((date?: Date) => {
    if (!date) return

    if (value === undefined) {
      setInternalValue(date)
    }
    onChange?.(date)
  }, [onChange, value])

  const changePanelValue = React.useCallback((date: Date) => {
    changeValue(date)
    onPanelChange?.(date, mergedPanelMode)
  }, [changeValue, mergedPanelMode, onPanelChange])

  const changePanelMode = React.useCallback((nextMode: CalendarPanelMode) => {
    if (panelMode === undefined) {
      setInternalPanelMode(nextMode)
    }
    onPanelChange?.(mergedValue, nextMode)
  }, [mergedValue, onPanelChange, panelMode])

  const handleMonthChange = React.useCallback((date: Date) => {
    onMonthChange?.(date)
    onPanelChange?.(date, mergedPanelMode)
  }, [mergedPanelMode, onMonthChange, onPanelChange])

  const mergedDisabled = React.useMemo(() => {
    const disabledMatchers = Array.isArray(disabled) ? [...disabled] : disabled ? [disabled] : []

    if (validRange) {
      disabledMatchers.push((date: Date) => isBeforeDay(date, validRange[0]) || isAfterDay(date, validRange[1]))
    }

    if (disabledDate) {
      disabledMatchers.push(disabledDate)
    }

    return disabledMatchers.length ? disabledMatchers : undefined
  }, [disabled, disabledDate, validRange])

  return (
    <div data-slot="calendar-wrapper" className={cn(fullscreen && "w-full", !fullscreen && "w-fit")}>
      {headerRender ? headerRender({ value: mergedValue, type: mergedPanelMode, onChange: changePanelValue, onTypeChange: changePanelMode }) : null}
      <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        fullscreen && "w-full",
        !fullscreen && "rounded-md border",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          mergedShowWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      disabled={mergedDisabled}
      onMonthChange={handleMonthChange}
      showWeekNumber={mergedShowWeekNumber}
      {...(isSingleApi ? { ...props, mode: "single" as const, selected: mergedValue, onSelect: changeValue } : props)}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton
            locale={locale}
            dateCellRender={dateCellRender}
            cellRender={cellRender}
            fullCellRender={fullCellRender}
            {...props}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
    />
    </div>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  type,
  children,
  dateCellRender,
  cellRender,
  fullCellRender,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>
  dateCellRender?: (date: Date) => React.ReactNode
  cellRender?: (date: Date, info: CalendarCellInfo) => React.ReactNode
  fullCellRender?: (date: Date, info: CalendarCellInfo) => React.ReactNode
}) {
  const defaultClassNames = getDefaultClassNames()
  const buttonProps = { ...props } as Omit<typeof props, "color">
  delete (buttonProps as { color?: unknown }).color

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const originNode = <>{children}</>
  const cellInfo = { type: "date", originNode, today: new Date() } satisfies CalendarCellInfo
  const extraNode = cellRender?.(day.date, cellInfo) ?? dateCellRender?.(day.date)
  const contentNode = fullCellRender?.(day.date, cellInfo) ?? (
    <>
      {originNode}
      {extraNode ? <span data-slot="calendar-cell-extra" className="text-[10px] leading-none opacity-80">{extraNode}</span> : null}
    </>
  )

  return (
    <Button
      ref={ref}
      variant="text"
      shape="square"
      htmlType={type}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...buttonProps}
    >
      {contentNode}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
export type { CalendarCellInfo, CalendarHeaderRenderConfig, CalendarPanelMode, CalendarProps }
