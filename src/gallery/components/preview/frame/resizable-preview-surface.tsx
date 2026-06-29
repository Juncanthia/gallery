import { type ReactNode, useContext, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { PreviewFrameContext } from "./preview-frame"

type ResizablePreviewSurfaceProps = {
  children: ReactNode
  type: "component" | "block"
  className?: string
}

export function ResizablePreviewSurface({
  children,
  type,
  className,
}: ResizablePreviewSurfaceProps) {
  const context = useContext(PreviewFrameContext)
  const width = context?.width ?? "100%"
  const setWidth = context?.setWidth
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!containerRef.current) return

    setIsDragging(true)
    const startX = e.clientX
    const startWidth = containerRef.current.getBoundingClientRect().width

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const parentWidth = containerRef.current?.parentElement?.getBoundingClientRect().width ?? window.innerWidth
      const newWidth = Math.min(parentWidth, Math.max(375, startWidth + deltaX))
      setWidth?.(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="relative flex size-full items-stretch justify-start overflow-hidden bg-background">
      <div
        ref={containerRef}
        className={cn(
          "h-full overflow-auto border-r border-border/30 relative pr-4",
          !isDragging && "transition-all duration-200 ease-out",
          type === "component" ? "overflow-hidden" : "overflow-auto",
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          minWidth: "375px",
        }}
      >
        {children}
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "absolute top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group/handle select-none z-10",
          isDragging ? "bg-primary/5" : "hover:bg-muted/50"
        )}
        style={{
          left: typeof width === "number" ? `${width - 8}px` : "calc(100% - 8px)",
          transition: isDragging ? "none" : "left 0.2s ease-out",
        }}
      >
        <div className={cn(
          "w-1 h-8 rounded-full bg-muted-foreground/30 transition group-hover/handle:bg-muted-foreground/60",
          isDragging && "bg-primary/60"
        )} />
      </div>
    </div>
  )
}
