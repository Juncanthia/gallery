import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import {
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  X as XIcon,
} from "lucide-react"

import { Button } from "@/components/base/button"
import { cn } from "@/lib/utils"
import {
  inputAffixWrapperVariants,
  inputElementVariants,
  inputRootVariants,
  textareaVariants,
  type InputSize,
  type InputStatus,
  type InputVariant,
} from "@/components/base/input-variants"

type InputAllowClear = boolean | { clearIcon?: React.ReactNode }

type InputCountConfig = {
  show?: boolean
  max?: number
  strategy?: (value: string) => number
  exceedFormatter?: (value: string, config: { max: number }) => string
  formatter?: (info: { value: string; count: number; maxLength?: number }) => React.ReactNode
}

type InputRef = {
  focus: (options?: FocusOptions) => void
  blur: () => void
  select: () => void
  input: HTMLInputElement | null
  nativeElement: HTMLElement | null
}

type TextAreaRef = {
  focus: (options?: FocusOptions) => void
  blur: () => void
  select: () => void
  textarea: HTMLTextAreaElement | null
  nativeElement: HTMLElement | null
}

type TextAreaAutoSize = boolean | { minRows?: number; maxRows?: number }

type VisibilityToggle =
  | boolean
  | {
      visible?: boolean
      onVisibleChange?: (visible: boolean) => void
      tabIndex?: number
    }

type InputBaseProps = {
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
}

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
  InputBaseProps & {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    allowClear?: InputAllowClear
    onClear?: () => void
    addonBefore?: React.ReactNode
    addonAfter?: React.ReactNode
    showCount?: boolean | {
      formatter?: InputCountConfig["formatter"]
    }
    count?: InputCountConfig
  }

type TextAreaProps = React.ComponentPropsWithoutRef<"textarea"> &
  InputBaseProps & {
    allowClear?: InputAllowClear
    onClear?: () => void
    showCount?: boolean | {
      formatter?: InputCountConfig["formatter"]
    }
    count?: InputCountConfig
    autoSize?: TextAreaAutoSize
  }

type InputPasswordProps = InputProps & {
  visibilityToggle?: VisibilityToggle
  iconRender?: (visible: boolean) => React.ReactNode
}

type InputSearchProps = Omit<InputProps, "type" | "suffix"> & {
  enterButton?: boolean | React.ReactNode
  loading?: boolean
  searchIcon?: React.ReactNode
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>
  onSearch?: (
    value: string,
    event?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
    info?: { source?: "clear" | "input" }
  ) => void
}

type InputNumberProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "prefix"
> &
  InputBaseProps & {
    value?: number
    defaultValue?: number
    onChange?: (value: number | null) => void
    min?: number
    max?: number
    step?: number
    precision?: number
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    controls?: boolean
    formatter?: (value: number | undefined) => string
    parser?: (displayValue: string) => number
    disabled?: boolean
  }

type InputOTPSeparator =
  | number
  | number[]
  | React.ReactNode
  | ((index: number) => React.ReactNode)

type InputOTPProps = Omit<
  React.ComponentPropsWithoutRef<typeof OTPInput>,
  "children" | "maxLength" | "render" | "size"
> &
  InputBaseProps & {
    length?: number
    separator?: InputOTPSeparator
    mask?: boolean | string
    formatter?: (value: string) => string
    containerClassName?: string
  }

type InputCompound = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  TextArea: typeof InputTextArea
  Password: typeof InputPassword
  Search: typeof InputSearch
  Number: typeof InputNumber
  OTP: typeof InputOTP
}

function getClearIcon(allowClear: InputAllowClear) {
  if (typeof allowClear === "object") return allowClear.clearIcon ?? <XIcon />
  return <XIcon />
}

function setNativeInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = input instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set
  valueSetter?.call(input, value)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

function ClearButton({
  allowClear,
  onClick,
}: {
  allowClear: InputAllowClear
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      type="button"
      aria-label="Clear input"
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-40 [&_svg:not([class*='size-'])]:size-3.5"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {getClearIcon(allowClear)}
    </button>
  )
}

function getCount(value: string, count?: InputCountConfig) {
  return count?.strategy ? count.strategy(value) : value.length
}

