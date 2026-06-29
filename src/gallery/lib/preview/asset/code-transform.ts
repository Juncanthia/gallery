import { GALLERY_LIBRARIES } from "../../catalog/data/libraries"

/** Transform workspace import paths to standard @/ aliases for display/copy. */
export function transformImportPaths(code: string) {
  let out = code

  for (const library of GALLERY_LIBRARIES) {
    for (const rule of library.codeTransform.rules) {
      out = out.replaceAll(rule.from, rule.to)
    }
  }

  return out
}

/** @deprecated Use transformImportPaths */
export const parsePreviewCode = transformImportPaths
