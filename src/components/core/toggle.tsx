'use client';

import * as React from 'react';
import {Toggle as RadixToggle} from 'radix-ui';
import { motion, AnimatePresence, type HTMLMotionProps } from 'motion/react';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type ToggleContextType = {
  isPressed: boolean;
  setIsPressed: (isPressed: boolean) => void;
  disabled?: boolean;
};

const [ToggleProvider, useToggle] =
  getStrictContext<ToggleContextType>('ToggleContext');

type TogglePrimitiveProps = Omit<
  React.ComponentProps<typeof RadixToggle.Root>,
  'asChild'
> &
  HTMLMotionProps<'button'>;

function TogglePrimitive({
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  ...props
}: TogglePrimitiveProps) {
  const [isPressed, setIsPressed] = useControlledState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <ToggleProvider value={{ isPressed, setIsPressed, disabled }}>
      <RadixToggle.Root
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={setIsPressed}
        disabled={disabled}
        asChild
      >
        <motion.button
          data-slot="toggle"
          whileTap={{ scale: 0.95 }}
          {...props}
        />
      </RadixToggle.Root>
    </ToggleProvider>
  );
}

type ToggleHighlightProps = HTMLMotionProps<'div'>;

function ToggleHighlightPrimitive({ style, ...props }: ToggleHighlightProps) {
  const { isPressed, disabled } = useToggle();

  return (
    <AnimatePresence>
      {isPressed && (
        <motion.div
          data-slot="toggle-highlight"
          aria-pressed={isPressed}
          data-state={isPressed ? 'on' : 'off'}
          data-disabled={disabled}
          style={{ position: 'absolute', zIndex: 0, inset: 0, ...style }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

type ToggleItemPrimitiveProps = HTMLMotionProps<'div'>;

function ToggleItemPrimitive({ style, ...props }: ToggleItemPrimitiveProps) {
  const { isPressed, disabled } = useToggle();

  return (
    <motion.div
      data-slot="toggle-item"
      aria-pressed={isPressed}
      data-state={isPressed ? 'on' : 'off'}
      data-disabled={disabled}
      style={{ position: 'relative', zIndex: 1, ...style }}
      {...props}
    />
  );
}

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted/40 hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,background-color,box-shadow] duration-200 ease-in-out aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent/40 hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-1.5 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ToggleProps = TogglePrimitiveProps &
  ToggleItemPrimitiveProps &
  VariantProps<typeof toggleVariants>;

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      className="relative"
    >
      <ToggleHighlightPrimitive className="bg-accent rounded-md" />
      <ToggleItemPrimitive
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    </TogglePrimitive>
  );
}

export { Toggle, toggleVariants, type ToggleProps };
