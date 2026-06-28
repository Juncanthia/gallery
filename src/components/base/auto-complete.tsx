"use client"

import * as React from "react"
import {
  Select,
  type SelectOption,
  type SelectOptionGroup,
  type SelectOptionItem,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
} from "@/components/base/select"

type AutoCompleteProps = {
  /** Options to suggest while typing. Supports flat and grouped formats. */
  options?: SelectOptionItem[]
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
  optionRender?: (option: SelectOption, info: { index: number }) => React.ReactNode
  /** Wrap the popup list node (e.g. to append a footer button). */
  popupRender?: (originNode: React.ReactNode) => React.ReactNode
  /** Custom rendering of the selected value display. Only applies when value matches an option. */
  labelRender?: (option: SelectOption) => React.ReactNode
  /** Popup placement relative to the trigger. @default "bottomLeft" */
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
  /** Filter function or a boolean to control local filtering. Set `false` for async search. @default true */
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean)
  /** Custom sort for filtered options. */
  filterSort?: (a: SelectOption, b: SelectOption, input: string) => number
  /**
   * Callback fired when the input value changes (user typing).
   * Useful for async search: fetch options externally and update the `options` prop.
   */
  onSearch?: (value: string) => void
  /** Callback fired when an option is selected from the dropdown. */
  onSelect?: (value: string, option: SelectOption) => void
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

function AutoComplete(props: AutoCompleteProps) {
  return (
    <Select
      mode="combobox"
      showSearch
      {...props}
    />
  )
}

export { AutoComplete }
export type { AutoCompleteProps }
export type { SelectOption as AutoCompleteOption }
export type { SelectOptionGroup as AutoCompleteOptionGroup }
export type { SelectOptionItem as AutoCompleteOptionItem }
export type { SelectSize as AutoCompleteSize }
export type { SelectStatus as AutoCompleteStatus }
export type { SelectVariant as AutoCompleteVariant }
