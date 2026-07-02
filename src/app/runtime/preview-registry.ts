import type { ComponentType } from "react"

type PreviewModule = {
  default: ComponentType
}

const previews = import.meta.glob<PreviewModule>(
  "../../../content/components/**/examples/*.tsx"
)
const sources = import.meta.glob<string>(
  "../../../content/components/**/examples/*.tsx",
  {
    import: "default",
    query: "?raw",
  }
)

const resolveExampleKey = (path: string) => {
  const parts = path.split("/")
  const example = parts.pop()
  const component = parts.join("/")

  if (!component || !example) {
    return null
  }

  return `../../../content/components/${component}/examples/${example}.tsx`
}

export async function loadPreview(path: string) {
  const key = resolveExampleKey(path)

  if (!key) {
    return null
  }

  const loader = previews[key]

  if (!loader) {
    return null
  }

  const module = await loader()

  return module.default
}

export async function loadPreviewSource(path: string) {
  const key = resolveExampleKey(path)

  if (!key) {
    return null
  }

  const loader = sources[key]

  if (!loader) {
    return null
  }

  return loader()
}
