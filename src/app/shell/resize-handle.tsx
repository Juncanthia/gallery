import { cn } from "@/kit/utils"
import * as React from "react"

type ResizeHandleProps = {
  onMouseDown: (event: React.MouseEvent) => void
  onDoubleClick?: () => void
  dragging?: boolean
  side?: "right" | "left"
  className?: string
}

export function ResizeHandle({
  onMouseDown,
  onDoubleClick,
  dragging,
  side = "right",
  className,
}: ResizeHandleProps) {
  return (
    <div
      aria-orientation="vertical"
      className={cn(
        "group absolute top-0 z-20 h-full w-1 cursor-col-resize",
        side === "right" ? "-right-px" : "-left-px",
        className
      )}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      role="separator"
      title="拖拽调整宽度（双击重置）"
    >
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition-colors",
          "group-hover:w-[3px] group-hover:bg-primary/50",
          dragging && "!w-[3px] !bg-primary"
        )}
      />
    </div>
  )
}
