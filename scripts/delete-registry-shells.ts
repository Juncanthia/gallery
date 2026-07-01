#!/usr/bin/env tsx
/**
 * Deletes ui/ forwarding shells registered in COMPONENT_REGISTRY.
 * Run: pnpm exec tsx scripts/delete-registry-shells.ts [--dry-run]
 */
import { readFileSync, unlinkSync, readdirSync } from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { COMPONENT_REGISTRY } from "../src/gallery/registry/index"

const ROOT = path.resolve(import.meta.dirname, "..")

function shellFileFromImport(shellImportPath: string): string | null {
  if (!shellImportPath.startsWith("@/components/ui/")) {
    return null
  }
  return path.join(ROOT, "src/components/ui", `${shellImportPath.replace("@/components/ui/", "")}.tsx`)
}

function isPureReexport(filePath: string): boolean {
  const content = readFileSync(filePath, "utf8")
  const stripped = content
    .replace(/^["']use client["']\s*/m, "")
    .replace(/export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["']@\/components\/[^"']+["'];?\s*/g, "")
    .trim()
  return stripped.length === 0 && /export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["']@\/components\//.test(content)
}

function hasReferences(shellImportPath: string, shellFile: string): string[] {
  try {
    const result = execSync(
      `rg -l "${shellImportPath.replace(/"/g, '\\"')}" src content --glob '*.tsx' --glob '*.ts' --glob '!src/gallery/registry/domains/*'`,
      {
        cwd: ROOT,
        encoding: "utf8",
      }
    ).trim()
    const files = result ? result.split("\n").filter(Boolean) : []
    return files.filter((f) => path.resolve(ROOT, f) !== shellFile)
  } catch {
    return []
  }
}

function main() {
  const dryRun = process.argv.includes("--dry-run")
  let deleted = 0
  let skipped = 0

  for (const item of COMPONENT_REGISTRY) {
    if (!item.legacyShellImportPath) {
      continue
    }
    const shellFile = shellFileFromImport(item.legacyShellImportPath)
    if (!shellFile) {
      continue
    }

    try {
      readFileSync(shellFile, "utf8")
    } catch {
      skipped++
      continue
    }

    if (!isPureReexport(shellFile)) {
      console.log(`skip (not pure re-export): ${path.relative(ROOT, shellFile)}`)
      skipped++
      continue
    }

    const refs = hasReferences(item.legacyShellImportPath, shellFile)
    if (refs.length > 0) {
      console.log(`skip (still referenced): ${path.relative(ROOT, shellFile)} -> ${refs.slice(0, 3).join(", ")}`)
      skipped++
      continue
    }

    if (dryRun) {
      console.log(`[dry-run] delete ${path.relative(ROOT, shellFile)}`)
    } else {
      unlinkSync(shellFile)
      console.log(`deleted ${path.relative(ROOT, shellFile)}`)
    }
    deleted++
  }

  // Always remove known orphan 0.tsx
  const orphan = path.join(ROOT, "src/components/ui/0.tsx")
  try {
    readFileSync(orphan, "utf8")
    const refs = hasReferences("@/components/ui/0", orphan)
    if (refs.length === 0) {
      if (dryRun) {
        console.log("[dry-run] delete src/components/ui/0.tsx")
      } else {
        unlinkSync(orphan)
        console.log("deleted src/components/ui/0.tsx")
      }
      deleted++
    }
  } catch {
    // already gone
  }

  console.log(`Done: ${deleted} deleted, ${skipped} skipped`)
}

main()
