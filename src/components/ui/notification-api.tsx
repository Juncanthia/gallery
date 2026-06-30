import * as React from "react"
import { toast, type ExternalToast } from "sonner"

type NotificationType = "success" | "info" | "warning" | "error"

type NotificationPlacement = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight"

type NotificationArgs = {
  /** Notification title (required). */
  title: React.ReactNode
  /** Notification description/content. */
  description?: React.ReactNode
  /** Notification type. @default "info" */
  type?: NotificationType
  /** Unique key for update/destroy. */
  key?: string | number
  /** Auto-close duration in seconds. @default 4.5; set 0 to disable. */
  duration?: number
  /** Screen position. @default "topRight" */
  placement?: NotificationPlacement
  /** Whether to show close button. @default true */
  closable?: boolean
  /** Custom close icon. */
  closeIcon?: React.ReactNode
  /** Custom icon. */
  icon?: React.ReactNode
  /** Callback when notification closes. */
  onClose?: () => void
  /** Callback when notification is clicked. */
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

type NotificationClose = () => void

/** Maps our placement to sonner position. */
function mapPlacement(placement?: NotificationPlacement): NonNullable<ExternalToast["position"]> | undefined {
  if (!placement) return undefined
  switch (placement) {
    case "top":
      return "top-center"
    case "topLeft":
      return "top-left"
    case "topRight":
      return "top-right"
    case "bottom":
      return "bottom-center"
    case "bottomLeft":
      return "bottom-left"
    case "bottomRight":
      return "bottom-right"
  }
}

function resolveDuration(duration?: number) {
  if (duration === undefined || duration < 0) {
    return 4500 // AntD default 4.5s
  }
  if (duration === 0) {
    return Number.POSITIVE_INFINITY
  }
  return duration * 1000
}

function renderNotificationContent(args: NotificationArgs, dismissKey?: string | number) {
  const { title, description, closable = true, closeIcon } = args

  return (
    <div className="flex w-full min-w-0 gap-3">
      {args.icon && (
        <div className="mt-0.5 shrink-0">{args.icon}</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      {closable && (
        <button
          className="shrink-0 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            if (dismissKey !== undefined) {
              toast.dismiss(dismissKey)
            }
          }}
          aria-label="Close"
          type="button"
        >
          {closeIcon ?? (
            <span className="text-xs leading-none">✕</span>
          )}
        </button>
      )}
    </div>
  )
}

function openNotification(args: NotificationArgs): NotificationClose {
  const {
    key,
    duration,
    placement,
    onClose,
    className,
    style,
  } = args

  let closed = false
  const handleClose = () => {
    if (closed) return
    closed = true
    onClose?.()
  }

  const options: ExternalToast = {
    id: key,
    duration: resolveDuration(duration),
    position: mapPlacement(placement),
    onAutoClose: handleClose,
    onDismiss: handleClose,
    className,
    style,
  }

  const content = renderNotificationContent(args, key)

  let id: string | number
  if (args.type === "success") {
    id = toast.success(content, options)
  } else if (args.type === "warning") {
    id = toast.warning(content, options)
  } else if (args.type === "error") {
    id = toast.error(content, options)
  } else if (args.type === "info") {
    id = toast.info(content, options)
  } else {
    id = toast(content, options)
  }

  return () => {
    toast.dismiss(key ?? id)
  }
}

function typeOpen(type: NotificationType) {
  return (args: NotificationArgs) => openNotification({ ...args, type })
}

const notification = {
  open: (args: NotificationArgs) => openNotification(args),
  success: typeOpen("success"),
  info: typeOpen("info"),
  warning: typeOpen("warning"),
  error: typeOpen("error"),
  destroy: (key?: string | number) => {
    toast.dismiss(key)
  },
}

export { notification }
export type { NotificationArgs, NotificationClose, NotificationPlacement, NotificationType }
