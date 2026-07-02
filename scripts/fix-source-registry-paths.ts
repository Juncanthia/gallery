#!/usr/bin/env tsx
/**
 * Rewrites stale ?raw import paths in source-registry.ts to current repo locations.
 * Run: pnpm exec tsx scripts/fix-source-registry-paths.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const TARGET = path.join(ROOT, "src/app/registry/source-registry.ts")

const REPLACEMENTS: Record<string, string> = {
  "src/components/ui/": "src/components/core/",
  "src/components/ui/badge-variants.ts": "src/components/core/variants/badge-variants.ts",
  "src/components/ui/button-variants.ts": "src/components/core/variants/button-variants.ts",
  "src/components/ui/float-button-variants.ts": "src/components/core/variants/float-button-variants.ts",
  "src/components/ui/input-variants.ts": "src/components/core/variants/input-variants.ts",
  "src/components/ui/navigation-menu-variants.ts": "src/components/core/variants/navigation-menu-variants.ts",
  "src/components/ui/select-variants.ts": "src/components/core/variants/select-variants.ts",
  "src/components/ui/link-preview.tsx": "src/components/agent-tools/link-preview/link-preview.tsx",
  "src/components/ui/border-beam.tsx": "src/components/effects/interactions/border-beam.tsx",
  "src/components/ui/carousel.tsx": "src/components/data-display/carousel/index.tsx",
  "src/components/ui/empty-state.tsx": "src/components/data-display/empty-state/index.tsx",
  "src/components/ui/notification-api.tsx": "src/components/feedback/legacy-notification.tsx",
  "src/components/effects/backgrounds/chamaac/nebula/nebula.tsx":
    "src/components/effects/backgrounds/nebula/index.tsx",
  "src/components/effects/backgrounds/chamaac/electric-mist/electric-mist.tsx":
    "src/components/effects/backgrounds/electric-mist/index.tsx",
  "src/components/effects/backgrounds/chamaac/grid-bloom/grid-bloom.tsx":
    "src/components/effects/backgrounds/grid-bloom/index.tsx",
  "src/components/effects/backgrounds/chamaac/liquid-morph/liquid-morph.tsx":
    "src/components/effects/backgrounds/liquid-morph/index.tsx",
  "src/components/effects/backgrounds/chamaac/emissive-dot-grid/emissive-dot-grid.tsx":
    "src/components/effects/backgrounds/emissive-dot-grid/index.tsx",
  "src/components/effects/backgrounds/chamaac/iridescent-windows/iridescent-windows.tsx":
    "src/components/effects/backgrounds/iridescent-windows/index.tsx",
  "src/components/effects/backgrounds/chamaac/water-caustic/water-caustic.tsx":
    "src/components/effects/backgrounds/water-caustic/index.tsx",
  "src/components/effects/text/chamaac/dancing-letters/dancing-letters.tsx":
    "src/components/effects/text/dancing-letters/index.tsx",
  "src/components/effects/text/chamaac/text-loop/text-loop.tsx":
    "src/components/effects/text/text-loop/index.tsx",
  "src/components/general/chamaac/shimmer-button/shimmer-button.tsx":
    "src/components/general/shimmer-button/index.tsx",
  "src/components/marketing-blocks/chamaac/feature-steps/feature-steps.tsx":
    "src/components/marketing-blocks/feature-steps/index.tsx",
  "src/components/charts/chamaac/gauge/gauge.tsx":
    "src/components/charts/gauge-chamaac/gauge.tsx",
  "src/components/general/uselayouts/discover-button.tsx": "src/components/general/discover-button.tsx",
  "src/components/data-entry/uselayouts/multi-step-form.tsx": "src/components/data-entry/multi-step-form.tsx",
  "src/components/general/uselayouts/status-button.tsx": "src/components/general/status-button.tsx",
  "src/components/navigation/uselayouts/vertical-tabs.tsx": "src/components/navigation/vertical-tabs.tsx",
  "src/components/data-entry/sabraman/legacy-slider.tsx": "src/components/data-entry/legacy-slider.tsx",
  "src/components/effects/interactions/gooseui/border-beam.tsx":
    "src/components/effects/interactions/border-beam.tsx",
  "src/components/effects/text/gooseui/curved-text.tsx": "src/components/effects/text/curved-text/index.tsx",
  "src/components/effects/interactions/gooseui/stacking-cards.tsx":
    "src/components/effects/interactions/stacking-cards.tsx",
  "src/components/marketing-blocks/gooseui/promo-banner.tsx": "src/components/marketing-blocks/promo-banner.tsx",
  "src/components/effects/interactions/gooseui/parallax-cards.tsx":
    "src/components/effects/interactions/parallax-cards.tsx",
  "src/components/marketing-blocks/gooseui/features/features-grid.tsx":
    "src/components/marketing-blocks/features-grid/index.tsx",
  "src/components/marketing-blocks/gooseui/footers/footer-columns.tsx":
    "src/components/marketing-blocks/footer-columns/index.tsx",
  "src/components/marketing-blocks/gooseui/footers/footer-simple.tsx":
    "src/components/marketing-blocks/footer-simple/index.tsx",
  "src/components/marketing-blocks/gooseui/footers/footer-newsletter.tsx":
    "src/components/marketing-blocks/footer-newsletter/index.tsx",
  "src/components/marketing-blocks/gooseui/marketing/curved-text-marquee.tsx":
    "src/components/marketing-blocks/curved-text-marquee/index.tsx",
  "src/components/marketing-blocks/gooseui/headers/header-with-cta.tsx":
    "src/components/marketing-blocks/header-with-cta/index.tsx",
  "src/components/templates/manifest/form/contact-form.tsx":
    "src/components/templates/form/contact-form.tsx",
  "src/components/templates/manifest/form/countries.ts": "src/components/templates/form/countries.ts",
  "src/components/templates/manifest/form/demo/form.ts": "src/components/templates/form/demo/form.ts",
  "src/components/data-entry/manifest/date-time-picker.tsx": "src/components/data-entry/date-time-picker.tsx",
  "src/components/data-display/manifest/empty-state.tsx": "src/components/data-display/empty-state/index.tsx",
  "src/components/data-entry/manifest/file-uploader.tsx": "src/components/data-entry/file-uploader.tsx",
  "src/components/templates/manifest/form/settings-panel.tsx":
    "src/components/templates/form/settings-panel.tsx",
  "src/components/general/dice/headless/hitbox.tsx": "src/components/general/headless/hitbox.tsx",
  "src/components/data-display/dice/color-swatch.tsx": "src/components/data-display/color-swatch/index.tsx",
}

function resolvePath(repoPath: string): string | null {
  if (REPLACEMENTS[repoPath]) {
    return REPLACEMENTS[repoPath]
  }

  if (repoPath.startsWith("src/components/ui/")) {
    const corePath = repoPath.replace("src/components/ui/", "src/components/core/")
    if (existsSync(path.join(ROOT, corePath))) {
      return corePath
    }
  }

  return null
}

function main() {
  let content = readFileSync(TARGET, "utf8")
  const missing: string[] = []

  content = content.replace(
    /from "\.\.\/\.\.\/\.\.\/(src\/components\/[^"?]+)(\?raw)"/g,
    (full, repoPath: string, suffix: string) => {
      const resolved = resolvePath(repoPath)
      if (resolved) {
        return `from "../../../${resolved}${suffix}"`
      }
      if (!existsSync(path.join(ROOT, repoPath))) {
        missing.push(repoPath)
      }
      return full
    },
  )

  writeFileSync(TARGET, content)

  if (missing.length > 0) {
    console.error("Unresolved paths:")
    for (const item of [...new Set(missing)].sort()) {
      console.error(`  ${item}`)
    }
    process.exit(1)
  }

  console.log("source-registry.ts paths updated")
}

main()
