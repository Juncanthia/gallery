#!/usr/bin/env tsx
/**
 * Flatten vendor subdirectories under navigation / marketing-blocks / layout / general.
 * Run: pnpm exec tsx scripts/flatten-nav-marketing-layout-general-vendor.ts [--dry-run]
 */
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")

const DOMAINS = ["navigation", "marketing-blocks", "layout", "general"] as const

const VENDORS: Record<(typeof DOMAINS)[number], string[]> = {
  navigation: ["chamaac", "dice", "gooseui", "react-bits", "sabraman", "uselayouts"],
  "marketing-blocks": ["chamaac", "gooseui", "react-bits"],
  layout: ["dice", "gooseui", "uselayouts"],
  general: ["chamaac", "dice", "gooseui", "sabraman", "uselayouts"],
}

/** old repo-relative path -> new repo-relative path */
const FILE_MOVES: Record<string, string> = {}

/** explicit conflict / rename overrides (old -> new) */
const OVERRIDES: Record<string, string> = {
  "src/components/navigation/react-bits/dock.tsx": "src/components/navigation/magnify-dock.tsx",
  "src/components/navigation/react-bits/dock.css": "src/components/navigation/magnify-dock.css",
}

const dryRun = process.argv.includes("--dry-run")

function addMove(oldRel: string, newRel: string) {
  if (oldRel === newRel) return
  FILE_MOVES[oldRel] = newRel
}

function basenameNoExt(file: string): string {
  return path.basename(file, path.extname(file))
}

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      walkFiles(full, out)
    } else {
      out.push(full)
    }
  }
  return out
}

function computeTarget(domain: string, vendorRelFromDomain: string): string {
  const overrideKey = `src/components/${domain}/${vendorRelFromDomain}`
  if (OVERRIDES[overrideKey]) return OVERRIDES[overrideKey]

  const parts = vendorRelFromDomain.split("/")
  const fileName = parts[parts.length - 1]
  const base = basenameNoExt(fileName)

  // vendor/file.ext -> domain/file.ext
  if (parts.length === 2) {
    return `src/components/${domain}/${fileName}`
  }

  // vendor/headless/file.ext -> domain/headless/file.ext (general/dice)
  if (parts[0] === "dice" && parts[1] === "headless") {
    return `src/components/${domain}/headless/${fileName}`
  }

  // vendor/name/name.ext -> domain/name/index.ext
  if (parts.length === 3 && parts[1] === base) {
    const ext = path.extname(fileName)
    return `src/components/${domain}/${parts[1]}/index${ext}`
  }

  // vendor/category/file.ext -> domain/file/index.ext when file is self-descriptive
  if (parts.length === 3) {
    const category = parts[1]
    const ext = path.extname(fileName)
    // Keep multi-file package dirs as-is minus vendor
    if (category === "complex-component") {
      return `src/components/${domain}/${category}/${parts.slice(2).join("/")}`
    }
    // example-with-css/example-card.* -> example-card/*
    if (category === "example-with-css") {
      const destName = base
      if (ext === ".css") return `src/components/${domain}/${destName}/${fileName}`
      return `src/components/${domain}/${destName}/index${ext}`
    }
    // category/component.ext -> component/index.ext (footers, headers, hero, etc.)
    return `src/components/${domain}/${base}/index${ext}`
  }

  // deeper paths (complex-component internals)
  if (parts.length > 3) {
    return `src/components/${domain}/${parts.slice(1).join("/")}`
  }

  return overrideKey
}

function discoverMoves() {
  for (const domain of DOMAINS) {
    const domainRoot = path.join(ROOT, "src/components", domain)
    for (const vendor of VENDORS[domain]) {
      const vendorDir = path.join(domainRoot, vendor)
      if (!existsSync(vendorDir)) continue
      for (const abs of walkFiles(vendorDir)) {
        const rel = path.relative(ROOT, abs).replace(/\\/g, "/")
        const vendorRel = rel.replace(`src/components/${domain}/`, "")
        const target = computeTarget(domain, vendorRel)
        addMove(rel, target)
      }
    }
  }
}

function aliasFromRepo(repoPath: string): string {
  const withoutExt = repoPath.replace(/\.(tsx?|jsx?|css)$/, "").replace(/\/index$/, "")
  return `@/${withoutExt.replace(/^src\//, "")}`
}

