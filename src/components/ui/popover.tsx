import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover as PopoverPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
  PopoverPortal as PopoverPortalPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverAnchor as PopoverAnchorPrimitive,
  PopoverClose as PopoverClosePrimitive,
  PopoverArrow as PopoverArrowPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  type PopoverTriggerProps as PopoverTriggerPrimitiveProps,
  type PopoverContentProps as PopoverContentPrimitiveProps,
  type PopoverAnchorProps as PopoverAnchorPrimitiveProps,
  type PopoverCloseProps as PopoverClosePrimitiveProps,
  type PopoverArrowProps as PopoverArrowPrimitiveProps,
} from '@/primitives/radix/popover';
import { cn } from '@/lib/utils';

type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

type PopoverPlacementConfig = Pick<PopoverContentProps, 'align' | 'side'>;

const popoverPlacementMap: Record<PopoverPlacement, PopoverPlacementConfig> = {
  top: { side: 'top', align: 'center' },
  bottom: { side: 'bottom', align: 'center' },
  left: { side: 'left', align: 'center' },
  right: { side: 'right', align: 'center' },
  topLeft: { side: 'top', align: 'start' },
  topRight: { side: 'top', align: 'end' },
  bottomLeft: { side: 'bottom', align: 'start' },
  bottomRight: { side: 'bottom', align: 'end' },
  leftTop: { side: 'left', align: 'start' },
  leftBottom: { side: 'left', align: 'end' },
  rightTop: { side: 'right', align: 'start' },
  rightBottom: { side: 'right', align: 'end' },
};

type PopoverProps = PopoverPrimitiveProps & {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  placement?: PopoverPlacement;
  arrow?: boolean;
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
  arrow = false,
  trigger,
  title,
  content,
  placement,
  contentProps,
  children,
  ...props
}: PopoverProps) {
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    content !== undefined ||
    placement !== undefined ||
    arrow !== false ||
    contentProps !== undefined;

  if (!hasApiContent) {
    return <PopoverPrimitive {...props}>{children}</PopoverPrimitive>;
  }

  const placementProps = placement ? popoverPlacementMap[placement] : undefined;

  return (
    <PopoverPrimitive {...props}>
      {renderPopoverTrigger(trigger)}
      {children}
      <PopoverContent arrow={arrow} {...placementProps} {...contentProps}>
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

type PopoverContentProps = PopoverContentPrimitiveProps & {
  arrow?: boolean;
};

function PopoverContent({
  arrow = false,
  className,
  align = 'center',
  sideOffset = 4,
  children,
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
      >
        {children}
        {arrow && <PopoverArrow />}
      </PopoverContentPrimitive>
    </PopoverPortalPrimitive>
  );
}

type PopoverArrowProps = PopoverArrowPrimitiveProps;

function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return (
    <PopoverArrowPrimitive
      className={cn('fill-popover stroke-border', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverArrow,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverAnchorProps,
  type PopoverCloseProps,
  type PopoverContentProps,
  type PopoverArrowProps,
  type PopoverPlacement,
};
