import type { ReactNode } from "react"

import type { PreviewFrameConfig } from "../frame/preview-frame"
import { PreviewFrame } from "../frame/preview-frame"
import { ResizablePreviewSurface } from "../frame/resizable-preview-surface"
import { PreviewRender } from "../runtime/preview-render"

export type PreviewPaneProps = {
  frame: PreviewFrameConfig
  type?: "component" | "block"
  children?: ReactNode
  className?: string
  controls?: ReactNode
  copyCode?: string
  copyMeta?: {
    id: string
    title: string
    href: string
  }
}

export function PreviewPane({
  frame,
  type = "component",
  children,
  className,
  controls,
  copyCode,
  copyMeta,
}: PreviewPaneProps) {
  return (
    <PreviewFrame
      className={className}
      config={frame}
      controls={controls}
      copyCode={copyCode}
      copyMeta={copyMeta}
    >
      <div className={type === "block" ? "size-full h-[48rem]" : "size-full"}>
        <ResizablePreviewSurface type={type}>
          {type === "block" ? (
            children
          ) : (
            <PreviewRender align={frame.align}>{children}</PreviewRender>
          )}
        </ResizablePreviewSurface>
      </div>
    </PreviewFrame>
  )
}
