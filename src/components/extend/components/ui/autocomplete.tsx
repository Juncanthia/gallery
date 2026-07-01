"use client"

import * as React from "react"
import { ArrowUpDownIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/components/extend/lib/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PopoverPrimitive } from "@/components/ui/popover"

type AutocompleteContextValue = {
  setOpen: (open: boolean) => void
}

type AutocompleteInputContextValue = {
  clearInput: () => void
}

type AutocompleteFilter = {
  contains: <Item>(
    item: Item,
    query: string,
    itemToString?: (item: Item) => string
  ) => boolean
  startsWith: <Item>(
    item: Item,
    query: string,
    itemToString?: (item: Item) => string
  ) => boolean
  endsWith: <Item>(
    item: Item,
    query: string,
    itemToString?: (item: Item) => string
  ) => boolean
}

const AutocompleteContext = React.createContext<AutocompleteContextValue | null>(
  null
)
const AutocompleteInputContext =
  React.createContext<AutocompleteInputContextValue | null>(null)

type AutocompleteProps = Omit<
  React.ComponentProps<typeof CommandPrimitive>,
  "children"
> & {
  children?: React.ReactNode
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

function itemToText<Item>(item: Item, itemToString?: (item: Item) => string) {
  return (itemToString ? itemToString(item) : String(item)).toLocaleLowerCase()
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  ref.current = value
}

export function Autocomplete({
  children,
  defaultOpen = false,
  modal = false,
  onOpenChange,
  open,
  ...props
}: AutocompleteProps): React.ReactElement {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const openValue = open ?? uncontrolledOpen
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open]
  )
  const contextValue = React.useMemo(() => ({ setOpen }), [setOpen])

  return (
    <AutocompleteContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        modal={modal}
        open={openValue}
        onOpenChange={setOpen}
      >
        <CommandPrimitive {...props}>{children}</CommandPrimitive>
      </PopoverPrimitive.Root>
    </AutocompleteContext.Provider>
  )
}

export function AutocompleteInput({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  defaultValue,
  onFocus,
  onValueChange,
  ref,
  value,
  ...props
}: Omit<React.ComponentProps<typeof CommandPrimitive.Input>, "size"> & {
  showTrigger?: boolean
  showClear?: boolean
  startAddon?: React.ReactNode
  size?: "sm" | "default" | "lg" | number
  ref?: React.Ref<HTMLInputElement>
  triggerProps?: React.ComponentProps<typeof PopoverPrimitive.Trigger>
  clearProps?: React.ComponentProps<"button">
}): React.ReactElement {
  const autocompleteContext = React.useContext(AutocompleteContext)
  const [inputElement, setInputElement] = React.useState<HTMLInputElement | null>(
    null
  )
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    typeof defaultValue === "string" ? defaultValue : ""
  )
  const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number
  const inputValue = value ?? uncontrolledValue
  const setInputRef = React.useCallback(
    (element: HTMLInputElement | null) => {
      setInputElement(element)
      assignRef(ref, element)
    },
    [ref]
  )
  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      onValueChange?.(nextValue)
      autocompleteContext?.setOpen(true)
    },
    [autocompleteContext, onValueChange, value]
  )
  const clearInput = React.useCallback(() => {
    handleValueChange("")
    inputElement?.focus()
  }, [handleValueChange, inputElement])
  const inputContextValue = React.useMemo(
    () => ({ clearInput }),
    [clearInput]
  )

  return (
    <AutocompleteInputContext.Provider value={inputContextValue}>
      <div
        className="relative w-full text-foreground not-has-[>*.w-full]:w-fit has-disabled:opacity-64"
        data-slot="autocomplete-input-group"
      >
        {startAddon && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
            data-slot="autocomplete-start-addon"
          >
            {startAddon}
          </div>
        )}
        <CommandPrimitive.Input
          asChild
          className={cn(
            startAddon &&
              "*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)]",
            sizeValue === "sm"
              ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5"
              : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7",
            className
          )}
          data-slot="autocomplete-input"
          onFocus={(event) => {
            autocompleteContext?.setOpen(true)
            onFocus?.(event)
          }}
          onValueChange={handleValueChange}
          ref={setInputRef}
          value={inputValue}
          {...props}
        >
          <Input nativeInput size={sizeValue} />
        </CommandPrimitive.Input>
        {showTrigger && (
          <AutocompleteTrigger
            className={cn(
              "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 transition-colors outline-none hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
              sizeValue === "sm" ? "end-0" : "end-0.5"
            )}
            {...triggerProps}
          >
            <AutocompleteIcon data-slot="autocomplete-icon">
              <HugeiconsIcon icon={ArrowUpDownIcon} />
            </AutocompleteIcon>
          </AutocompleteTrigger>
        )}
        {showClear && (
          <AutocompleteClear
            className={cn(
              "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 transition-colors outline-none hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
              sizeValue === "sm" ? "end-0" : "end-0.5"
            )}
            {...clearProps}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </AutocompleteClear>
        )}
      </div>
    </AutocompleteInputContext.Provider>
  )
}

