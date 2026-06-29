import type { ComponentType } from "react"

type PreviewModule = {
  default: ComponentType
}

const previews = import.meta.glob<PreviewModule>("../../../examples/**/*.tsx")
const sources = import.meta.glob<string>("../../../examples/**/*.tsx", {
  import: "default",
  query: "?raw",
})

const resolveExampleKey = (path: string) => `../../../examples/${path}.tsx`

export async function loadPreview(path: string) {
  const loader = previews[resolveExampleKey(path)]

  if (!loader) {
    return null
  }

  const module = await loader()

  return module.default
}

export async function loadPreviewSource(path: string) {
  const loader = sources[resolveExampleKey(path)]

  if (!loader) {
    return null
  }

  return loader()
}
