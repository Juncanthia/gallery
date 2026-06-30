import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogContent as AlertDialogContentPrimitive,
  AlertDialogDescription as AlertDialogDescriptionPrimitive,
  AlertDialogFooter as AlertDialogFooterPrimitive,
  AlertDialogHeader as AlertDialogHeaderPrimitive,
  AlertDialogTitle as AlertDialogTitlePrimitive,
  AlertDialogTrigger as AlertDialogTriggerPrimitive,
  AlertDialogPortal as AlertDialogPortalPrimitive,
  AlertDialogOverlay as AlertDialogOverlayPrimitive,
  AlertDialogAction as AlertDialogActionPrimitive,
  AlertDialogCancel as AlertDialogCancelPrimitive,
  type AlertDialogProps as AlertDialogPrimitiveProps,
  type AlertDialogContentProps as AlertDialogContentPrimitiveProps,
  type AlertDialogDescriptionProps as AlertDialogDescriptionPrimitiveProps,
  type AlertDialogFooterProps as AlertDialogFooterPrimitiveProps,
  type AlertDialogHeaderProps as AlertDialogHeaderPrimitiveProps,
  type AlertDialogTitleProps as AlertDialogTitlePrimitiveProps,
  type AlertDialogTriggerProps as AlertDialogTriggerPrimitiveProps,
  type AlertDialogOverlayProps as AlertDialogOverlayPrimitiveProps,
  type AlertDialogActionProps as AlertDialogActionPrimitiveProps,
  type AlertDialogCancelProps as AlertDialogCancelPrimitiveProps,
} from '@/primitives/radix/alert-dialog';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';

type AlertDialogProps = AlertDialogPrimitiveProps & {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmLoading?: boolean;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  contentProps?: AlertDialogContentProps;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
};

function renderAlertDialogTrigger(trigger: React.ReactNode) {
  if (trigger === undefined) return null;

  return (
    <AlertDialogTrigger asChild>
      {React.isValidElement(trigger) ? (
        trigger
      ) : (
        <Button>{trigger}</Button>
      )}
    </AlertDialogTrigger>
  );
}

function AlertDialog({
  trigger,
  title,
  description,
  footer,
  okText,
  cancelText,
  confirmLoading,
  okButtonProps,
  cancelButtonProps,
  contentProps,
  onOk,
  onCancel,
  children,
  ...props
}: AlertDialogProps) {
  const hasApiContent =
    trigger !== undefined ||
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    okText !== undefined ||
    cancelText !== undefined ||
    confirmLoading !== undefined ||
    okButtonProps !== undefined ||
    cancelButtonProps !== undefined ||
    contentProps !== undefined ||
    onOk !== undefined ||
    onCancel !== undefined;

  if (!hasApiContent) {
    return <AlertDialogPrimitive {...props}>{children}</AlertDialogPrimitive>;
  }

  const footerNode = footer === null
    ? null
    : (footer ?? (
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button
            variant="outlined"
            {...cancelButtonProps}
            onClick={onCancel}
          >
            {cancelText ?? 'Cancel'}
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button loading={confirmLoading} {...okButtonProps} onClick={onOk}>
            {okText ?? 'Continue'}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    ));

  return (
    <AlertDialogPrimitive {...props}>
      {renderAlertDialogTrigger(trigger)}
      <AlertDialogContent {...contentProps}>
        {(title !== undefined || description !== undefined) && (
          <AlertDialogHeader>
            {title !== undefined && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {description !== undefined && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        {children}
        {footerNode}
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}

type AlertDialogTriggerProps = AlertDialogTriggerPrimitiveProps;

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return <AlertDialogTriggerPrimitive {...props} />;
}

type AlertDialogOverlayProps = AlertDialogOverlayPrimitiveProps;

function AlertDialogOverlay({ className, ...props }: AlertDialogOverlayProps) {
  return (
    <AlertDialogOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  );
}

type AlertDialogContentProps = AlertDialogContentPrimitiveProps;

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortalPrimitive>
      <AlertDialogOverlay />
      <AlertDialogContentPrimitive
        className={cn(
          'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortalPrimitive>
  );
}

type AlertDialogHeaderProps = AlertDialogHeaderPrimitiveProps;

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <AlertDialogHeaderPrimitive
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

type AlertDialogFooterProps = AlertDialogFooterPrimitiveProps;

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <AlertDialogFooterPrimitive
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

type AlertDialogTitleProps = AlertDialogTitlePrimitiveProps;

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogTitlePrimitive
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

type AlertDialogDescriptionProps = AlertDialogDescriptionPrimitiveProps;

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogDescriptionPrimitive
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = AlertDialogActionPrimitiveProps;

function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionPrimitiveProps) {
  return (
    <AlertDialogActionPrimitive
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

type AlertDialogCancelProps = AlertDialogCancelPrimitiveProps;

function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelPrimitiveProps) {
  return (
    <AlertDialogCancelPrimitive
      className={cn(buttonVariants({ variant: 'outlined' }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps,
  type AlertDialogTriggerProps,
  type AlertDialogContentProps,
  type AlertDialogHeaderProps,
  type AlertDialogFooterProps,
  type AlertDialogTitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
};
