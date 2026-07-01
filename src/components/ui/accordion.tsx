import { ChevronDown as ChevronDownIcon } from 'lucide-react';

import {
  Accordion as AccordionPrimitive,
  AccordionItem as AccordionItemPrimitive,
  AccordionHeader as AccordionHeaderPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
  AccordionContent as AccordionContentPrimitive,
  useAccordionItem,
  type AccordionProps as AccordionPrimitiveProps,
  type AccordionItemProps as AccordionItemPrimitiveProps,
  type AccordionTriggerProps as AccordionTriggerPrimitiveProps,
  type AccordionContentProps as AccordionContentPrimitiveProps,
} from '@/components/_primitives/radix/accordion';
import { cn } from '@/lib/utils';

type AccordionSize = 'small' | 'middle' | 'large';
type AccordionExpandIconPlacement = 'start' | 'end';
type AccordionKey = string;
type AccordionCollapsible = boolean | 'header' | 'icon' | 'disabled';

type AccordionExpandIconProps = {
  disabled?: boolean;
  isActive: boolean;
  key: AccordionKey;
};

type AccordionExpandIcon = (props: AccordionExpandIconProps) => React.ReactNode;

type AccordionItemOption = {
  key: AccordionKey;
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsible?: Exclude<AccordionCollapsible, boolean>;
  disabled?: boolean;
  extra?: React.ReactNode;
  forceRender?: boolean;
  showArrow?: boolean;
};

type AccordionRootType = 'single' | 'multiple';

type AccordionProps = Omit<
  AccordionPrimitiveProps,
  'collapsible' | 'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  variant?: 'default';
  accordion?: boolean;
  activeKey?: AccordionKey | AccordionKey[];
  bordered?: boolean;
  collapsible?: AccordionCollapsible;
  defaultActiveKey?: AccordionKey | AccordionKey[];
  defaultValue?: AccordionKey | AccordionKey[];
  expandIcon?: AccordionExpandIcon;
  expandIconPlacement?: AccordionExpandIconPlacement;
  ghost?: boolean;
  items?: AccordionItemOption[];
  onChange?: (key: AccordionKey | AccordionKey[] | undefined) => void;
  onValueChange?: (key: AccordionKey | AccordionKey[] | undefined) => void;
  size?: AccordionSize;
  type?: AccordionRootType;
  value?: AccordionKey | AccordionKey[];
};

const accordionTriggerSizeClasses: Record<AccordionSize, string> = {
  small: 'px-3 py-2',
  middle: 'px-4 py-3',
  large: 'px-4 py-4',
};

import * as React from 'react';
const AccordionContext = React.createContext<{ variant?: 'default' }>({ variant: 'default' });

