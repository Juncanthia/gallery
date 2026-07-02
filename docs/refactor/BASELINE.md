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

## 其他

| 指标 | 数值 |
|------|------|
| `_internal/radix` 文件数 | 18 |
| `core/` 文件数 | 95 |
| `base/` 文件数 | 1 |
