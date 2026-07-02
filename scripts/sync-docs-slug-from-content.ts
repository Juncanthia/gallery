#!/usr/bin/env tsx
/**
 * Sync registry docsSlug from content/components filesystem (single-pass, docsSlug only).
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY } from "../src/gallery/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(ROOT, "content/components")

function walkContentSlugs(): Map<string, string> {
  const byCatalogId = new Map<string, string>()
  const byFullPath = new Map<string, string>()

  function walk(dir: string, prefix = "") {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue
      const slug = prefix ? `${prefix}/${entry}` : entry
      if (existsSync(path.join(full, "index.mdx"))) {
        byFullPath.set(slug, slug)
        byCatalogId.set(entry, slug)
        const leaf = slug.split("/").pop()!
        if (!byCatalogId.has(leaf)) byCatalogId.set(leaf, slug)
      } else {
        walk(full, slug)
      }
    }
  }

  walk(CONTENT)
  return byCatalogId
}

function syncDocsSlugOnly() {
  const contentByCatalogId = walkContentSlugs()
  const slugUpdates = new Map<string, string>()

  for (const item of COMPONENT_REGISTRY) {
    const catalogId = item.catalogId ?? item.id.split("/").pop() ?? item.id
    let target: string | undefined

    if (existsSync(path.join(CONTENT, item.docsSlug, "index.mdx"))) {
      target = item.docsSlug
    } else {
      target = contentByCatalogId.get(catalogId)
      if (!target && item.id.includes("/")) {
        const vendorLeaf = item.id.split("/").pop()!
        target = contentByCatalogId.get(vendorLeaf)
      }
    }

    if (target && target !== item.docsSlug) {
      slugUpdates.set(item.docsSlug, target)
    }
  }

  const files = [
    path.join(ROOT, "src/gallery/registry/domains/generated.ts"),
    path.join(ROOT, "src/gallery/registry/domains/pilot.ts"),
  ]

  for (const file of files) {
    let content = readFileSync(file, "utf8")
    let count = 0
    for (const [from, to] of slugUpdates) {
      const pattern = `docsSlug: ${JSON.stringify(from)}`
      const replacement = `docsSlug: ${JSON.stringify(to)}`
      if (content.includes(pattern)) {
        content = content.split(pattern).join(replacement)
        count++
      }
    }
    writeFileSync(file, content)
    console.log(`${path.relative(ROOT, file)}: ${count} docsSlug updates`)
  }

  return slugUpdates
}

function fixDoublePaths() {
  const fixes: Array<[RegExp, string]> = [
    [/blocks\/blocks\//g, "blocks/"],
    [/references\/references\//g, "references/"],
    [/baseline-blocks\//g, ""],
    [/css-blocks\//g, ""],
    [/curved-text-blocks\//g, "curved-text-"],
  ]

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!/\.(mdx|tsx|txt|ts)$/.test(entry)) continue
      let content = readFileSync(full, "utf8")
      let changed = false
      for (const [pattern, replacement] of fixes) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement)
          changed = true
        }
      }
      if (changed) writeFileSync(full, content)
    }
  }

  walk(CONTENT)
  walk(path.join(ROOT, "src/gallery"))
}

function main() {
  fixDoublePaths()
  const updates = syncDocsSlugOnly()
  console.log(`Total slug updates: ${updates.size}`)
  for (const [from, to] of [...updates.entries()].slice(0, 15)) {
    console.log(`  ${from} -> ${to}`)
  }
}

main()
