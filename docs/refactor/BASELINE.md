# 重构基线指标

> 记录时间：2026-07-02  
> 分支：`refactor/kit-internals`  
> 用途：Phase 0 基线，仅数字，不写分析

## Hooks

| 指标 | 数值 |
|------|------|
| `use-*` 文件总数 | 97 |

### hooks 所在目录

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

## lib 目录

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

## 重复副本（基线）

| 文件 | 副本数 |
|------|--------|
| use-mobile | 6 |

### use-mobile 副本路径

```
src/components/_internal/dice/hooks/use-mobile.ts
src/components/_internal/gooseui/hooks/use-mobile.ts
src/components/_internal/hooks/use-mobile.ts
src/components/_internal/uselayouts/hooks/use-mobile.ts
src/components/document/hooks/use-mobile.ts
src/components/media/hooks/use-mobile.ts
```

## 类型检查基线

```bash
pnpm typecheck   # 项目实际脚本名（04 文档写 type-check，package.json 为 typecheck）
```

结果：**0 错误**（`tsc -b` 退出码 0）

> 注：package.json 脚本名为 `typecheck`，非 `type-check`。

## 工具链基线（T0.3）

| 命令 | 结果 | 备注 |
|------|------|------|
| `pnpm typecheck` | ✅ 通过 | ~51s |
| `pnpm build` | ❌ 失败 | ~53s；`source-registry.ts` 仍引用已删除的 `src/components/ui/*` |
| `pnpm check:registry` | ✅ 通过 | Registry OK (220 items) |
| `ts-morph` | ✅ 已安装 | devDependency ^28.0.0 |
