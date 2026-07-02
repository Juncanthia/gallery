'use client';

import * as React from 'react';
import {Dialog as RadixDialog} from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { X as XIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import { Button } from '@/components/core/button';
import { ScrollArea } from '@/components/core/scroll-area';
import { cn } from '@/lib/utils';

type SheetContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [SheetProvider, useSheet] =
  getStrictContext<SheetContextType>('SheetContext');

type SheetPrimitiveProps = React.ComponentProps<typeof RadixDialog.Root>;

function SheetPrimitive(props: SheetPrimitiveProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return (
    <SheetProvider value={{ isOpen, setIsOpen }}>
      <RadixDialog.Root
        data-slot="sheet"
        {...props}
        onOpenChange={setIsOpen}
      />
    </SheetProvider>
  );
}

type SheetTriggerPrimitiveProps = React.ComponentProps<typeof RadixDialog.Trigger>;

function SheetTriggerPrimitive(props: SheetTriggerPrimitiveProps) {
  return <RadixDialog.Trigger data-slot="sheet-trigger" {...props} />;
}

type SheetClosePrimitiveProps = React.ComponentProps<typeof RadixDialog.Close>;

function SheetClosePrimitive(props: SheetClosePrimitiveProps) {
  return <RadixDialog.Close data-slot="sheet-close" {...props} />;
}

type SheetPortalProps = React.ComponentProps<typeof RadixDialog.Portal>;

function SheetPortalPrimitive(props: SheetPortalProps) {
  const { isOpen } = useSheet();

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixDialog.Portal forceMount data-slot="sheet-portal" {...props} />
      )}
    </AnimatePresence>
  );
}

type SheetOverlayPrimitiveProps = Omit<
  React.ComponentProps<typeof RadixDialog.Overlay>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function SheetOverlayPrimitive({
  transition = { duration: 0.2, ease: 'easeInOut' },
  ...props
}: SheetOverlayPrimitiveProps) {
  return (
    <RadixDialog.Overlay asChild forceMount>
      <motion.div
        key="sheet-overlay"
        data-slot="sheet-overlay"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        transition={transition}
        {...props}
      />
    </RadixDialog.Overlay>
  );
}

type Side = 'top' | 'bottom' | 'left' | 'right';

type SheetContentPrimitiveProps = React.ComponentProps<typeof RadixDialog.Content> &
  HTMLMotionProps<'div'> & {
    side?: Side;
  };

function SheetContentPrimitive({
  side = 'right',
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  style,
  children,
  ...props
}: SheetContentPrimitiveProps) {
  const axis = side === 'left' || side === 'right' ? 'x' : 'y';

  const offscreen: Record<Side, { x?: string; y?: string; opacity: number }> = {
    right: { x: '100%', opacity: 0 },
    left: { x: '-100%', opacity: 0 },
    top: { y: '-100%', opacity: 0 },
    bottom: { y: '100%', opacity: 0 },
  };

  const positionStyle: Record<Side, React.CSSProperties> = {
    right: { insetBlock: 0, right: 0 },
    left: { insetBlock: 0, left: 0 },
    top: { insetInline: 0, top: 0 },
    bottom: { insetInline: 0, bottom: 0 },
  };

  return (
    <RadixDialog.Content asChild forceMount {...props}>
      <motion.div
        key="sheet-content"
        data-slot="sheet-content"
        data-side={side}
        initial={offscreen[side]}
        animate={{ [axis]: 0, opacity: 1 }}
        exit={offscreen[side]}
        style={{
          position: 'fixed',
          ...positionStyle[side],
          ...style,
        }}
        transition={transition}
      >
        {children}
      </motion.div>
    </RadixDialog.Content>
  );
}

type SheetHeaderPrimitiveProps = React.ComponentProps<'div'>;

function SheetHeaderPrimitive(props: SheetHeaderPrimitiveProps) {
  return <div data-slot="sheet-header" {...props} />;
}

type SheetFooterPrimitiveProps = React.ComponentProps<'div'>;

function SheetFooterPrimitive(props: SheetFooterPrimitiveProps) {
  return <div data-slot="sheet-footer" {...props} />;
}

type SheetTitlePrimitiveProps = React.ComponentProps<typeof RadixDialog.Title>;

function SheetTitlePrimitive(props: SheetTitlePrimitiveProps) {
  return <RadixDialog.Title data-slot="sheet-title" {...props} />;
}

type SheetDescriptionPrimitiveProps = React.ComponentProps<
  typeof RadixDialog.Description
>;

