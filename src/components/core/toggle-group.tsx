'use client';

import * as React from 'react';
import {ToggleGroup as RadixToggleGroup} from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@/_internals/foundations/primitives/effects/highlight';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { type VariantProps } from 'class-variance-authority';
import { toggleVariants } from '@/components/core/toggle';
import { cn } from '@/_internals/foundations/utils/cn';

type ToggleGroupPrimitiveContextType = {
  value: string | string[] | undefined;
  setValue: (value: string | string[] | undefined) => void;
  type: 'single' | 'multiple';
};

const [ToggleGroupValueProvider, useToggleGroupPrimitive] =
  getStrictContext<ToggleGroupPrimitiveContextType>('ToggleGroupPrimitiveContext');

type ToggleGroupPrimitiveProps = React.ComponentProps<typeof RadixToggleGroup.Root>;

function ToggleGroupPrimitive(props: ToggleGroupPrimitiveProps) {
  const [value, setValue] = useControlledState<string | string[] | undefined>({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onValueChange as (
      value: string | string[] | undefined,
    ) => void,
  });

  return (
    <ToggleGroupValueProvider value={{ value, setValue, type: props.type }}>
      <RadixToggleGroup.Root
        data-slot="toggle-group"
        {...props}
        onValueChange={setValue}
      />
    </ToggleGroupValueProvider>
  );
}

type ToggleGroupItemPrimitiveProps = Omit<
  React.ComponentProps<typeof RadixToggleGroup.Item>,
  'asChild'
> &
  HTMLMotionProps<'button'>;

function ToggleGroupItemPrimitive({ value, disabled, ...props }: ToggleGroupItemPrimitiveProps) {
  return (
    <RadixToggleGroup.Item value={value} disabled={disabled} asChild>
      <motion.button
        data-slot="toggle-group-item"
        whileTap={{ scale: 0.95 }}
        {...props}
      />
    </RadixToggleGroup.Item>
  );
}

type ToggleGroupHighlightProps = Omit<HighlightProps, 'controlledItems'>;

function ToggleGroupHighlightPrimitive({
  transition = { type: 'spring', stiffness: 200, damping: 25 },
  ...props
}: ToggleGroupHighlightProps) {
  const { value } = useToggleGroupPrimitive();

  return (
    <Highlight
      data-slot="toggle-group-highlight"
      controlledItems
      value={typeof value === 'string' ? value : null}
      exitDelay={0}
      transition={transition}
      {...props}
    />
  );
}

type ToggleGroupHighlightItemProps = HighlightItemProps &
  HTMLMotionProps<'div'> & {
    children: React.ReactElement;
  };

function ToggleGroupHighlightItemPrimitive({
  children,
  style,
  ...props
}: ToggleGroupHighlightItemProps) {
  const { type, value } = useToggleGroupPrimitive();

  if (type === 'single') {
    return (
      <HighlightItem
        data-slot="toggle-group-highlight-item"
        style={{ inset: 0, ...style }}
        {...props}
      >
        {children}
      </HighlightItem>
    );
  }

  if (type === 'multiple' && React.isValidElement(children)) {
    const isActive = props.value && value && value.includes(props.value);

    const element = children as React.ReactElement<React.ComponentProps<'div'>>;

    return React.cloneElement(
      children,
      {
        style: {
          ...element.props.style,
          position: 'relative',
        },
        ...element.props,
      },
      <>
        <AnimatePresence>
          {isActive && (
            <motion.div
              data-slot="toggle-group-highlight-item"
              style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              {...props}
            />
          )}
        </AnimatePresence>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          {element.props.children}
        </div>
      </>,
    );
  }
}

const [ToggleGroupProvider, useToggleGroup] =
  getStrictContext<VariantProps<typeof toggleVariants>>('ToggleGroupContext');

type ToggleGroupProps = ToggleGroupPrimitiveProps &
  VariantProps<typeof toggleVariants> & {
    options?: ToggleGroupOption[];
    direction?: 'horizontal' | 'vertical';
    spacing?: 'default' | 'none';
  };

type ToggleGroupOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  title?: string;
  'aria-label'?: string;
};

function ToggleGroup({
  className,
  variant,
  size,
  children,
  options,
  direction = 'horizontal',
  orientation,
  spacing = 'default',
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-lg data-[variant=outline]:shadow-xs data-[variant=outline]:border data-[variant=outline]:p-0.5',
        spacing === 'default' && 'gap-0.5',
        spacing === 'none' && 'gap-0',
        direction === 'vertical' && 'flex-col items-stretch',
        className,
      )}
      orientation={orientation ?? direction}
      {...props}
    >
      <ToggleGroupProvider value={{ variant, size }}>
        {props.type === 'single' ? (
          <ToggleGroupHighlightPrimitive className="bg-accent rounded-md">
            {options?.length
              ? options.map((option) => (
                  <ToggleGroupItem
                    aria-label={option['aria-label']}
                    className={option.className}
                    disabled={option.disabled}
                    key={option.value}
                    title={option.title}
                    value={option.value}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))
              : children}
          </ToggleGroupHighlightPrimitive>
        ) : (
          options?.length
            ? options.map((option) => (
                <ToggleGroupItem
                  aria-label={option['aria-label']}
                  className={option.className}
                  disabled={option.disabled}
                  key={option.value}
                  title={option.title}
                  value={option.value}
                >
                  {option.label}
                </ToggleGroupItem>
              ))
            : children
        )}
      </ToggleGroupProvider>
    </ToggleGroupPrimitive>
  );
}

type ToggleGroupItemProps = ToggleGroupItemPrimitiveProps &
  VariantProps<typeof toggleVariants>;

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const { variant: contextVariant, size: contextSize } = useToggleGroup();
  const { type } = useToggleGroupPrimitive();

  return (
    <ToggleGroupHighlightItemPrimitive
      value={props.value}
      className={cn(type === 'multiple' && 'bg-accent rounded-md')}
    >
      <ToggleGroupItemPrimitive
        data-variant={contextVariant || variant}
        data-size={contextSize || size}
        className={cn(
          toggleVariants({
            variant: contextVariant || variant,
            size: contextSize || size,
          }),
          'min-w-0 border-0 flex-1 shrink-0 shadow-none rounded-md focus:z-10 focus-visible:z-10',
          'group-data-[spacing=none]/toggle-group:rounded-none group-data-[spacing=none]/toggle-group:shadow-none',
          'group-data-[spacing=none]/toggle-group:first:rounded-l-md group-data-[spacing=none]/toggle-group:last:rounded-r-md',
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroupItemPrimitive>
    </ToggleGroupHighlightItemPrimitive>
  );
}

export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupOption,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
};
