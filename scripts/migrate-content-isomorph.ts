#!/usr/bin/env tsx
/**
 * Reorganize content/components/ to mirror src/components/ usage structure.
 * Vendor info stays in metadata, not paths.
 *
 * Run: npx tsx scripts/migrate-content-isomorph.ts [--dry-run]
 */
import { execSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY } from "../src/app/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content/components")
const SRC_COMPONENTS = path.join(ROOT, "src/components")
const DRY_RUN = process.argv.includes("--dry-run")

const VENDORS = new Set([
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
])

const SKIP_SRC_DIRS = new Set(["_internal", "base", "patterns"])

const VENDOR_HINTS: Record<string, string[]> = {
  bklit: ["charts/chart-kit"],
  evilcharts: ["charts/evil-charts"],
  chamaac: ["effects", "data-entry", "data-display", "navigation", "marketing-blocks", "charts"],
  gooseui: ["effects", "marketing-blocks", "layout", "navigation", "data-display", "data-entry"],
  manifest: ["templates"],
  tool: ["agent-tools"],
  dt: ["data-display/data-table-filters"],
  uselayouts: ["layout", "effects", "navigation", "data-entry", "templates"],
  dice: ["data-entry", "data-display", "navigation", "layout", "feedback", "general"],
  rb: ["navigation", "marketing-blocks", "effects", "general"],
  extend: ["document", "general"],
  limeplay: ["media"],
  sabraman: ["feedback", "data-entry", "data-display", "navigation", "effects"],
}

const FLAT_CATEGORY_ORDER = [
  "core",
  "blocks",
  "data-entry",
  "data-display",
  "feedback",
  "navigation",
  "layout",
  "general",
  "editor",
  "document",
  "media",
  "charts",
  "effects",
  "marketing-blocks",
  "templates",
  "agent-tools",
]

type Move = { from: string; to: string; reason: string }

function isDir(p: string): boolean {
  return existsSync(p) && statSync(p).isDirectory()
}

function srcModuleExists(slug: string): boolean {
  const base = path.join(SRC_COMPONENTS, slug)
  return (
    existsSync(`${base}.tsx`) ||
    existsSync(`${base}.ts`) ||
    existsSync(path.join(base, "index.tsx")) ||
    existsSync(path.join(base, "index.ts"))
  )
}

function buildSrcSlugIndex(): Map<string, string[]> {
  const index = new Map<string, string[]>()

  function walk(dir: string, slugPrefix: string) {
    for (const entry of readdirSync(dir)) {
      if (SKIP_SRC_DIRS.has(entry)) continue
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue

      const slug = slugPrefix ? `${slugPrefix}/${entry}` : entry
      const hasIndex =
        existsSync(path.join(full, "index.tsx")) || existsSync(path.join(full, "index.ts"))
      const tsxFiles = readdirSync(full).filter((f) => f.endsWith(".tsx") && !f.startsWith("_"))

      if (hasIndex) {
        const list = index.get(entry) ?? []
        list.push(slug)
        index.set(entry, list)
      }

      for (const file of tsxFiles) {
        if (file === "index.tsx") continue
        const name = file.replace(/\.tsx$/, "")
        const fileSlug = `${slug}/${name}`
        const list = index.get(name) ?? []
        list.push(fileSlug)
        index.set(name, list)
      }

      walk(full, slug)
    }

    for (const file of readdirSync(dir)) {
      if (!/\.tsx$/.test(file) || file.startsWith("_")) continue
      const name = file.replace(/\.tsx$/, "")
      const slug = slugPrefix ? `${slugPrefix}/${name}` : name
      const list = index.get(name) ?? []
      list.push(slug)
      index.set(name, list)
    }
  }

  walk(SRC_COMPONENTS, "")
  return index
}

function walkContentSlugs(): string[] {
  const out: string[] = []

  function walk(dir: string, prefix = "") {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (!statSync(full).isDirectory()) continue

      if (existsSync(path.join(full, "index.mdx"))) {
        out.push(prefix ? `${prefix}/${entry}` : entry)
        continue
      }

      if (!prefix && VENDORS.has(entry)) {
        for (const sub of readdirSync(full)) {
          const subFull = path.join(full, sub)
          if (statSync(subFull).isDirectory() && existsSync(path.join(subFull, "index.mdx"))) {
            out.push(`${entry}/${sub}`)
          }
        }
      }
    }
  }

  walk(CONTENT_DIR)
  return out.sort()
}

function scoreCandidate(slug: string, vendor: string | null, hints: string[]): number {
  let score = 0
  if (vendor) {
    for (const hint of hints) {
      if (slug.startsWith(hint)) score += 100
      if (slug.includes(`/${hint}/`) || slug.includes(`/${hint}`)) score += 50
    }
  }
  score -= slug.split("/").length * 2
  if (slug.includes("_internal") || slug.includes("/demo/") || slug.includes("/__")) score -= 200
  if (srcModuleExists(slug)) score += 20
  return score
}

