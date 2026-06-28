'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
  type CollapsibleProps as CollapsibleRootProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
} from '@/primitives/radix/collapsible';

type CollapsibleProps = Omit<CollapsibleRootProps, 'children'> & {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  showArrow?: boolean;
  children?: React.ReactNode;
};

type CollapsibleHeaderProps = {
  title: React.ReactNode;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  showArrow: boolean;
  disabled?: boolean;
};

function CollapsibleHeader({
  title,
  extra,
  icon,
  showArrow,
  disabled,
}: CollapsibleHeaderProps) {
  const { isOpen } = useCollapsible();

  return (
    <div className="flex items-center gap-2 rounded border bg-background px-3 py-2 text-sm">
      <CollapsibleTrigger
        className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      >
        {showArrow && (
          <span
            className={cn(
              'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform',
              isOpen && 'rotate-90',
            )}
          >
            {icon ?? <ChevronRight className="size-4" />}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
      </CollapsibleTrigger>
      {extra && (
        <div
          className="shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          {extra}
        </div>
      )}
    </div>
  );
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      title,
      extra,
      icon,
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
        disabled={disabled}
        {...props}
      >
        <CollapsibleHeader
          title={title}
          extra={extra}
          icon={icon}
          showArrow={showArrow}
          disabled={disabled}
        />
        <CollapsibleContent className="mt-1 rounded border bg-muted/20 p-3 text-sm text-muted-foreground">
          {children}
        </CollapsibleContent>
      </CollapsibleRoot>
    );
  },
);

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
};
