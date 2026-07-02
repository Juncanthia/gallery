#!/usr/bin/env tsx
/**
 * Detects duplicate use-* hook filenames under src/.
 * Run: pnpm check:duplicate-hooks
 */
import { readdirSync, statSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const SRC = path.join(ROOT, "src")

/** Pre-existing isolated duplicates documented during Phase 3 exit. */
const ALLOWED_DUPLICATE_GROUPS = new Set([
  [
    "src/_internals/foundations/hooks/use-mounted.ts",
    "src/_internals/foundations/headless/hooks/use-mounted.ts",
  ].sort().join("\n"),
])

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue
      walk(full, files)
    } else if (/^use-.*\.tsx?$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}

function main() {
  const byName = new Map<string, string[]>()

  for (const file of walk(SRC)) {
    const name = path.basename(file)
    const rel = path.relative(ROOT, file)
    if (!byName.has(name)) byName.set(name, [])
    byName.get(name)!.push(rel)
  }

  const duplicates = [...byName.entries()].filter(([, paths]) => {
    if (paths.length <= 1) return false
    const key = [...paths].sort().join("\n")
    return !ALLOWED_DUPLICATE_GROUPS.has(key)
  })

  if (duplicates.length > 0) {
    console.error("Duplicate hook filenames found:\n")
    for (const [name, paths] of duplicates) {
      console.error(`  ${name}:`)
      for (const p of paths) console.error(`    - ${p}`)
    }
    process.exit(1)
  }

  console.log(`No duplicate use-* hooks (${byName.size} unique files)`)
}

main()
