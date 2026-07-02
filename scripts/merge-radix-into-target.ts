#!/usr/bin/env tsx
/**
 * T1.4 codemod：将 `_internal/radix/<name>.tsx` 的实现合并进目标文件（core/ 或跨域目标）。
 * 按目标文件中已有的 import alias 重命名 radix 导出符号，删除 radix import 并内联实现。
 *
 * Run: pnpm exec tsx scripts/merge-radix-into-target.ts [component-name]
 *   无参数 → 批量处理全部 11 个一对一 + accordion/link-preview 配对
 *   有参数 → 仅处理指定组件（如 `button`）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

type AliasMap = Map<string, string>;

function extractImportFromPath(content: string, importPath: string) {
  const fromPattern = new RegExp(
    `from\\s*['"]${escapeRegExp(importPath)}['"];?`,
    'm',
  );
  const fromMatch = content.match(fromPattern);
  if (!fromMatch || fromMatch.index === undefined) {
    return null;
  }

  const before = content.slice(0, fromMatch.index);
  const importStart = before.lastIndexOf('import ');
  if (importStart === -1) {
    return null;
  }

  const end = fromMatch.index + fromMatch[0].length;
  return content.slice(importStart, end);
}

function removeImportFromPath(content: string, importPath: string) {
  const block = extractImportFromPath(content, importPath);
  if (!block) return content;
  return content.replace(block, '').replace(/^\s*\n/, '');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renameSymbolUsages(content: string, original: string, alias: string) {
  if (original === alias) return content;

  let next = content;
  next = next.replace(
    new RegExp(`:\\s*${escapeRegExp(original)}\\b`, 'g'),
    `: ${alias}`,
  );
  next = next.replace(
    new RegExp(`<${escapeRegExp(original)}([\\s/>])`, 'g'),
    `<${alias}$1`,
  );
  next = next.replace(
    new RegExp(`</${escapeRegExp(original)}>`, 'g'),
    `</${alias}>`,
  );
  return next;
}

function parseImportAliases(importBlock: string): AliasMap {
  const aliases = new Map<string, string>();
  const inner = importBlock.match(/\{([\s\S]*?)\}/)?.[1] ?? '';
  for (const part of inner.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const isType = trimmed.startsWith('type ');
    const spec = isType ? trimmed.slice(5).trim() : trimmed;
    const match = spec.match(/^([\w$]+)(?:\s+as\s+([\w$]+))?$/);
    if (!match) continue;
    const original = match[1];
    const alias = match[2] ?? original;
    aliases.set(original, alias);
  }
  return aliases;
}

function renameDeclaredSymbol(content: string, original: string, alias: string) {
  if (original === alias) return content;

  let next = content;

  next = next.replace(
    new RegExp(`\\bfunction\\s+${escapeRegExp(original)}\\b`, 'g'),
    `function ${alias}`,
  );
  next = next.replace(
    new RegExp(`\\btype\\s+${escapeRegExp(original)}\\b`, 'g'),
    `type ${alias}`,
  );
  next = next.replace(
    new RegExp(`\\binterface\\s+${escapeRegExp(original)}\\b`, 'g'),
    `interface ${alias}`,
  );
  next = next.replace(
    new RegExp(`\\bconst\\s+${escapeRegExp(original)}\\b`, 'g'),
    `const ${alias}`,
  );

  return next;
}

function disambiguateRadixUiImports(
  radixContent: string,
  reservedAliases: Set<string>,
) {
  const renames = new Map<string, string>();
  let next = radixContent;
  const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]radix-ui['"];?/g;

  next = next.replace(importRegex, (block, inner: string) => {
    const specs = inner.split(',').map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return part;
      const isType = trimmed.startsWith('type ');
      const spec = isType ? trimmed.slice(5).trim() : trimmed;
      const match = spec.match(/^([\w$]+)(?:\s+as\s+([\w$]+))?$/);
      if (!match) return part;
      const original = match[1];
      const alias = match[2] ?? original;
      if (!reservedAliases.has(alias)) {
        return part;
      }
      const nextAlias = `Radix${original}`;
      renames.set(alias, nextAlias);
      return isType
        ? `type ${original} as ${nextAlias}`
        : `${original} as ${nextAlias}`;
    });

    return block.replace(inner, specs.join(', '));
  });

  for (const [alias, nextAlias] of renames) {
    next = next.replace(
      new RegExp(`\\b${escapeRegExp(alias)}\\.`, 'g'),
      `${nextAlias}.`,
    );
    next = next.replace(
      new RegExp(`typeof\\s+${escapeRegExp(alias)}\\b`, 'g'),
      `typeof ${nextAlias}`,
    );
  }

  return next;
}

function stripRadixExportBlock(content: string) {
  return content.replace(/\nexport\s*\{[\s\S]*?\};?\s*$/m, '\n');
}

function collectImportBlocks(content: string) {
  const imports: string[] = [];
  const regex = /^import[\s\S]*?;\s*$/gm;
  for (const match of content.matchAll(regex)) {
    imports.push(match[0].trim());
  }
  return imports;
}

function stripImportsAndUseClient(content: string) {
  return content
    .replace(/^'use client';\s*\n/m, '')
    .replace(/^import[\s\S]*?;\s*$/gm, '')
    .trim();
}

function mergeImports(blocks: string[]) {
  const seen = new Set<string>();
  const merged: string[] = [];
  const hasReactValueImport = blocks.some((block) =>
    /^import \* as React from ['"]react['"]/.test(block.replace(/\s+/g, ' ')),
  );

  for (const block of blocks) {
    const normalized = block.replace(/\s+/g, ' ');
    if (
      hasReactValueImport &&
      /^import type \* as React from ['"]react['"];?$/.test(normalized)
    ) {
      continue;
    }
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    merged.push(block);
  }
  return merged.join('\n');
}

function mergeRadixIntoTarget(options: {
  radixRel: string;
  targetRel: string;
  radixImportPath: string;
}) {
  const radixPath = path.join(ROOT, options.radixRel);
  const targetPath = path.join(ROOT, options.targetRel);
  const radix = fs.readFileSync(radixPath, 'utf8');
  let target = fs.readFileSync(targetPath, 'utf8');

  const importBlock = extractImportFromPath(target, options.radixImportPath);
  if (!importBlock) {
    throw new Error(`Import from ${options.radixImportPath} not found in ${options.targetRel}`);
  }

  const aliases = parseImportAliases(importBlock);
  const reservedAliases = new Set(aliases.values());

  let processedRadix = stripRadixExportBlock(radix);
  processedRadix = disambiguateRadixUiImports(processedRadix, reservedAliases);
  for (const [original, alias] of aliases) {
    processedRadix = renameDeclaredSymbol(processedRadix, original, alias);
    processedRadix = renameSymbolUsages(processedRadix, original, alias);
  }

  target = removeImportFromPath(target, options.radixImportPath);

  const targetImports = collectImportBlocks(target);
  const radixImports = collectImportBlocks(processedRadix);
  const radixBody = stripImportsAndUseClient(processedRadix);
  const targetWithoutImports = stripImportsAndUseClient(target);
  const useClient =
    radix.includes("'use client'") || target.includes("'use client'")
      ? "'use client';\n\n"
      : '';

  const merged = [
    useClient,
    mergeImports([...radixImports, ...targetImports]),
    '',
    radixBody,
    '',
    targetWithoutImports,
  ]
    .filter((part, index, arr) => !(part === '' && arr[index - 1] === ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(targetPath, merged.endsWith('\n') ? merged : `${merged}\n`);
  console.log(`Merged ${options.radixRel} -> ${options.targetRel}`);
}

const pairs: Array<{
  name: string;
  radixRel: string;
  targetRel: string;
  radixImportPath?: string;
}> = [
  { name: 'accordion', radixRel: 'src/components/_internal/radix/accordion.tsx', targetRel: 'src/components/core/accordion.tsx' },
  { name: 'collapsible', radixRel: 'src/components/_internal/radix/collapsible.tsx', targetRel: 'src/components/core/collapsible.tsx' },
  { name: 'progress', radixRel: 'src/components/_internal/radix/progress.tsx', targetRel: 'src/components/core/progress.tsx' },
  { name: 'radio-group', radixRel: 'src/components/_internal/radix/radio-group.tsx', targetRel: 'src/components/core/radio-group.tsx' },
  { name: 'switch', radixRel: 'src/components/_internal/radix/switch.tsx', targetRel: 'src/components/core/switch.tsx' },
  { name: 'toggle', radixRel: 'src/components/_internal/radix/toggle.tsx', targetRel: 'src/components/core/toggle.tsx' },
  { name: 'sheet', radixRel: 'src/components/_internal/radix/sheet.tsx', targetRel: 'src/components/core/sheet.tsx' },
  { name: 'tabs', radixRel: 'src/components/_internal/radix/tabs.tsx', targetRel: 'src/components/core/tabs.tsx' },
  { name: 'toggle-group', radixRel: 'src/components/_internal/radix/toggle-group.tsx', targetRel: 'src/components/core/toggle-group.tsx' },
  { name: 'file-tree', radixRel: 'src/components/_internal/radix/file-tree.tsx', targetRel: 'src/components/core/file-tree.tsx' },
  {
    name: 'hover-card',
    radixRel: 'src/components/_internal/radix/hover-card.tsx',
    targetRel: 'src/components/_internal/radix/link-preview.tsx',
    radixImportPath: '@/components/_internal/radix/hover-card',
  },
  {
    name: 'link-preview',
    radixRel: 'src/components/_internal/radix/link-preview.tsx',
    targetRel: 'src/components/editor/blocks/link-preview.tsx',
  },
];

const selected = process.argv[2];
const toRun = selected ? pairs.filter((pair) => pair.name === selected) : pairs;

if (selected && toRun.length === 0) {
  console.error(`Unknown component: ${selected}`);
  process.exit(1);
}

for (const pair of toRun) {
  mergeRadixIntoTarget({
    radixRel: pair.radixRel,
    targetRel: pair.targetRel,
    radixImportPath:
      pair.radixImportPath ?? `@/components/_internal/radix/${pair.name}`,
  });
}
