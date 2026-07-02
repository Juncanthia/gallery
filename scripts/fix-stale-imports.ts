#!/usr/bin/env tsx
/** Fix stale @/components import paths after flatten migration. */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const TARGET_DIRS = [
  path.join(ROOT, "content/components"),
  path.join(ROOT, "src/gallery"),
]

const REPLACEMENTS: Array<[string, string]> = [
  ["@/components/_shared/sabraman-api", "@/components/_internal/sabraman"],
  ["@/components/_shared/sabramans", "@/components/_internal/sabraman"],
  ["@/components/_shared/sabraman", "@/components/_internal/sabraman"],
  ["@/components/_shared/dice/ui/blocks/file-upload", "@/components/blocks/file-upload"],
  ["@/components/_shared/", "@/components/_internal/"],
  ["@/components/_primitives/animate/tooltip", "@/components/_internal/animate/tooltip"],
  ["@/components/_primitives/animate/tabs", "@/components/_internal/animate/tabs"],
  ["@/components/_primitives/", "@/components/_internal/"],
  ["@/components/ui/", "@/components/core/"],
]

function walk(dir: string, changedFiles: string[]) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full, changedFiles)
      continue
    }
    if (!/\.(mdx|tsx|txt|ts)$/.test(entry)) {
      continue
    }

    let content = readFileSync(full, "utf8")
    let changed = false
    const sorted = [...REPLACEMENTS].sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of sorted) {
      if (content.includes(from)) {
        content = content.split(from).join(to)
        changed = true
      }
    }
    if (changed) {
      writeFileSync(full, content)
      changedFiles.push(path.relative(ROOT, full))
    }
  }
}

function main() {
  const changedFiles: string[] = []
  for (const dir of TARGET_DIRS) {
    walk(dir, changedFiles)
  }
  console.log(`Updated ${changedFiles.length} files`)
  for (const file of changedFiles.slice(0, 20)) {
    console.log(`  ${file}`)
  }
  if (changedFiles.length > 20) {
    console.log(`  ... and ${changedFiles.length - 20} more`)
  }
}

main()
