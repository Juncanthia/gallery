import * as React from 'react';

import {
  TooltipProvider as TooltipProviderPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  TooltipPortal as TooltipPortalPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipArrow as TooltipArrowPrimitive,
  type TooltipProviderProps as TooltipProviderPrimitiveProps,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
  type TooltipContentProps as TooltipContentPrimitiveProps,
  type TooltipArrowProps as TooltipArrowPrimitiveProps,
} from '@/primitives/radix/tooltip';
import { cn } from '@/lib/utils';

type TooltipPlacement =
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

type TooltipPlacementConfig = Pick<TooltipContentProps, 'align' | 'side'>;

const tooltipPlacementMap: Record<TooltipPlacement, TooltipPlacementConfig> = {
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

function getReadableTextColor(background?: string) {
  if (!background?.startsWith('#')) return undefined;

  const normalized = background.length === 4
    ? `#${background[1]}${background[1]}${background[2]}${background[2]}${background[3]}${background[3]}`
    : background;

  if (normalized.length !== 7) return undefined;

  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance < 0.5 ? '#fff' : '#000';
}

type TooltipProviderProps = TooltipProviderPrimitiveProps;

function TooltipProvider({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) {
  return <TooltipProviderPrimitive delayDuration={delayDuration} {...props} />;
}

type TooltipProps = TooltipPrimitiveProps & {
  arrow?: boolean;
  color?: string;
  title?: React.ReactNode;
  placement?: TooltipPlacement;
  contentProps?: TooltipContentProps;
};

function Tooltip({
  arrow = false,
  color,
  title,
  placement,
  contentProps,
  children,
  ...props
}: TooltipProps) {
  if (
    title === undefined &&
    placement === undefined &&
    color === undefined &&
    contentProps === undefined &&
    arrow === false
  ) {
    return <TooltipPrimitive {...props}>{children}</TooltipPrimitive>;
  }

  const placementProps = placement ? tooltipPlacementMap[placement] : undefined;

  return (
    <TooltipPrimitive {...props}>
      <TooltipTrigger asChild>
        {React.isValidElement(children) ? children : <span>{children}</span>}
      </TooltipTrigger>
      <TooltipContent
        arrow={arrow}
        color={color}
        {...placementProps}
        {...contentProps}
      >
        {title}
      </TooltipContent>
    </TooltipPrimitive>
  );
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps;

function TooltipTrigger(props: TooltipTriggerProps) {
  return <TooltipTriggerPrimitive {...props} />;
}

type TooltipContentProps = TooltipContentPrimitiveProps & {
  arrow?: boolean;
  color?: string;
};

function TooltipContent({
  arrow = false,
  className,
  color,
  sideOffset = 4,
  children,
  style,
  ...props
}: TooltipContentProps) {
  const textColor = getReadableTextColor(color);

  return (
    <TooltipPortalPrimitive>
      <TooltipContentPrimitive
        sideOffset={sideOffset}
        className={cn(
          'bg-primary text-primary-foreground z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        style={{
          backgroundColor: color,
          color: textColor,
          ...style,
        }}
        {...props}
      >
        {children}
        {arrow && <TooltipArrow color={color} />}
      </TooltipContentPrimitive>
    </TooltipPortalPrimitive>
  );
}

type TooltipArrowProps = TooltipArrowPrimitiveProps & {
  color?: string;
};

function TooltipArrow({ className, color, style, ...props }: TooltipArrowProps) {
  return (
    <TooltipArrowPrimitive
      className={cn('fill-primary', className)}
      style={{
        fill: color,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  type TooltipProviderProps,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
  type TooltipArrowProps,
  type TooltipPlacement,
};
