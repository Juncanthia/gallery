import * as React from 'react';

import {
  HoverCard as HoverCardPrimitive,
  HoverCardTrigger as HoverCardTriggerPrimitive,
  HoverCardPortal as HoverCardPortalPrimitive,
  HoverCardContent as HoverCardContentPrimitive,
  HoverCardArrow as HoverCardArrowPrimitive,
  type HoverCardProps as HoverCardPrimitiveProps,
  type HoverCardTriggerProps as HoverCardTriggerPrimitiveProps,
  type HoverCardContentProps as HoverCardContentPrimitiveProps,
  type HoverCardArrowProps as HoverCardArrowPrimitiveProps,
} from '@/primitives/radix/hover-card';
import { cn } from '@/lib/utils';

type HoverCardPlacement =
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

type HoverCardPlacementConfig = Pick<HoverCardContentProps, 'align' | 'side'>;

const hoverCardPlacementMap: Record<HoverCardPlacement, HoverCardPlacementConfig> = {
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

type HoverCardProps = HoverCardPrimitiveProps & {
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  placement?: HoverCardPlacement;
  arrow?: boolean;
  contentProps?: HoverCardContentProps;
};

function HoverCard({
  arrow = false,
  trigger,
  content,
  placement,
  contentProps,
  children,
  ...props
}: HoverCardProps) {
  const hasApiContent =
    trigger !== undefined ||
    content !== undefined ||
    placement !== undefined ||
    arrow !== false ||
    contentProps !== undefined;

  if (!hasApiContent) {
    return <HoverCardPrimitive {...props}>{children}</HoverCardPrimitive>;
  }

  const placementProps = placement ? hoverCardPlacementMap[placement] : undefined;

  return (
    <HoverCardPrimitive {...props}>
      <HoverCardTrigger asChild>
        {React.isValidElement(trigger) ? trigger : <span>{trigger}</span>}
      </HoverCardTrigger>
      {children}
      <HoverCardContent arrow={arrow} {...placementProps} {...contentProps}>
        {content}
      </HoverCardContent>
    </HoverCardPrimitive>
  );
}

type HoverCardTriggerProps = HoverCardTriggerPrimitiveProps;

function HoverCardTrigger(props: HoverCardTriggerProps) {
  return <HoverCardTriggerPrimitive {...props} />;
}

type HoverCardContentProps = HoverCardContentPrimitiveProps & {
  arrow?: boolean;
};

function HoverCardContent({
  arrow = false,
  className,
  align = 'center',
  sideOffset = 4,
  children,
  ...props
}: HoverCardContentProps) {
  return (
    <HoverCardPortalPrimitive>
      <HoverCardContentPrimitive
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className,
        )}
        {...props}
      >
        {children}
        {arrow && <HoverCardArrow />}
      </HoverCardContentPrimitive>
    </HoverCardPortalPrimitive>
  );
}

type HoverCardArrowProps = HoverCardArrowPrimitiveProps;

function HoverCardArrow({ className, ...props }: HoverCardArrowProps) {
  return (
    <HoverCardArrowPrimitive
      className={cn('fill-popover stroke-border', className)}
      {...props}
    />
  );
}

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  type HoverCardProps,
  type HoverCardTriggerProps,
  type HoverCardContentProps,
  type HoverCardArrowProps,
  type HoverCardPlacement,
};
