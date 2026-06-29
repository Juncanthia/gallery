import type { ReactNode } from "react"

import { PreviewFrame as CorePreviewFrame } from "./preview/frame/preview-frame"

type PreviewFrameProps = {
  children: ReactNode
  title: string
  copyCode?: string | null
  className?: string
}

export function PreviewFrame({ children, title, copyCode, className }: PreviewFrameProps) {
  return (
    <CorePreviewFrame
      className={className}
      config={{ title }}
      copyCode={copyCode ?? undefined}
    >
      {children}
    </CorePreviewFrame>
  )
}
