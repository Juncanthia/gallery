#!/usr/bin/env tsx
/**
 * Agent A1 migration: core shell removal, editor file moves, core reorganization.
 * Run: pnpm exec tsx scripts/migrate-core-a1.ts [--dry-run]
 */
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  renameSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = path.resolve(import.meta.dirname, "..")
const CORE_DIR = path.join(ROOT, "src/components/core")
const EDITOR_DIR = path.join(ROOT, "src/components/editor")
const dryRun = process.argv.includes("--dry-run")

type Shell = { file: string; shellPath: string; targetPath: string }

function parseShell(filePath: string): Shell | null {
  const content = readFileSync(filePath, "utf8")
  const shellName = path.basename(filePath, ".tsx")
  const shellPath = `@/components/core/${shellName}`

  const exportFrom = content.match(
    /export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["'](@\/components\/[^"']+)["']/g
  )
  if (!exportFrom || exportFrom.length === 0) return null

  const paths = [
    ...new Set(
      exportFrom
        .map((line) => line.match(/from\s+["'](@\/components\/[^"']+)["']/)?.[1])
        .filter(Boolean)
    ),
  ]
  if (paths.length !== 1) return null

  const stripped = content
    .replace(/^["']use client["']\s*/m, "")
    .replace(/export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["']@\/components\/[^"']+["'];?\s*/g, "")
    .replace(/export\s+\{\s*default\s+as\s+\w+\s*\}\s+from\s+["']@\/components\/[^"']+["'];?\s*/g, "")
    .trim()

  if (stripped.length !== 0) return null

  return { file: path.basename(filePath), shellPath, targetPath: paths[0]! }
}

function collectFiles(dir: string, exts = [".ts", ".tsx"]): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      results.push(...collectFiles(full, exts))
    } else if (exts.some((e) => entry.endsWith(e))) {
      results.push(full)
    }
  }
  return results
}

