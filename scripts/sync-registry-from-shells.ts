#!/usr/bin/env tsx
/**
 * Scans `src/components/core/*.tsx` forwarding shells and generates registry entries.
 * Run: pnpm exec tsx scripts/sync-registry-from-shells.ts
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CORE_DIR = path.join(ROOT, "src/components/core")
const CONTENT_DIR = path.join(ROOT, "content/components")
const OUT_FILE = path.join(ROOT, "src/gallery/registry/domains/generated.ts")

type ParsedShell = {
  shellFile: string
  shellImportPath: string
  targetAlias: string
  targetRepoPath: string
  isPureReexport: boolean
  hasRename: boolean
}

function resolveRepoPath(alias: string): string | null {
  const base = aliasToRepo(alias)
  const candidates = [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`]
  for (const candidate of candidates) {
    if (existsSync(path.join(ROOT, candidate))) {
      return candidate
    }
  }
  return null
}

function aliasToRepo(alias: string): string {
  return `src/${alias.replace(/^@\//, "")}`
}

function aliasFromRepo(repoPath: string): string {
  return `@/${repoPath.replace(/^src\//, "").replace(/\.(tsx?|jsx?)$/, "")}`
}

function parseShell(filePath: string): ParsedShell | null {
  const content = readFileSync(filePath, "utf8")
  const shellName = path.basename(filePath, ".tsx")
  const shellImportPath = `@/components/core/${shellName}`

  const exportFrom = content.match(/export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["'](@\/components\/[^"']+)["']/g)
  if (!exportFrom || exportFrom.length === 0) {
    return null
  }

  const paths = [...new Set(exportFrom.map((line) => line.match(/from\s+["'](@\/components\/[^"']+)["']/)?.[1]).filter(Boolean))]
  if (paths.length !== 1) {
    return null
  }

  const targetAlias = paths[0]!
  const hasRename = /\bas\s/.test(content)
  const stripped = content
    .replace(/^["']use client["']\s*/m, "")
    .replace(/export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["']@\/components\/[^"']+["'];?\s*/g, "")
    .trim()

  const isPureReexport = stripped.length === 0

  return {
    shellFile: path.basename(filePath),
    shellImportPath,
    targetAlias,
    targetRepoPath: aliasToRepo(targetAlias),
    isPureReexport,
    hasRename,
  }
}

function inferCategory(repoPath: string): string {
  const match = repoPath.match(/^src\/components\/([^/]+)/)
  return match?.[1] ?? "ui"
}

function inferDocsSlug(shell: ParsedShell): string | null {
  const candidates: string[] = []
  const shellBase = path.basename(shell.shellFile, ".tsx")

  for (const suffix of ["-gooseui", "-chamaac", "-bklit", "-evilcharts", "-sabraman", "-extend", "-dice", "-rb", "-limeplay", "-tool", "-manifest", "-uselayouts"]) {
    if (shellBase.endsWith(suffix)) {
      const vendor = suffix.slice(1)
      const short = shellBase.slice(0, -suffix.length)
      candidates.push(`${vendor}/${short}`)
    }
  }

  candidates.push(shellBase)

  for (const candidate of candidates) {
    if (existsSync(path.join(CONTENT_DIR, candidate, "index.mdx"))) {
      return candidate
    }
  }

  const targetParts = shell.targetRepoPath.split("/")
  const vendorIdx = targetParts.findIndex((p) =>
    ["gooseui", "chamaac", "bklit", "evilcharts", "sabraman", "extend", "dice", "react-bits", "limeplay", "manifest", "uselayouts", "tool"].includes(p)
  )
  if (vendorIdx >= 0) {
    const vendor = targetParts[vendorIdx] === "react-bits" ? "rb" : targetParts[vendorIdx]
    const name = path.basename(shell.targetRepoPath, path.extname(shell.targetRepoPath))
    const slug = `${vendor}/${name}`
    if (existsSync(path.join(CONTENT_DIR, slug, "index.mdx"))) {
      return slug
    }
  }

  if (existsSync(path.join(CONTENT_DIR, shellBase, "index.mdx"))) {
    return shellBase
  }

  return null
}

function inferId(docsSlug: string): string {
  return docsSlug
}

function inferTitle(id: string): { title: string; titleEn: string; catalogId: string } {
  const short = id.includes("/") ? id.split("/").pop()! : id
  const titleEn = short
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
  return { title: short, titleEn, catalogId: short }
}

function main() {
  const files = readdirSync(CORE_DIR).filter((f) => f.endsWith(".tsx"))
  const entries: string[] = []
  let skipped = 0

  for (const file of files.sort()) {
    const parsed = parseShell(path.join(CORE_DIR, file))
    if (!parsed || !parsed.isPureReexport) {
      skipped++
      continue
    }

    const docsSlug = inferDocsSlug(parsed)
    if (!docsSlug) {
      skipped++
      continue
    }

    let targetRepoPath = resolveRepoPath(parsed.targetAlias)
    if (!targetRepoPath) {
      skipped++
      continue
    }

    parsed.targetRepoPath = targetRepoPath

    const id = inferId(docsSlug)
    const { title, titleEn, catalogId } = inferTitle(id)
    const category = inferCategory(parsed.targetRepoPath)
    const internalImportPath = aliasFromRepo(parsed.targetRepoPath.replace(/\.(tsx?)$/, ""))

    entries.push(`  item({
    id: ${JSON.stringify(id)},
    catalogId: ${JSON.stringify(catalogId)},
    title: ${JSON.stringify(title)},
    titleEn: ${JSON.stringify(titleEn)},
    category: ${JSON.stringify(category)},
    docsSlug: ${JSON.stringify(docsSlug)},
    files: [{ path: ${JSON.stringify(parsed.targetRepoPath)}, role: "source" }],
    internalImportPath: ${JSON.stringify(aliasFromRepo(parsed.targetRepoPath.replace(/\.(tsx?|jsx?)$/, "")))},
    legacyShellImportPath: ${JSON.stringify(parsed.shellImportPath)},
  }),`)
  }

  const output = `/* AUTO-GENERATED by scripts/sync-registry-from-shells.ts — do not edit manually */
import type { ComponentRegistryItem } from "../schema"

function item(
  partial: Omit<ComponentRegistryItem, "displayImportPath"> & {
    displayImportPath?: ComponentRegistryItem["displayImportPath"]
  }
): ComponentRegistryItem {
  return {
    ...partial,
    displayImportPath: partial.displayImportPath ?? {
      kind: "local",
      value: partial.internalImportPath,
    },
  }
}

export const GENERATED_REGISTRY: ComponentRegistryItem[] = [
${entries.join("\n")}
]
`

  writeFileSync(OUT_FILE, output)
  console.log(`Wrote ${entries.length} registry entries to ${OUT_FILE} (skipped ${skipped})`)
}

main()
