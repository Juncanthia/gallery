#!/usr/bin/env tsx
/**
 * Finish content isomorph migration: resolve duplicates, update registry slugs, clean vendor dirs.
 */
import { execSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY } from "../src/gallery/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(ROOT, "content/components")

const VENDORS = [
  "bklit",
  "chamaac",
  "dice",
  "dt",
  "evilcharts",
  "extend",
  "gooseui",
  "limeplay",
  "manifest",
  "rb",
  "sabraman",
  "tool",
  "uselayouts",
]

function run(cmd: string) {
  console.log(cmd)
  execSync(cmd, { cwd: ROOT, stdio: "inherit" })
}

function rmContent(rel: string) {
  const full = path.join(CONTENT, rel)
  if (!existsSync(full)) return
  try {
    run(`git rm -rf ${JSON.stringify(full)}`)
  } catch {
    execSync(`rm -rf ${JSON.stringify(full)}`, { cwd: ROOT })
  }
}

function mvContent(from: string, to: string) {
  const fromFull = path.join(CONTENT, from)
  const toFull = path.join(CONTENT, to)
  if (!existsSync(fromFull)) return
  if (existsSync(toFull)) {
    console.warn(`SKIP mv ${from} -> ${to} (target exists)`)
    return
  }
  const parent = path.dirname(toFull)
  execSync(`mkdir -p ${JSON.stringify(parent)}`, { cwd: ROOT })
  run(`git mv ${JSON.stringify(fromFull)} ${JSON.stringify(toFull)}`)
}

function resolveDuplicates() {
  const resolutions: Array<{ action: "rm"; path: string } | { action: "mv"; from: string; to: string }> = [
    { action: "rm", path: "core/checkbox" },
    { action: "mv", from: "checkbox", to: "core/checkbox" },
    { action: "rm", path: "dice/checkbox" },
    { action: "rm", path: "core/progress" },
    { action: "mv", from: "progress", to: "core/progress" },
    { action: "rm", path: "core/slider" },
    { action: "mv", from: "slider", to: "core/slider" },
    { action: "rm", path: "core/switch" },
    { action: "mv", from: "switch", to: "core/switch" },
    { action: "rm", path: "chart" },
    { action: "rm", path: "image" },
    { action: "rm", path: "tool/citation" },
  ]

  for (const step of resolutions) {
    if (step.action === "rm") rmContent(step.path)
    else mvContent(step.from, step.to)
  }
}

function removeEmptyVendorDirs() {
  for (const vendor of VENDORS) {
    const dir = path.join(CONTENT, vendor)
    if (!existsSync(dir)) continue
    const entries = readdirSync(dir)
    if (entries.length === 0) {
      try {
        run(`git rm -r ${JSON.stringify(dir)}`)
      } catch {
        execSync(`rmdir ${JSON.stringify(dir)}`)
      }
    } else {
      console.warn(`Vendor dir ${vendor} still has: ${entries.join(", ")}`)
    }
  }
}

function updateRegistryDocsSlugs() {
  const slugMap = new Map<string, string>()
  for (const item of COMPONENT_REGISTRY) {
    let target = item.internalImportPath.replace(/^@\/components\//, "")
    if (target.startsWith("_shared/") || target.startsWith("_primitives/")) {
      target = `references/${item.docsSlug}`
    }
    if (item.docsSlug !== target) {
      slugMap.set(item.docsSlug, target)
    }
  }

  const files = [
    path.join(ROOT, "src/gallery/registry/domains/generated.ts"),
    path.join(ROOT, "src/gallery/registry/domains/pilot.ts"),
    path.join(ROOT, "src/gallery/registry/catalog.ts"),
  ]

  for (const file of files) {
    let content = readFileSync(file, "utf8")
    let changed = false
    const sorted = [...slugMap.entries()].sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of sorted) {
      const replacements = [
        [`docsSlug: ${JSON.stringify(from)}`, `docsSlug: ${JSON.stringify(to)}`],
        [`/components/${from}`, `/components/${to}`],
        [`content/components/${from}`, `content/components/${to}`],
        [`../../../content/components/${from}`, `../../../content/components/${to}`],
      ]
      for (const [oldStr, newStr] of replacements) {
        if (content.includes(oldStr)) {
          content = content.split(oldStr).join(newStr)
          changed = true
        }
      }
    }
    if (changed) {
      writeFileSync(file, content)
      console.log(`Updated ${path.relative(ROOT, file)}`)
    }
  }

  return slugMap
}

function replaceContentReferences(slugMap: Map<string, string>) {
  const replacements: Array<[string, string]> = []
  for (const [from, to] of slugMap) {
    replacements.push([from, to])
    replacements.push([`content/components/${from}`, `content/components/${to}`])
    replacements.push([`/components/${from}`, `/components/${to}`])
  }

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
      for (const [from, to] of replacements.sort((a, b) => b[0].length - a[0].length)) {
        if (content.includes(from)) {
          content = content.split(from).join(to)
          changed = true
        }
      }
      if (changed) writeFileSync(full, content)
    }
  }

  walk(CONTENT)
  walk(path.join(ROOT, "src/gallery"))
}

function countVendorSlugs(): number {
  let count = 0
  function walk(dir: string, prefix = "") {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue
      const slug = prefix ? `${prefix}/${entry}` : entry
      if (existsSync(path.join(full, "index.mdx"))) {
        const first = slug.split("/")[0]
        if (VENDORS.includes(first)) count++
      } else {
        walk(full, slug)
      }
    }
  }
  walk(CONTENT)
  return count
}

function countAllSlugs(): number {
  let count = 0
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue
      if (existsSync(path.join(full, "index.mdx"))) count++
      else walk(full)
    }
  }
  walk(CONTENT)
  return count
}

function main() {
  resolveDuplicates()
  removeEmptyVendorDirs()
  const slugMap = updateRegistryDocsSlugs()
  replaceContentReferences(slugMap)

  const report = {
    totalSlugs: countAllSlugs(),
    vendorPathRemaining: countVendorSlugs(),
    registrySlugUpdates: slugMap.size,
    sampleUpdates: [...slugMap.entries()].slice(0, 10).map(([a, b]) => `${a} -> ${b}`),
  }

  writeFileSync(path.join(ROOT, "scripts/.content-isomorph-report.json"), JSON.stringify(report, null, 2))
  console.log("\nReport:", JSON.stringify(report, null, 2))
}

main()