function replaceImportPath(content: string, from: string, to: string): string {
  const patterns = [
    new RegExp(`(from\\s+["'])${escapeRegex(from)}(["'])`, "g"),
    new RegExp(`(import\\(["'])${escapeRegex(from)}(["']\\))`, "g"),
    new RegExp(`(require\\(["'])${escapeRegex(from)}(["']\\))`, "g"),
  ]
  let result = content
  for (const re of patterns) {
    result = result.replace(re, `$1${to}$2`)
  }
  return result
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function applyReplacements(
  filePath: string,
  replacements: Array<{ from: string; to: string }>
): boolean {
  let content = readFileSync(filePath, "utf8")
  const original = content
  for (const { from, to } of replacements) {
    if (from === to) continue
    content = replaceImportPath(content, from, to)
  }
  if (content !== original) {
    if (!dryRun) writeFileSync(filePath, content)
    return true
  }
  return false
}

function editorDest(file: string): string | null {
  const base = file.replace(/\.tsx$/, "")
  if (file === "editor.tsx" || file === "editor-static.tsx") {
    return path.join(EDITOR_DIR, file)
  }
  if (file.startsWith("ai-") || file === "ghost-text.tsx") {
    return path.join(EDITOR_DIR, "ai", file)
  }
  if (file.includes("-node") || file.endsWith("-node-static.tsx")) {
    return path.join(EDITOR_DIR, "nodes", file)
  }
  if (file.includes("toolbar") || file === "caption.tsx" || file === "comment.tsx") {
    return path.join(EDITOR_DIR, "toolbars", file)
  }
  if (
    file.startsWith("block-") ||
    file === "cursor-overlay.tsx" ||
    file === "block-selection.tsx" ||
    file === "inline-combobox.tsx" ||
    file === "link-preview.tsx" ||
    file === "media-preview-dialog.tsx" ||
    file === "media-upload-toast.tsx" ||
    file === "resize-handle.tsx"
  ) {
    return path.join(EDITOR_DIR, "blocks", file)
  }
  return null
}

function phase1DeleteShells(): { deleted: number; codemodFiles: number } {
  console.log("\n=== Phase 1: Delete pure forwarding shells ===")
  const shellFiles = readdirSync(CORE_DIR).filter((f) => f.endsWith(".tsx"))
  const shells: Shell[] = []
  for (const file of shellFiles) {
    const parsed = parseShell(path.join(CORE_DIR, file))
    if (parsed) shells.push(parsed)
  }
  console.log(`Found ${shells.length} pure shells`)

  const scanDirs = [
    path.join(ROOT, "src"),
    path.join(ROOT, "content"),
  ]
  const allFiles = scanDirs.flatMap((d) => collectFiles(d))
  const shellSet = new Set(shells.map((s) => s.shellPath))
  let codemodFiles = 0

  for (const file of allFiles) {
    const relShell = path.relative(CORE_DIR, file)
    if (relShell.startsWith("..") === false && relShell.endsWith(".tsx")) {
      const shellPath = `@/components/core/${path.basename(file, ".tsx")}`
      if (shellSet.has(shellPath)) continue
    }

    const replacements = shells.map((s) => ({ from: s.shellPath, to: s.targetPath }))
    if (applyReplacements(file, replacements)) {
      codemodFiles++
    }
  }

  let deleted = 0
  for (const shell of shells) {
    const filePath = path.join(CORE_DIR, shell.file)
    if (!dryRun) unlinkSync(filePath)
    deleted++
  }
  console.log(`Codemod updated ${codemodFiles} files, deleted ${deleted} shells`)
  return { deleted, codemodFiles }
}

function phase2MoveEditor(): { moved: number } {
  console.log("\n=== Phase 2: Move Plate/editor files ===")
  const coreFiles = readdirSync(CORE_DIR).filter((f) => f.endsWith(".tsx"))
  const moves: Array<{ from: string; to: string; oldImport: string; newImport: string }> = []

  for (const file of coreFiles) {
    const dest = editorDest(file)
    if (!dest) continue
    const from = path.join(CORE_DIR, file)
    const base = file.replace(/\.tsx$/, "")
    moves.push({
      from,
      to: dest,
      oldImport: `@/components/core/${base}`,
      newImport: `@/components/editor/${path.relative(EDITOR_DIR, dest).replace(/\.tsx$/, "")}`,
    })
  }

  for (const sub of ["nodes", "toolbars", "ai", "blocks"]) {
    const subDir = path.join(EDITOR_DIR, sub)
    if (!existsSync(subDir) && !dryRun) mkdirSync(subDir, { recursive: true })
  }

  let moved = 0
  for (const m of moves) {
    if (!dryRun) {
      renameSync(m.from, m.to)
    }
    moved++
  }

  const scanDirs = [path.join(ROOT, "src"), path.join(ROOT, "content")]
  const allFiles = scanDirs.flatMap((d) => collectFiles(d))
  let codemodFiles = 0
  for (const file of allFiles) {
    if (applyReplacements(file, moves.map((m) => ({ from: m.oldImport, to: m.newImport })))) {
      codemodFiles++
    }
  }

  console.log(`Moved ${moved} files to editor/, updated ${codemodFiles} import sites`)
  return { moved }
}

function phase4OrganizeCore(): { movedVariants: number } {
  console.log("\n=== Phase 4: Organize core internal structure ===")
  const variantsDir = path.join(CORE_DIR, "variants")
  if (!existsSync(variantsDir) && !dryRun) mkdirSync(variantsDir, { recursive: true })

  const variantFiles = readdirSync(CORE_DIR).filter((f) => f.endsWith("-variants.ts"))
  const moves: Array<{ from: string; to: string; oldImport: string; newImport: string }> = []

  for (const file of variantFiles) {
    const from = path.join(CORE_DIR, file)
    const to = path.join(variantsDir, file)
    const base = file.replace(/\.ts$/, "")
    moves.push({
      from,
      to,
      oldImport: `@/components/core/${base}`,
      newImport: `@/components/core/variants/${base}`,
    })
  }

  let movedVariants = 0
  for (const m of moves) {
    if (!dryRun) renameSync(m.from, m.to)
    movedVariants++
  }

  const scanDirs = [path.join(ROOT, "src"), path.join(ROOT, "content")]
  const allFiles = scanDirs.flatMap((d) => collectFiles(d))
  let codemodFiles = 0
  for (const file of allFiles) {
    if (applyReplacements(file, moves.map((m) => ({ from: m.oldImport, to: m.newImport })))) {
      codemodFiles++
    }
  }

  console.log(`Moved ${movedVariants} variant files, updated ${codemodFiles} import sites`)
  return { movedVariants }
}

function updateRegistry(): void {
  console.log("\n=== Updating registry ===")
  if (dryRun) {
    console.log("[dry-run] would run sync-registry-from-shells.ts and fix-registry-paths.ts")
    return
  }
  execSync("pnpm exec tsx scripts/sync-registry-from-shells.ts", { cwd: ROOT, stdio: "inherit" })
  execSync("pnpm exec tsx scripts/fix-registry-paths.ts", { cwd: ROOT, stdio: "inherit" })

  const generated = path.join(ROOT, "src/gallery/registry/domains/generated.ts")
  let content = readFileSync(generated, "utf8")
  content = content.replace(/@\/components\/ui\//g, "@/components/core/")
  writeFileSync(generated, content)
  console.log("Updated generated registry (ui→core)")
}

function countRemainingCore(): number {
  if (!existsSync(CORE_DIR)) return 0
  return readdirSync(CORE_DIR).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts")).length
}

function main() {
  console.log(`migrate-core-a1 ${dryRun ? "(DRY RUN)" : ""}`)
  const p1 = phase1DeleteShells()
  const p2 = phase2MoveEditor()
  const p4 = phase4OrganizeCore()
  updateRegistry()

  const remaining = countRemainingCore()
  console.log("\n=== Summary ===")
  console.log(`Shells deleted: ${p1.deleted}`)
  console.log(`Editor files moved: ${p2.moved}`)
  console.log(`Variants moved: ${p4.movedVariants}`)
  console.log(`Core remaining files: ${remaining}`)
}

main()
