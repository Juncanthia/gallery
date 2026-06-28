"use client"

import * as React from "react"
import { TriangleAlert as WarningIcon } from "lucide-react"
import { Popover } from "@/components/base/popover"
import { Button } from "@/components/base/button"

type PopconfirmProps = {
  /** Confirmation title/message. */
  title: React.ReactNode
  /** Optional additional description. */
  description?: React.ReactNode
  /** Callback when confirm is clicked. */
  onConfirm?: () => void
  /** Callback when cancel is clicked or popover closes. */
  onCancel?: () => void
  /** Confirm button text. @default "OK" */
  okText?: React.ReactNode
  /** Cancel button text. @default "Cancel" */
  cancelText?: React.ReactNode
  /** Confirm button color. @default "primary" */
  okColor?: "primary" | "danger" | "default"
  /** Popover placement. @default "top" */
  placement?: "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom"
  /** Custom icon. Pass `null` to hide. @default warning triangle */
  icon?: React.ReactNode | null
  /** Whether the trigger is disabled. */
  disabled?: boolean
  /** The trigger element (usually a Button). */
  children: React.ReactNode
}

function Popconfirm({
  title,
  description,
  onConfirm,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  okColor = "primary",
  placement = "top",
  icon,
  disabled,
  children,
}: PopconfirmProps) {
  const [open, setOpen] = React.useState(false)

  const handleConfirm = () => {
    setOpen(false)
    onConfirm?.()
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return
    if (!nextOpen) {
      onCancel?.()
    }
    setOpen(nextOpen)
  }

  const content = (
    <div className="flex max-w-64 flex-col gap-3">
      <div className="flex gap-3">
        {icon !== null && (
          <span className="mt-0.5 shrink-0 text-amber-500">
            {icon ?? <WarningIcon className="size-4" />}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{title}</div>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="small" variant="outlined" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button size="small" color="primary" variant={okColor === "danger" ? "solid" : "solid"} onClick={handleConfirm}>
          {okText}
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      placement={placement}
      trigger={children}
      content={content}
      contentProps={{ sideOffset: 8 }}
    />
  )
}

export { Popconfirm }
export type { PopconfirmProps }
