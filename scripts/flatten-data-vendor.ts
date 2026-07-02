#!/usr/bin/env tsx
/**
 * Flatten vendor subdirectories under data-entry, data-display, feedback
 * Run: pnpm exec tsx scripts/flatten-data-vendor.ts [--dry-run]
 */
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const VENDORS = ["chamaac", "gooseui", "uselayouts", "dice", "sabraman", "manifest"] as const
const DOMAINS = ["data-entry", "data-display", "feedback"] as const
const dryRun = process.argv.includes("--dry-run")

/** old repo-relative path -> new repo-relative path */
const FILE_MOVES: Record<string, string> = {}

function addMove(oldRel: string, newRel: string) {
  if (oldRel === newRel) return
  FILE_MOVES[oldRel] = newRel
}

function repoRel(absPath: string): string {
  return path.relative(ROOT, absPath).replace(/\\/g, "/")
}

/** chamaac component/name/name.tsx -> component/index.tsx */
function addChamaacNested(domain: string, component: string, fileName: string, target = "index.tsx") {
  addMove(
    `src/components/${domain}/chamaac/${component}/${fileName}`,
    `src/components/${domain}/${component}/${target}`,
  )
}

// --- data-entry/chamaac ---
addChamaacNested("data-entry", "ai-input", "ai-input.tsx")

// --- data-display/chamaac ---
addChamaacNested("data-display", "carousel", "carousel.tsx")
addChamaacNested("data-display", "stats-cards", "stats-cards.tsx")

// --- data-entry: flat vendor files (gooseui, manifest, sabraman, uselayouts) ---
for (const domain of ["data-entry", "data-display"] as const) {
  const domainPath = path.join(ROOT, "src/components", domain)
  for (const vendor of VENDORS) {
    const vendorPath = path.join(domainPath, vendor)
    if (!existsSync(vendorPath)) continue

    for (const entry of readdirSync(vendorPath)) {
      const full = path.join(vendorPath, entry)
      if (statSync(full).isFile() && /\.(tsx?|jsx?)$/.test(entry)) {
        addMove(
          `src/components/${domain}/${vendor}/${entry}`,
          `src/components/${domain}/${entry}`,
        )
      } else if (statSync(full).isDirectory() && vendor === "dice") {
        // dice/checkbox-group/* -> checkbox-group/*
        for (const sub of readdirSync(full)) {
          const subFull = path.join(full, sub)
          if (statSync(subFull).isFile()) {
            addMove(
              `src/components/${domain}/dice/${entry}/${sub}`,
              `src/components/${domain}/${entry}/${sub}`,
            )
          }
        }
      } else if (statSync(full).isDirectory() && vendor === "chamaac") {
        // handled above via addChamaacNested
        for (const sub of readdirSync(full)) {
          const subFull = path.join(full, sub)
          if (statSync(subFull).isFile() && sub !== entry && !FILE_MOVES[`src/components/${domain}/chamaac/${entry}/${sub}`]) {
            addMove(
              `src/components/${domain}/chamaac/${entry}/${sub}`,
              `src/components/${domain}/${entry}/${sub}`,
            )
          }
        }
      }
    }
  }
}

// --- feedback: flat vendor files ---
const feedbackPath = path.join(ROOT, "src/components/feedback")
for (const vendor of VENDORS) {
  const vendorPath = path.join(feedbackPath, vendor)
  if (!existsSync(vendorPath)) continue
  for (const entry of readdirSync(vendorPath)) {
    const full = path.join(vendorPath, entry)
    if (statSync(full).isFile() && /\.(tsx?|jsx?)$/.test(entry)) {
      addMove(
        `src/components/feedback/${vendor}/${entry}`,
        `src/components/feedback/${entry}`,
      )
    }
  }
}

function aliasFromRepo(repoPath: string): string {
  const withoutExt = repoPath.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "")
  return `@/${withoutExt.replace(/^src\//, "")}`
}

function buildImportReplacements(): Array<[string, string]> {
  const pairs: Array<[string, string]> = []
  for (const [oldRel, newRel] of Object.entries(FILE_MOVES)) {
    const oldAlias = aliasFromRepo(oldRel)
    const newAlias = aliasFromRepo(newRel)
    if (oldAlias !== newAlias) {
      pairs.push([oldAlias, newAlias])
    }
    if (oldRel !== newRel) {
      pairs.push([oldRel, newRel])
    }
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

function walkFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      walkFiles(full, exts, out)
    } else if (exts.has(path.extname(entry))) {
      out.push(full)
    }
  }
  return out
}

function updateImports(replacements: Array<[string, string]>) {
  const scanRoots = [
    path.join(ROOT, "src"),
    path.join(ROOT, "content"),
    path.join(ROOT, "docs"),
  ]
  const exts = new Set([".ts", ".tsx", ".mdx", ".txt", ".md"])
  let filesUpdated = 0
  let totalReplacements = 0

  for (const root of scanRoots) {
    for (const file of walkFiles(root, exts)) {
      if (file.includes("scripts/flatten-data-vendor.ts")) continue
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
  return { filesUpdated, totalReplacements }
}

function removeEmptyVendorDirs() {
  for (const domain of DOMAINS) {
    const domainPath = path.join(ROOT, "src/components", domain)
    for (const vendor of VENDORS) {
      removeEmptyDirs(path.join(domainPath, vendor))
    }
  }
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

function countVendorDirs(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const domain of DOMAINS) {
    const found: string[] = []
    for (const vendor of VENDORS) {
      const p = path.join(ROOT, "src/components", domain, vendor)
      if (existsSync(p)) found.push(vendor)
    }
    result[domain] = found
  }
  return result
}

function main() {
  console.log(`Flattening data vendor dirs (${Object.keys(FILE_MOVES).length} files)${dryRun ? " [DRY RUN]" : ""}`)

  const sorted = Object.entries(FILE_MOVES).sort(
    (a, b) => b[0].split("/").length - a[0].split("/").length,
  )

  let moved = 0
  for (const [from, to] of sorted) {
    if (gitMv(from, to)) moved++
  }

  const replacements = buildImportReplacements()
  const codemod = updateImports(replacements)

  if (!dryRun) {
    removeEmptyVendorDirs()
  }

  console.log("\n=== Mapping Table ===")
  for (const [oldRel, newRel] of Object.entries(FILE_MOVES).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${oldRel}\n  -> ${newRel}`)
  }

  const vendorAfter = countVendorDirs()
  console.log(`\n=== Summary ===`)
  console.log(`Files moved: ${moved}`)
  console.log(`Codemod files: ${codemod.filesUpdated}, replacements: ${codemod.totalReplacements}`)
  console.log(`Vendor dirs remaining:`)
  for (const [domain, vendors] of Object.entries(vendorAfter)) {
    console.log(`  ${domain}: ${vendors.length === 0 ? "CLEARED" : vendors.join(", ")}`)
  }

  if (!dryRun) {
    writeFileSync(
      path.join(ROOT, "scripts/.flatten-data-mapping.json"),
      JSON.stringify({ moves: FILE_MOVES, moved, codemod, vendorAfter }, null, 2),
    )
  }
}

main()
