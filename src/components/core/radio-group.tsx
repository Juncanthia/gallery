'use client';

import * as React from 'react';
import {RadioGroup as RadixRadioGroup} from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { Circle as CircleIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/_internals/foundations/utils/cn';

type RadioGroupContextType = {
  value: string;
  setValue: (value: string) => void;
};

type RadioGroupItemContextType = {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

const [RadioGroupProvider, useRadioGroup] =
  getStrictContext<RadioGroupContextType>('RadioGroupContext');

const [RadioGroupItemProvider, useRadioGroupItem] =
  getStrictContext<RadioGroupItemContextType>('RadioGroupItemContext');

type RadioGroupPrimitiveProps = React.ComponentProps<typeof RadixRadioGroup.Root>;

function RadioGroupPrimitive(props: RadioGroupPrimitiveProps) {
  const [value, setValue] = useControlledState({
    value: props.value ?? undefined,
    defaultValue: props.defaultValue,
    onChange: props.onValueChange,
  });

  return (
    <RadioGroupProvider value={{ value, setValue }}>
      <RadixRadioGroup.Root
        data-slot="radio-group"
        {...props}
        onValueChange={setValue}
      />
    </RadioGroupProvider>
  );
}

type RadioGroupIndicatorProps = Omit<
  React.ComponentProps<typeof RadixRadioGroup.Indicator>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function RadioGroupIndicatorPrimitive({
  transition = { type: 'spring', stiffness: 200, damping: 16 },
  ...props
}: RadioGroupIndicatorProps) {
  const { isChecked } = useRadioGroupItem();

  return (
    <AnimatePresence>
      {isChecked && (
        <RadixRadioGroup.Indicator
          data-slot="radio-group-indicator"
          asChild
          forceMount
        >
          <motion.div
            key="radio-group-indicator-circle"
            data-slot="radio-group-indicator-circle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transition}
            {...props}
          />
        </RadixRadioGroup.Indicator>
      )}
    </AnimatePresence>
  );
}

type RadioGroupItemPrimitiveProps = Omit<
  React.ComponentProps<typeof RadixRadioGroup.Item>,
  'asChild'
> &
  HTMLMotionProps<'button'>;

function RadioGroupItemPrimitive({
  value: valueProps,
  disabled,
  required,
  ...props
}: RadioGroupItemPrimitiveProps) {
  const { value } = useRadioGroup();
  const [isChecked, setIsChecked] = React.useState(value === valueProps);

  React.useEffect(() => {
    setIsChecked(value === valueProps);
  }, [value, valueProps]);

  return (
    <RadioGroupItemProvider value={{ isChecked, setIsChecked }}>
      <RadixRadioGroup.Item
        asChild
        value={valueProps}
        disabled={disabled}
        required={required}
      >
        <motion.button
          data-slot="radio-group-item"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        />
      </RadixRadioGroup.Item>
    </RadioGroupItemProvider>
  );
}

const radioGroupItemVariants = cva(
  'aspect-square shrink-0 rounded-full outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 shadow-xs',
      },
      size: {
        small: 'size-3.5',
        middle: 'size-4',
        large: 'size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'middle',
    },
  },
);

const radioGroupIndicatorVariants = cva(
  'fill-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  {
    variants: {
      size: {
        small: 'size-1.5',
        middle: 'size-2',
        large: 'size-2.5',
      },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

type RadioGroupSize = NonNullable<VariantProps<typeof radioGroupItemVariants>['size']>;

type RadioGroupOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  title?: string;
  id?: string;
  required?: boolean;
};

type RadioGroupProps = Omit<RadioGroupPrimitiveProps, 'children'> & {
  children?: React.ReactNode;
  options?: RadioGroupOption[];
  size?: RadioGroupSize;
  variant?: 'default';
  direction?: 'horizontal' | 'vertical';
  optionClassName?: string;
  labelClassName?: string;
};

function RadioGroup({
  className,
  children,
  options,
  size = 'middle',
  variant = 'default',
  direction = 'vertical',
  optionClassName,
  labelClassName,
  disabled,
  orientation,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      className={cn(
        'gap-3',
        direction === 'vertical' ? 'grid' : 'flex flex-row flex-wrap',
        className,
      )}
      disabled={disabled}
      orientation={orientation ?? direction}
      {...props}
    >
      {options?.length
        ? options.map((option) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm leading-none font-normal',
                (disabled || option.disabled) && 'cursor-not-allowed opacity-60',
                optionClassName,
                option.className,
              )}
              key={option.value}
              title={option.title}
            >
              <RadioGroupItem
                disabled={disabled || option.disabled}
                id={option.id}
                required={option.required}
                size={size}
                variant={variant}
                value={option.value}
              />
              <span className={cn('select-none', labelClassName, option.labelClassName)}>
                {option.label}
              </span>
            </label>
          ))
        : children}
    </RadioGroupPrimitive>
  );
}

type RadioGroupItemProps = RadioGroupItemPrimitiveProps & {
  size?: RadioGroupSize;
  variant?: 'default';
};

function RadioGroupItem({ className, size = 'middle', variant = 'default', ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupItemPrimitive
      className={cn(radioGroupItemVariants({ variant, size }), className)}
      {...props}
    >
      <RadioGroupIndicatorPrimitive className="relative flex items-center justify-center">
<CircleIcon className={radioGroupIndicatorVariants({ size })} />
      </RadioGroupIndicatorPrimitive>
    </RadioGroupItemPrimitive>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupOption,
  type RadioGroupProps,
  type RadioGroupItemProps,
  type RadioGroupSize,
};
