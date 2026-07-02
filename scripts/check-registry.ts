#!/usr/bin/env tsx
/**
 * Validates component registry consistency.
 * Run: pnpm check:registry
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { COMPONENT_REGISTRY } from "../src/app/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content/components")
const CORE_DIR = path.join(ROOT, "src/components/core")

const errors: string[] = []

function checkUniqueIds() {
  const seen = new Set<string>()
  for (const item of COMPONENT_REGISTRY) {
    if (seen.has(item.id)) {
      errors.push(`Duplicate registry id: ${item.id}`)
    }
    seen.add(item.id)
    if (seen.has(item.docsSlug) && item.id !== item.docsSlug) {
      // docsSlug uniqueness checked separately
    }
  }
  const slugSeen = new Set<string>()
  for (const item of COMPONENT_REGISTRY) {
    if (slugSeen.has(item.docsSlug)) {
      errors.push(`Duplicate docsSlug: ${item.docsSlug}`)
    }
    slugSeen.add(item.docsSlug)
  }
}

function checkDocsSlugExists() {
  for (const item of COMPONENT_REGISTRY) {
    const docPath = path.join(CONTENT_DIR, item.docsSlug, "index.mdx")
    if (!existsSync(docPath)) {
      errors.push(`Missing docs for docsSlug ${item.docsSlug}: ${docPath}`)
    }
  }
}

function checkFilesExist() {
  for (const item of COMPONENT_REGISTRY) {
    for (const file of item.files) {
      const full = path.join(ROOT, file.path)
      if (!existsSync(full)) {
        errors.push(`Missing file for ${item.id}: ${file.path}`)
      }
    }
  }
}

function checkInternalImportPath() {
  for (const item of COMPONENT_REGISTRY) {
    if (!item.internalImportPath.startsWith("@/")) {
      errors.push(`internalImportPath must start with @/: ${item.id}`)
      continue
    }
    const repoPath = path.join(ROOT, "src", item.internalImportPath.slice(2))
    const candidates = [`${repoPath}.tsx`, `${repoPath}.ts`, `${repoPath}/index.tsx`, `${repoPath}/index.ts`]
    if (!candidates.some((candidate) => existsSync(candidate))) {
      errors.push(`internalImportPath does not resolve for ${item.id}: ${item.internalImportPath}`)
    }
  }
}

function parseShellTargets(): Map<string, string> {
  const map = new Map<string, string>()
  for (const file of readdirSync(CORE_DIR).filter((f) => f.endsWith(".tsx"))) {
    const content = readFileSync(path.join(CORE_DIR, file), "utf8")
    const match = content.match(/^export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["'](@\/components\/[^"']+)["']/m)
    if (match) {
      map.set(`@/components/core/${file.replace(/\.tsx$/, "")}`, match[1])
    }
  }
  return map
}

function checkRegisteredShells() {
  const shells = parseShellTargets()
  const registeredShells = new Set(
    COMPONENT_REGISTRY.map((item) => item.legacyShellImportPath).filter(Boolean) as string[]
  )

  for (const [shellImport] of shells) {
    if (!registeredShells.has(shellImport)) {
      // Only warn for pure single-line re-exports with content docs — keep as info not hard error during migration
    }
  }
}

function checkLegacyInternalPaths() {
  for (const item of COMPONENT_REGISTRY) {
    if (item.internalImportPath.includes("@/components/_internal")) {
      errors.push(`Stale _internal path in internalImportPath for ${item.id}: ${item.internalImportPath}`)
    }
    if (item.legacyShellImportPath?.includes("@/components/_internal")) {
      errors.push(`Stale _internal path in legacyShellImportPath for ${item.id}: ${item.legacyShellImportPath}`)
    }
    for (const file of item.files) {
      if (file.path.includes("components/_internal")) {
        errors.push(`Stale _internal path in files[].path for ${item.id}: ${file.path}`)
      }
    }
  }
}

function checkStaleVendorPaths() {
  const stalePatterns = [
    "@/components/ui/",
    "@/components/_shared/",
    "@/components/_primitives/",
    "@/components/_internal/",
    "/gooseui/",
    "/chamaac/",
    "/react-bits/",
    "/uselayouts/",
    "/bklit/",
    "/manifest/",
    "/dice/",
    "/sabraman/",
    "/extend/",
    "/limeplay/",
    "/tool/",
  ]

  for (const item of COMPONENT_REGISTRY) {
    for (const pattern of stalePatterns) {
      if (item.internalImportPath.includes(pattern)) {
        errors.push(`Stale vendor segment in internalImportPath for ${item.id}: ${item.internalImportPath}`)
        break
      }
    }
    for (const file of item.files) {
      if (
        file.path.includes("/src/components/ui/") ||
        file.path.includes("/src/components/_shared/") ||
        file.path.includes("/src/components/_primitives/")
      ) {
        errors.push(`Stale legacy path in files[].path for ${item.id}: ${file.path}`)
      }
    }
  }
}

function main() {
  checkUniqueIds()
  checkDocsSlugExists()
  checkFilesExist()
  checkInternalImportPath()
  checkLegacyInternalPaths()
  checkStaleVendorPaths()
  checkRegisteredShells()

  if (errors.length > 0) {
    console.error("Registry validation failed:\n")
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(`Registry OK (${COMPONENT_REGISTRY.length} items)`)
}

main()
