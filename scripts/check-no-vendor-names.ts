#!/usr/bin/env tsx
/**
 * Blocks vendor-origin names in src/ paths and import strings.
 * Run: pnpm check:no-vendor-names
 *
 * @see docs/refactor/07-de-vendor-plan.md
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const SRC = path.join(ROOT, "src")

const VENDOR_SEGMENTS = new Set([
  "dice",
  "gooseui",
  "uselayouts",
  "sabraman",
  "chamaac",
  "bklit",
  "react-bits",
])

/** Paths exempt from vendor segment checks (migration artifacts). */
const EXEMPT_PATH_PREFIXES = [
  "src/app/registry/",
  "src/components/legacy-ui/",
  "src/components/core/",
]

function isExempt(relPath: string): boolean {
  return EXEMPT_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix))
}

function hasVendorSegment(pathLike: string): boolean {
  return pathLike
    .split(/[/\\]/)
    .some((segment) => VENDOR_SEGMENTS.has(segment.toLowerCase()))
}

function collectImportPaths(content: string): string[] {
  const paths: string[] = []
  const patterns = [
    /from\s+["']([^"']+)["']/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
    /require\s*\(\s*["']([^"']+)["']\s*\)/g,
  ]
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      if (match[1]) paths.push(match[1])
    }
  }
  return paths
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const rel = path.relative(ROOT, full)
    const st = statSync(full)

    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue
      walk(full, files)
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(rel)
    }
  }
  return files
}

function main() {
  const errors: string[] = []

  for (const rel of walk(SRC)) {
    if (isExempt(rel)) continue

    if (hasVendorSegment(rel)) {
      errors.push(`Vendor segment in path: ${rel}`)
      continue
    }

    const content = readFileSync(path.join(ROOT, rel), "utf8")
    for (const importPath of collectImportPaths(content)) {
      if (!importPath.startsWith("@/") && !importPath.startsWith("./") && !importPath.startsWith("../")) {
        continue
      }
      if (hasVendorSegment(importPath)) {
        errors.push(`Vendor segment in import path (${rel}): ${importPath}`)
      }
    }
  }

  if (errors.length > 0) {
    console.error("Vendor name check failed:\n")
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }

  console.log("No vendor-origin path segments under src/")
}

main()