function pickCandidate(name: string, vendor: string | null, srcIndex: Map<string, string[]>): string | null {
  const hints = vendor ? (VENDOR_HINTS[vendor] ?? []) : []
  const candidates = srcIndex.get(name) ?? []

  if (candidates.length === 0) {
    if (!vendor) {
      for (const cat of FLAT_CATEGORY_ORDER) {
        const candidate = `${cat}/${name}`
        if (srcModuleExists(candidate)) return candidate
      }
      if (srcModuleExists(name)) return name
    }
    return null
  }

  const ranked = [...candidates].sort(
    (a, b) => scoreCandidate(b, vendor, hints) - scoreCandidate(a, vendor, hints)
  )
  return ranked[0] ?? null
}

function resolveTarget(oldSlug: string, srcIndex: Map<string, string[]>): Move {
  const registryItem = COMPONENT_REGISTRY.find((item) => item.docsSlug === oldSlug)
  const name = oldSlug.includes("/") ? oldSlug.split("/").pop()! : oldSlug
  const vendor = oldSlug.includes("/") ? oldSlug.split("/")[0] : null

  if (registryItem) {
    const target = registryItem.internalImportPath.replace(/^@\/components\//, "")
    if (target.startsWith("_shared/") || target.startsWith("_primitives/")) {
      return { from: oldSlug, to: `references/${oldSlug}`, reason: "shared-primitive-skip" }
    }
    if (!srcModuleExists(target)) {
      const fallback = pickCandidate(name, vendor, srcIndex)
      if (fallback) {
        return { from: oldSlug, to: fallback, reason: "registry-fallback" }
      }
    }
    if (oldSlug !== target) {
      return { from: oldSlug, to: target, reason: "registry" }
    }
    return { from: oldSlug, to: target, reason: "unchanged" }
  }

  const picked = pickCandidate(name, vendor, srcIndex)
  if (picked) {
    if (picked !== oldSlug) {
      return { from: oldSlug, to: picked, reason: vendor ? "vendor-resolve" : "flat-resolve" }
    }
    return { from: oldSlug, to: picked, reason: "unchanged" }
  }

  if (vendor) {
    return { from: oldSlug, to: `references/${oldSlug}`, reason: "orphan-vendor" }
  }

  return { from: oldSlug, to: `references/${oldSlug}`, reason: "orphan-flat" }
}

function ensureParentDir(targetPath: string) {
  const parent = path.dirname(targetPath)
  if (!existsSync(parent)) {
    mkdirSync(parent, { recursive: true })
  }
}

function gitMv(fromRel: string, toRel: string) {
  const from = path.join(CONTENT_DIR, fromRel)
  const to = path.join(CONTENT_DIR, toRel)
  if (!existsSync(from)) return
  if (existsSync(to)) {
    console.warn(`SKIP conflict: ${fromRel} -> ${toRel} (target exists)`)
    return
  }
  ensureParentDir(to)
  const cmd = `git mv ${JSON.stringify(from)} ${JSON.stringify(to)}`
  if (DRY_RUN) {
    console.log(`[dry-run] ${cmd}`)
  } else {
    execSync(cmd, { cwd: ROOT, stdio: "pipe" })
  }
}

function replaceInTree(dir: string, replacements: Array<[string, string]>) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      replaceInTree(full, replacements)
      continue
    }
    if (!/\.(mdx|tsx|txt|ts|json)$/.test(entry)) continue
    let content = readFileSync(full, "utf8")
    let changed = false
    const sorted = [...replacements].sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of sorted) {
      if (content.includes(from)) {
        content = content.split(from).join(to)
        changed = true
      }
    }
    if (changed && !DRY_RUN) {
      writeFileSync(full, content)
    }
  }
}

function updateRegistryFiles(slugMap: Map<string, string>) {
  const registryFiles = [
    path.join(ROOT, "src/app/registry/domains/generated.ts"),
    path.join(ROOT, "src/app/registry/domains/pilot.ts"),
  ]

  for (const file of registryFiles) {
    if (!existsSync(file)) continue
    let content = readFileSync(file, "utf8")
    let changed = false
    for (const [from, to] of slugMap) {
      const patterns = [
        `docsSlug: ${JSON.stringify(from)}`,
        `docsSlug: "${from}"`,
        `docsSlug: '${from}'`,
      ]
      for (const pattern of patterns) {
        const replacement = pattern.replace(from, to)
        if (content.includes(pattern)) {
          content = content.split(pattern).join(replacement)
          changed = true
        }
      }
    }
    if (changed && !DRY_RUN) {
      writeFileSync(file, content)
    }
  }
}

