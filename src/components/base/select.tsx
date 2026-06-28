"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/button"
import {
  selectChipVariants,
  selectInputVariants,
  selectItemVariants,
  selectPopupVariants,
  selectTriggerVariants,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
} from "@/components/base/select-variants"
import {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  X as XIcon,
} from "lucide-react"

type SelectMode = "multiple" | "tags" | "combobox"

type SelectOption = {
  label: React.ReactNode
  value: string
  disabled?: boolean
  title?: string
  className?: string
  searchText?: string
}

type SelectOptionGroup = {
  label: React.ReactNode
  options: SelectOption[]
  className?: string
}

type SelectOptionItem = SelectOption | SelectOptionGroup

type SelectInternalOption = SelectOption & {
  created?: boolean
}

type SelectInternalGroup = {
  label: React.ReactNode
  value: string
  className?: string
  items: SelectInternalOption[]
}

type SelectCommonApiProps = {
  options?: SelectOptionItem[]
  placeholder?: React.ReactNode
  searchPlaceholder?: string
  size?: SelectSize
  variant?: SelectVariant
  status?: SelectStatus
  disabled?: boolean
  allowClear?: boolean
  prefix?: React.ReactNode
  suffixIcon?: React.ReactNode | null
  notFoundContent?: React.ReactNode
  optionRender?: (option: SelectOption, info: { index: number }) => React.ReactNode
  popupRender?: (originNode: React.ReactNode) => React.ReactNode
  labelRender?: (option: SelectOption) => React.ReactNode
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
  showSearch?: boolean
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean)
  filterSort?: (a: SelectOption, b: SelectOption, input: string) => number
  onSearch?: (value: string) => void
  onSelect?: (value: string, option: SelectOption) => void
  onDeselect?: (value: string, option: SelectOption) => void
  onClear?: () => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  contentClassName?: string
  listClassName?: string
  name?: string
  id?: string
  required?: boolean
  "aria-label"?: string
}

type SelectSingleApiProps = SelectCommonApiProps & {
  mode?: "combobox"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
}

type SelectMultipleApiProps = SelectCommonApiProps & {
  mode: "multiple" | "tags"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  maxCount?: number
  tokenSeparators?: string[]
}

type SelectApiProps = SelectSingleApiProps | SelectMultipleApiProps

type SelectLegacyProps = React.ComponentProps<typeof SelectPrimitive.Root>

type SelectProps = SelectLegacyProps | SelectApiProps

function isOptionGroup(option: SelectOptionItem): option is SelectOptionGroup {
  return "options" in option
}

function getOptionText(option: SelectOption): string {
  if (option.searchText) {
    return option.searchText
  }
  if (typeof option.label === "string" || typeof option.label === "number") {
    return String(option.label)
  }
  return option.value
}

function normalizeOptions(options: SelectOptionItem[] = []) {
  const groups: SelectInternalGroup[] = []
  const flatOptions: SelectInternalOption[] = []

  options.forEach((option, index) => {
    if (isOptionGroup(option)) {
      const groupItems = option.options.map((item) => ({ ...item }))
      groups.push({
        label: option.label,
        value: `group-${index}`,
        className: option.className,
        items: groupItems,
      })
      flatOptions.push(...groupItems)
      return
    }

    flatOptions.push({ ...option })
  })

  return { flatOptions, groups }
}

function normalizePlacement(
  placement: SelectCommonApiProps["placement"]
): Pick<ComboboxPrimitive.Positioner.Props, "side" | "align"> {
  switch (placement) {
    case "topLeft":
      return { side: "top", align: "start" }
    case "topRight":
      return { side: "top", align: "end" }
    case "bottomRight":
      return { side: "bottom", align: "end" }
    case "bottomLeft":
    default:
      return { side: "bottom", align: "start" }
  }
}

