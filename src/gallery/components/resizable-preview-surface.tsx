import type { ComponentProps } from "react"

import { ResizablePreviewSurface as CoreResizablePreviewSurface } from "./preview/frame/resizable-preview-surface"

type ResizablePreviewSurfaceProps = Omit<
  ComponentProps<typeof CoreResizablePreviewSurface>,
  "type"
> & {
  type?: ComponentProps<typeof CoreResizablePreviewSurface>["type"]
}

export function ResizablePreviewSurface({
  type = "component",
  ...props
}: ResizablePreviewSurfaceProps) {
  return <CoreResizablePreviewSurface type={type} {...props} />
}
