import * as React from 'react';
import { X } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/base/button';
import {
  Dialog as DialogPrimitive,
  DialogTrigger as DialogTriggerPrimitive,
  DialogPortal as DialogPortalPrimitive,
  DialogOverlay as DialogOverlayPrimitive,
  DialogContent as DialogContentPrimitive,
  DialogClose as DialogClosePrimitive,
  DialogHeader as DialogHeaderPrimitive,
  DialogFooter as DialogFooterPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  type DialogProps as DialogPrimitiveProps,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  type DialogPortalProps as DialogPortalPrimitiveProps,
  type DialogOverlayProps as DialogOverlayPrimitiveProps,
  type DialogContentProps as DialogContentPrimitiveProps,
  type DialogCloseProps as DialogClosePrimitiveProps,
  type DialogHeaderProps as DialogHeaderPrimitiveProps,
  type DialogFooterProps as DialogFooterPrimitiveProps,
  type DialogTitleProps as DialogTitlePrimitiveProps,
  type DialogDescriptionProps as DialogDescriptionPrimitiveProps,
} from '@/primitives/radix/dialog';
import { cn } from '@/lib/utils';

type DialogProps = DialogPrimitiveProps & {
  variant?: 'default' | 'skeuomorphic';
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmLoading?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  width?: number | string;
  showCloseButton?: boolean;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  contentProps?: Omit<DialogContentProps, 'children'>;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
};

function renderDialogTrigger(trigger: React.ReactNode) {
  if (trigger === undefined) return null;

  return (
    <DialogTrigger asChild>
      {React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
    </DialogTrigger>
  );
}

const DialogContext = React.createContext<{ variant?: 'default' | 'skeuomorphic' }>({ variant: 'default' });

function Dialog({
  variant = 'default',
  trigger,
  title,
  description,
  footer,
  okText,
  cancelText,
  confirmLoading,
  closable,
  closeIcon,
  mask,
  maskClosable,
  width,
  showCloseButton,
  okButtonProps,
  cancelButtonProps,
  contentProps,
  onOk,
  onCancel,
  children,
  ...props
}: DialogProps) {
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    okText !== undefined ||
    cancelText !== undefined ||
    confirmLoading !== undefined ||
    closable !== undefined ||
    closeIcon !== undefined ||
    mask !== undefined ||
    maskClosable !== undefined ||
    width !== undefined ||
    showCloseButton !== undefined ||
    okButtonProps !== undefined ||
    cancelButtonProps !== undefined ||
    contentProps !== undefined ||
    onOk !== undefined ||
    onCancel !== undefined;

  if (!hasApiContent) {
    return (
      <DialogContext.Provider value={{ variant }}>
        <DialogPrimitive {...props}>{children}</DialogPrimitive>
      </DialogContext.Provider>
    );
  }

  const mergedClosable = closable ?? showCloseButton;
  const isSkeuomorphic = variant === 'skeuomorphic';
  const footerNode = footer === null
    ? null
    : (footer ??
      ((okText !== undefined ||
      cancelText !== undefined ||
      onOk !== undefined ||
      onCancel !== undefined ||
      okButtonProps !== undefined ||
      cancelButtonProps !== undefined ||
      confirmLoading !== undefined) && (
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant={isSkeuomorphic ? "skeuomorphic" : "outlined"}
            {...cancelButtonProps}
            onClick={onCancel}
          >
            {cancelText ?? 'Cancel'}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant={isSkeuomorphic ? "skeuomorphic" : "solid"} loading={confirmLoading} {...okButtonProps} onClick={onOk}>
            {okText ?? 'OK'}
          </Button>
        </DialogClose>
      </DialogFooter>
    )));

  return (
    <DialogContext.Provider value={{ variant }}>
      <DialogPrimitive {...props}>
        {renderDialogTrigger(trigger)}
        <DialogContent
          closable={mergedClosable}
          closeIcon={closeIcon}
          mask={mask}
          maskClosable={maskClosable}
          width={width}
          {...contentProps}
        >
          {(title !== undefined || description !== undefined) && (
            <DialogHeader>
              {title !== undefined && <DialogTitle>{title}</DialogTitle>}
              {description !== undefined && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {children && (
            <div className={cn(isSkeuomorphic && "px-6 py-6 bg-white dark:bg-zinc-950 text-neutral-700 dark:text-zinc-300")}>
              {children}
            </div>
          )}
          {footerNode}
        </DialogContent>
      </DialogPrimitive>
    </DialogContext.Provider>
  );
}

type DialogTriggerProps = DialogTriggerPrimitiveProps;

function DialogTrigger(props: DialogTriggerProps) {
  return <DialogTriggerPrimitive {...props} />;
}

type DialogPortalProps = DialogPortalPrimitiveProps;

function DialogPortal(props: DialogPortalProps) {
  return <DialogPortalPrimitive {...props} />;
}

type DialogOverlayProps = DialogOverlayPrimitiveProps;

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-black/80', className)}
      {...props}
    />
  );
}

type DialogContentProps = DialogContentPrimitiveProps & {
  closable?: boolean;
  closeIcon?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  showCloseButton?: boolean;
  width?: number | string;
};

function DialogContent({
  className,
  children,
  closable,
  closeIcon,
  mask = true,
  maskClosable = true,
  showCloseButton,
  style,
  width,
  onInteractOutside,
  ...props
}: DialogContentProps) {
  const { variant } = React.useContext(DialogContext);
  const isSkeuomorphic = variant === 'skeuomorphic';
  const mergedClosable = closable ?? showCloseButton ?? true;
  const mergedStyle = {
    width,
    ...style,
  };

  return (
    <DialogPortal>
      {mask && <DialogOverlay />}
      <DialogContentPrimitive
        className={cn(
          isSkeuomorphic
            ? 'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-neutral-300 dark:border-zinc-700 bg-linear-to-b from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] p-0 overflow-hidden gap-0 sm:max-w-lg'
            : 'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
          className,
        )}
        style={mergedStyle}
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
          <DialogClosePrimitive className={cn(
            "absolute rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            isSkeuomorphic
              ? "top-4.5 right-4.5 text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-white"
              : "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground top-4 right-4"
          )}>
            {closeIcon ?? <X />}
            <span className="sr-only">Close</span>
          </DialogClosePrimitive>
        )}
      </DialogContentPrimitive>
    </DialogPortal>
  );
}

