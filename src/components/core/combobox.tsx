"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import {
  CheckIcon,
  ChevronDownIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/_internals/foundations/utils/cn"
import { Button } from "@/components/core/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/core/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core/popover"

type ComboboxOption = {
  description?: React.ReactNode
  disabled?: boolean
  group?: string
  keywords?: string[]
  label: string
  value: string
}

type ComboboxOptionGroup = {
  label: string
  options: ComboboxOption[]
}

type ComboboxOptionItem = ComboboxOption | ComboboxOptionGroup

type ComboboxProps = Omit<
  React.ComponentProps<typeof Button>,
  "defaultValue" | "onChange" | "onSelect" | "value"
> & {
  allowClear?: boolean
  autoHighlight?: boolean
  contentClassName?: string
  defaultInputValue?: string
  defaultOpen?: boolean
  defaultValue?: string
  emptyContent?: React.ReactNode
  filterOption?: boolean | ((input: string, option: ComboboxOption) => boolean)
  inputValue?: string
  listClassName?: string
  loading?: boolean
  loadingContent?: React.ReactNode
  loop?: boolean
  name?: string
  onChange?: (value: string | undefined) => void
  onInputValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  onSearch?: (value: string) => void
  onSelect?: (value: string, option: ComboboxOption) => void
  onValueChange?: (value: string | undefined) => void
  open?: boolean
  openOnFocus?: boolean
  optionRender?: (option: ComboboxOption) => React.ReactNode
  options?: ComboboxOptionItem[]
  placeholder?: string
  popupRender?: (originNode: React.ReactNode) => React.ReactNode
  readOnly?: boolean
  required?: boolean
  searchPlaceholder?: string
  value?: string
}

function isOptionGroup(item: ComboboxOptionItem): item is ComboboxOptionGroup {
  return "options" in item
}

function flattenOptions(options: ComboboxOptionItem[]) {
  return options.flatMap((item) => (isOptionGroup(item) ? item.options : item))
}

