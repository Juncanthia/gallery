import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CheckCircle,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type AlertType = "success" | "info" | "warning" | "error"
type AlertVariant = "outlined" | "filled" | "skeuomorphic"
type AlertClosable =
  | boolean
  | {
      closeIcon?: React.ReactNode
      onClose?: React.MouseEventHandler<HTMLButtonElement>
      afterClose?: () => void
    }

type AlertProps = Omit<React.ComponentProps<"div">, "title"> &
  Omit<VariantProps<typeof alertVariants>, "variant"> & {
    type?: AlertType
    variant?: AlertVariant | NonNullable<VariantProps<typeof alertVariants>["variant"]>
    title?: React.ReactNode
    message?: React.ReactNode
    description?: React.ReactNode
    icon?: React.ReactNode
    showIcon?: boolean
    action?: React.ReactNode
    closable?: AlertClosable
    closeText?: React.ReactNode
    closeIcon?: React.ReactNode
    onClose?: React.MouseEventHandler<HTMLButtonElement>
    afterClose?: () => void
    banner?: boolean
  }

const alertOutlinedClasses: Record<AlertType, string> = {
  success: "border-green-500/40 bg-card text-green-700 dark:text-green-400",
  info: "border-blue-500/40 bg-card text-blue-700 dark:text-blue-400",
  warning: "border-yellow-500/40 bg-card text-yellow-700 dark:text-yellow-400",
  error: "border-destructive/40 bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90",
}

const alertFilledClasses: Record<AlertType, string> = {
  success: "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400",
  info: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  error: "border-destructive/40 bg-destructive/10 text-destructive *:data-[slot=alert-description]:text-destructive/90",
}

const alertSkeuomorphicClasses: Record<AlertType, string> = {
  success: "border-emerald-300 dark:border-emerald-800 bg-linear-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 text-emerald-800 dark:text-emerald-400 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]",
  info: "border-blue-300 dark:border-blue-800 bg-linear-to-b from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 text-blue-800 dark:text-blue-400 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]",
  warning: "border-amber-300 dark:border-amber-800 bg-linear-to-b from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 text-amber-800 dark:text-amber-400 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]",
  error: "border-red-300 dark:border-red-800 bg-linear-to-b from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 text-red-800 dark:text-red-400 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)] *:data-[slot=alert-description]:text-red-900/80 dark:*:data-[slot=alert-description]:text-red-400/80",
}

const alertIcons: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle />,
  info: <Info />,
  warning: <TriangleAlert />,
  error: <CircleX />,
}

function Alert({
  className,
  variant,
  type,
  title,
  message,
  description,
  icon,
  showIcon,
  action,
  closable,
  closeText,
  closeIcon,
  onClose,
  afterClose,
  banner,
  children,
  ...props
}: AlertProps) {
  const [closed, setClosed] = React.useState(false)
  const mergedTitle = title ?? message
  const hasApiContent =
    type !== undefined ||
    mergedTitle !== undefined ||
    description !== undefined ||
    icon !== undefined ||
    showIcon !== undefined ||
    action !== undefined ||
    closable !== undefined ||
    closeText !== undefined ||
    closeIcon !== undefined ||
    onClose !== undefined ||
    afterClose !== undefined ||
    banner !== undefined
  const mergedType = type ?? (variant === "destructive" ? "error" : banner ? "warning" : "info")
  const mergedVariant: AlertVariant = variant === "filled" ? "filled" : variant === "skeuomorphic" ? "skeuomorphic" : "outlined"
  const legacyVariant = variant === "destructive" ? "destructive" : "default"
  const closableConfig = typeof closable === "object" ? closable : undefined
  const isClosable =
    Boolean(closable) ||
    closeText !== undefined ||
    closeIcon !== undefined ||
    closableConfig?.closeIcon !== undefined
  const shouldShowIcon = showIcon ?? (banner || type !== undefined)

  if (closed) return null

  if (!hasApiContent) {
    return (
      <div
        data-slot="alert"
        role="alert"
        className={cn(
          alertVariants({
            variant: variant === "destructive" ? "destructive" : "default",
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closableConfig?.onClose?.(event)
    onClose?.(event)
    if (!event.defaultPrevented) {
      setClosed(true)
      queueMicrotask(() => {
        closableConfig?.afterClose?.()
        afterClose?.()
      })
    }
  }

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant: mergedType === "error" ? "destructive" : legacyVariant }),
        mergedVariant === "filled"
          ? alertFilledClasses[mergedType]
          : mergedVariant === "skeuomorphic"
            ? alertSkeuomorphicClasses[mergedType]
            : alertOutlinedClasses[mergedType],
        banner && "rounded-none border-x-0",
        isClosable && "pr-10",
        className
      )}
      {...props}
    >
      {shouldShowIcon && (icon ?? alertIcons[mergedType])}
      <div className={cn(shouldShowIcon && "col-start-2")}>
        {mergedTitle !== undefined && <AlertTitle>{mergedTitle}</AlertTitle>}
        {description !== undefined && (
          <AlertDescription>{description}</AlertDescription>
        )}
        {children}
      </div>
      {action !== undefined && <AlertAction>{action}</AlertAction>}
      {isClosable && (
        <button
          type="button"
          className="absolute right-3 top-2.5 inline-flex size-5 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleClose}
        >
          {closableConfig?.closeIcon ?? closeText ?? closeIcon ?? <X className="size-4" />}
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
export type { AlertProps, AlertType, AlertVariant, AlertClosable }
