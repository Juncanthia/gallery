'use client';

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { getStrictContext } from '@/components/_internal/lib/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type CollapsibleContextType = {
  isOpen: boolean;
};

const [CollapsibleProvider, useCollapsible] =
  getStrictContext<CollapsibleContextType>('CollapsibleContext');

type CollapsibleRootProps = React.ComponentProps<typeof CollapsiblePrimitive.Root>;

function CollapsibleRoot(props: CollapsibleRootProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <CollapsibleProvider value={{ isOpen }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        {...props}
        onOpenChange={setIsOpen}
      />
    </CollapsibleProvider>
  );
}

type CollapsibleTriggerProps = React.ComponentProps<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>;

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

type CollapsibleContentProps = Omit<
  React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function CollapsibleContent({
  transition = { duration: 0.25, ease: 'easeInOut' },
  ...props
}: CollapsibleContentProps) {
  const { isOpen } = useCollapsible();

  return (
    <AnimatePresence>
      {isOpen && (
        <CollapsiblePrimitive.CollapsibleContent asChild forceMount>
          <motion.div
            key="collapsible-content"
            data-slot="collapsible-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            style={{ overflow: 'hidden' }}
            {...props}
          />
        </CollapsiblePrimitive.CollapsibleContent>
      )}
    </AnimatePresence>
  );
}

type CollapsibleTriggerMode = 'header' | 'icon' | 'disabled';

type CollapsibleExpandIconProps = {
  disabled?: boolean;
  isActive: boolean;
};

type CollapsibleExpandIcon = (props: CollapsibleExpandIconProps) => React.ReactNode;

type CollapsibleProps = Omit<CollapsibleRootProps, 'children'> & {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  expandIcon?: CollapsibleExpandIcon;
  collapsible?: CollapsibleTriggerMode;
  showArrow?: boolean;
  children?: React.ReactNode;
};

type CollapsibleHeaderProps = {
  title: React.ReactNode;
  collapsible?: CollapsibleTriggerMode;
  disabled?: boolean;
  expandIcon?: CollapsibleExpandIcon;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  showArrow: boolean;
};

function CollapsibleArrow({
  disabled,
  expandIcon,
  icon,
}: Pick<CollapsibleHeaderProps, 'disabled' | 'expandIcon' | 'icon'>) {
  const { isOpen } = useCollapsible();

  return (
    <span
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform',
        isOpen && !expandIcon && 'rotate-90',
      )}
    >
      {expandIcon
        ? expandIcon({ disabled, isActive: isOpen })
        : (icon ?? <ChevronRight className="size-4" />)}
    </span>
  );
}

function CollapsibleHeader({
  title,
  collapsible,
  disabled,
  expandIcon,
  extra,
  icon,
  showArrow,
}: CollapsibleHeaderProps) {
  const triggerDisabled = disabled || collapsible === 'disabled';
  const arrow = showArrow ? (
    <CollapsibleArrow disabled={disabled} expandIcon={expandIcon} icon={icon} />
  ) : null;

  if (collapsible === 'icon') {
    return (
      <div className="flex items-center gap-2 rounded border bg-background px-3 py-2 text-sm">
        {arrow && (
          <CollapsibleTrigger
            className="inline-flex size-5 shrink-0 items-center justify-center rounded text-left outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={triggerDisabled}
          >
            {arrow}
          </CollapsibleTrigger>
        )}
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
        {extra && <div className="shrink-0">{extra}</div>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded border bg-background px-3 py-2 text-sm">
      <CollapsibleTrigger
        className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={triggerDisabled}
      >
        {arrow}
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
      </CollapsibleTrigger>
      {extra && <div className="shrink-0">{extra}</div>}
    </div>
  );
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      title,
      extra,
      icon,
      expandIcon,
      collapsible,
      showArrow = true,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) {
    if (title === undefined) {
      return (
        <CollapsibleRoot
          ref={ref}
          className={className}
          disabled={disabled}
          {...props}
        >
          {children}
        </CollapsibleRoot>
      );
    }

    return (
      <CollapsibleRoot
        ref={ref}
        className={cn('w-full', className)}
        disabled={disabled || collapsible === 'disabled'}
        {...props}
      >
        <CollapsibleHeader
          title={title}
          collapsible={collapsible}
          disabled={disabled}
          expandIcon={expandIcon}
          extra={extra}
          icon={icon}
          showArrow={showArrow}
        />
        <CollapsibleContent
          className="mt-1 rounded border bg-muted/20 p-3 text-sm text-muted-foreground"
        >
          {children}
        </CollapsibleContent>
      </CollapsibleRoot>
    );
  },
);

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent as CollapsiblePanel,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
  type CollapsibleExpandIcon,
  type CollapsibleExpandIconProps,
  type CollapsibleTriggerMode,
};