function isApiSelectProps(props: SelectProps): props is SelectApiProps {
  return (
    "options" in props ||
    "showSearch" in props ||
    "mode" in props ||
    "allowClear" in props ||
    "prefix" in props ||
    "suffixIcon" in props ||
    "optionRender" in props ||
    "popupRender" in props ||
    "labelRender" in props ||
    "filterOption" in props ||
    "filterSort" in props ||
    "onSearch" in props ||
    "onSelect" in props ||
    "onDeselect" in props ||
    "onClear" in props ||
    "maxCount" in props ||
    "tokenSeparators" in props
  )
}

function getCreatedOption(value: string): SelectInternalOption {
  return {
    label: value,
    value,
    searchText: value,
    created: true,
  }
}

function getFilteredOptions(
  options: SelectInternalOption[],
  inputValue: string,
  filterOption: SelectCommonApiProps["filterOption"],
  filterSort: SelectCommonApiProps["filterSort"]
) {
  const normalizedInput = inputValue.trim().toLowerCase()
  const shouldFilter = filterOption !== false && normalizedInput.length > 0
  const filteredOptions = shouldFilter
    ? options.filter((option) => {
        if (typeof filterOption === "function") {
          return filterOption(inputValue, option)
        }

        return getOptionText(option).toLowerCase().includes(normalizedInput)
      })
    : [...options]

  if (filterSort) {
    filteredOptions.sort((a, b) => filterSort(a, b, inputValue))
  }

  return filteredOptions
}

function getDisplayItems(
  groups: SelectInternalGroup[],
  filteredOptions: SelectInternalOption[]
): SelectInternalOption[] | SelectInternalGroup[] {
  if (groups.length === 0) {
    return filteredOptions
  }

  const filteredValues = new Set(filteredOptions.map((option) => option.value))

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((option) => filteredValues.has(option.value)),
    }))
    .filter((group) => group.items.length > 0)
}

function getLimitedValues(values: string[], maxCount?: number) {
  const uniqueValues = Array.from(new Set(values))

  if (typeof maxCount !== "number") {
    return uniqueValues
  }

  return uniqueValues.slice(0, Math.max(0, maxCount))
}

function splitTokenValue(value: string, tokenSeparators?: string[]) {
  const separators = tokenSeparators?.filter(Boolean)

  if (!separators?.length) {
    return null
  }

  if (!separators.some((separator) => value.includes(separator))) {
    return null
  }

  const tokens = value
    .split(new RegExp(separators.map(escapeRegExp).join("|")))
    .map((token) => token.trim())
    .filter(Boolean)

  return tokens.length > 0 ? tokens : null
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function useApiControllableState<T>({
  defaultValue,
  isControlled,
  onChange,
  value,
}: {
  defaultValue: T
  isControlled: boolean
  onChange?: (value: T) => void
  value: T | undefined
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange]
  )

  return [currentValue, setValue] as const
}

