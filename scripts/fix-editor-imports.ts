#!/usr/bin/env tsx
/**
 * Fix relative imports in editor/ subdirs after file moves.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const EDITOR_DIR = path.join(ROOT, "src/components/editor")
const CORE_DIR = path.join(ROOT, "src/components/core")

function collectFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full))
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      results.push(full)
    }
  }
  return results
}

function buildModuleIndex(): Map<string, string> {
  const index = new Map<string, string>()
  for (const dir of [EDITOR_DIR, CORE_DIR]) {
    if (!existsSync(dir)) continue
    for (const file of collectFiles(dir)) {
      const base = path.basename(file).replace(/\.(tsx?|jsx?)$/, "")
      const rel = path.relative(path.join(ROOT, "src"), file).replace(/\.(tsx?|jsx?)$/, "")
      index.set(base, `@/${rel}`)
    }
  }
  return index
}

function fixRelativeImports(filePath: string, index: Map<string, string>): boolean {
  const dir = path.dirname(filePath)
  let content = readFileSync(filePath, "utf8")
  const original = content

  content = content.replace(
    /from\s+(['"])\.\/([^'"]+)\1/g,
    (match, quote, importPath) => {
      const localTarget = path.join(dir, importPath)
      const extensions = ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]
      for (const ext of extensions) {
        const candidate = localTarget + ext
        if (existsSync(candidate)) {
          return match
        }
      }
      const base = path.basename(importPath)
      const resolved = index.get(base)
      if (resolved) {
        return `from ${quote}${resolved}${quote}`
      }
      return match
    }
  )

  if (content !== original) {
    writeFileSync(filePath, content)
    return true
  }
  return false
}

function fixCoreVariantImports(): number {
  let fixed = 0
  for (const file of collectFiles(CORE_DIR)) {
    if (file.includes(`${path.sep}variants${path.sep}`)) continue
    let content = readFileSync(file, "utf8")
    const original = content
    content = content.replace(
      /from\s+(['"])\.\/([a-z-]+-variants)\1/g,
      `from $1@/components/core/variants/$2$1`
    )
    if (content !== original) {
      writeFileSync(file, content)
      fixed++
    }
  }
  return fixed
}

function main() {
  const index = buildModuleIndex()
  const editorFiles = collectFiles(EDITOR_DIR)
  let fixed = 0
  for (const file of editorFiles) {
    if (fixRelativeImports(file, index)) fixed++
  }
  const coreFixed = fixCoreVariantImports()
  console.log(`Fixed ${fixed} editor files, ${coreFixed} core variant imports`)
}

main()
