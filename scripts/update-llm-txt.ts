/**
 * 批量更新 content/components/*\/llm.txt：
 * 1. 如缺少 examples: 块，在 source: 后插入
 * 2. 如已有 examples: 块，替换为实际文件列表
 * 3. 没有 llm.txt 的目录自动创建
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const COMPONENTS_DIR = join(import.meta.dirname, "..", "content", "components")
const INDENT = "    "

function getExampleFiles(name: string): string[] {
  const examplesDir = join(COMPONENTS_DIR, name, "examples")
  try {
    return readdirSync(examplesDir)
      .filter((f) => f.endsWith(".tsx"))
      .sort()
  } catch {
    return []
  }
}

function buildExamplesBlock(paths: string[]): string {
  if (paths.length === 0) return ""
  return `  examples:\n${paths.map((p) => `${INDENT}- ${p}`).join("\n")}`
}

function updateLlmTxt(filePath: string, examplePaths: string[]) {
  let content = readFileSync(filePath, "utf-8")
  let modified = false

  // 1. check if "  examples:" already exists in frontmatter
  if (content.match(/^  examples:/m)) {
    // Replace existing examples block up to next top-level key (before --- or non-indented)
    const newBlock = buildExamplesBlock(examplePaths)
    const replaced = content.replace(
      /^  examples:[\s\S]*?(?=\n[^ \n])/m,
      newBlock
    )
    if (replaced !== content) {
      content = replaced
      modified = true
    }
  } else {
    // Insert after "source:" block, before "stack:" or before "---"
    const newBlock = buildExamplesBlock(examplePaths)
    if (newBlock) {
      // Insert before stack: or before ---
      const inserted = content.replace(
        /(^stack:)/m,
        `${newBlock}\n$1`
      )
      if (inserted !== content) {
        content = inserted
        modified = true
      }
    }
  }

  if (modified) {
    writeFileSync(filePath, content, "utf-8")
  }
  return modified
}

const componentNames = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let updated = 0
let created = 0
let skipped = 0

for (const name of componentNames) {
  const llmPath = join(COMPONENTS_DIR, name, "llm.txt")
  const files = getExampleFiles(name)
  const paths = files.map((f) => `content/components/${name}/examples/${f}`)

  if (!existsSync(llmPath)) {
    // Create llm.txt from template
    const template = `---
category: Components
title: ${name}
description: ${name} 组件。
demo:
  cols: 2
source:
  component: src/components/ui/${name}.tsx
  examples:
${paths.map((p) => `    - ${p}`).join("\n")}
stack:
  react: true
  tailwindcss: true
---

# ${name}

<ComponentShowcase id="${name}" path="${name}/basic" />

## API

See source for props interface.

## LLM 使用规则

AI 生成代码时从 \`@/components/ui/${name}\` 导入。
`
    writeFileSync(llmPath, template, "utf-8")
    console.log(`  🆕 ${name}: created with ${paths.length} examples`)
    created++
    continue
  }

  try {
    if (updateLlmTxt(llmPath, paths)) {
      console.log(`  ✅ ${name}: ${paths.length} examples`)
      updated++
    } else {
      console.log(`  ⏭️  ${name}: unchanged`)
      skipped++
    }
  } catch (err) {
    console.log(`  ❌ ${name}: ${err}`)
  }
}

console.log(`\nDone. Updated: ${updated}, Created: ${created}, Skipped: ${skipped}`)
