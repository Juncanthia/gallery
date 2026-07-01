import type { GalleryNavItem } from "./nav-types"
import type { ComponentRegistryItem } from "./schema"
import { getCatalogId, getDocsRoute } from "./registry-utils"

export function registryItemToNavItem(item: ComponentRegistryItem): GalleryNavItem {
  const catalogId = getCatalogId(item)
  const vendor = item.id.includes("/") ? item.id.split("/")[0] : null
  const summary = vendor
    ? `${item.title}，${vendor === "gooseui" ? "GooseUI" : vendor === "chamaac" ? "Chamaac" : vendor} 组件。`
    : `${item.title}。`

  return {
    id: catalogId,
    label: item.title,
    en: item.titleEn,
    to: getDocsRoute(item),
    summary,
    keywords: [catalogId, item.titleEn, item.titleEn.toLowerCase(), item.title, item.id],
    antd: item.legacy?.antd ?? false,
    migration: item.legacy?.migration ?? 0,
    api: item.api ?? true,
  }
}

export function mergeNavItemFromRegistry(
  existing: GalleryNavItem,
  item: ComponentRegistryItem
): GalleryNavItem {
  const derived = registryItemToNavItem(item)
  return {
    ...existing,
    ...derived,
    // Preserve any manually tuned fields from catalog when present
    summary: existing.summary || derived.summary,
    keywords: derived.keywords.length > existing.keywords.length ? derived.keywords : existing.keywords,
  }
}
