import { ChevronDown as ChevronDownIcon } from 'lucide-react';

import {
  Accordion as AccordionPrimitive,
  AccordionItem as AccordionItemPrimitive,
  AccordionHeader as AccordionHeaderPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
  AccordionContent as AccordionContentPrimitive,
  type AccordionProps as AccordionPrimitiveProps,
  type AccordionItemProps as AccordionItemPrimitiveProps,
  type AccordionTriggerProps as AccordionTriggerPrimitiveProps,
  type AccordionContentProps as AccordionContentPrimitiveProps,
} from '@/primitives/radix/accordion';
import { cn } from '@/lib/utils';

type AccordionSize = 'small' | 'middle' | 'large';
type AccordionExpandIconPlacement = 'start' | 'end';
type AccordionKey = string;

type AccordionItemOption = {
  key: AccordionKey;
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  extra?: React.ReactNode;
  showArrow?: boolean;
};

type AccordionRootType = 'single' | 'multiple';

type AccordionProps = Omit<
  AccordionPrimitiveProps,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  accordion?: boolean;
  activeKey?: AccordionKey | AccordionKey[];
  bordered?: boolean;
  collapsible?: boolean;
  defaultActiveKey?: AccordionKey | AccordionKey[];
  defaultValue?: AccordionKey | AccordionKey[];
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

function Accordion({
  accordion,
  activeKey,
  bordered = true,
  className,
  defaultActiveKey,
  defaultValue,
  expandIconPlacement = 'end',
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

  const handleValueChange = (nextValue: string | string[] | undefined) => {
    onValueChange?.(nextValue as never);
    onChange?.(nextValue);
  };

  if (items?.length) {
    return (
      <AccordionPrimitive
        className={cn(
          bordered && !ghost && 'rounded-md border',
          ghost && 'border-none',
          className,
        )}
        type={mergedType}
        value={mergedValue as never}
        defaultValue={mergedValue === undefined ? (mergedDefaultValue as never) : undefined}
        onValueChange={handleValueChange as never}
        collapsible={mergedType === 'single' ? (collapsible ?? true) : undefined}
        {...props}
      >
        {items.map((item) => (
          <AccordionItem key={item.key} value={item.key} disabled={item.disabled}>
            <AccordionTrigger
              arrowPlacement={expandIconPlacement}
              className={accordionTriggerSizeClasses[size]}
              extra={item.extra}
              showArrow={item.showArrow}
            >
              {item.label}
            </AccordionTrigger>
            <AccordionContent className={cn('px-4', size === 'small' && 'px-3')}>
              {item.children}
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionPrimitive>
    );
  }

  return (
    <AccordionPrimitive
      className={cn(className)}
      type={mergedType}
      value={mergedValue as never}
      defaultValue={mergedValue === undefined ? (mergedDefaultValue as never) : undefined}
      onValueChange={handleValueChange as never}
      {...props}
    />
  );
}

type AccordionItemProps = AccordionItemPrimitiveProps;

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionItemPrimitive
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

type AccordionTriggerProps = AccordionTriggerPrimitiveProps & {
  arrowPlacement?: AccordionExpandIconPlacement;
  extra?: React.ReactNode;
  showArrow?: boolean;
};

function AccordionTrigger({
  arrowPlacement = 'end',
  className,
  children,
  extra,
  showArrow = true,
  ...props
}: AccordionTriggerProps) {
  const arrow = showArrow ? (
    <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
  ) : null;
  return (
    <AccordionHeaderPrimitive className="flex">
      <AccordionTriggerPrimitive
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {arrowPlacement === 'start' && arrow}
        <span className="flex-1">{children}</span>
        {extra && <span className="text-muted-foreground text-xs font-normal">{extra}</span>}
        {arrowPlacement === 'end' && arrow}
      </AccordionTriggerPrimitive>
    </AccordionHeaderPrimitive>
  );
}

type AccordionContentProps = AccordionContentPrimitiveProps;

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionContentPrimitive {...props}>
      <div className={cn('text-sm pt-0 pb-4', className)}>{children}</div>
    </AccordionContentPrimitive>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
  type AccordionExpandIconPlacement,
  type AccordionItemOption,
  type AccordionSize,
};