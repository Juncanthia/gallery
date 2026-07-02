import * as React from "react"
import { toast, type ExternalToast } from "sonner"

type MessageType = "success" | "info" | "warning" | "error" | "loading"

type MessageArgs = Omit<ExternalToast, "id" | "duration"> & {
  content: React.ReactNode
  type?: MessageType
  key?: string | number
  duration?: number
  onClose?: () => void
}

type MessageContent = React.ReactNode | MessageArgs

type MessageClose = () => void

function isMessageArgs(value: MessageContent): value is MessageArgs {
  return (
    typeof value === "object" &&
    value !== null &&
    !React.isValidElement(value) &&
    "content" in value
  )
}

function resolveDuration(duration?: number) {
  if (duration === undefined) {
    return undefined
  }

  if (duration === 0) {
    return Number.POSITIVE_INFINITY
  }

  return duration * 1000
}

function normalizeMessageArgs(
  type: MessageType | undefined,
  content: MessageContent,
  duration?: number | (() => void),
  onClose?: () => void,
): MessageArgs {
  const config = isMessageArgs(content) ? content : { content }
  const mergedOnClose = typeof duration === "function" ? duration : onClose
  const mergedDuration = typeof duration === "number" ? duration : config.duration

  return {
    ...config,
    type: config.type ?? type,
    duration: mergedDuration,
    onClose: mergedOnClose ?? config.onClose,
  }
}

function openMessage(config: MessageArgs): MessageClose {
  const { content, type, key, duration, onClose, ...toastOptions } = config
  let closed = false
  const handleClose = () => {
    if (closed) {
      return
    }

    closed = true
    onClose?.()
  }

  const options: ExternalToast = {
    ...toastOptions,
    id: key,
    duration: resolveDuration(duration),
    onAutoClose: handleClose,
    onDismiss: handleClose,
  }

  const id =
    type && type !== "loading"
      ? toast[type](content, options)
      : type === "loading"
        ? toast.loading(content, options)
        : toast(content, options)

  return () => {
    toast.dismiss(id)
  }
}

function typeOpen(type: MessageType) {
  return (
    content: MessageContent,
    duration?: number | (() => void),
    onClose?: () => void,
  ) => openMessage(normalizeMessageArgs(type, content, duration, onClose))
}

const message = {
  open: (config: MessageArgs) => openMessage(config),
  success: typeOpen("success"),
  info: typeOpen("info"),
  warning: typeOpen("warning"),
  error: typeOpen("error"),
  loading: typeOpen("loading"),
  destroy: (key?: string | number) => {
    toast.dismiss(key)
  },
}

export { message }
export type { MessageArgs, MessageClose, MessageContent, MessageType }
