#!/usr/bin/env tsx
/**
 * Full registry sync: docsSlug dedupe + path alignment.
 * Run after content isomorph migration.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(ROOT, "content/components")
const TARGETS = [
  path.join(ROOT, "src/app/registry/domains/generated.ts"),
  path.join(ROOT, "src/app/registry/domains/pilot.ts"),
]

const SLUG_OVERRIDES: Record<string, string> = {
  "dice/slider": "core/slider",
  "sabraman/slider": "references/sabraman/slider",
  "dice/switch": "core/switch",
  "sabraman/switch": "references/sabraman/switch",
  "code-block": "blocks/code-block",
  "sabraman/code-block": "references/sabraman/code-block",
  notification: "references/notification",
  "sabraman/alert-dialog": "references/sabraman/alert-dialog",
  "bklit/area-chart": "charts/chart-kit/area-chart",
  "bklit/bar-chart": "charts/chart-kit/bar-chart",
  "bklit/composed-chart": "charts/chart-kit/composed-chart",
  "bklit/gauge": "charts/chart-kit/gauge",
  "bklit/line-chart": "charts/chart-kit/line-chart",
  "bklit/pie-chart": "charts/chart-kit/pie-chart",
  "bklit/radar-chart": "charts/chart-kit/radar-chart",
  "bklit/sankey-chart": "charts/chart-kit/sankey/sankey-chart",
  "evilcharts/area-chart": "charts/evil-charts/components/evilcharts/charts/area-chart",
  "evilcharts/bar-chart": "charts/evil-charts/components/evilcharts/charts/bar-chart",
  "evilcharts/chart": "charts/evil-charts/components/evilcharts/ui/chart",
  "evilcharts/composed-chart": "charts/evil-charts/components/evilcharts/charts/composed-chart",
  "evilcharts/line-chart": "charts/evil-charts/components/evilcharts/charts/line-chart",
  "evilcharts/pie-chart": "charts/evil-charts/components/evilcharts/charts/pie-chart",
  "evilcharts/radar-chart": "charts/evil-charts/components/evilcharts/charts/radar-chart",
  "evilcharts/sankey-chart": "charts/evil-charts/components/evilcharts/charts/sankey-chart",
  "tool/chart": "agent-tools/chart/chart",
  "tool/data-table": "agent-tools/data-table/data-table",
  "data-table": "blocks/data-table",
  "gooseui/checkbox": "core/checkbox",
  "dice/checkbox": "core/checkbox",
  "gooseui/border-beam": "effects/interactions/border-beam",
  "chamaac/dock": "navigation/dock",
  "extend/file-upload": "blocks/file-upload",
  "file-upload": "blocks/file-upload",
  "gooseui/glitch-text": "effects/text/glitch-text-fx",
  "chamaac/liquid-chrome": "effects/backgrounds/liquid-chrome-three",
  "tool/order-summary": "agent-tools/order-summary/order-summary",
  "limeplay/video-player": "media/blocks/video-player/components/media-player",
  "video-player": "blocks/video-player",
  "chamaac/waves": "effects/backgrounds/waves",
  "rb/waves": "effects/backgrounds/shader-waves",
}

/** Registry ids to drop when they duplicate another entry's source module. */
const DROP_DUPLICATE_IDS = new Set([
  "rb/dock",
  "rb/glitch-text",
  "rb/liquid-chrome",
  "gooseui/checkbox",
])

/** Source module overrides when docsSlug is references/* or legacy shared paths. */
const IMPORT_OVERRIDES: Record<string, { repoPath: string; alias: string }> = {
  "sabraman/code-block": {
    repoPath: "src/components/_internal/sabraman/index.ts",
    alias: "@/components/_internal/sabraman",
  },
  notification: {
    repoPath: "src/components/_internal/sabraman/index.ts",
    alias: "@/components/_internal/sabraman",
  },
  "sabraman/slider": {
    repoPath: "src/components/_internal/sabraman/index.ts",
    alias: "@/components/_internal/sabraman",
  },
  "sabraman/switch": {
    repoPath: "src/components/_internal/sabraman/index.ts",
    alias: "@/components/_internal/sabraman",
  },
  "sabraman/alert-dialog": {
    repoPath: "src/components/_internal/sabraman/index.ts",
    alias: "@/components/_internal/sabraman",
  },
}

function contentExists(slug: string): boolean {
  return existsSync(path.join(CONTENT, slug, "index.mdx"))
}

function resolveRepoPath(alias: string): string | null {
  const base = path.join(ROOT, "src", alias.replace(/^@\//, ""))
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return path.relative(ROOT, candidate)
    }
  }
  return null
}

function aliasFromRepo(repoPath: string): string {
  const withoutExt = repoPath.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "")
  return `@/${withoutExt.replace(/^src\//, "")}`
}

function syncFile(filePath: string): { removed: number; updated: number } {
  let content = readFileSync(filePath, "utf8")
  let removed = 0
  let updated = 0
  const claimedSlugs = new Map<string, string>()

  content = content.replace(/item\(\{([\s\S]*?)\}\),/g, (fullBlock, body) => {
    const id = body.match(/id:\s*"([^"]+)"/)?.[1]
    if (!id || DROP_DUPLICATE_IDS.has(id)) {
      removed++
      return ""
    }

    const currentSlug = body.match(/docsSlug:\s*"([^"]+)"/)?.[1] ?? ""
    let docsSlug = SLUG_OVERRIDES[id] ?? currentSlug

    if (!contentExists(docsSlug)) {
      const catalogId = body.match(/catalogId:\s*"([^"]+)"/)?.[1] ?? id.split("/").pop()!
      const fallback = [...Object.values(SLUG_OVERRIDES), currentSlug].find(
        (candidate) => candidate.endsWith(`/${catalogId}`) || candidate === catalogId
      )
      if (fallback && contentExists(fallback)) {
        docsSlug = fallback
      }
    }

    if (claimedSlugs.has(docsSlug) && claimedSlugs.get(docsSlug) !== id) {
      removed++
      return ""
    }
    if (contentExists(docsSlug)) {
      claimedSlugs.set(docsSlug, id)
    }

    const importOverride = IMPORT_OVERRIDES[id]
    const repoPath =
      importOverride?.repoPath ?? resolveRepoPath(`@/components/${docsSlug}`)
    if (!repoPath || !existsSync(path.join(ROOT, repoPath))) {
      return fullBlock
    }

    const alias = importOverride?.alias ?? aliasFromRepo(repoPath)
    const nextBody = body
      .replace(/docsSlug:\s*"[^"]+"/, `docsSlug: "${docsSlug}"`)
      .replace(/files:\s*\[\{\s*path:\s*"[^"]+"/, `files: [{ path: "${repoPath}"`)
      .replace(/internalImportPath:\s*"@\/components\/[^"]+"/, `internalImportPath: "${alias}"`)

    if (nextBody !== body) {
      updated++
    }

    return `item({${nextBody}}),`
  })

  writeFileSync(filePath, content)
  return { removed, updated }
}

function main() {
  let totalRemoved = 0
  let totalUpdated = 0
  for (const target of TARGETS) {
    const { removed, updated } = syncFile(target)
    totalRemoved += removed
    totalUpdated += updated
    console.log(`${path.relative(ROOT, target)}: removed ${removed}, updated ${updated}`)
  }
  console.log(`Total removed: ${totalRemoved}, updated: ${totalUpdated}`)
}

main()
