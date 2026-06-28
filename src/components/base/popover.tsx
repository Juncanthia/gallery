import * as React from 'react';

import { Button } from '@/components/base/button';
import {
  Popover as PopoverPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
  PopoverPortal as PopoverPortalPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverAnchor as PopoverAnchorPrimitive,
  PopoverClose as PopoverClosePrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  type PopoverTriggerProps as PopoverTriggerPrimitiveProps,
  type PopoverContentProps as PopoverContentPrimitiveProps,
  type PopoverAnchorProps as PopoverAnchorPrimitiveProps,
  type PopoverCloseProps as PopoverClosePrimitiveProps,
} from '@/primitives/radix/popover';
import { cn } from '@/lib/utils';

type PopoverProps = PopoverPrimitiveProps & {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  contentProps?: PopoverContentProps;
};

function renderPopoverTrigger(trigger: React.ReactNode) {
  if (trigger === undefined) return null;

  return (
    <PopoverTrigger asChild>
      {React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
    </PopoverTrigger>
  );
}

function Popover({
  trigger,
  title,
  content,
  contentProps,
  children,
  ...props
}: PopoverProps) {
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    content !== undefined ||
    contentProps !== undefined;

  if (!hasApiContent) {
    return <PopoverPrimitive {...props}>{children}</PopoverPrimitive>;
  }

  return (
    <PopoverPrimitive {...props}>
      {renderPopoverTrigger(trigger)}
      {children}
      <PopoverContent {...contentProps}>
        <div className="space-y-2">
          {title !== undefined && <p className="text-sm font-medium">{title}</p>}
          {content !== undefined && (
            <div className="text-sm text-muted-foreground">{content}</div>
          )}
        </div>
      </PopoverContent>
    </PopoverPrimitive>
  );
}

type PopoverTriggerProps = PopoverTriggerPrimitiveProps;

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverTriggerPrimitive {...props} />;
}

type PopoverAnchorProps = PopoverAnchorPrimitiveProps;

function PopoverAnchor(props: PopoverAnchorProps) {
  return <PopoverAnchorPrimitive {...props} />;
}

type PopoverCloseProps = PopoverClosePrimitiveProps;

function PopoverClose(props: PopoverCloseProps) {
  return <PopoverClosePrimitive {...props} />;
}

type PopoverContentProps = PopoverContentPrimitiveProps;

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPortalPrimitive>
      <PopoverContentPrimitive
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className,
        )}
        {...props}
      />
    </PopoverPortalPrimitive>
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverAnchorProps,
  type PopoverCloseProps,
  type PopoverContentProps,
};