function Select(props: SelectProps) {
  if (isApiSelectProps(props)) {
    return <SelectApi {...props} />
  }

  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectApi(props: SelectApiProps) {
  if (props.mode === "multiple" || props.mode === "tags") {
    return <SelectMultipleApi {...props} />
  }

  return <SelectSingleApi {...(props as SelectSingleApiProps)} />
}

function SelectSingleApi(props: SelectSingleApiProps) {
  const {
    options,
    placeholder,
    searchPlaceholder,
    size = "middle",
    variant = "outlined",
    status,
    disabled,
    allowClear,
    prefix,
    suffixIcon,
    notFoundContent = "No results found.",
    optionRender,
    popupRender,
    labelRender,
    placement,
    showSearch,
    filterOption,
    filterSort,
    onSearch,
    onSelect,
    onClear,
    mode,
    value: controlledValue,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    className,
    contentClassName,
    listClassName,
    name,
    id,
    required,
    "aria-label": ariaLabel,
  } = props
  const { flatOptions, groups } = React.useMemo(() => normalizeOptions(options), [options])
  const byValue = React.useMemo(
    () => new Map(flatOptions.map((option) => [option.value, option])),
    [flatOptions]
  )
  const [value, setValue] = useApiControllableState<string | undefined>({
    defaultValue,
    isControlled: "value" in props,
    onChange: onValueChange,
    value: controlledValue,
  })
  const [inputValue, setInputValue] = React.useState(mode === "combobox" ? value ?? "" : "")

  const selectedOption = React.useMemo(() => {
    if (!value) {
      return null
    }
    return byValue.get(value) ?? getCreatedOption(value)
  }, [byValue, value])

  const shouldShowInput = showSearch || mode === "combobox"
  const renderedOptions = React.useMemo(
    () => getFilteredOptions(flatOptions, inputValue, filterOption, filterSort),
    [filterOption, filterSort, flatOptions, inputValue]
  )
  const items = React.useMemo(
    () => getDisplayItems(groups, renderedOptions),
    [groups, renderedOptions]
  )
  const { side, align } = normalizePlacement(placement)
  const canClear = Boolean(allowClear && value && !disabled)

  const handleChange = React.useCallback(
    (option: SelectInternalOption | null) => {
      if (option && option.value !== value) {
        onSelect?.(option.value, option)
      }
      if (!option && value) {
        onClear?.()
      }
      setValue(option?.value)
      if (mode !== "combobox") {
        setInputValue("")
      }
    },
    [mode, onClear, onSelect, setValue, value]
  )

  const handleInputValueChange = React.useCallback(
    (nextValue: string) => {
      setInputValue(nextValue)
      onSearch?.(nextValue)
      if (mode === "combobox") {
        setValue(nextValue || undefined)
      }
    },
    [mode, onSearch, setValue]
  )

  const handleClear = React.useCallback(() => {
    setValue(undefined)
    setInputValue("")
    onClear?.()
  }, [onClear, setValue])

  const trigger = mode === "combobox" ? (
    <div
      className={cn(
        selectTriggerVariants({ variant, size, status: status ?? "default" }),
        "cursor-text",
        className
      )}
      data-slot="select-trigger"
    >
      {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
      <ComboboxPrimitive.Input
        id={id}
        className={selectInputVariants({ size })}
        disabled={disabled}
        placeholder={typeof placeholder === "string" ? placeholder : undefined}
        aria-label={ariaLabel ?? "Select"}
      />
      {canClear && <SelectClearButton onClear={handleClear} />}
      {suffixIcon !== null && (
        <ComboboxPrimitive.Trigger
          className="inline-flex shrink-0 items-center justify-center text-muted-foreground outline-none"
          disabled={disabled}
          aria-label="Open popup"
        >
          {suffixIcon ?? <ChevronDownIcon className="size-4" />}
        </ComboboxPrimitive.Trigger>
      )}
    </div>
  ) : (
    <ComboboxPrimitive.Trigger
      id={id}
      className={cn(
        selectTriggerVariants({ variant, size, status: status ?? "default" }),
        className
      )}
      data-slot="select-trigger"
      disabled={disabled}
      aria-label={ariaLabel ?? (typeof placeholder === "string" ? placeholder : "Select")}
    >
      {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
      <span className="min-w-0 flex-1 truncate text-left">
        {selectedOption ? (labelRender?.(selectedOption) ?? selectedOption.label) : placeholder}
      </span>
      {canClear && <SelectClearButton onClear={handleClear} />}
      {suffixIcon !== null && (
        <span className="shrink-0 text-muted-foreground">
          {suffixIcon ?? <ChevronDownIcon className="size-4" />}
        </span>
      )}
    </ComboboxPrimitive.Trigger>
  )

  return (
    <ComboboxPrimitive.Root<SelectInternalOption>
      items={items}
      value={selectedOption}
      onValueChange={handleChange}
      inputValue={mode === "combobox" ? value ?? "" : inputValue}
      onInputValueChange={handleInputValueChange}
      filter={null}
      itemToStringLabel={getOptionText}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, currentValue) => option.value === currentValue.value}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      {trigger}
      <SelectPopup
        align={align}
        contentClassName={contentClassName}
        listClassName={listClassName}
        notFoundContent={notFoundContent}
        optionRender={optionRender}
        popupRender={popupRender}
        searchInput={
          shouldShowInput && mode !== "combobox" ? (
            <ComboboxPrimitive.Input
              className={cn(
                selectInputVariants({ size }),
                "m-1 mb-0 w-[calc(100%---spacing(2))] rounded-md border border-input bg-background px-2"
              )}
              placeholder={searchPlaceholder ?? "Search..."}
              disabled={disabled}
            />
          ) : null
        }
        side={side}
      />
    </ComboboxPrimitive.Root>
  )
}

function SelectMultipleApi(props: SelectMultipleApiProps) {
  const {
    options,
    placeholder,
    searchPlaceholder,
    size = "middle",
    variant = "outlined",
    status,
    disabled,
    allowClear,
    prefix,
    suffixIcon,
    notFoundContent = "No results found.",
    optionRender,
    popupRender,
    labelRender,
    placement,
    filterOption,
    filterSort,
    onSelect,
    onDeselect,
    onClear,
    mode,
    value: controlledValue,
    defaultValue,
    onValueChange,
    maxCount,
    tokenSeparators,
    open,
    defaultOpen,
    onOpenChange,
    className,
    contentClassName,
    listClassName,
    name,
    id,
    required,
    "aria-label": ariaLabel,
  } = props
  const { flatOptions, groups } = React.useMemo(() => normalizeOptions(options), [options])
  const byValue = React.useMemo(
    () => new Map(flatOptions.map((option) => [option.value, option])),
    [flatOptions]
  )
  const [values = [], setValues] = useApiControllableState<string[]>({
    defaultValue: defaultValue ?? [],
    isControlled: "value" in props,
    onChange: onValueChange,
    value: controlledValue,
  })
  const [inputValue, setInputValue] = React.useState("")
  const renderedOptions = React.useMemo(
    () => getFilteredOptions(flatOptions, inputValue, filterOption, filterSort),
    [filterOption, filterSort, flatOptions, inputValue]
  )
  const renderedOptionsWithLimit = React.useMemo(() => {
    const isMaxReached = typeof maxCount === "number" && values.length >= maxCount

    if (!isMaxReached) {
      return renderedOptions
    }

    return renderedOptions.map((option) => ({
      ...option,
      disabled: option.disabled || !values.includes(option.value),
    }))
  }, [maxCount, renderedOptions, values])
  const displayItems = React.useMemo(
    () => getDisplayItems(groups, renderedOptionsWithLimit),
    [groups, renderedOptionsWithLimit]
  )
  const trimmedInputValue = inputValue.trim()
  const canCreate =
    mode === "tags" &&
    trimmedInputValue.length > 0 &&
    !byValue.has(trimmedInputValue) &&
    !values.includes(trimmedInputValue) &&
    (typeof maxCount !== "number" || values.length < maxCount)
  const createdOption = canCreate ? getCreatedOption(trimmedInputValue) : null

  const items = React.useMemo(() => {
    if (!createdOption) {
      return displayItems
    }

    if (groups.length > 0) {
      return [
        ...(displayItems as SelectInternalGroup[]),
        {
          label: "Create",
          value: "__create__",
          items: [createdOption],
        },
      ] satisfies SelectInternalGroup[]
    }

    return [...renderedOptionsWithLimit, createdOption]
  }, [createdOption, displayItems, groups.length, renderedOptionsWithLimit])

  const selectedOptions = React.useMemo(
    () => values.map((item) => byValue.get(item) ?? getCreatedOption(item)),
    [byValue, values]
  )
  const { side, align } = normalizePlacement(placement)
  const canClear = Boolean(allowClear && values.length > 0 && !disabled)

  const handleChange = React.useCallback(
    (nextOptions: SelectInternalOption[]) => {
      const nextValues = getLimitedValues(
        nextOptions.map((option) => option.value),
        maxCount
      )
      const nextValueSet = new Set(nextValues)
      const currentValueSet = new Set(values)

      nextValues
        .filter((item) => !currentValueSet.has(item))
        .forEach((item) => onSelect?.(item, byValue.get(item) ?? getCreatedOption(item)))
      values
        .filter((item) => !nextValueSet.has(item))
        .forEach((item) => onDeselect?.(item, byValue.get(item) ?? getCreatedOption(item)))

      setValues(nextValues)
      setInputValue("")
    },
    [byValue, maxCount, onDeselect, onSelect, setValues, values]
  )

  const handleInputValueChange = React.useCallback(
    (nextValue: string) => {
      const tokens = mode === "tags" ? splitTokenValue(nextValue, tokenSeparators) : null

      if (!tokens) {
        setInputValue(nextValue)
        return
      }

      const currentValueSet = new Set(values)
      const nextValues = getLimitedValues(
        [
          ...values,
          ...tokens.filter((token) => !currentValueSet.has(token)),
        ],
        maxCount
      )

      nextValues
        .filter((item) => !currentValueSet.has(item))
        .forEach((item) => onSelect?.(item, byValue.get(item) ?? getCreatedOption(item)))

      setValues(nextValues)
      setInputValue("")
    },
    [byValue, maxCount, mode, onSelect, setValues, tokenSeparators, values]
  )

  const handleClear = React.useCallback(() => {
    setValues([])
    setInputValue("")
    onClear?.()
  }, [onClear, setValues])

  return (
    <ComboboxPrimitive.Root<SelectInternalOption, true>
      items={items}
      multiple
      value={selectedOptions}
      onValueChange={handleChange}
      inputValue={inputValue}
      onInputValueChange={handleInputValueChange}
      filter={null}
      itemToStringLabel={getOptionText}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, currentValue) => option.value === currentValue.value}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <div
        className={cn(
          selectTriggerVariants({ variant, size, status: status ?? "default" }),
          "h-auto min-h-9 cursor-text flex-wrap justify-start py-1.5",
          className
        )}
        data-slot="select-trigger"
      >
        {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
        <ComboboxPrimitive.Chips className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          <ComboboxPrimitive.Value>
            {(currentValue: SelectInternalOption[]) => (
              <React.Fragment>
                {currentValue.map((option) => (
                  <ComboboxPrimitive.Chip
                    key={option.value}
                    className={selectChipVariants()}
                    aria-label={getOptionText(option)}
                  >
                    <span className="max-w-36 truncate">
                      {labelRender?.(option) ?? option.label}
                    </span>
                    <ComboboxPrimitive.ChipRemove
                      render={<Button variant="text" size="small" shape="square" />}
                      className="-ml-1 opacity-50 hover:opacity-100"
                      data-slot="select-chip-remove"
                    >
                      <XIcon className="pointer-events-none" />
                    </ComboboxPrimitive.ChipRemove>
                  </ComboboxPrimitive.Chip>
                ))}
                <ComboboxPrimitive.Input
                  id={id}
                  className="min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  disabled={disabled}
                  placeholder={currentValue.length > 0 ? "" : typeof placeholder === "string" ? placeholder : undefined}
                  aria-label={ariaLabel ?? "Select"}
                />
              </React.Fragment>
            )}
          </ComboboxPrimitive.Value>
        </ComboboxPrimitive.Chips>
        {canClear && <SelectClearButton onClear={handleClear} />}
        {suffixIcon !== null && (
          <ComboboxPrimitive.Trigger
            className="inline-flex shrink-0 items-center justify-center text-muted-foreground outline-none"
            disabled={disabled}
            aria-label="Open popup"
          >
            {suffixIcon ?? <ChevronDownIcon className="size-4" />}
          </ComboboxPrimitive.Trigger>
        )}
      </div>
      <SelectPopup
        align={align}
        contentClassName={contentClassName}
        listClassName={listClassName}
        notFoundContent={notFoundContent}
        optionRender={optionRender}
        popupRender={popupRender}
        searchInput={
          <ComboboxPrimitive.Input
            className={cn(
              selectInputVariants({ size }),
              "m-1 mb-0 w-[calc(100%---spacing(2))] rounded-md border border-input bg-background px-2"
            )}
            placeholder={searchPlaceholder ?? "Search..."}
            disabled={disabled}
          />
        }
        side={side}
      />
    </ComboboxPrimitive.Root>
  )
}

