#!/usr/bin/env tsx
/**
 * Updates llm.txt and index.mdx documentation to use internalImportPath.
 * Run: npx tsx scripts/codemod-registry-docs.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY } from "../src/gallery/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content/components")

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...walk(full))
    } else if (entry === "llm.txt" || entry === "index.mdx") {
      out.push(full)
    }
  }
  return out
}

function main() {
  const shellMap = new Map<string, string>()
  for (const item of COMPONENT_REGISTRY) {
    if (item.legacyShellImportPath) {
      shellMap.set(item.legacyShellImportPath, item.internalImportPath)
    }
  }

  let changed = 0
  for (const file of walk(CONTENT_DIR)) {
    let content = readFileSync(file, "utf8")
    let fileChanged = false

    for (const [shellPath, internalPath] of shellMap) {
      const escaped = shellPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const pattern = new RegExp(escaped, "g")
      if (pattern.test(content)) {
        content = content.replace(pattern, internalPath)
        fileChanged = true
      }
    }

    if (fileChanged) {
      writeFileSync(file, content)
      changed++
      console.log(path.relative(ROOT, file))
    }
  }

  console.log(`Updated ${changed} doc files`)
}

main()