function updateCatalogRoutes(slugMap: Map<string, string>) {
  const catalogFile = path.join(ROOT, "src/app/registry/catalog.ts")
  if (!existsSync(catalogFile)) return
  let content = readFileSync(catalogFile, "utf8")
  let changed = false
  for (const [from, to] of slugMap) {
    const oldRoute = `/components/${from}`
    const newRoute = `/components/${to}`
    if (content.includes(oldRoute)) {
      content = content.split(oldRoute).join(newRoute)
      changed = true
    }
  }
  if (changed && !DRY_RUN) {
    writeFileSync(catalogFile, content)
  }
}

function removeEmptyVendorDirs() {
  for (const vendor of VENDORS) {
    const vendorDir = path.join(CONTENT_DIR, vendor)
    if (!existsSync(vendorDir)) continue
    const remaining = readdirSync(vendorDir)
    if (remaining.length === 0) {
      if (DRY_RUN) {
        console.log(`[dry-run] rmdir ${vendorDir}`)
      } else {
        execSync(`git rm -r ${JSON.stringify(vendorDir)}`, { cwd: ROOT, stdio: "pipe" })
      }
    }
  }
}

function addVendorMetadata(slugMap: Map<string, string>) {
  for (const item of COMPONENT_REGISTRY) {
    const newSlug = slugMap.get(item.docsSlug) ?? item.docsSlug
    const vendor = item.id.includes("/") ? item.id.split("/")[0] : null
    if (!vendor) continue

    const llmPath = path.join(CONTENT_DIR, newSlug, "llm.txt")
    if (!existsSync(llmPath)) continue

    let content = readFileSync(llmPath, "utf8")
    if (content.includes("registry:")) continue

    const registryLine = `registry:\n  vendor: ${vendor}\n  id: ${JSON.stringify(item.id)}\n`
    if (content.startsWith("---")) {
      const end = content.indexOf("\n---", 4)
      if (end > 0) {
        content = `${content.slice(0, end)}\n${registryLine}${content.slice(end)}`
      }
    } else {
      content = `---\n${registryLine}---\n\n${content}`
    }

    if (!DRY_RUN) writeFileSync(llmPath, content)
  }
}

function main() {
  const srcIndex = buildSrcSlugIndex()
  const contentSlugs = walkContentSlugs()
  const moves: Move[] = contentSlugs.map((slug) => resolveTarget(slug, srcIndex))

  const actionable = moves.filter((m) => m.from !== m.to)
  const slugMap = new Map(actionable.map((m) => [m.from, m.to]))

  // Sort deepest targets first; then longest from paths
  actionable.sort((a, b) => {
    const depth = b.to.split("/").length - a.to.split("/").length
    if (depth !== 0) return depth
    return b.from.length - a.from.length
  })

  console.log(`Content slugs: ${contentSlugs.length}`)
  console.log(`Moves planned: ${actionable.length}`)
  console.log(`Unchanged: ${moves.length - actionable.length}`)

  const byReason: Record<string, number> = {}
  for (const m of actionable) {
    byReason[m.reason] = (byReason[m.reason] ?? 0) + 1
  }
  console.log("By reason:", byReason)

  for (const move of actionable) {
    gitMv(move.from, move.to)
  }

  removeEmptyVendorDirs()

  const replacements: Array<[string, string]> = []
  for (const [from, to] of slugMap) {
    replacements.push([from, to])
    replacements.push([`content/components/${from}`, `content/components/${to}`])
    replacements.push([`/components/${from}`, `/components/${to}`])
    replacements.push([`../../../content/components/${from}`, `../../../content/components/${to}`])
  }

  replaceInTree(CONTENT_DIR, replacements)
  replaceInTree(path.join(ROOT, "src/app"), replacements)
  updateRegistryFiles(slugMap)
  updateCatalogRoutes(slugMap)
  addVendorMetadata(slugMap)

  const report = {
    totalSlugs: contentSlugs.length,
    moved: actionable.length,
    unchanged: moves.length - actionable.length,
    byReason,
    vendorPathRemaining: walkContentSlugs().filter((s) => {
      const first = s.split("/")[0]
      return VENDORS.has(first)
    }).length,
    samples: actionable.slice(0, 15).map((m) => `${m.from} -> ${m.to}`),
    orphans: actionable.filter((m) => m.to.startsWith("references/")).map((m) => m.from),
  }

  const reportPath = path.join(ROOT, "scripts/.content-isomorph-report.json")
  if (!DRY_RUN) {
    writeFileSync(reportPath, JSON.stringify(report, null, 2))
  }

  console.log("\nSample moves:")
  for (const s of report.samples) console.log(`  ${s}`)
  console.log(`\nVendor path remaining: ${report.vendorPathRemaining}`)
  console.log(`Orphans -> references: ${report.orphans.length}`)
  if (!DRY_RUN) console.log(`Report: ${reportPath}`)
}

main()