function Accordion({
  variant = 'default',
  accordion,
  activeKey,
  bordered = true,
  className,
  defaultActiveKey,
  defaultValue,
  expandIcon,
  expandIconPlacement = 'start',
  ghost = false,
  items,
  collapsible,
  onChange,
  onValueChange,
  size = 'middle',
  type,
  value,
  ...props
}: AccordionProps) {
  const mergedType = type ?? (accordion ? 'single' : 'multiple');
  const mergedValue = activeKey ?? value;
  const mergedDefaultValue = defaultActiveKey ?? defaultValue;
  const triggerCollapsible = typeof collapsible === 'string' ? collapsible : undefined;
  const rootCollapsible = typeof collapsible === 'boolean' ? collapsible : true;

  const handleValueChange = (nextValue: string | string[] | undefined) => {
    onValueChange?.(nextValue as never);
    onChange?.(nextValue);
  };

  const useDefaultVariant = false;

  if (items?.length) {
    return (
      <AccordionContext.Provider value={{ variant }}>
        <AccordionPrimitive
          className={cn(
            useDefaultVariant
              ? 'rounded-lg border border-neutral-300 dark:border-zinc-700 bg-linear-to-b from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden'
              : bordered && !ghost && 'rounded-md border',
            (ghost || !bordered) && !useDefaultVariant && 'border-none',
            className,
          )}
          type={mergedType}
          value={mergedValue as never}
          defaultValue={mergedValue === undefined ? (mergedDefaultValue as never) : undefined}
          onValueChange={handleValueChange as never}
          collapsible={mergedType === 'single' ? rootCollapsible : undefined}
          {...props}
        >
          {items.map((item) => {
            const itemCollapsible = item.collapsible ?? triggerCollapsible;

            return (
              <AccordionItem
                key={item.key}
                value={item.key}
                disabled={item.disabled || itemCollapsible === 'disabled'}
                className={cn((ghost || !bordered) && 'border-b-0', item.className)}
              >
                <AccordionTrigger
                  arrowPlacement={expandIconPlacement}
                  className={accordionTriggerSizeClasses[size]}
                  collapsible={itemCollapsible}
                  disabled={item.disabled}
                  expandIcon={expandIcon}
                  extra={item.extra}
                  itemKey={item.key}
                  showArrow={item.showArrow}
                >
                  {item.label}
                </AccordionTrigger>
                <AccordionContent
                  keepRendered={item.forceRender}
                  className={cn('px-4', size === 'small' && 'px-3')}
                >
                  {item.children}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </AccordionPrimitive>
      </AccordionContext.Provider>
    );
  }

  return (
    <AccordionContext.Provider value={{ variant }}>
      <AccordionPrimitive
        className={cn(className)}
        type={mergedType}
        value={mergedValue as never}
        defaultValue={mergedValue === undefined ? (mergedDefaultValue as never) : undefined}
        onValueChange={handleValueChange as never}
        collapsible={mergedType === 'single' ? rootCollapsible : undefined}
        {...props}
      />
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = AccordionItemPrimitiveProps;

function AccordionItem({ className, ...props }: AccordionItemProps) {
  const useDefaultVariant = false;
  return (
    <AccordionItemPrimitive
      className={cn(
        useDefaultVariant
          ? 'border-b border-neutral-200 dark:border-zinc-700 last:border-b-0'
          : 'border-b last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

type AccordionTriggerProps = AccordionTriggerPrimitiveProps & {
  arrowPlacement?: AccordionExpandIconPlacement;
  collapsible?: Exclude<AccordionCollapsible, boolean>;
  expandIcon?: AccordionExpandIcon;
  extra?: React.ReactNode;
  itemKey?: AccordionKey;
  showArrow?: boolean;
};

function AccordionTrigger({
  arrowPlacement = 'start',
  className,
  children,
  collapsible,
  disabled,
  expandIcon,
  extra,
  itemKey,
  showArrow = true,
  ...props
}: AccordionTriggerProps) {
  const { isOpen, value } = useAccordionItem();
  const useDefaultVariant = false;
  const mergedItemKey = itemKey ?? value;
  const triggerDisabled = disabled || collapsible === 'disabled';
  const arrow = showArrow ? (
    <span className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground">
      {expandIcon ? (
        expandIcon({ disabled, isActive: isOpen, key: mergedItemKey })
      ) : (
        <ChevronDownIcon
          className={cn(
            'pointer-events-none size-4 translate-y-0.5 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      )}
    </span>
  ) : null;

  if (collapsible === 'icon') {
    return (
      <AccordionHeaderPrimitive className="flex items-start">
        {arrowPlacement === 'start' && arrow && (
          <AccordionTriggerPrimitive
            className={cn(
              useDefaultVariant
                ? 'focus-visible:border-blue-500 focus-visible:ring-blue-500/50 flex shrink-0 items-center justify-center rounded-md outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50'
                : 'focus-visible:border-ring focus-visible:ring-ring/50 flex shrink-0 items-center justify-center rounded-md outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
              className,
            )}
            disabled={triggerDisabled}
            {...props}
          >
            {arrow}
          </AccordionTriggerPrimitive>
        )}
        <div className={cn('flex flex-1 items-start text-sm font-medium', className)}>
          <span className="flex-1">{children}</span>
        </div>
        {extra && (
          <span className="text-muted-foreground shrink-0 text-xs font-normal">
            {extra}
          </span>
        )}
        {arrowPlacement === 'end' && arrow && (
          <AccordionTriggerPrimitive
            className={cn(
              useDefaultVariant
                ? 'focus-visible:border-blue-500 focus-visible:ring-blue-500/50 flex shrink-0 items-center justify-center rounded-md outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50'
                : 'focus-visible:border-ring focus-visible:ring-ring/50 flex shrink-0 items-center justify-center rounded-md outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
              className,
            )}
            disabled={triggerDisabled}
            {...props}
          >
            {arrow}
          </AccordionTriggerPrimitive>
        )}
      </AccordionHeaderPrimitive>
    );
  }

  return (
    <AccordionHeaderPrimitive className={cn(
      "flex items-start w-full",
      useDefaultVariant && "hover:bg-neutral-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-150"
    )}>
      <AccordionTriggerPrimitive
        className={cn(
          useDefaultVariant
            ? 'focus-visible:border-blue-500 focus-visible:ring-blue-500/50 flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 text-neutral-800 dark:text-zinc-200'
            : 'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        disabled={triggerDisabled}
        {...props}
      >
        {arrowPlacement === 'start' && arrow}
        <span className="flex-1">{children}</span>
        {arrowPlacement === 'end' && arrow}
      </AccordionTriggerPrimitive>
      {extra && (
        <span className="text-muted-foreground shrink-0 px-4 py-3 text-xs font-normal">
          {extra}
        </span>
      )}
    </AccordionHeaderPrimitive>
  );
}

type AccordionContentProps = AccordionContentPrimitiveProps;

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const useDefaultVariant = false;
  return (
    <AccordionContentPrimitive {...props}>
      <div className={cn(
        useDefaultVariant
          ? 'pt-3 pb-5 text-sm px-4 bg-neutral-50/40 dark:bg-zinc-950/20 border-t border-neutral-100 dark:border-zinc-800/50 text-neutral-600 dark:text-zinc-300'
          : 'pt-0 pb-4 text-sm',
        className
      )}>{children}</div>
    </AccordionContentPrimitive>
  );
}

export {
  Accordion,
  AccordionContent as AccordionPanel,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
  type AccordionCollapsible,
  type AccordionExpandIcon,
  type AccordionExpandIconPlacement,
  type AccordionExpandIconProps,
  type AccordionItemOption,
  type AccordionSize,
};
