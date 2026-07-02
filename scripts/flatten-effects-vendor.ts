#!/usr/bin/env tsx
/**
 * Flatten vendor subdirectories under src/components/effects/
 * Run: pnpm exec tsx scripts/flatten-effects-vendor.ts [--dry-run]
 */
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const EFFECTS = path.join(ROOT, "src/components/effects")
const dryRun = process.argv.includes("--dry-run")

/** old repo-relative path -> new repo-relative path */
const FILE_MOVES: Record<string, string> = {}

function addMove(oldRel: string, newRel: string) {
  FILE_MOVES[oldRel] = newRel
}

// --- backgrounds/chamaac: component/name/name.tsx -> component/index.tsx ---
const chamaacBgComponents: Array<[string, string, string]> = [
  ["astral-flow", "astral-flow.tsx", "index.tsx"],
  ["deform-tunnel", "deform-tunnel.tsx", "index.tsx"],
  ["electric-mist", "electric-mist.tsx", "index.tsx"],
  ["emissive-dot-grid", "emissive-dot-grid.tsx", "index.tsx"],
  ["glassy-boxes", "glassy-boxes.tsx", "index.tsx"],
  ["grid-bloom", "grid-bloom.tsx", "index.tsx"],
  ["interactive-grid", "interactive-grid-background.tsx", "index.tsx"],
  ["iridescent-windows", "iridescent-windows.tsx", "index.tsx"],
  ["light-speed", "light-speed.tsx", "index.tsx"],
  ["liquid-chrome", "liquid-chrome.tsx", "index.tsx"], // -> liquid-chrome-three (conflict)
  ["liquid-morph", "liquid-morph.tsx", "index.tsx"],
  ["marching-waves", "marching-waves.tsx", "index.tsx"],
  ["modern-smoke", "page.tsx", "index.tsx"],
  ["shader-test", "page.tsx", "index.tsx"],
  ["water-caustic", "water-caustic.tsx", "index.tsx"],
  ["waves", "waves.tsx", "index.tsx"], // -> shader-waves (conflict)
]

for (const [name, file, target] of chamaacBgComponents) {
  const destName = name === "liquid-chrome" ? "liquid-chrome-three" : name === "waves" ? "shader-waves" : name
  addMove(
    `src/components/effects/backgrounds/chamaac/${name}/${file}`,
    `src/components/effects/backgrounds/${destName}/${target}`,
  )
}

addMove(
  "src/components/effects/backgrounds/chamaac/nebula/nebula.tsx",
  "src/components/effects/backgrounds/nebula/index.tsx",
)
addMove(
  "src/components/effects/backgrounds/chamaac/nebula/nebula-interactive.tsx",
  "src/components/effects/backgrounds/nebula/nebula-interactive.tsx",
)

// --- backgrounds/manifest ---
addMove(
  "src/components/effects/backgrounds/manifest/wave-canvas.tsx",
  "src/components/effects/backgrounds/wave-canvas.tsx",
)
addMove(
  "src/components/effects/backgrounds/manifest/wavy-background.tsx",
  "src/components/effects/backgrounds/wavy-background.tsx",
)

// --- interactions/uselayouts ---
for (const name of [
  "animated-collection",
  "dynamic-toolbar",
  "expandable-gallery",
  "feature-carousel",
  "folder-interaction",
]) {
  addMove(
    `src/components/effects/interactions/uselayouts/${name}.tsx`,
    `src/components/effects/interactions/${name}.tsx`,
  )
}

// --- interactions/gooseui ---
for (const name of [
  "border-beam",
  "corner-shape",
  "morphing-dialog",
  "morphing-header",
  "parallax-cards",
  "reveal-on-scroll",
  "stacking-cards",
  "svg-drawable",
]) {
  addMove(
    `src/components/effects/interactions/gooseui/${name}.tsx`,
    `src/components/effects/interactions/${name}.tsx`,
  )
}

