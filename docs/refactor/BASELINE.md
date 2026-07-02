# 重构基线指标（2026-07-02）

> Phase 0 T0.2 记录。仅数字，不含分析。分支：`refactor/kit-internals`（基于 main @ 13fcb56b）

## Hooks

| 指标 | 数值 |
|------|------|
| `use-*` 文件总数 | 97 |
| hooks 所在目录数 | 17 |
| use-mobile 副本数 | 6 |

### hooks 目录清单

```
src/app/navigation/toc
src/app/shell
src/components/_internal/dice/hooks
src/components/_internal/dice/internal/hooks
src/components/_internal/gooseui/hooks
src/components/_internal/hooks
src/components/_internal/sabraman/lib/hooks
src/components/_internal/uselayouts/hooks
src/components/agent-tools/shared
src/components/charts/chart-kit
src/components/data-display/data-table-filters/hooks
src/components/document/hooks
src/components/editor
src/components/marketing-blocks/complex-component/hooks
src/components/media/blocks/audio-player/hooks
src/components/media/hooks
src/components/media/stream-panel
```

### use-mobile 副本路径

```
src/components/_internal/dice/hooks/use-mobile.ts
src/components/_internal/gooseui/hooks/use-mobile.ts
src/components/_internal/hooks/use-mobile.ts
src/components/_internal/uselayouts/hooks/use-mobile.ts
src/components/document/hooks/use-mobile.ts
src/components/media/hooks/use-mobile.ts
```

## Lib 目录（16 处）

```
src/components/_internal/dice/internal/lib
src/components/_internal/dice/lib
src/components/_internal/gooseui/lib
src/components/_internal/lib
src/components/_internal/sabraman/lib
src/components/_internal/uselayouts/lib
src/components/charts/chart-kit/lib
src/components/charts/evil-charts/lib
src/components/data-display/data-table-filters/lib
src/components/document/lib
src/components/marketing-blocks/complex-component/lib
src/components/media/blocks/audio-player/lib
src/components/media/blocks/video-player/lib
src/components/media/lib
src/components/templates/lib
src/lib
```

## 验证命令基线

| 命令 | 结果 | 备注 |
|------|------|------|
| `pnpm typecheck` | ✅ 0 错误 | ~47s |
| `pnpm build` | ❌ 失败 | 196 个 UNRESOLVED_IMPORT：`source-registry.ts` 仍引用已删除的 `src/components/ui/*` |
| `pnpm check:registry` | ✅ 通过 | Registry OK (220 items) |
| `ts-morph` | ✅ 已安装 | v28.0.0（T0.3 新增 devDependency） |

---

## 重构后指标（Phase 3 封板，2026-07-02）

> 分支：`refactor/kit-internals` · 对比基线：上方 Phase 0 数据

### Hooks

| 指标 | 基线 | 重构后 | 变化 |
| --- | ---: | ---: | --- |
| `use-*` 文件总数 | 97 | 79 | −18（去重 + 域迁移） |
| hooks 所在目录数 | 17 | 11 | −6 |
| use-mobile 副本数 | 6 | 1 | 合并至 foundations |

### hooks 目录清单（重构后）

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
src/components/marketing-blocks/complex-component/hooks   # 审计豁免：演示数据
```

### Lib 目录

| 指标 | 基线 | 重构后 |
| --- | ---: | ---: |
| `lib/` 目录数 | 16 | 4 |

```
src/_internals/foundations/headless/lib     # headless 原语专用
src/components/marketing-blocks/complex-component/lib   # 审计豁免
src/components/effects/interactions/lib     # 领域内聚
src/lib                                     # Gallery app 专属
```

### 架构清洁度

| 检查项 | 基线 | 重构后 |
| --- | --- | --- |
| `rg "@/components/_internal" src content` | 大量 | **0** |
| `src/components/_internal/` 目录 | 80 文件 | **已删除** |
| `src/components/base/` | 1 文件 | **已归档** |
| vendor 路径段（dice/gooseui/...） | 大量 | **0**（check:no-vendor-names） |
| 同名 hook 重复 | use-mobile ×6 等 | **0**（1 组 headless 豁免） |

### 验证命令（重构后）

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `pnpm typecheck` | ✅ 0 错误 | ~60s |
| `pnpm check:registry` | ✅ 通过 | Registry OK (220 items) |
| `pnpm check:duplicate-hooks` | ✅ 通过 | 78 unique files |
| `pnpm check:no-vendor-names` | ✅ 通过 | src/ 无 vendor 路径段 |
| `pnpm verify` | ⚠️ lint 段失败 | 893 个既有 lint 问题，非本次引入 |
| `pnpm build` | ❌ 失败 | 63 个 MDX 解析错误（content/ 既有问题） |

## 其他

| 指标 | 数值 |
|------|------|
| `_internal/radix` 文件数 | 18 |
| `core/` 文件数 | 95 |
| `base/` 文件数 | 1 |