function getCountConfig(
  showCount: InputProps["showCount"] | TextAreaProps["showCount"],
  count: InputCountConfig | undefined,
  maxLength: number | undefined
) {
  const mergedCount: InputCountConfig = {
    max: maxLength,
    ...count,
  }

  if (typeof showCount === "object") {
    mergedCount.show = true
    mergedCount.formatter = showCount.formatter
  } else if (showCount) {
    mergedCount.show = true
  }

  return mergedCount
}

function getCountNode(value: string, count: InputCountConfig) {
  if (!count.show) return null
  const currentCount = getCount(value, count)
  const maxLength = count.max

  if (count.formatter) {
    return count.formatter({ value, count: currentCount, maxLength })
  }

  return `${currentCount}${maxLength ? ` / ${maxLength}` : ""}`
}

function formatExceededValue(value: string, count: InputCountConfig) {
  if (!count.max || !count.exceedFormatter) return value
  if (getCount(value, count) <= count.max) return value
  return count.exceedFormatter(value, { max: count.max })
}

const InputBase = React.forwardRef<InputRef, InputProps>(function Input(
  {
    className,
    size = "middle",
    variant = "outlined",
    status,
    prefix,
    suffix,
    allowClear = false,
    onClear,
    addonBefore,
    addonAfter,
    showCount = false,
    count,
    onChange,
    value,
    defaultValue,
    disabled,
    maxLength,
    ...props
  },
  ref
) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const nativeElementRef = React.useRef<HTMLElement | null>(null)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    defaultValue == null ? "" : String(defaultValue)
  )
  const currentValue = value == null ? uncontrolledValue : String(value)
  const showClear = Boolean(allowClear && !disabled && currentValue)
  const mergedStatus = status ?? "default"
  const countConfig = getCountConfig(showCount, count, maxLength)
  const countNode = getCountNode(currentValue, countConfig)
  const hasCount = Boolean(countNode)
  const hasAffix = Boolean(prefix || suffix || showClear || hasCount)
  const hasAddon = Boolean(addonBefore || addonAfter)

  React.useImperativeHandle(ref, () => ({
    focus: (options) => inputRef.current?.focus(options),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    get input() {
      return inputRef.current
    },
    get nativeElement() {
      return nativeElementRef.current
    },
  }), [])

  const setInputNode = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (!hasAffix) nativeElementRef.current = node
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = formatExceededValue(event.target.value, countConfig)
    if (nextValue !== event.target.value) {
      setNativeInputValue(event.target, nextValue)
    }
    if (value == null) setUncontrolledValue(nextValue)
    onChange?.(event)
  }

  const handleClear = () => {
    const input = inputRef.current
    if (!input) return
    setNativeInputValue(input, "")
    if (value == null) setUncontrolledValue("")
    onClear?.()
    input.focus()
  }

  const suffixNode = suffix || hasCount ? (
    <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
      {suffix}
      {hasCount && <span data-slot="input-count" className="text-xs">{countNode}</span>}
    </span>
  ) : null

  const inputNode = hasAffix ? (
    <span
      ref={(node) => {
        nativeElementRef.current = node
      }}
      data-slot="input-wrapper"
      data-variant={variant}
      data-size={size}
      data-status={status}
      className={cn(
        inputAffixWrapperVariants({ size, variant, status: mergedStatus }),
        hasAddon && addonBefore && "rounded-l-none",
        hasAddon && addonAfter && "rounded-r-none",
        !hasAddon && className
      )}
    >
      {prefix && (
        <span data-slot="input-prefix" className="inline-flex shrink-0 items-center text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        ref={setInputNode}
        data-slot="input"
        className={cn(inputElementVariants({ size }))}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...props}
      />
      {showClear && <ClearButton allowClear={allowClear} onClick={handleClear} />}
      {suffixNode && (
        <span data-slot="input-suffix" className="inline-flex shrink-0 items-center">
          {suffixNode}
        </span>
      )}
    </span>
  ) : (
    <input
      ref={setInputNode}
      data-slot="input"
      className={cn(
        inputRootVariants({ size, variant, status: mergedStatus }),
        hasAddon && addonBefore && "rounded-l-none",
        hasAddon && addonAfter && "rounded-r-none",
        !hasAddon && className
      )}
      disabled={disabled}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...props}
    />
  )

  if (!hasAddon) return inputNode

  return (
    <span
      data-slot="input-addon-wrapper"
      className={cn("inline-flex w-full min-w-0 items-stretch", className)}
    >
      {addonBefore && (
        <span className="inline-flex shrink-0 items-center rounded-l-md border border-r-0 border-input bg-muted px-2.5 text-sm text-muted-foreground shadow-xs">
          {addonBefore}
        </span>
      )}
      {inputNode}
      {addonAfter && (
        <span className="inline-flex shrink-0 items-center rounded-r-md border border-l-0 border-input bg-muted px-2.5 text-sm text-muted-foreground shadow-xs">
          {addonAfter}
        </span>
      )}
    </span>
  )
})
const InputTextArea = React.forwardRef<TextAreaRef, TextAreaProps>(function InputTextArea(
  {
    className,
    size = "middle",
    variant = "outlined",
    status,
    allowClear = false,
    onClear,
    onChange,
    value,
    defaultValue,
    disabled,
    maxLength,
    showCount = false,
    count,
    autoSize = false,
    rows,
    onInput,
    ...props
  },
  ref
) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const nativeElementRef = React.useRef<HTMLElement | null>(null)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    defaultValue == null ? "" : String(defaultValue)
  )
  const currentValue = value == null ? uncontrolledValue : String(value)
  const showClear = Boolean(allowClear && !disabled && currentValue)
  const mergedStatus = status ?? "default"
  const countConfig = getCountConfig(showCount, count, maxLength)

  React.useImperativeHandle(ref, () => ({
    focus: (options) => textareaRef.current?.focus(options),
    blur: () => textareaRef.current?.blur(),
    select: () => textareaRef.current?.select(),
    get textarea() {
      return textareaRef.current
    },
    get nativeElement() {
      return nativeElementRef.current
    },
  }), [])

  const resizeTextarea = React.useCallback(() => {
    if (!autoSize || !textareaRef.current) return
    const textarea = textareaRef.current
    const autoSizeConfig = typeof autoSize === "object" ? autoSize : {}
    const computedStyle = window.getComputedStyle(textarea)
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 20
    textarea.style.height = "auto"
    if (autoSizeConfig.minRows) {
      textarea.style.minHeight = `${lineHeight * autoSizeConfig.minRows}px`
    }
    if (autoSizeConfig.maxRows) {
      textarea.style.maxHeight = `${lineHeight * autoSizeConfig.maxRows}px`
      textarea.style.overflowY = textarea.scrollHeight > lineHeight * autoSizeConfig.maxRows ? "auto" : "hidden"
    } else {
      textarea.style.overflowY = "hidden"
    }
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [autoSize])

  React.useLayoutEffect(() => {
    resizeTextarea()
  }, [currentValue, resizeTextarea])

  const setTextareaNode = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node
    nativeElementRef.current = node
  }

  const handleClear = () => {
    const textareaElement = textareaRef.current
    if (!textareaElement) return
    setNativeInputValue(textareaElement, "")
    if (value == null) setUncontrolledValue("")
    onClear?.()
    textareaElement.focus()
    requestAnimationFrame(resizeTextarea)
  }

  const countNode = countConfig.show ? (
    <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
      {getCountNode(currentValue, countConfig)}
    </span>
  ) : null

  const textarea = (
    <textarea
      ref={setTextareaNode}
      data-slot="textarea"
      className={cn(
        textareaVariants({ size, variant, status: mergedStatus }),
        (showClear || showCount) && "pr-8",
        showCount && "pb-6",
        className
      )}
      disabled={disabled}
      maxLength={maxLength}
      rows={autoSize ? undefined : rows}
      value={value}
      defaultValue={defaultValue}
      onInput={(event) => {
        resizeTextarea()
        onInput?.(event)
      }}
      onChange={(event) => {
        const nextValue = formatExceededValue(event.target.value, countConfig)
        if (nextValue !== event.target.value) {
          setNativeInputValue(event.target, nextValue)
          requestAnimationFrame(resizeTextarea)
        }
        if (value == null) setUncontrolledValue(nextValue)
        onChange?.(event)
      }}
      {...props}
    />
  )

  if (!showClear && !showCount) return textarea

  return (
    <span
      ref={(node) => {
        nativeElementRef.current = node
      }}
      className="relative inline-flex w-full"
    >
      {textarea}
      {showClear && (
        <span className="absolute top-2 right-2">
          <ClearButton allowClear={allowClear} onClick={handleClear} />
        </span>
      )}
      {countNode}
    </span>
  )
})
const InputPassword = React.forwardRef<InputRef, InputPasswordProps>(function InputPassword(
  {
    visibilityToggle = true,
    iconRender,
    suffix,
    type: _type,
    disabled,
    ...props
  },
  ref
) {
  const isToggleEnabled = visibilityToggle !== false
  const visibilityConfig = typeof visibilityToggle === "object" ? visibilityToggle : undefined
  const isControlled = visibilityConfig?.visible !== undefined
  const [innerVisible, setInnerVisible] = React.useState(false)
  const visible = isControlled ? Boolean(visibilityConfig?.visible) : innerVisible
  void _type

  const setVisible = (nextVisible: boolean) => {
    if (!isControlled) setInnerVisible(nextVisible)
    visibilityConfig?.onVisibleChange?.(nextVisible)
  }

  const toggle = isToggleEnabled ? (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      tabIndex={visibilityConfig?.tabIndex}
      disabled={disabled}
      className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground opacity-80 hover:opacity-100 disabled:pointer-events-none disabled:opacity-40 [&_svg:not([class*='size-'])]:size-4"
      onMouseDown={(event) => event.preventDefault()}
      onMouseUp={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          setVisible(!visible)
        }
      }}
      onClick={() => setVisible(!visible)}
    >
      {iconRender ? iconRender(visible) : visible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  ) : null

  return (
    <InputBase
      ref={ref}
      type={visible ? "text" : "password"}
      disabled={disabled}
      suffix={
        suffix || toggle ? (
          <span className="inline-flex items-center gap-1">
            {suffix}
            {toggle}
          </span>
        ) : undefined
      }
      {...props}
    />
  )
})
const InputSearch = React.forwardRef<InputRef, InputSearchProps>(function InputSearch(
  {
    enterButton = false,
    loading = false,
    searchIcon = <SearchIcon />,
    onSearch,
    onPressEnter,
    onKeyDown,
    onChange,
    onClear,
    onCompositionStart,
    onCompositionEnd,
    value,
    defaultValue,
    disabled,
    className,
    size = "middle",
    variant = "outlined",
    status,
    allowClear,
    ...props
  },
  ref
) {
  const inputRef = React.useRef<InputRef>(null)
  const isComposingRef = React.useRef(false)

  React.useImperativeHandle(ref, () => ({
    focus: (options) => inputRef.current?.focus(options),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    get input() {
      return inputRef.current?.input ?? null
    },
    get nativeElement() {
      return inputRef.current?.nativeElement ?? null
    },
  }), [])

  const triggerSearch = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
    source: "clear" | "input" = "input"
  ) => {
    onSearch?.(inputRef.current?.input?.value ?? "", event, { source })
  }

  const input = (
    <InputBase
      ref={inputRef}
      type="search"
      size={size}
      variant={variant}
      status={status}
      className={enterButton ? "rounded-r-none" : className}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      allowClear={allowClear}
      onClear={() => {
        onClear?.()
        onSearch?.("", undefined, { source: "clear" })
      }}
      onChange={onChange}
      onCompositionStart={(event) => {
        isComposingRef.current = true
        onCompositionStart?.(event)
      }}
      onCompositionEnd={(event) => {
        isComposingRef.current = false
        onCompositionEnd?.(event)
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onPressEnter?.(event)
          if (!loading && !isComposingRef.current) triggerSearch(event)
        }
        onKeyDown?.(event)
      }}
      suffix={
        enterButton ? undefined : (
          <button
            type="button"
            aria-label="Search"
            disabled={disabled || loading}
            className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground opacity-80 hover:opacity-100 disabled:pointer-events-none disabled:opacity-40"
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => triggerSearch(event)}
          >
            {searchIcon}
          </button>
        )
      }
      {...props}
    />
  )

  if (!enterButton) return input

  const searchButton = React.isValidElement(enterButton) ? (
    React.cloneElement(
      enterButton as React.ReactElement<{
        className?: string
        onClick?: React.MouseEventHandler<HTMLElement>
        onMouseDown?: React.MouseEventHandler<HTMLElement>
      }>,
      {
        className: cn(
          "rounded-l-none",
          (enterButton.props as { className?: string }).className
        ),
        onMouseDown: (event) => {
          event.preventDefault()
          ;(enterButton.props as { onMouseDown?: React.MouseEventHandler<HTMLElement> })
            .onMouseDown?.(event)
        },
        onClick: (event) => {
          ;(enterButton.props as { onClick?: React.MouseEventHandler<HTMLElement> })
            .onClick?.(event)
          triggerSearch(event)
        },
      }
    )
  ) : (
    <Button
      htmlType="button"
      size={size}
      color={enterButton === true ? "primary" : "default"}
      variant={enterButton === true ? "solid" : "outlined"}
      loading={loading}
      disabled={disabled}
      className="rounded-l-none"
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => triggerSearch(event)}
    >
      {enterButton === true ? searchIcon : enterButton}
    </Button>
  )

  return (
    <span className={cn("inline-flex w-full", className)}>
      {input}
      {searchButton}
    </span>
  )
})
const InputNumber = React.forwardRef<HTMLDivElement, InputNumberProps>(function InputNumber(
  {
    value,
    defaultValue = 0,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    precision,
    prefix,
    suffix,
    controls = true,
    formatter,
    parser,
    className,
    disabled,
    size = "middle",
    variant = "outlined",
    status,
    ...props
  },
  ref
) {
  const format = React.useCallback(
    (num: number | undefined) => {
      if (formatter && num !== undefined) return formatter(num)
      if (num === undefined) return ""
      if (precision !== undefined) return num.toFixed(precision)
      return String(num)
    },
    [formatter, precision]
  )
  const parse = React.useCallback(
    (displayValue: string) => {
      if (parser) return parser(displayValue)
      const parsed = Number.parseFloat(displayValue)
      return Number.isNaN(parsed) ? 0 : parsed
    },
    [parser]
  )
  const [inputValue, setInputValue] = React.useState(() => format(defaultValue))
  const displayValue = value === undefined ? inputValue : format(value)
  const currentValue = value ?? parse(inputValue)
  const canDecrement = currentValue > min
  const canIncrement = currentValue < max
  const mergedStatus = status ?? "default"


  const clamp = React.useCallback(
    (num: number) => Math.min(max, Math.max(min, num)),
    [max, min]
  )

  const commit = (raw: string) => {
    if (raw === "" || raw === "-") {
      setInputValue(raw)
      onChange?.(null)
      return
    }
    const nextValue = clamp(parse(raw))
    setInputValue(format(nextValue))
    onChange?.(nextValue)
  }

  const stepValue = (direction: 1 | -1) => {
    const nextValue = clamp(currentValue + direction * step)
    setInputValue(format(nextValue))
    onChange?.(nextValue)
  }

  return (
    <div
      ref={ref}
      data-slot="input-number"
      className={cn(inputAffixWrapperVariants({ size, variant, status: mergedStatus }), className)}
      {...props}
    >
      {controls && (
        <button
          type="button"
          aria-label="Decrease value"
          disabled={disabled || !canDecrement}
          className="-ml-1 inline-flex h-full w-7 shrink-0 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          onClick={() => stepValue(-1)}
        >
          <MinusIcon className="size-3" />
        </button>
      )}
      {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
      <input
        data-slot="input-number-control"
        type="text"
        inputMode="decimal"
        value={displayValue}
        disabled={disabled}
        className={cn(inputElementVariants({ size }), "text-center")}
        onChange={(event) => setInputValue(event.target.value)}
        onBlur={() => commit(inputValue)}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault()
            if (canIncrement && !disabled) stepValue(1)
          }
          if (event.key === "ArrowDown") {
            event.preventDefault()
            if (canDecrement && !disabled) stepValue(-1)
          }
        }}
      />
      {suffix && <span className="shrink-0 text-muted-foreground">{suffix}</span>}
      {controls && (
        <button
          type="button"
          aria-label="Increase value"
          disabled={disabled || !canIncrement}
          className="-mr-1 inline-flex h-full w-7 shrink-0 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          onClick={() => stepValue(1)}
        >
          <PlusIcon className="size-3" />
        </button>
      )}
    </div>
  )
})