function buildImportReplacements(): Array<[string, string]> {
  const pairs: Array<[string, string]> = []
  for (const [oldRel, newRel] of Object.entries(FILE_MOVES)) {
    const oldAlias = aliasFromRepo(oldRel)
    const newAlias = aliasFromRepo(newRel)
    if (oldAlias !== newAlias) pairs.push([oldAlias, newAlias])
    pairs.push([oldRel, newRel])
  }
  pairs.sort((a, b) => b[0].length - a[0].length)
  return pairs
}

function gitMv(from: string, to: string) {
  const fromAbs = path.join(ROOT, from)
  const toAbs = path.join(ROOT, to)
  if (!existsSync(fromAbs)) {
    console.warn(`SKIP (missing): ${from}`)
    return false
  }
  mkdirSync(path.dirname(toAbs), { recursive: true })
  if (dryRun) {
    console.log(`[dry-run] git mv ${from} -> ${to}`)
    return true
  }
  execSync(`git mv "${fromAbs}" "${toAbs}"`, { cwd: ROOT, stdio: "inherit" })
  return true
}

function scanWalkFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      scanWalkFiles(full, exts, out)
    } else if (exts.has(path.extname(entry))) {
      out.push(full)
    }
  }
  return out
}

function updateImports(replacements: Array<[string, string]>) {
  const scanRoots = [path.join(ROOT, "src"), path.join(ROOT, "content"), path.join(ROOT, "docs")]
  const exts = new Set([".ts", ".tsx", ".mdx", ".txt", ".md"])
  let filesUpdated = 0
  let totalReplacements = 0

  for (const root of scanRoots) {
    for (const file of scanWalkFiles(root, exts)) {
      if (file.includes("flatten-nav-marketing-layout-general-vendor.ts")) continue
      let content = readFileSync(file, "utf8")
      let changed = false
      for (const [oldPath, newPath] of replacements) {
        const count = content.split(oldPath).length - 1
        if (count > 0) {
          content = content.split(oldPath).join(newPath)
          totalReplacements += count
          changed = true
        }
      }
      if (changed) {
        if (!dryRun) writeFileSync(file, content)
        filesUpdated++
      }
    }
  }
  console.log(`Import codemod: ${filesUpdated} files, ${totalReplacements} replacements`)
}

function removeEmptyDirs(dir: string) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) removeEmptyDirs(full)
  }
  try {
    if (readdirSync(dir).length === 0 && !dryRun) {
      execSync(`rmdir "${dir}"`, { cwd: ROOT })
    }
  } catch {
    // not empty
  }
}

function vendorDirsRemaining(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const domain of DOMAINS) {
    const found: string[] = []
    for (const vendor of VENDORS[domain]) {
      const p = path.join(ROOT, "src/components", domain, vendor)
      if (existsSync(p)) found.push(vendor)
    }
    result[domain] = found
  }
  return result
}

function main() {
  discoverMoves()

  console.log(
    `Flattening nav/marketing/layout/general vendor dirs (${Object.keys(FILE_MOVES).length} files)${dryRun ? " [DRY RUN]" : ""}`,
  )

  const sorted = Object.entries(FILE_MOVES).sort(
    (a, b) => b[0].split("/").length - a[0].split("/").length,
  )

  let moved = 0
  for (const [from, to] of sorted) {
    if (gitMv(from, to)) moved++
  }

  const replacements = buildImportReplacements()
  updateImports(replacements)

  if (!dryRun) {
    for (const domain of DOMAINS) {
      for (const vendor of VENDORS[domain]) {
        removeEmptyDirs(path.join(ROOT, "src/components", domain, vendor))
      }
    }
  }

  console.log("\n=== Mapping Table ===")
  for (const [oldRel, newRel] of Object.entries(FILE_MOVES).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${oldRel}\n  -> ${newRel}`)
  }

  const remaining = vendorDirsRemaining()
  console.log(`\n=== Summary ===`)
  console.log(`Files moved: ${moved}`)
  console.log(`Vendor dirs remaining:`)
  for (const [domain, vendors] of Object.entries(remaining)) {
    console.log(`  ${domain}: ${vendors.length === 0 ? "cleared" : vendors.join(", ")}`)
  }

  if (!dryRun) {
    writeFileSync(
      path.join(ROOT, "scripts/.flatten-nav-marketing-layout-general-mapping.json"),
      JSON.stringify({ moves: FILE_MOVES, moved, vendorDirsRemaining: remaining }, null, 2),
    )
  }
}

main()