export function AutocompletePopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  align = "start",
  anchor,
  portalProps,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  align?: React.ComponentProps<typeof PopoverPrimitive.Content>["align"]
  sideOffset?: React.ComponentProps<typeof PopoverPrimitive.Content>["sideOffset"]
  alignOffset?: React.ComponentProps<typeof PopoverPrimitive.Content>["alignOffset"]
  side?: React.ComponentProps<typeof PopoverPrimitive.Content>["side"]
  anchor?: unknown
  portalProps?: React.ComponentProps<typeof PopoverPrimitive.Portal>
}): React.ReactElement {
  void anchor

  return (
    <PopoverPrimitive.Portal {...portalProps}>
      <PopoverPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        className="z-50 select-none"
        data-slot="autocomplete-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            "relative flex max-h-full max-w-(--radix-popover-content-available-width) min-w-(--radix-popover-trigger-width) origin-(--radix-popover-content-transform-origin) rounded-lg border bg-popover shadow-lg/5 transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className
          )}
        >
          <div
            className="flex max-h-[min(var(--radix-popover-content-available-height),23rem)] flex-1 flex-col text-foreground"
            data-slot="autocomplete-popup"
            {...props}
          >
            {children}
          </div>
        </span>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export function AutocompleteItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>): React.ReactElement {
  return (
    <CommandPrimitive.Item
      className={cn(
        "flex min-h-8 cursor-default items-center rounded-sm px-2 py-1 text-base outline-none select-none data-selected:bg-accent data-selected:text-accent-foreground sm:min-h-7 sm:text-sm data-disabled:pointer-events-none data-disabled:opacity-64",
        className
      )}
      data-slot="autocomplete-item"
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  )
}

export function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>): React.ReactElement {
  return (
    <CommandPrimitive.Separator
      className={cn("mx-2 my-1 h-px bg-border last:hidden", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  )
}

export function AutocompleteGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>): React.ReactElement {
  return (
    <CommandPrimitive.Group
      className={cn("[[role=group]+&]:mt-1.5", className)}
      data-slot="autocomplete-group"
      {...props}
    />
  )
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      data-slot="autocomplete-group-label"
      {...props}
    />
  )
}

export function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>): React.ReactElement {
  return (
    <CommandPrimitive.Empty
      className={cn(
        "text-center text-base text-muted-foreground not-empty:p-2 sm:text-sm",
        className
      )}
      data-slot="autocomplete-empty"
      {...props}
    />
  )
}

export function AutocompleteRow({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div className={className} data-slot="autocomplete-row" {...props} />
}

export function AutocompleteValue({
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return <span data-slot="autocomplete-value" {...props} />
}

export function AutocompleteList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>): React.ReactElement {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <CommandPrimitive.List
        className={cn(
          "not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3",
          className
        )}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  )
}

export function AutocompleteClear({
  className,
  onClick,
  type = "button",
  ...props
}: React.ComponentProps<"button">): React.ReactElement {
  const inputContext = React.useContext(AutocompleteInputContext)

  return (
    <button
      className={cn(
        "absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 transition-[color,background-color,box-shadow,opacity] outline-none hover:opacity-100 sm:size-7 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="autocomplete-clear"
      type={type}
      onClick={(event) => {
        inputContext?.clearInput()
        onClick?.(event)
      }}
      {...props}
    >
      <HugeiconsIcon icon={Cancel01Icon} />
    </button>
  )
}

export function AutocompleteStatus({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-medium text-muted-foreground empty:m-0 empty:p-0",
        className
      )}
      data-slot="autocomplete-status"
      {...props}
    />
  )
}

export function AutocompleteCollection({
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div data-slot="autocomplete-collection" {...props} />
}

export function AutocompleteTrigger({
  className,
  children,
  type = "button",
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>): React.ReactElement {
  return (
    <PopoverPrimitive.Trigger
      className={className}
      data-slot="autocomplete-trigger"
      type={type}
      {...props}
    >
      {children}
    </PopoverPrimitive.Trigger>
  )
}

export function AutocompleteIcon({
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return <span data-slot="autocomplete-icon" {...props} />
}

export function useAutocompleteFilter(
  options?: Intl.CollatorOptions & { locale?: Intl.LocalesArgument }
): AutocompleteFilter {
  const collator = React.useMemo(
    () =>
      new Intl.Collator(options?.locale, {
        sensitivity: "base",
        usage: "search",
        ...options,
      }),
    [options]
  )
  const normalize = React.useCallback(
    <Item,>(item: Item, itemToString?: (item: Item) => string) =>
      itemToText(item, itemToString),
    []
  )

  return React.useMemo(
    () => ({
      contains: <Item,>(
        item: Item,
        query: string,
        itemToString?: (item: Item) => string
      ) => normalize(item, itemToString).includes(query.toLocaleLowerCase()),
      startsWith: <Item,>(
        item: Item,
        query: string,
        itemToString?: (item: Item) => string
      ) => {
        const text = normalize(item, itemToString)
        const normalizedQuery = query.toLocaleLowerCase()
        return (
          text.startsWith(normalizedQuery) ||
          collator.compare(text.slice(0, normalizedQuery.length), query) === 0
        )
      },
      endsWith: <Item,>(
        item: Item,
        query: string,
        itemToString?: (item: Item) => string
      ) => {
        const text = normalize(item, itemToString)
        const normalizedQuery = query.toLocaleLowerCase()
        return (
          text.endsWith(normalizedQuery) ||
          collator.compare(text.slice(-normalizedQuery.length), query) === 0
        )
      },
    }),
    [collator, normalize]
  )
}

export const AutocompletePrimitive = {
  Clear: AutocompleteClear,
  Collection: AutocompleteCollection,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Icon: AutocompleteIcon,
  Input: AutocompleteInput,
  InputGroup: "div",
  Item: AutocompleteItem,
  List: AutocompleteList,
  Popup: AutocompletePopup,
  Portal: PopoverPrimitive.Portal,
  Positioner: PopoverPrimitive.Content,
  Root: Autocomplete,
  Row: AutocompleteRow,
  Separator: AutocompleteSeparator,
  Status: AutocompleteStatus,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  useFilter: useAutocompleteFilter,
}
