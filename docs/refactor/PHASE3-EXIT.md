# Phase 3 出口检查（T3.1–T3.3，2026-07-02）

> commits: `d367b63f` (T3.1) · `e661393c` (T3.2) · `507b5f01` (T3.3)

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
| `customToast` kit 出口 | 新增 `@/kit/utils` 导出 |

主要替换映射：
- `@/components/_internal/sabraman` → `@/components/legacy-ui`
- `@/components/_internal/gooseui/lib/toast` → `@/kit/utils`
- `@/components/_internal/animate/*` → `@/_internals/foundations/primitives/animate/*`
- `@/components/_internal/{effects,texts}/*` → `@/kit/primitives`
- `src/primitives/` → `src/_internals/foundations/primitives/`

## 全量验证

```bash
pnpm typecheck && pnpm check:registry
```
```
typecheck: exit 0
check:registry: Registry OK (220 items), exit 0
```

```bash
pnpm build
```
```
exit: 1 — 63 个 MDX 解析错误（content/ 既有问题，T3.3 修改的 91 个文件均为 llm.txt/mdx 路径文字替换，未引入新 TS 错误）
```

## 待续（Phase 3 剩余）

- T3.4 Registry 同步（`pnpm sync:registry`）
- T3.5 防回潮 ESLint + check-duplicate-hooks
- T3.6 文档封板（ARCHITECTURE.md / 00-README / BASELINE）

## 备注

`rg "@/components/_internal" docs` 在 `docs/refactor/*.md` 与 `docs/ARCHITECTURE.md` 历史章节仍有匹配——为审计/迁移过程文档中的** intentional 历史引用**，不影响 src/content 运行时路径。
