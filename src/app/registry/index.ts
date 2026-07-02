import { CHAMAAC_REGISTRY, GOOSEUI_REGISTRY } from "./domains/pilot"
import { GENERATED_REGISTRY } from "./domains/generated"
import { buildRegistryIndex } from "./registry-utils"
import type { ComponentRegistryItem } from "./schema"

function mergeRegistries(...lists: ComponentRegistryItem[][]): ComponentRegistryItem[] {
  const byId = new Map<string, ComponentRegistryItem>()
  for (const list of lists) {
    for (const item of list) {
      byId.set(item.id, item)
    }
  }
  return [...byId.values()]
}

export const COMPONENT_REGISTRY: ComponentRegistryItem[] = mergeRegistries(
  GENERATED_REGISTRY,
  CHAMAAC_REGISTRY,
  GOOSEUI_REGISTRY
)

export const REGISTRY_INDEX = buildRegistryIndex(COMPONENT_REGISTRY)

export function getRegistryItem(id: string): ComponentRegistryItem | undefined {
  return REGISTRY_INDEX.byId.get(id) ?? REGISTRY_INDEX.byDocsSlug.get(id)
}

export function getRegistryItemByShellImport(shellImportPath: string): ComponentRegistryItem | undefined {
  return REGISTRY_INDEX.byShellImportPath.get(shellImportPath)
}

export function isRegistryManaged(id: string): boolean {
  return REGISTRY_INDEX.byId.has(id) || REGISTRY_INDEX.byDocsSlug.has(id)
}

export const REGISTRY_MANAGED_IDS = new Set(
  COMPONENT_REGISTRY.flatMap((item) => [item.id, item.docsSlug])
)
