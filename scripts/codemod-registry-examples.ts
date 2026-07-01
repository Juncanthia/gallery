#!/usr/bin/env tsx
/**
 * Rewrites example imports from legacy ui/ shells to registry internalImportPath.
 * Run: pnpm exec tsx scripts/codemod-registry-examples.ts [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY, getRegistryItemByShellImport } from "../src/gallery/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const EXAMPLES_GLOB = path.join(ROOT, "content/components")

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...walk(full))
    } else if (entry.endsWith(".tsx") && full.includes(`${path.sep}examples${path.sep}`)) {
      out.push(full)
    }
  }
  return out
}

function main() {
  const dryRun = process.argv.includes("--dry-run")
  const shellMap = new Map<string, string>()

  for (const item of COMPONENT_REGISTRY) {
    if (item.legacyShellImportPath) {
      shellMap.set(item.legacyShellImportPath, item.internalImportPath)
    }
  }

  let changedFiles = 0
  let changedImports = 0

  for (const file of walk(EXAMPLES_GLOB)) {
    let content = readFileSync(file, "utf8")
    let fileChanged = false

    for (const [shellPath, internalPath] of shellMap) {
      const patterns = [
        new RegExp(`from\\s+["']${shellPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "g"),
        new RegExp(`from\\s+["']${shellPath.replace(/^@\//, "@/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "g"),
      ]
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, `from "${internalPath}"`)
          changedImports++
          fileChanged = true
        }
      }
    }

    // Also handle dynamic lookup for any remaining shell imports
    content = content.replace(/from\s+["'](@\/components\/ui\/[^"']+)["']/g, (match, shellImport: string) => {
      const item = getRegistryItemByShellImport(shellImport)
      if (!item) {
        return match
      }
      changedImports++
      fileChanged = true
      return `from "${item.internalImportPath}"`
    })

    if (fileChanged) {
      changedFiles++
      if (!dryRun) {
        writeFileSync(file, content)
      }
      console.log(`${dryRun ? "[dry-run] " : ""}${path.relative(ROOT, file)}`)
    }
  }

  console.log(`Updated ${changedImports} imports across ${changedFiles} files`)
}

main()