function renderOptionLabel(option: ComboboxOption) {
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

function Combobox({
  allowClear = false,
  autoHighlight = false,
  className,
  contentClassName,
  defaultInputValue = "",
  defaultOpen = false,
  defaultValue,
  disabled = false,
  emptyContent = "无匹配结果",
  filterOption = true,
  inputValue: inputValueProp,
  listClassName,
  loading = false,
  loadingContent = "加载中...",
  loop = true,
  name,
  onChange,
  onInputValueChange,
  onOpenChange,
  onSearch,
  onSelect,
  onValueChange,
  open: openProp,
  openOnFocus = false,
  optionRender,
  options = [],
  placeholder = "请选择",
  popupRender,
  readOnly = false,
  required = false,
  searchPlaceholder = "搜索...",
  value: valueProp,
  variant = "outlined",
  ...props
}: ComboboxProps) {
  const [open = false, setOpen] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  })
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp: defaultValue,
    onChange: (nextValue) => {
      onValueChange?.(nextValue)
      onChange?.(nextValue)
    },
    prop: valueProp,
  })
  const [inputValue = "", setInputValue] = useControllableState({
    defaultProp: defaultInputValue,
    onChange: (nextInputValue) => {
      onInputValueChange?.(nextInputValue)
      onSearch?.(nextInputValue)
    },
    prop: inputValueProp,
  })
  const flatOptions = React.useMemo(() => flattenOptions(options), [options])
  const selectedOption = flatOptions.find((option) => option.value === value)
  const isInteractiveDisabled = disabled || readOnly
  const commandValue =
    value ?? (autoHighlight ? flatOptions.find((option) => !option.disabled)?.value : undefined)

  const commandFilter = React.useMemo(() => {
    if (typeof filterOption !== "function") return undefined

    return (itemValue: string, input: string) => {
      const option = flatOptions.find((item) => item.value === itemValue)
      if (!option) return 0
      return filterOption(input, option) ? 1 : 0
    }
  }, [filterOption, flatOptions])

  const handleSelect = React.useCallback(
    (option: ComboboxOption) => {
      if (isInteractiveDisabled) return
      setValue(option.value)
      onSelect?.(option.value, option)
      setInputValue("")
      setOpen(false)
    },
    [isInteractiveDisabled, onSelect, setInputValue, setOpen, setValue]
  )

  const handleClear = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (isInteractiveDisabled) return
      setValue(undefined)
      setInputValue("")
    },
    [isInteractiveDisabled, setInputValue, setValue]
  )

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && isInteractiveDisabled) return
      setOpen(nextOpen)
    },
    [isInteractiveDisabled, setOpen]
  )

  const listNode = (
      <CommandList className={cn("max-h-72", listClassName)}>
      {loading ? (
        <div
          data-slot="combobox-loading"
          className="py-6 text-center text-sm text-muted-foreground"
          role="status"
        >
          {loadingContent}
        </div>
      ) : (
        <CommandEmpty>{emptyContent}</CommandEmpty>
      )}
      {loading
        ? null
        : options.map((item) => {
            if (isOptionGroup(item)) {
              return (
                <CommandGroup heading={item.label} key={item.label}>
                  {item.options.map((option) => (
                    <ComboboxCommandItem
                      key={option.value}
                      onSelect={handleSelect}
                      option={option}
                      optionRender={optionRender}
                      selected={option.value === value}
                    />
                  ))}
                </CommandGroup>
              )
            }

            return (
              <ComboboxCommandItem
                key={item.value}
                onSelect={handleSelect}
                option={item}
                optionRender={optionRender}
                selected={item.value === value}
              />
            )
          })}
    </CommandList>
  )

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-invalid={props["aria-invalid"]}
          aria-readonly={readOnly || undefined}
          aria-required={required || undefined}
          className={cn("w-52 justify-between", className)}
          data-slot="combobox"
          data-readonly={readOnly || undefined}
          disabled={disabled}
          onFocus={() => {
            if (openOnFocus) handleOpenChange(true)
          }}
          role="combobox"
          htmlType="button"
          variant={variant}
          {...props}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              !selectedOption && "text-muted-foreground"
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          {allowClear && selectedOption && !isInteractiveDisabled ? (
            <span
              aria-label="清除选择"
              className="mr-1 flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              role="button"
              tabIndex={-1}
            >
              <XIcon className="size-3" />
            </span>
          ) : null}
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={value ?? ""}
          disabled={disabled}
          required={required}
        />
      ) : null}
      <PopoverContent
        align="start"
        className={cn("w-(--radix-popover-trigger-width) gap-0 p-0", contentClassName)}
        sideOffset={6}
      >
        <Command
          filter={commandFilter}
          loop={loop}
          shouldFilter={filterOption !== false}
          value={commandValue}
        >
          <CommandInput
            onValueChange={(nextSearch) => {
              setInputValue(nextSearch)
            }}
            placeholder={searchPlaceholder}
            readOnly={readOnly}
            value={inputValue}
          />
          {popupRender ? popupRender(listNode) : listNode}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function ComboboxCommandItem({
  onSelect,
  option,
  optionRender,
  selected,
}: {
  onSelect: (option: ComboboxOption) => void
  option: ComboboxOption
  optionRender?: (option: ComboboxOption) => React.ReactNode
  selected: boolean
}) {
  return (
    <CommandItem
      data-checked={selected}
      disabled={option.disabled}
      keywords={[option.label, option.value, ...(option.keywords ?? [])]}
      onSelect={() => onSelect(option)}
      value={option.value}
    >
      {optionRender ? optionRender(option) : renderOptionLabel(option)}
      <CheckIcon
        className={cn("ml-auto opacity-0", selected && "opacity-100")}
      />
    </CommandItem>
  )
}

export { Combobox }
export type { ComboboxOption, ComboboxOptionGroup, ComboboxOptionItem, ComboboxProps }
