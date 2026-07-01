"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Command as CommandPrimitive } from "cmdk"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import {
  selectInputVariants,
  selectTriggerVariants,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
} from "@/components/ui/select-variants"

type AutoCompleteOption = {
  description?: React.ReactNode
  disabled?: boolean
  group?: string
  keywords?: string[]
  label: string
  value: string
}

type AutoCompleteOptionGroup = {
  label: string
  options: AutoCompleteOption[]
}

type AutoCompleteOptionItem = AutoCompleteOption | AutoCompleteOptionGroup

type AutoCompletePlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight"

type AutoCompleteProps = {
  /** Options to suggest while typing. Supports flat and grouped formats. */
  options?: AutoCompleteOptionItem[]
  /** Placeholder text when no value is entered. */
  placeholder?: React.ReactNode
  /** Size of the input. @default "middle" */
  size?: SelectSize
  /** Visual variant. @default "outlined" */
  variant?: SelectVariant
  /** Validation status. */
  status?: SelectStatus
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Show a clear button when value is non-empty. */
  allowClear?: boolean
  /** Content rendered before the input. */
  prefix?: React.ReactNode
  /** Custom suffix icon. Pass `null` to hide. */
  suffixIcon?: React.ReactNode | null
  /** Content shown when no option matches the input. @default "No results found." */
  notFoundContent?: React.ReactNode
  /** Custom rendering of each option item. */
  optionRender?: (option: AutoCompleteOption) => React.ReactNode
  /** Wrap the popup list node (e.g. to append a footer button). */
  popupRender?: (originNode: React.ReactNode) => React.ReactNode
  /** Popup placement relative to the trigger. @default "bottomLeft" */
  placement?: AutoCompletePlacement
  /** Filter function or a boolean to control local filtering. Set `false` for async search. @default true */
  filterOption?: boolean | ((input: string, option: AutoCompleteOption) => boolean)
  /**
   * Callback fired when the input value changes (user typing).
   * Useful for async search: fetch options externally and update the `options` prop.
   */
  onSearch?: (value: string) => void
  /** Callback fired when an option is selected from the dropdown. */
  onSelect?: (value: string, option: AutoCompleteOption) => void
  /** Callback fired when the value is cleared. */
  onClear?: () => void
  /** Controlled open state. */
  open?: boolean
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Callback when the popup opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled value (free-text input, not restricted to options). */
  value?: string
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Callback when the value changes. Fires on every keystroke and on option selection. */
  onValueChange?: (value: string | undefined) => void
  /** Alias for onValueChange — AntD-compatible name. */
  onChange?: (value: string | undefined) => void
  /** CSS class for the root trigger element. */
  className?: string
  /** CSS class for the popup content. */
  contentClassName?: string
  /** CSS class for the option list. */
  listClassName?: string
  /** Name attribute for the underlying form input. */
  name?: string
  /** Id attribute for the input element. */
  id?: string
  /** Whether the input is required in a form context. */
  required?: boolean
  /** Accessible label for the input. */
  "aria-label"?: string
}

function isOptionGroup(item: AutoCompleteOptionItem): item is AutoCompleteOptionGroup {
  return "options" in item
}

function flattenOptions(options: AutoCompleteOptionItem[]) {
  return options.flatMap((item) => (isOptionGroup(item) ? item.options : item))
}

function renderOptionLabel(option: AutoCompleteOption) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate">{option.label}</span>
      {option.description ? (
        <span className="block truncate text-xs text-muted-foreground">
          {option.description}
        </span>
      ) : null}
    </span>
  )
}

const placementToSide: Record<AutoCompletePlacement, { align: "start" | "end"; side: "top" | "bottom" }> = {
  bottomLeft: { align: "start", side: "bottom" },
  bottomRight: { align: "end", side: "bottom" },
  topLeft: { align: "start", side: "top" },
  topRight: { align: "end", side: "top" },
}

