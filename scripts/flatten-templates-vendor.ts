#!/usr/bin/env tsx
/**
 * Flatten vendor subdirectories under src/components/templates/
 * Run: pnpm exec tsx scripts/flatten-templates-vendor.ts [--dry-run]
 */
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const TEMPLATES = path.join(ROOT, "src/components/templates")
const dryRun = process.argv.includes("--dry-run")

/** old repo-relative path -> new repo-relative path */
const FILE_MOVES: Record<string, string> = {}

function addMove(oldRel: string, newRel: string) {
  FILE_MOVES[oldRel] = newRel
}

function walkFiles(dir: string, prefix: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      walkFiles(full, `${prefix}/${entry}`, out)
    } else {
      out.push(`${prefix}/${entry}`)
    }
  }
  return out
}

// manifest/* -> templates/*
for (const rel of walkFiles(path.join(TEMPLATES, "manifest"), "src/components/templates/manifest")) {
  const newRel = rel.replace("src/components/templates/manifest/", "src/components/templates/")
  addMove(rel, newRel)
}

// uselayouts/pricing-card.tsx -> pricing-card.tsx
addMove(
  "src/components/templates/uselayouts/pricing-card.tsx",
  "src/components/templates/pricing-card.tsx",
)

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

function walkScanFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      walkScanFiles(full, exts, out)
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
    for (const file of walkScanFiles(root, exts)) {
      if (file.includes("scripts/flatten-templates-vendor.ts")) continue
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
  if (dir === TEMPLATES) return
  try {
    if (readdirSync(dir).length === 0 && !dryRun) {
      execSync(`rmdir "${dir}"`, { cwd: ROOT })
    }
  } catch {
    // not empty
  }
}

function vendorDirsRemain(): string[] {
  const remaining: string[] = []
  for (const vendor of ["manifest", "uselayouts"]) {
    const p = path.join(TEMPLATES, vendor)
    if (existsSync(p)) remaining.push(`templates/${vendor}`)
  }
  return remaining
}

function main() {
  console.log(`Flattening templates vendor dirs (${Object.keys(FILE_MOVES).length} files)${dryRun ? " [DRY RUN]" : ""}`)

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
    for (const vendor of ["manifest", "uselayouts"]) {
      removeEmptyDirs(path.join(TEMPLATES, vendor))
    }
  }

  console.log("\n=== Summary ===")
  console.log(`Files moved: ${moved}`)
  console.log(`Vendor dirs remaining: ${dryRun ? "(run without dry-run)" : vendorDirsRemain().join(", ") || "none"}`)

  if (!dryRun) {
    writeFileSync(
      path.join(ROOT, "scripts/.flatten-templates-mapping.json"),
      JSON.stringify({ moves: FILE_MOVES, moved, vendorDirsRemaining: vendorDirsRemain() }, null, 2),
    )
  }
}

main()
