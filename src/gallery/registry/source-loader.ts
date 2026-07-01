import type { ComponentSourceFile } from "./schema"
import { basename } from "./registry-utils"
import { getRegistryItem } from "./index"

const sourceModules = import.meta.glob("../../../src/components/**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function normalizeGlobKey(key: string): string {
  return key.replace(/^\.\.\/\.\.\/\.\.\//, "")
}

const SOURCE_BY_REPO_PATH = new Map<string, string>(
  Object.entries(sourceModules).map(([key, source]) => [normalizeGlobKey(key), source])
)

export function getSourceFromRepoPath(repoPath: string): string | undefined {
  const candidates = [repoPath, repoPath.replace(/\.tsx$/, ".ts")]
  for (const candidate of candidates) {
    const source = SOURCE_BY_REPO_PATH.get(candidate)
    if (source !== undefined) {
      return source
    }
  }
  return undefined
}

export function getRegistryComponentSources(componentId: string): ComponentSourceFile[] | null {
  const item = getRegistryItem(componentId)
  if (!item) {
    return null
  }

  const files: ComponentSourceFile[] = []

  for (const file of item.files) {
    const source = getSourceFromRepoPath(file.path)
    if (source === undefined) {
      continue
    }
    files.push({
      name: basename(file.path),
      source,
      role: file.role,
    })
  }

  return files.length > 0 ? files : null
}

export function hasRegistrySource(componentId: string): boolean {
  return getRegistryComponentSources(componentId) !== null
}
