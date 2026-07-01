#!/usr/bin/env tsx
/**
 * Fixes files[].path and internalImportPath in generated registry entries.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const GENERATED = path.join(ROOT, "src/gallery/registry/domains/generated.ts")

function resolveRepoPath(alias: string): string | null {
  const base = `src/${alias.replace(/^@\//, "")}`
  const candidates = [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`]
  for (const candidate of candidates) {
    if (existsSync(path.join(ROOT, candidate))) {
      return candidate
    }
  }
  return null
}

function aliasFromRepo(repoPath: string): string {
  const withoutExt = repoPath.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "")
  return `@/${withoutExt.replace(/^src\//, "")}`
}

function main() {
  let content = readFileSync(GENERATED, "utf8")
  const importRegex = /internalImportPath:\s*"(@\/components\/[^"]+)"/g
  let match: RegExpExecArray | null
  let fixed = 0

  while ((match = importRegex.exec(content)) !== null) {
    const alias = match[1]
    const repoPath = resolveRepoPath(alias)
    if (!repoPath) {
      continue
    }
    const correctAlias = aliasFromRepo(repoPath)
    const oldPathPattern = new RegExp(
      `(id:[\\s\\S]*?internalImportPath:\\s*"${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?files:\\s*\\[{\\s*path:\\s*")[^"]+(")`
    )
    const blockStart = content.lastIndexOf("item({", match.index)
    const blockEnd = content.indexOf("}),", match.index)
    if (blockStart < 0 || blockEnd < 0) {
      continue
    }
    const block = content.slice(blockStart, blockEnd)
    const updatedBlock = block
      .replace(/files:\s*\[\{\s*path:\s*"[^"]+"/, `files: [{ path: "${repoPath}"`)
      .replace(/internalImportPath:\s*"@\/components\/[^"]+"/, `internalImportPath: "${correctAlias}"`)
    if (updatedBlock !== block) {
      content = content.slice(0, blockStart) + updatedBlock + content.slice(blockEnd)
      fixed++
      importRegex.lastIndex = blockStart + updatedBlock.length
    }
  }

  writeFileSync(GENERATED, content)
  console.log(`Fixed ${fixed} registry entry paths`)
}

main()
