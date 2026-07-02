#!/usr/bin/env tsx
/**
 * Syncs files[].path and internalImportPath in registry domain files
 * to match flattened src/components/ layout via docsSlug resolution.
 *
 * Run: pnpm exec tsx scripts/fix-registry-paths.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const TARGETS = [
  path.join(ROOT, "src/gallery/registry/domains/generated.ts"),
  path.join(ROOT, "src/gallery/registry/domains/pilot.ts"),
]

function resolveRepoPath(alias: string): string | null {
  const base = path.join(ROOT, "src", alias.replace(/^@\//, ""))
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return path.relative(ROOT, candidate)
    }
  }
  return null
}

function aliasFromRepo(repoPath: string): string {
  const withoutExt = repoPath.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "")
  return `@/${withoutExt.replace(/^src\//, "")}`
}

function patchRegistryFile(filePath: string): { fixed: number; skipped: string[] } {
  const content = readFileSync(filePath, "utf8")
  const skipped: string[] = []
  let fixed = 0

  const updated = content.replace(/item\(\{([\s\S]*?)\}\),/g, (fullBlock, body) => {
    const docsSlugMatch = body.match(/docsSlug:\s*"([^"]+)"/)
    if (!docsSlugMatch) {
      return fullBlock
    }

    const repoPath = resolveRepoPath(`@/components/${docsSlugMatch[1]}`)
    if (!repoPath) {
      const idMatch = body.match(/id:\s*"([^"]+)"/)
      skipped.push(idMatch?.[1] ?? docsSlugMatch[1])
      return fullBlock
    }

    const alias = aliasFromRepo(repoPath)
    const currentImport = body.match(/internalImportPath:\s*"([^"]+)"/)?.[1]
    const currentFile = body.match(/files:\s*\[\{\s*path:\s*"([^"]+)"/)?.[1]

    if (currentImport === alias && currentFile === repoPath) {
      return fullBlock
    }

    fixed++
    const nextBody = body
      .replace(/files:\s*\[\{\s*path:\s*"[^"]+"/, `files: [{ path: "${repoPath}"`)
      .replace(/internalImportPath:\s*"@\/components\/[^"]+"/, `internalImportPath: "${alias}"`)

    return `item({${nextBody}}),`
  })

  writeFileSync(filePath, updated)
  return { fixed, skipped }
}

function main() {
  let totalFixed = 0
  const allSkipped = new Set<string>()

  for (const target of TARGETS) {
    const { fixed, skipped } = patchRegistryFile(target)
    totalFixed += fixed
    for (const id of skipped) {
      allSkipped.add(id)
    }
    console.log(`Fixed ${fixed} entries in ${path.relative(ROOT, target)}`)
    if (skipped.length > 0) {
      console.log(`  Skipped (unresolved docsSlug): ${skipped.join(", ")}`)
    }
  }

  console.log(`Total fixed: ${totalFixed}`)
  if (allSkipped.size > 0) {
    console.log(`Unresolved ids: ${[...allSkipped].join(", ")}`)
  }
}

main()
