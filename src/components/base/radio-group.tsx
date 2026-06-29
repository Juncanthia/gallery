import { Circle as CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  RadioGroup as RadioGroupPrimitive,
  RadioGroupItem as RadioGroupItemPrimitive,
  RadioGroupIndicator as RadioGroupIndicatorPrimitive,
  type RadioGroupProps as RadioGroupPrimitiveProps,
  type RadioGroupItemProps as RadioGroupItemPrimitiveProps,
} from '@/primitives/radix/radio-group';
import { cn } from '@/lib/utils';

const radioGroupItemVariants = cva(
  'aspect-square shrink-0 rounded-full outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 shadow-xs',
        skeuomorphic: 'border border-neutral-300 dark:border-zinc-700 bg-linear-to-b from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.25)] text-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/50 [&[data-state=checked]]:bg-linear-to-b [&[data-state=checked]]:from-white [&[data-state=checked]]:to-neutral-100 [&[data-state=checked]]:border-neutral-300 dark:[&[data-state=checked]]:from-zinc-800 dark:[&[data-state=checked]]:to-zinc-900 dark:[&[data-state=checked]]:border-zinc-700',
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
  variant?: 'default' | 'skeuomorphic';
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
  variant?: 'default' | 'skeuomorphic';
};

function RadioGroupItem({ className, size = 'middle', variant = 'default', ...props }: RadioGroupItemProps) {
  const isSkeuomorphic = variant === 'skeuomorphic';
  return (
    <RadioGroupItemPrimitive
      className={cn(radioGroupItemVariants({ variant, size }), className)}
      {...props}
    >
      <RadioGroupIndicatorPrimitive className="relative flex items-center justify-center">
        {isSkeuomorphic ? (
          <span
            className={cn(
              "rounded-full bg-linear-to-tr from-blue-600 to-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.2)]",
              size === 'small' && 'size-1.5',
              size === 'middle' && 'size-2',
              size === 'large' && 'size-2.5'
            )}
          />
        ) : (
          <CircleIcon className={radioGroupIndicatorVariants({ size })} />
        )}
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
