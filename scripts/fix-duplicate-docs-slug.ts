#!/usr/bin/env tsx
/**
 * Ensure unique docsSlug across registry files with vendor-aware overrides.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(ROOT, "content/components")
const FILES = [
  path.join(ROOT, "src/gallery/registry/domains/generated.ts"),
  path.join(ROOT, "src/gallery/registry/domains/pilot.ts"),
]

/** Explicit docsSlug overrides by registry id (wins over auto resolution). */
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
  "rb/dock": "navigation/dock-rb",
  "extend/file-upload": "blocks/file-upload",
  "file-upload": "blocks/file-upload",
  "gooseui/glitch-text": "effects/text/glitch-text-fx",
  "rb/glitch-text": "effects/text/glitch-text-rb",
  "chamaac/liquid-chrome": "effects/backgrounds/liquid-chrome-three",
  "rb/liquid-chrome": "effects/backgrounds/liquid-chrome-three-rb",
  "tool/order-summary": "agent-tools/order-summary/order-summary",
  "limeplay/video-player": "media/blocks/video-player/components/media-player",
  "video-player": "blocks/video-player",
  "chamaac/waves": "effects/backgrounds/waves",
  "rb/waves": "effects/backgrounds/shader-waves",
}

type Entry = { file: string; id: string; docsSlug: string; block: string; index: number }

function contentExists(slug: string): boolean {
  return existsSync(path.join(CONTENT, slug, "index.mdx"))
}

function parseEntries(file: string): Entry[] {
  const content = readFileSync(file, "utf8")
  const entries: Entry[] = []
  const itemRegex = /item\(\{[\s\S]*?\}\),/g
  let index = 0
  for (const block of content.match(itemRegex) ?? []) {
    const id = block.match(/id: "([^"]+)"/)?.[1]
    const docsSlug = block.match(/docsSlug: "([^"]+)"/)?.[1]
    if (id && docsSlug) entries.push({ file, id, docsSlug, block, index: index++ })
  }
  return entries
}

function resolveSlug(entry: Entry): string {
  if (SLUG_OVERRIDES[entry.id]) {
    return SLUG_OVERRIDES[entry.id]
  }
  if (contentExists(entry.docsSlug)) {
    return entry.docsSlug
  }
  if (entry.id.includes("/") && contentExists(`references/${entry.id}`)) {
    return `references/${entry.id}`
  }
  return entry.docsSlug
}

function removeDuplicateIds(file: string): number {
  let content = readFileSync(file, "utf8")
  const seen = new Set<string>()
  let removed = 0
  content = content.replace(/item\(\{[\s\S]*?\}\),/g, (block) => {
    const id = block.match(/id: "([^"]+)"/)?.[1]
    if (!id) return block
    if (seen.has(id)) {
      removed++
      return ""
    }
    seen.add(id)
    return block
  })
  writeFileSync(file, content)
  return removed
}

function main() {
  for (const file of FILES) {
    const removed = removeDuplicateIds(file)
    if (removed > 0) {
      console.log(`${path.relative(ROOT, file)}: removed ${removed} duplicate id blocks`)
    }
  }

  const entries = FILES.flatMap(parseEntries)
  const claimed = new Map<string, string>()
  const updates = new Map<string, string>()

  for (const entry of entries) {
    let slug = resolveSlug(entry)
    if (claimed.has(slug) && claimed.get(slug) !== entry.id) {
      const fallback = SLUG_OVERRIDES[entry.id] ?? `references/${entry.id}`
      slug = contentExists(fallback) ? fallback : fallback
    }
    claimed.set(slug, entry.id)
    if (slug !== entry.docsSlug) {
      updates.set(`${entry.file}::${entry.id}`, slug)
    }
  }

  for (const file of FILES) {
    let content = readFileSync(file, "utf8")
    let count = 0
    for (const [key, slug] of updates) {
      const [f, id] = key.split("::")
      if (f !== file) continue
      const pattern = new RegExp(
        `(id: ${JSON.stringify(id)}[\\s\\S]*?docsSlug: )"[^"]+"`,
        "m"
      )
      if (pattern.test(content)) {
        content = content.replace(pattern, `$1${JSON.stringify(slug)}`)
        count++
        console.log(`${id} -> ${slug}`)
      }
    }
    writeFileSync(file, content)
    console.log(`${path.relative(ROOT, file)}: ${count} slug updates`)
  }
}

main()
