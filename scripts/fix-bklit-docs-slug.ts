#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(ROOT, "content/components")
const GENERATED = path.join(ROOT, "src/gallery/registry/domains/generated.ts")

function findChartKitSlug(name: string): string | null {
  const direct = path.join(CONTENT, "charts/chart-kit", name, "index.mdx")
  if (existsSync(direct)) return `charts/chart-kit/${name}`

  function walk(dir: string, prefix: string): string | null {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue
      const slug = `${prefix}/${entry}`
      if (entry === name && existsSync(path.join(full, "index.mdx"))) return slug
      const nested = walk(full, slug)
      if (nested) return nested
    }
    return null
  }

  const kitRoot = path.join(CONTENT, "charts/chart-kit")
  if (!existsSync(kitRoot)) return null
  return walk(kitRoot, "charts/chart-kit")
}

const content = readFileSync(GENERATED, "utf8")
const itemRegex = /item\(\{[\s\S]*?\}\),/g
let fixes = 0
const updated = content.replace(itemRegex, (block) => {
  const idMatch = block.match(/id: "bklit\/([^"]+)"/)
  if (!idMatch) return block
  const catalogMatch = block.match(/catalogId: "([^"]+)"/)
  const name = catalogMatch?.[1] ?? idMatch[1]
  const target = findChartKitSlug(name)
  if (!target) return block
  const docsMatch = block.match(/docsSlug: "([^"]+)"/)
  if (!docsMatch || docsMatch[1] === target) return block
  fixes++
  console.log(`bklit/${name}: ${docsMatch[1]} -> ${target}`)
  return block.replace(/docsSlug: "[^"]+"/, `docsSlug: ${JSON.stringify(target)}`)
})

writeFileSync(GENERATED, updated)
console.log(`Fixed ${fixes} bklit docsSlug entries`)