function AutoComplete({
  allowClear = false,
  className,
  contentClassName,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  filterOption = true,
  listClassName,
  notFoundContent = "No results found.",
  onChange,
  onClear,
  onOpenChange,
  onSearch,
  onSelect,
  onValueChange,
  open: openProp,
  options = [],
  placeholder,
  placement = "bottomLeft",
  popupRender,
  prefix,
  size = "middle",
  status,
  suffixIcon,
  value: valueProp,
  variant = "outlined",
  optionRender,
  name,
  id,
  required,
  "aria-label": ariaLabel,
}: AutoCompleteProps) {
  const handleValueChange = onChange ?? onValueChange
  const [open = false, setOpen] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  })
  const [value = "", setValue] = useControllableState<string>({
    defaultProp: defaultValue ?? "",
    onChange: (nextValue) => {
      handleValueChange?.(nextValue)
      onSearch?.(nextValue)
    },
    prop: valueProp,
  })

  const flatOptions = React.useMemo(() => flattenOptions(options), [options])

  const commandFilter = React.useMemo(() => {
    if (typeof filterOption !== "function") return undefined

    return (itemValue: string, input: string) => {
      const option = flatOptions.find((item) => item.value === itemValue)
      if (!option) return 0
      return filterOption(input, option) ? 1 : 0
    }
  }, [filterOption, flatOptions])

  const handleSelect = React.useCallback(
    (option: AutoCompleteOption) => {
      if (disabled) return
      setValue(option.value)
      onSelect?.(option.value, option)
      setOpen(false)
    },
    [disabled, onSelect, setOpen, setValue]
  )

  const handleClear = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (disabled) return
      setValue("")
      onClear?.()
    },
    [disabled, onClear, setValue]
  )

  const { align, side } = placementToSide[placement]

  const listNode = (
    <CommandList className={cn("max-h-72", listClassName)}>
      <CommandEmpty>{notFoundContent}</CommandEmpty>
      {options.map((item) => {
        if (isOptionGroup(item)) {
          return (
            <CommandGroup heading={item.label} key={item.label}>
              {item.options.map((option) => (
                <AutoCompleteCommandItem
                  key={option.value}
                  onSelect={handleSelect}
                  option={option}
                  optionRender={optionRender}
                />
              ))}
            </CommandGroup>
          )
        }

        return (
          <AutoCompleteCommandItem
            key={item.value}
            onSelect={handleSelect}
            option={item}
            optionRender={optionRender}
          />
        )
      })}
    </CommandList>
  )

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Command filter={commandFilter} shouldFilter={filterOption !== false}>
        <PopoverAnchor asChild>
          <div
            aria-disabled={disabled || undefined}
            aria-expanded={open}
            className={cn(selectTriggerVariants({ size, status, variant }), className)}
            data-slot="auto-complete"
            role="combobox"
          >
            {prefix ? <span className="flex shrink-0 items-center text-muted-foreground">{prefix}</span> : null}
            <CommandPrimitive.Input
              aria-label={ariaLabel}
              className={cn(selectInputVariants({ size }))}
              disabled={disabled}
              id={id}
              name={name}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false)
              }}
              placeholder={typeof placeholder === "string" ? placeholder : undefined}
              required={required}
              value={value}
              onValueChange={setValue}
            />
            {allowClear && value && !disabled ? (
              <span
                aria-label="清除内容"
                className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={handleClear}
                onPointerDown={(event) => event.preventDefault()}
                role="button"
                tabIndex={-1}
              >
                <XIcon className="size-3.5" />
              </span>
            ) : (
              suffixIcon ?? null
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          align={align}
          className={cn(
            "w-(--radix-popover-trigger-width) gap-0 p-0",
            contentClassName
          )}
          onOpenAutoFocus={(event) => event.preventDefault()}
          side={side}
          sideOffset={6}
        >
          {popupRender ? popupRender(listNode) : listNode}
        </PopoverContent>
      </Command>
    </Popover>
  )
}

function AutoCompleteCommandItem({
  onSelect,
  option,
  optionRender,
}: {
  onSelect: (option: AutoCompleteOption) => void
  option: AutoCompleteOption
  optionRender?: (option: AutoCompleteOption) => React.ReactNode
}) {
  return (
    <CommandItem
      disabled={option.disabled}
      keywords={[option.label, option.value, ...(option.keywords ?? [])]}
      onSelect={() => onSelect(option)}
      value={option.value}
    >
      {optionRender ? optionRender(option) : renderOptionLabel(option)}
    </CommandItem>
  )
}

export { AutoComplete }
export type {
  AutoCompleteOption,
  AutoCompleteOptionGroup,
  AutoCompleteOptionItem,
  AutoCompletePlacement,
  AutoCompleteProps,
}
export type { SelectSize as AutoCompleteSize } from "@/components/ui/select-variants"
export type { SelectStatus as AutoCompleteStatus } from "@/components/ui/select-variants"
export type { SelectVariant as AutoCompleteVariant } from "@/components/ui/select-variants"
