import React, { type ComponentProps, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Minus as MinusIcon, Plus as PlusIcon } from "lucide-react";

export type InputNumberProps = Omit<ComponentProps<"input">, "onChange" | "value" | "type" | "step" | "min" | "max" | "prefix"> & {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  controls?: boolean;
  formatter?: (value: number | undefined) => string;
  parser?: (displayValue: string) => number;
}

export const InputNumber = React.forwardRef<HTMLDivElement, InputNumberProps>(
  (
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
      ...props
    },
    ref
  ) => {
    const [inputStr, setInputStr] = useState<string>("");

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const format = (num: number | undefined) => {
      if (formatter && num !== undefined) {
        return formatter(num);
      }
      if (num === undefined) return "";
      if (precision !== undefined) {
        return num.toFixed(precision);
      }
      return String(num);
    };

    const parse = (displayValue: string) => {
      if (parser) {
        return parser(displayValue);
      }
      const parsed = parseFloat(displayValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    const commit = (str: string) => {
      if (str === "" || str === "-") {
        onChange?.(null);
        setInputStr(str);
        return;
      }
      const num = parse(str);
      const clamped = clamp(num);
      onChange?.(clamped);
      setInputStr(format(clamped));
    };

    const increment = () => {
      const current = value !== undefined ? value : defaultValue;
      const next = clamp(current + step);
      onChange?.(next);
    };

    const decrement = () => {
      const current = value !== undefined ? value : defaultValue;
      const next = clamp(current - step);
      onChange?.(next);
    };

    useEffect(() => {
      if (value !== undefined) {
        setInputStr(format(value));
      } else {
        setInputStr(format(defaultValue));
      }
    }, [value, defaultValue, precision, formatter]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputStr(e.target.value);
    };

    const handleBlur = () => {
      commit(inputStr);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
    };

    const currentValue = value !== undefined ? value : defaultValue;
    const canDecrement = currentValue > min;
    const canIncrement = currentValue < max;

    return (
      <div
        ref={ref}
        data-slot="input-number"
        className={cn(
          "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs transition focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          className
        )}
        {...props}
      >
        {controls && (
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || !canDecrement}
            className="h-full px-2 border-r border-input hover:bg-muted text-muted-foreground rounded-l-md disabled:opacity-50"
          >
            <MinusIcon className="h-3 w-3" />
          </button>
        )}
        {prefix && (
          <span className="pl-2.5 text-sm text-muted-foreground select-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={inputStr}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent px-2.5 py-1 text-sm text-center outline-none disabled:opacity-50"
        />
        {suffix && (
          <span className="pr-2.5 text-sm text-muted-foreground select-none">
            {suffix}
          </span>
        )}
        {controls && (
          <button
            type="button"
            onClick={increment}
            disabled={disabled || !canIncrement}
            className="h-full px-2 border-l border-input hover:bg-muted text-muted-foreground rounded-r-md disabled:opacity-50"
          >
            <PlusIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

InputNumber.displayName = "InputNumber";