// --- interactions/gooseui/animate-ui ---
addMove(
  "src/components/effects/interactions/gooseui/animate-ui/primitives/animate/slot.tsx",
  "src/components/effects/interactions/_internal/animate/slot.tsx",
)
for (const icon of ["binary", "blocks", "brush-cleaning", "gauge", "icon", "party-popper", "terminal"]) {
  addMove(
    `src/components/effects/interactions/gooseui/animate-ui/icons/${icon}.tsx`,
    `src/components/effects/interactions/_internal/animate-icons/${icon}.tsx`,
  )
}

// --- interactions/chamaac/animated-icons ---
const animatedIconsDir = path.join(EFFECTS, "interactions/chamaac/animated-icons")
if (existsSync(animatedIconsDir)) {
  for (const file of readdirSync(animatedIconsDir)) {
    if (file.endsWith(".tsx")) {
      addMove(
        `src/components/effects/interactions/chamaac/animated-icons/${file}`,
        `src/components/effects/interactions/animated-icons/${file}`,
      )
    }
  }
}

addMove(
  "src/components/effects/interactions/chamaac/synthesis/synthesis.tsx",
  "src/components/effects/interactions/synthesis/index.tsx",
)
addMove(
  "src/components/effects/interactions/sabraman/roundbit.tsx",
  "src/components/effects/interactions/roundbit.tsx",
)
addMove(
  "src/components/effects/interactions/dice/swap.tsx",
  "src/components/effects/interactions/dice-swap.tsx",
)

// --- text/chamaac ---
for (const name of ["dancing-letters", "gif-text", "text-loop"]) {
  addMove(
    `src/components/effects/text/chamaac/${name}/${name}.tsx`,
    `src/components/effects/text/${name}/index.tsx`,
  )
}

// --- text/gooseui ---
for (const name of ["balanced-text", "curved-text", "glitch-text-fx"]) {
  addMove(
    `src/components/effects/text/gooseui/${name}.tsx`,
    `src/components/effects/text/${name}.tsx`,
  )
}

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
    // Relative paths in source-registry.ts (?raw imports)
    if (oldRel !== newRel) {
      pairs.push([oldRel, newRel])
    }
  }
  // Sort longest first to avoid partial replacements
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

function walkFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue
      walkFiles(full, exts, out)
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
    for (const file of walkFiles(root, exts)) {
      if (file.includes("scripts/flatten-effects-vendor.ts")) continue
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
  if (dir === EFFECTS) return
  try {
    if (readdirSync(dir).length === 0 && !dryRun) {
      execSync(`rmdir "${dir}"`, { cwd: ROOT })
    }
  } catch {
    // not empty
  }
}

function maxDepth(): number {
  let max = 0
  function walk(d: string, depth: number) {
    if (!existsSync(d)) return
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry)
      if (statSync(full).isDirectory()) {
        max = Math.max(max, depth + 1)
        walk(full, depth + 1)
      }
    }
  }
  walk(EFFECTS, 1) // effects = depth 1
  return max
}

function main() {
  console.log(`Flattening effects vendor dirs (${Object.keys(FILE_MOVES).length} files)${dryRun ? " [DRY RUN]" : ""}`)

  // Move deepest paths first
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
    // Remove leftover vendor empty dirs
    for (const vendor of ["chamaac", "gooseui", "uselayouts", "sabraman", "manifest", "dice"]) {
      removeEmptyDirs(path.join(EFFECTS, "backgrounds", vendor))
      removeEmptyDirs(path.join(EFFECTS, "interactions", vendor))
      removeEmptyDirs(path.join(EFFECTS, "text", vendor))
    }
  }

  console.log("\n=== Mapping Table ===")
  for (const [oldRel, newRel] of Object.entries(FILE_MOVES).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${oldRel}\n  -> ${newRel}`)
  }

  console.log(`\n=== Summary ===`)
  console.log(`Files moved: ${moved}`)
  console.log(`Max depth after: ${dryRun ? "(run without dry-run)" : maxDepth()} layers under effects/`)

  // Write mapping for report
  if (!dryRun) {
    writeFileSync(
      path.join(ROOT, "scripts/.flatten-effects-mapping.json"),
      JSON.stringify({ moves: FILE_MOVES, moved, maxDepth: maxDepth() }, null, 2),
    )
  }
}

main()
