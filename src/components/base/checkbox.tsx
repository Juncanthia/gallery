import {
  Checkbox as CheckboxPrimitive,
  CheckboxIndicator as CheckboxIndicatorPrimitive,
  type CheckboxProps as CheckboxPrimitiveProps,
} from '@/primitives/radix/checkbox';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const checkboxVariants = cva(
  'peer shrink-0 flex items-center justify-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-500 focus-visible:ring-offset-2 [&[data-state=checked],&[data-state=indeterminate]]:bg-primary [&[data-state=checked],&[data-state=indeterminate]]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background border',
        accent: 'bg-input',
      },
      size: {
        small: 'size-4.5 rounded-[5px]',
        middle: 'size-5 rounded-sm',
        large: 'size-6 rounded-[7px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'middle',
    },
  },
);

const checkboxIndicatorVariants = cva('', {
  variants: {
    size: {
      small: 'size-3',
      middle: 'size-3.5',
      large: 'size-4',
    },
  },
  defaultVariants: {
    size: 'middle',
  },
});

type CheckboxSize = NonNullable<VariantProps<typeof checkboxVariants>['size']>;
type CheckboxVariant = NonNullable<VariantProps<typeof checkboxVariants>['variant']>;
type CheckboxValue = string | number | boolean;

type CheckboxOption = {
  label: React.ReactNode;
  value: CheckboxValue;
  disabled?: boolean;
  className?: string;
  title?: string;
  id?: string;
  required?: boolean;
};

type CheckboxProps = Omit<CheckboxPrimitiveProps, 'onChange' | 'value'> &
  VariantProps<typeof checkboxVariants> & {
    label?: React.ReactNode;
    wrapperClassName?: string;
    labelClassName?: string;
    indeterminate?: boolean;
    value?: CheckboxValue;
    onChange?: (checked: boolean) => void;
  };

type CheckboxGroupProps = Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  options?: Array<CheckboxOption | string | number>;
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onValueChange?: (value: CheckboxValue[]) => void;
  disabled?: boolean;
  name?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  direction?: 'horizontal' | 'vertical';
  optionClassName?: string;
  labelClassName?: string;
};

function normalizeCheckboxOption(option: CheckboxOption | string | number): CheckboxOption {
  if (typeof option === 'string' || typeof option === 'number') {
    return { label: option, value: option };
  }

  return option;
}

function useCheckboxGroupValue({
  defaultValue,
  onValueChange,
  value,
}: {
  defaultValue?: CheckboxValue[];
  onValueChange?: (value: CheckboxValue[]) => void;
  value?: CheckboxValue[];
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<CheckboxValue[]>(
    defaultValue ?? [],
  );
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: CheckboxValue[]) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

function Checkbox({
  className,
  children,
  label,
  wrapperClassName,
  labelClassName,
  indeterminate,
  checked,
  onCheckedChange,
  onChange,
  value,
  variant,
  size = 'middle',
  ...props
}: CheckboxProps) {
  const labelNode = label ?? children;
  const mergedChecked = indeterminate ? 'indeterminate' : checked;

  const handleCheckedChange = React.useCallback(
    (nextChecked: boolean | 'indeterminate') => {
      onCheckedChange?.(nextChecked);
      onChange?.(nextChecked === true);
    },
    [onChange, onCheckedChange],
  );

  const control = (
    <CheckboxPrimitive
      className={cn(checkboxVariants({ variant, size, className }))}
      checked={mergedChecked}
      onCheckedChange={handleCheckedChange}
      value={value === undefined ? undefined : String(value)}
      {...props}
    >
      <CheckboxIndicatorPrimitive
        className={cn(checkboxIndicatorVariants({ size }))}
      />
    </CheckboxPrimitive>
  );

  if (!labelNode) {
    return control;
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 text-sm leading-none font-normal',
        props.disabled && 'cursor-not-allowed opacity-60',
        wrapperClassName,
      )}
    >
      {control}
      <span className={cn('select-none', labelClassName)}>{labelNode}</span>
    </label>
  );
}

function CheckboxGroup({
  className,
  options = [],
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  size = 'middle',
  variant,
  direction = 'horizontal',
  optionClassName,
  labelClassName,
  ...props
}: CheckboxGroupProps) {
  const normalizedOptions = React.useMemo(
    () => options.map(normalizeCheckboxOption),
    [options],
  );
  const [checkedValues, setCheckedValues] = useCheckboxGroupValue({
    defaultValue,
    onValueChange,
    value,
  });

  const optionValues = React.useMemo(
    () => normalizedOptions.map((option) => option.value),
    [normalizedOptions],
  );

  const handleOptionChange = React.useCallback(
    (optionValue: CheckboxValue, checked: boolean) => {
      const nextValueSet = new Set(checkedValues);

      if (checked) {
        nextValueSet.add(optionValue);
      } else {
        nextValueSet.delete(optionValue);
      }

      setCheckedValues(optionValues.filter((item) => nextValueSet.has(item)));
    },
    [checkedValues, optionValues, setCheckedValues],
  );

  return (
    <div
      role="group"
      className={cn(
        'flex gap-3',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
      {...props}
    >
      {normalizedOptions.map((option) => (
        <Checkbox
          checked={checkedValues.includes(option.value)}
          disabled={disabled || option.disabled}
          id={option.id}
          key={String(option.value)}
          label={option.label}
          labelClassName={labelClassName}
          name={name}
          onCheckedChange={(nextChecked) =>
            handleOptionChange(option.value, nextChecked === true)
          }
          required={option.required}
          size={size}
          title={option.title}
          value={option.value}
          variant={variant}
          wrapperClassName={cn(optionClassName, option.className)}
        />
      ))}
    </div>
  );
}

export {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxOption,
  type CheckboxProps,
  type CheckboxSize,
  type CheckboxValue,
  type CheckboxVariant,
};
