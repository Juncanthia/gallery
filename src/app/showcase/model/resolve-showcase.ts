import { GALLERY_DOCS } from "../../registry/catalog"
import { getRegistryItem } from "../../registry/index"
import { getDisplayImportPath } from "../../registry/registry-utils"
import { loadPreview, loadPreviewSource } from "../../runtime/preview-registry"
import { getGalleryApiDoc } from "../../registry/api-registry"
import type { GalleryApiDoc } from "../../registry/api-types"
import type { GalleryItem } from "../../registry/types"
import { transformImportPaths } from "../preview/asset/code-transform"
import type { PreviewAsset, PreviewSourceId } from "../preview/asset/types"
import { normalizeSourceId } from "../preview/asset/types"
import { showcaseAnchorBase } from "../../navigation/href/heading-slug"

export type ShowcaseModel = {
  anchor: string
  asset: PreviewAsset | null
  item: GalleryItem | null
  selectedSource: string
  apiDoc: GalleryApiDoc | null
  relatedPatterns: GalleryItem[]
  has: {
    preview: boolean
    api: boolean
    examples: boolean
    source: boolean
  }
}

function normalizeSource(source?: PreviewSourceId | "local" | string): PreviewSourceId {
  return normalizeSourceId(source) ?? "local"
}

function inferItemId(path: string, explicitId?: string): string | null {
  const [first] = path.split("/")

  if (first && GALLERY_DOCS[first]) {
    return first
  }

  if (explicitId && GALLERY_DOCS[explicitId]) {
    return explicitId
  }

  return first || null
}

function resolveImportPath(path: string, explicitId?: string): string {
  const candidates = [explicitId, path.split("/").slice(0, 2).join("/"), path.split("/")[0]].filter(
    Boolean
  ) as string[]

  for (const candidate of candidates) {
    const registryItem = getRegistryItem(candidate)
    if (registryItem) {
      return getDisplayImportPath(registryItem).value
    }
  }

  const itemId = inferItemId(path, explicitId)
  if (itemId) {
    return `@/components/core/${itemId}`
  }

  return `@/components/core/${path.split("/")[0]}`
}

function getGalleryItem(path: string, explicitId?: string): GalleryItem | null {
  const registryCandidates = [explicitId, path.split("/").slice(0, 2).join("/")].filter(Boolean) as string[]
  for (const candidate of registryCandidates) {
    const registryItem = getRegistryItem(candidate)
    if (registryItem) {
      const display = getDisplayImportPath(registryItem)
      return {
        id: registryItem.docsSlug,
        title: `${registryItem.title} ${registryItem.titleEn}`,
        href: `/components/${registryItem.docsSlug}`,
        kind: "component",
        description: `${registryItem.title}。`,
        implementations: [
          {
            source: "local",
            status: "stable",
            importPath: display.value,
          },
        ],
      }
    }
  }

  const itemId = inferItemId(path, explicitId)
  if (!itemId) {
    return null
  }

  const doc = GALLERY_DOCS[itemId]
  if (!doc) {
    return null
  }

  return {
    id: itemId,
    title: doc.en ? `${doc.title} ${doc.en}` : doc.title,
    href: `/components/${itemId}`,
    kind: "component",
    description: doc.description,
    implementations: [
      {
        source: "local",
        status: "stable",
        importPath: resolveImportPath(path, explicitId),
      },
    ],
  }
}

function buildAsset(path: string, Preview: NonNullable<Awaited<ReturnType<typeof loadPreview>>>, code: string | null): PreviewAsset {
  const filename = `examples/${path}.tsx`
  const parsedCode = transformImportPaths(code ?? "")

  return {
    path,
    filename,
    parsedCode,
    frame: { title: filename },
    type: "component",
    sourceFiles: code
      ? [
          {
            library: "local",
            name: filename,
            source: parsedCode,
          },
        ]
      : [],
    Preview,
  }
}

export async function resolveShowcase(
  path: string,
  source?: PreviewSourceId | "local" | string,
  id?: string
): Promise<ShowcaseModel> {
  const [Preview, code] = await Promise.all([loadPreview(path), loadPreviewSource(path)])
  const anchor = id ?? showcaseAnchorBase(path)
  const selectedSource = normalizeSource(source)
  const item = getGalleryItem(path, id)
  const apiDoc = item ? getGalleryApiDoc(item.id) : null
  const asset = Preview ? buildAsset(path, Preview, code) : null

  return {
    anchor,
    asset,
    item,
    selectedSource,
    apiDoc,
    relatedPatterns: [],
    has: {
      preview: Boolean(asset),
      api: Boolean(apiDoc && item && anchor === item.id),
      examples: false,
      source: false,
    },
  }
}
