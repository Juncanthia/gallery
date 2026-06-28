import * as React from 'react';
import { X as XIcon } from 'lucide-react';

import { Button } from '@/components/base/button';
import {
  Sheet as SheetPrimitive,
  SheetTrigger as SheetTriggerPrimitive,
  SheetOverlay as SheetOverlayPrimitive,
  SheetClose as SheetClosePrimitive,
  SheetPortal as SheetPortalPrimitive,
  SheetContent as SheetContentPrimitive,
  SheetHeader as SheetHeaderPrimitive,
  SheetFooter as SheetFooterPrimitive,
  SheetTitle as SheetTitlePrimitive,
  SheetDescription as SheetDescriptionPrimitive,
  type SheetProps as SheetPrimitiveProps,
  type SheetTriggerProps as SheetTriggerPrimitiveProps,
  type SheetOverlayProps as SheetOverlayPrimitiveProps,
  type SheetCloseProps as SheetClosePrimitiveProps,
  type SheetContentProps as SheetContentPrimitiveProps,
  type SheetHeaderProps as SheetHeaderPrimitiveProps,
  type SheetFooterProps as SheetFooterPrimitiveProps,
  type SheetTitleProps as SheetTitlePrimitiveProps,
  type SheetDescriptionProps as SheetDescriptionPrimitiveProps,
} from '@/primitives/radix/sheet';
import { cn } from '@/lib/utils';

type SheetPlacement = 'top' | 'bottom' | 'left' | 'right';
type SheetSize = 'default' | 'large' | number | string;

function getSheetSizeStyle(
  side: SheetPlacement,
  size?: SheetSize,
): React.CSSProperties | undefined {
  if (size === undefined) return undefined;

  const value = size === 'large' ? 736 : size === 'default' ? 350 : size;
  const cssValue = typeof value === 'number' ? `${value}px` : value;

  return side === 'left' || side === 'right'
    ? { width: cssValue }
    : { height: cssValue };
}

type SheetProps = SheetPrimitiveProps & {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  placement?: SheetPlacement;
  side?: SheetContentProps['side'];
  size?: SheetSize;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  showCloseButton?: boolean;
  contentProps?: Omit<SheetContentProps, 'children' | 'side' | 'showCloseButton'>;
};

function renderSheetTrigger(trigger: React.ReactNode) {
  if (trigger === undefined) return null;

  return (
    <SheetTrigger asChild>
      {React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
    </SheetTrigger>
  );
}

function Sheet({
  trigger,
  title,
  description,
  footer,
  extra,
  placement,
  side,
  size,
  closable,
  closeIcon,
  mask,
  maskClosable,
  showCloseButton,
  contentProps,
  children,
  ...props
}: SheetProps) {
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    extra !== undefined ||
    placement !== undefined ||
    side !== undefined ||
    size !== undefined ||
    closable !== undefined ||
    closeIcon !== undefined ||
    mask !== undefined ||
    maskClosable !== undefined ||
    showCloseButton !== undefined ||
    contentProps !== undefined;

  if (!hasApiContent) {
    return <SheetPrimitive {...props}>{children}</SheetPrimitive>;
  }

  return (
    <SheetPrimitive {...props}>
      {renderSheetTrigger(trigger)}
      <SheetContent
        side={placement ?? side}
        size={size}
        closable={closable}
        closeIcon={closeIcon}
        mask={mask}
        maskClosable={maskClosable}
        showCloseButton={showCloseButton}
        {...contentProps}
      >
        {(title !== undefined || description !== undefined || extra !== undefined) && (
          <SheetHeader>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                {title !== undefined && <SheetTitle>{title}</SheetTitle>}
                {description !== undefined && (
                  <SheetDescription>{description}</SheetDescription>
                )}
              </div>
              {extra !== undefined && <div className="shrink-0">{extra}</div>}
            </div>
          </SheetHeader>
        )}
        <div className="px-4 pb-4">{children}</div>
        {footer !== undefined && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </SheetPrimitive>
  );
}

type SheetTriggerProps = SheetTriggerPrimitiveProps;

function SheetTrigger(props: SheetTriggerProps) {
  return <SheetTriggerPrimitive {...props} />;
}

type SheetOverlayProps = SheetOverlayPrimitiveProps;

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  );
}

type SheetCloseProps = SheetClosePrimitiveProps;

function SheetClose(props: SheetCloseProps) {
  return <SheetClosePrimitive {...props} />;
}

type SheetContentProps = SheetContentPrimitiveProps & {
  closable?: boolean;
  closeIcon?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  size?: SheetSize;
  showCloseButton?: boolean;
};

function SheetContent({
  className,
  children,
  closable,
  closeIcon,
  mask = true,
  maskClosable = true,
  side = 'right',
  size,
  showCloseButton = true,
  style,
  onInteractOutside,
  ...props
}: SheetContentProps) {
  const mergedClosable = closable ?? showCloseButton;
  const sizeStyle = getSheetSizeStyle(side, size);

  return (
    <SheetPortalPrimitive>
      {mask && <SheetOverlay />}
      <SheetContentPrimitive
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
          side === 'right' && 'h-full w-[350px] border-l',
          side === 'left' && 'h-full w-[350px] border-r',
          side === 'top' && 'h-[350px] w-full border-b',
          side === 'bottom' && 'h-[350px] w-full border-t',
          className,
        )}
        side={side}
        style={{
          ...sizeStyle,
          ...style,
        }}
        onInteractOutside={(event) => {
          if (!maskClosable) {
            event.preventDefault();
          }
          onInteractOutside?.(event);
        }}
        {...props}
      >
        {children}
        {mergedClosable && (
          <SheetClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            {closeIcon ?? <XIcon className="size-4" />}
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </SheetContentPrimitive>
    </SheetPortalPrimitive>
  );
}

type SheetHeaderProps = SheetHeaderPrimitiveProps;

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <SheetHeaderPrimitive
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  );
}

type SheetFooterProps = SheetFooterPrimitiveProps;

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <SheetFooterPrimitive
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

type SheetTitleProps = SheetTitlePrimitiveProps;

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <SheetTitlePrimitive
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

type SheetDescriptionProps = SheetDescriptionPrimitiveProps;

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <SheetDescriptionPrimitive
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetProps,
  type SheetTriggerProps,
  type SheetCloseProps,
  type SheetContentProps,
  type SheetPlacement,
  type SheetSize,
  type SheetHeaderProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
};