function SelectClearButton({ onClear }: { onClear: () => void }) {
  return (
    <span
      className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 hover:opacity-100"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClear()
      }}
      onPointerDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      role="button"
    >
      <XIcon className="size-3.5" />
    </span>
  )
}

function SelectPopup({
  align,
  contentClassName,
  listClassName,
  notFoundContent,
  optionRender,
  popupRender,
  searchInput,
  side,
}: {
  align: ComboboxPrimitive.Positioner.Props["align"]
  contentClassName?: string
  listClassName?: string
  notFoundContent: React.ReactNode
  optionRender?: (option: SelectOption, info: { index: number }) => React.ReactNode
  popupRender?: (originNode: React.ReactNode) => React.ReactNode
  searchInput?: React.ReactNode
  side: ComboboxPrimitive.Positioner.Props["side"]
}) {
  const list = (
    <React.Fragment>
      {searchInput}
      <ComboboxPrimitive.Empty>
        <div className="py-4 pr-4 pl-2 text-sm text-muted-foreground">
          {notFoundContent}
        </div>
      </ComboboxPrimitive.Empty>
      <ComboboxPrimitive.List
        className={cn(
          "max-h-[min(18rem,var(--available-height))] overflow-y-auto overscroll-contain p-1 scroll-py-1 outline-0 data-empty:p-0",
          listClassName
        )}
      >
        {(item: SelectInternalOption | SelectInternalGroup, index: number) => {
          if ("items" in item) {
            return (
              <ComboboxPrimitive.Group
                className={cn("block pb-1 last:pb-0", item.className)}
                items={item.items}
                key={item.value}
              >
                <ComboboxPrimitive.GroupLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                  {item.label}
                </ComboboxPrimitive.GroupLabel>
                <ComboboxPrimitive.Collection>
                  {(option: SelectInternalOption, optionIndex: number) => (
                    <SelectRenderedItem
                      index={optionIndex}
                      key={option.value}
                      option={option}
                      optionRender={optionRender}
                    />
                  )}
                </ComboboxPrimitive.Collection>
              </ComboboxPrimitive.Group>
            )
          }

          return (
            <SelectRenderedItem
              index={index}
              key={item.value}
              option={item}
              optionRender={optionRender}
            />
          )
        }}
      </ComboboxPrimitive.List>
    </React.Fragment>
  )

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner align={align} className="isolate z-50" side={side} sideOffset={6}>
        <ComboboxPrimitive.Popup
          className={cn(selectPopupVariants(), contentClassName)}
          data-slot="select-content"
        >
          {popupRender ? popupRender(list) : list}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function SelectRenderedItem({
  index,
  option,
  optionRender,
}: {
  index: number
  option: SelectInternalOption
  optionRender?: (option: SelectOption, info: { index: number }) => React.ReactNode
}) {
  return (
    <ComboboxPrimitive.Item
      className={cn(selectItemVariants(), option.className)}
      disabled={option.disabled}
      index={index}
      title={option.title}
      value={option}
    >
      <ComboboxPrimitive.ItemIndicator
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
      <span className="min-w-0 flex-1 truncate">
        {option.created ? `Create "${option.value}"` : optionRender ? optionRender(option, { index }) : option.label}
      </span>
    </ComboboxPrimitive.Item>
  )
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectApiProps,
  type SelectMode,
  type SelectOption,
  type SelectOptionGroup,
  type SelectOptionItem,
  type SelectLegacyProps,
  type SelectMultipleApiProps,
  type SelectSize,
  type SelectSingleApiProps,
  type SelectStatus,
  type SelectVariant,
}