function SheetDescriptionPrimitive(props: SheetDescriptionPrimitiveProps) {
  return (
    <RadixDialog.Description data-slot="sheet-description" {...props} />
  );
}

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

function SheetBackdrop({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetOverlayPrimitive
      data-slot="sheet-backdrop"
      className={cn(
        'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

type SheetViewportProps = React.ComponentProps<'div'> & {
  side?: SheetPlacement;
  variant?: 'default' | 'inset';
};

function SheetViewport({
  className,
  side,
  variant = 'default',
  ...props
}: SheetViewportProps) {
  return (
    <div
      data-slot="sheet-viewport"
      className={cn(
        'fixed inset-0 z-50 grid',
        side === 'bottom' && 'grid-rows-[1fr_auto] pt-12',
        side === 'top' && 'grid-rows-[auto_1fr] pb-12',
        side === 'left' && 'flex justify-start',
        side === 'right' && 'flex justify-end',
        variant === 'inset' && 'sm:p-4',
        className,
      )}
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

type SheetPopupProps = SheetContentPrimitiveProps & {
  closeProps?: SheetCloseProps;
  showCloseButton?: boolean;
  side?: SheetPlacement;
  variant?: 'default' | 'inset';
};

function SheetPopup({
  className,
  children,
  closeProps,
  showCloseButton = true,
  side = 'right',
  variant = 'default',
  ...props
}: SheetPopupProps) {
  return (
    <SheetPortalPrimitive>
      <SheetBackdrop />
      <SheetViewport side={side} variant={variant}>
        <SheetContentPrimitive
          data-slot="sheet-popup"
          className={cn(
            'relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover text-popover-foreground shadow-lg/5 will-change-transform data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
            side === 'bottom' &&
              'row-start-2 border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom',
            side === 'top' &&
              'border-b data-open:slide-in-from-top data-closed:slide-out-to-top',
            side === 'left' &&
              'w-[calc(100%-(--spacing(12)))] max-w-md border-e data-open:slide-in-from-left data-closed:slide-out-to-left',
            side === 'right' &&
              'col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-open:slide-in-from-right data-closed:slide-out-to-right',
            variant === 'inset' && 'sm:rounded-2xl sm:border',
            className,
          )}
          side={side}
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetClosePrimitive
              aria-label="Close"
              asChild
              className="absolute end-2 top-2"
              {...closeProps}
            >
              <Button variant="text" size="small" shape="square">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClosePrimitive>
          )}
        </SheetContentPrimitive>
      </SheetViewport>
    </SheetPortalPrimitive>
  );
}

type SheetHeaderProps = SheetHeaderPrimitiveProps & {
  asChild?: boolean;
};

function SheetHeader({ className, asChild = false, ...props }: SheetHeaderProps) {
  const Comp = asChild ? Slot.Root : SheetHeaderPrimitive;

  return (
    <Comp
      data-slot="sheet-header"
      className={cn(
        'flex flex-col gap-1.5 p-4 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3',
        className,
      )}
      {...props}
    />
  );
}

type SheetFooterProps = SheetFooterPrimitiveProps & {
  asChild?: boolean;
  variant?: 'default' | 'bare';
};

function SheetFooter({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: SheetFooterProps) {
  const Comp = asChild ? Slot.Root : SheetFooterPrimitive;

  return (
    <Comp
      data-slot="sheet-footer"
      className={cn(
        'mt-auto flex flex-col gap-2 p-4',
        variant === 'default' &&
          'in-[[data-slot=sheet-popup]]:border-t in-[[data-slot=sheet-popup]]:bg-muted/72',
        variant === 'bare' &&
          'in-[[data-slot=sheet-popup]]:pt-4 in-[[data-slot=sheet-popup]]:pb-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3',
        className,
      )}
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

function SheetPanel({
  className,
  scrollFade = true,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  scrollFade?: boolean;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <ScrollArea scrollFade={scrollFade}>
      <Comp
        data-slot="sheet-panel"
        className={cn(
          'p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1',
          className,
        )}
        {...props}
      />
    </ScrollArea>
  );
}

export {
  Sheet,
  SheetBackdrop,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetOverlay,
  SheetPanel,
  SheetPopup,
  SheetPrimitive,
  SheetTitle,
  SheetDescription,
  SheetViewport,
  type SheetProps,
  type SheetTriggerProps,
  type SheetCloseProps,
  type SheetContentProps,
  type SheetPopupProps,
  type SheetPlacement,
  type SheetSize,
  type SheetHeaderProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
};