type DialogCloseProps = DialogClosePrimitiveProps;

function DialogClose(props: DialogCloseProps) {
  return <DialogClosePrimitive {...props} />;
}

type DialogHeaderProps = DialogHeaderPrimitiveProps;

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  const { variant } = React.useContext(DialogContext);
  const isSkeuomorphic = variant === 'skeuomorphic';
  return (
    <DialogHeaderPrimitive
      className={cn(
        isSkeuomorphic
          ? 'flex flex-col gap-1 text-left bg-linear-to-b from-neutral-50 to-neutral-100/80 dark:from-zinc-800 dark:to-zinc-900 border-b border-neutral-200 dark:border-zinc-700 px-6 py-4'
          : 'flex flex-col gap-2 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

type DialogFooterProps = DialogFooterPrimitiveProps;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  const { variant } = React.useContext(DialogContext);
  const isSkeuomorphic = variant === 'skeuomorphic';
  return (
    <DialogFooterPrimitive
      className={cn(
        isSkeuomorphic
          ? 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end bg-linear-to-b from-neutral-50 to-neutral-100/80 dark:from-zinc-800 dark:to-zinc-900 border-t border-neutral-200 dark:border-zinc-700 px-6 py-4'
          : 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

type DialogTitleProps = DialogTitlePrimitiveProps;

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogTitlePrimitive
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

type DialogDescriptionProps = DialogDescriptionPrimitiveProps;

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogDescriptionPrimitive
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogProps,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogTitleProps,
  type DialogTriggerProps,
};
