import type { ComponentType } from "react"

import type { PreviewFrameConfig } from "../frame/preview-frame"

export type PreviewSourceId = "local"

export type PreviewSourceFile = {
  library?: string
  name: string
  source: string
  missing?: boolean
  expectedPath?: string
}

export type PreviewAsset = {
  path: string
  filename: string
  parsedCode: string
  frame: PreviewFrameConfig
  type: "component" | "block"
  sourceFiles: PreviewSourceFile[]
  Preview: ComponentType
}

export function normalizeSourceId(source?: string): PreviewSourceId | undefined {
  if (!source || source === "local") {
    return "local"
  }

  return undefined
}
