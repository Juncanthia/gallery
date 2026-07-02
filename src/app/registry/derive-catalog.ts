import type { GalleryNavGroup, GalleryNavItem } from "./nav-types"
import type { ComponentRegistryItem, DomainCategory } from "./schema"
import { getCatalogId, getDocsRoute } from "./registry-utils"

const CATEGORY_TO_GROUP: Partial<Record<DomainCategory, string>> = {
  general: "通用",
  layout: "布局",
  navigation: "导航",
  "data-entry": "数据录入",
  "data-display": "数据展示",
  feedback: "反馈",
  blocks: "复合组件",
  charts: "图表",
  media: "媒体播放",
  editor: "编辑器",
  document: "文档",
  "agent-tools": "工具组件",
  effects: "视觉效果",
  "marketing-blocks": "营销区块",
  templates: "页面模板",
  ui: "通用",
}

export function registryItemToNavItem(item: ComponentRegistryItem): GalleryNavItem {
  const catalogId = getCatalogId(item)

  return {
    id: catalogId,
    label: item.title,
    en: item.titleEn,
    to: getDocsRoute(item),
    summary: `${item.title}。`,
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
    summary: existing.summary || derived.summary,
    keywords: derived.keywords.length > existing.keywords.length ? derived.keywords : existing.keywords,
  }
}

/** Append registry-managed components missing from hand-authored nav seeds. */
export function mergeRegistryNavItems(
  groups: GalleryNavGroup[],
  registry: ComponentRegistryItem[]
): GalleryNavGroup[] {
  const next = groups.map((group) => ({ ...group, items: [...group.items] }))
  const groupByName = new Map(next.map((group) => [group.group, group]))
  const existingIds = new Set(next.flatMap((group) => group.items.map((item) => item.id)))

  for (const item of registry) {
    const catalogId = getCatalogId(item)
    if (existingIds.has(catalogId)) {
      continue
    }

    const groupName = CATEGORY_TO_GROUP[item.category]
    const targetGroup = groupName ? groupByName.get(groupName) : undefined
    if (!targetGroup) {
      continue
    }

    targetGroup.items.push(registryItemToNavItem(item))
    existingIds.add(catalogId)
  }

  return next
}
