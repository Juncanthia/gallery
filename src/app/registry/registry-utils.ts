import type { ComponentRegistryItem, DisplayImportPath } from "./schema"

export function getCatalogId(item: ComponentRegistryItem): string {
  return item.catalogId ?? item.id.split("/").pop() ?? item.id
}

export function getDocsRoute(item: ComponentRegistryItem): string {
  return `/components/${item.docsSlug}`
}

export function getDisplayImportPath(item: ComponentRegistryItem): DisplayImportPath {
  return (
    item.displayImportPath ?? {
      kind: "local",
      value: item.internalImportPath,
    }
  )
}

export function filePathToAlias(path: string): string {
  const normalized = path.replace(/^\.\//, "").replace(/^src\//, "")
  return `@/${normalized.replace(/\.(tsx?|jsx?)$/, "")}`
}

export function aliasToRepoPath(alias: string): string {
  if (!alias.startsWith("@/")) {
    throw new Error(`Expected @/ alias, got: ${alias}`)
  }
  return `src/${alias.slice(2)}`
}

export function basename(path: string): string {
  return path.split("/").pop()?.replace(/\.(tsx?|jsx?)$/, "") ?? path
}

export function buildRegistryIndex(items: ComponentRegistryItem[]) {
  const byId = new Map<string, ComponentRegistryItem>()
  const byDocsSlug = new Map<string, ComponentRegistryItem>()
  const byInternalImportPath = new Map<string, ComponentRegistryItem>()
  const byShellImportPath = new Map<string, ComponentRegistryItem>()

  for (const item of items) {
    if (byId.has(item.id)) {
      throw new Error(`Duplicate registry id: ${item.id}`)
    }
    byId.set(item.id, item)

    if (byDocsSlug.has(item.docsSlug)) {
      throw new Error(`Duplicate docsSlug: ${item.docsSlug}`)
    }
    byDocsSlug.set(item.docsSlug, item)

    byInternalImportPath.set(item.internalImportPath, item)

    const shellPath = item.legacyShellImportPath
    if (shellPath) {
      byShellImportPath.set(shellPath, item)
    }
  }

  return { byId, byDocsSlug, byInternalImportPath, byShellImportPath, all: items }
}
