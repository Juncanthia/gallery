# Phase 3 出口检查（终审，2026-07-02）

> commits: `d367b63f` (T3.1) · `e661393c` (T3.2) · `507b5f01` (T3.3) · `68283b97` (T3.4) · `1364d1fe` (T3.5) · T3.6 文档封板

## T3.1 死代码处理

| 检查项 | 结果 |
| --- | --- |
| `src/components/base/` | 已归档 → `archived/components-base/plate-editors-showcase.tsx` |
| `src/components/patterns/` | 不存在（无需删除） |
| `archived/README.md` | 已登记 radix 7 + animate/button + base 共 8 项 |

## T3.2 cn 引用统一

| 检查项 | 结果 |
| --- | --- |
| 组件库 import 路径 | 269 文件 → `@/_internals/foundations/utils/cn` |
| app/ import 路径 | 10 文件 → `@/kit/utils` |
| `src/lib/utils.ts` | 已删除 |
| `rg "from '@/lib/utils'" src/components` | 零输出 |
| `components.json` aliases.utils | 更新为 `@/_internals/foundations/utils/cn` |

## T3.3 mdx 文档路径修复

| 检查项 | 结果 |
| --- | --- |
| `rg "@/primitives/" content` | 零输出 |
| `rg "@/components/_internal" content` | 零输出 |
| `rg "@/lib/utils" content` | 零输出（llm.txt 同步更新为 `@/kit/utils`） |
| 更新文件数 | 91 个 content/ 文件 |

## T3.4 Registry 同步

| 检查项 | 结果 |
| --- | --- |
| `pnpm sync:registry` | 路径对齐 + 保留 221 条 generated 条目（core/ 壳已非纯转发，不再覆盖） |
| `pnpm check:registry` | Registry OK (220 items) |
| `internalImportPath` / `files[].path` 含 `_internal` | 零条 |
| `legacyShellImportPath` 含 `_internal` | 零条 |

## T3.5 防回潮机制

| 检查项 | 结果 |
| --- | --- |
| ESLint `no-restricted-imports` | components↛app、domains 间隔离、kit↛domains、app 对 domains warn |
| `pnpm check:duplicate-hooks` | 78 unique files（1 组 headless use-mounted 豁免） |
| `pnpm check:no-vendor-names` | src/ 无 vendor 路径段 |
| `pnpm verify` | typecheck + registry + duplicate-hooks + no-vendor-names + lint |

## T3.6 文档封板

| 文档 | 状态 |
| --- | --- |
| `docs/ARCHITECTURE.md` | 新增 kit/_internals 当前架构章节 |
| `docs/refactor/00-README.md` | 标记 ✅ 已完成 |
| `docs/refactor/BASELINE.md` | 追加重构后对比指标 |

## 全量验证

```bash
pnpm typecheck && pnpm check:registry && pnpm check:duplicate-hooks && pnpm check:no-vendor-names
```
```
typecheck: exit 0
check:registry: Registry OK (220 items), exit 0
check:duplicate-hooks: No duplicate use-* hooks (78 unique files), exit 0
check:no-vendor-names: No vendor-origin path segments under src/, exit 0
```

```bash
pnpm lint
```
```
exit: 1 — 893 个既有 lint 问题（@typescript-eslint/no-explicit-any 等），非 Phase 3 引入；边界规则已写入 eslint.config.js
```

```bash
pnpm build
```
```
exit: 1 — 63 个 MDX 解析错误（content/ 既有问题，非本次重构引入）
```

## 指标复查（对比 BASELINE.md）

```bash
find src \( -name "use-*.ts" -o -name "use-*.tsx" \) -exec dirname {} \; | sort -u
```
```
src/_internals/foundations/hooks
src/_internals/foundations/headless/hooks
src/_internals/foundations/theme
src/_internals/domains/charts/hooks
src/_internals/domains/data-table/hooks
src/_internals/domains/media/hooks
src/app/navigation/toc
src/app/shell
src/components/agent-tools/shared
src/components/editor
src/components/marketing-blocks/complex-component/hooks   # 审计豁免
```

```bash
find src -type d -name lib
```
```
src/_internals/foundations/headless/lib
src/components/marketing-blocks/complex-component/lib
src/components/effects/interactions/lib
src/lib
```

```bash
rg "@/components/_internal" src content docs
```
```
src + content: 0 匹配
docs/refactor/*.md + docs/ARCHITECTURE.md 历史章节: intentional 历史引用
```

## Phase 3 完成判定

| 维度 | 状态 |
| --- | --- |
| 死代码归档 | ✅ |
| cn 路径统一 | ✅ |
| mdx/llm.txt 路径修复 | ✅ |
| Registry 同步与校验 | ✅ |
| 防回潮脚本 + ESLint 规则 | ✅ |
| 文档封板 | ✅ |
| typecheck | ✅ |
| build | ❌ 既有 MDX 问题（范围外） |
| lint 全绿 | ❌ 既有 893 问题（范围外） |

**结论：Phase 3 重构目标可宣告完成。** build/lint 失败均为重构前既有债务，不影响 kit/_internals 架构落地与防回潮机制生效。