function InputOTPSlot({
  index,
  size,
  status,
  mask,
}: {
  index: number
  size: InputSize
  status: InputStatus | undefined
  mask?: boolean | string
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  const displayChar = mask && char ? (typeof mask === "string" ? mask : "•") : char

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-status={status}
      className={cn(
        "relative flex items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[status=error]:border-destructive data-[status=error]:data-[active=true]:ring-destructive/20 data-[status=warning]:border-amber-500 data-[status=warning]:data-[active=true]:ring-amber-500/20 dark:bg-input/30",
        size === "small" && "size-8 text-xs",
        size === "middle" && "size-9",
        size === "large" && "size-10"
      )}
    >
      {displayChar}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparatorNode({ children }: { children?: React.ReactNode }) {
  return (
    <div data-slot="input-otp-separator" className="flex items-center text-muted-foreground" role="separator">
      {children ?? <MinusIcon className="size-4" />}
    </div>
  )
}

function shouldSplitOtp(separator: InputOTPSeparator | undefined, index: number) {
  if (typeof separator === "number") return index === separator
  if (Array.isArray(separator)) return separator.includes(index)
  return false
}

function renderOtpSeparatorContent(separator: InputOTPSeparator | undefined, index: number) {
  if (!separator) return null
  if (typeof separator === "function") return separator(index)
  if (React.isValidElement(separator)) return separator
  if (typeof separator !== "number" && !Array.isArray(separator)) {
    return separator
  }
  return null
}

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(function InputOTP(
  {
    length = 6,
    size = "middle",
    status,
    separator,
    mask,
    formatter,
    value,
    defaultValue,
    onChange,
    className,
    containerClassName,
    ...props
  },
  ref
) {
  const groups: React.ReactNode[] = []
  let slots: React.ReactNode[] = []

  for (let index = 0; index < length; index += 1) {
    slots.push(
      <InputOTPSlot key={index} index={index} size={size} status={status} mask={mask} />
    )

    const splitIndex = index + 1
    if (splitIndex < length && shouldSplitOtp(separator, splitIndex)) {
      groups.push(
        <div key={`group-${splitIndex}`} data-slot="input-otp-group" className="flex items-center rounded-md">
          {slots}
        </div>
      )
      groups.push(
        <InputOTPSeparatorNode key={`separator-${splitIndex}`}>
          {renderOtpSeparatorContent(separator, splitIndex)}
        </InputOTPSeparatorNode>
      )
      slots = []
    }
  }

  groups.push(
    <div key="group-last" data-slot="input-otp-group" className="flex items-center rounded-md">
      {slots}
    </div>
  )

  return (
    <OTPInput
      ref={ref}
      data-slot="input-otp"
      maxLength={length}
      value={value === undefined ? undefined : formatter ? formatter(String(value)) : String(value)}
      defaultValue={
        defaultValue === undefined
          ? undefined
          : formatter
            ? formatter(String(defaultValue))
            : String(defaultValue)
      }
      onChange={(nextValue) => {
        onChange?.(formatter ? formatter(nextValue) : nextValue)
      }}
      spellCheck={false}
      containerClassName={cn(
        "cn-input-otp flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    >
      {groups}
    </OTPInput>
  )
})

InputBase.displayName = "Input"
InputTextArea.displayName = "Input.TextArea"
InputPassword.displayName = "Input.Password"
InputSearch.displayName = "Input.Search"
InputNumber.displayName = "Input.Number"
InputOTP.displayName = "Input.OTP"

const Input = Object.assign(InputBase, {
  TextArea: InputTextArea,
  Password: InputPassword,
  Search: InputSearch,
  Number: InputNumber,
  OTP: InputOTP,
}) as InputCompound

export {
  Input,
  type InputRef,
  type TextAreaRef,
  type InputOTPProps,
  type InputNumberProps,
  type InputPasswordProps,
  type InputProps,
  type InputSearchProps,
  type TextAreaProps,
}
export type { InputSize, InputStatus, InputVariant } from "@/components/base/input-variants"
