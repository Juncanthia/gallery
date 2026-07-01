# 外部 UI 副本覆盖审计

> 目的：给交叉审阅者一个“有没有漏目录”的入口。本文件来自当前 worktree 的只读扫描，不修改运行时代码。

## 1. 扫描命令

```bash
find src/components -type d \( \
  -path '*/components/ui' \
  -o -path '*/_shared/ui' \
  -o -path '*/ui' \
  -o -path '*/components/*/ui' \
\) | sort

rg -n "@/components/(uselayouts/_shared/ui|manifest/components/ui|gooseui/components/ui|dice/ui|limeplay/ui|limeplay/blocks/video-player/ui|extend/components/ui|sabraman/components/ui|evilcharts/components/evilcharts/ui)/[A-Za-z0-9_-]+" src --glob '*.{ts,tsx}'

rg -n "@base-ui|useRender|mergeProps" src package.json pnpm-lock.yaml
```

## 2. 当前发现的 UI-like 目录

| 目录 | 是否已有报告 | 判断 |
|---|---|---|
| `src/components/ui` | 主线，不单独迁移 | 主线基础组件 seam |
| `src/components/uselayouts/_shared/ui` | `SHADCN-CONSOLIDATION-USELAYOUTS.md` | 外部基础件副本，优先收口 |
| `src/components/manifest/components/ui` | `SHADCN-CONSOLIDATION-MANIFEST.md` | 外部基础件副本 + wave 业务组件 |
| `src/components/gooseui/components/ui` | `SHADCN-CONSOLIDATION-GOOSEUI.md` | 混合目录：基础件副本 + gooseui 业务视觉组件 |
| `src/components/dice/ui` | `SHADCN-CONSOLIDATION-DICE.md` | 大型组件包：只拔基础件依赖，不删除整个目录 |
| `src/components/limeplay/ui` | `SHADCN-CONSOLIDATION-LIMEPLAY.md` | 播放器领域组件 + 普通基础件副本 |
| `src/components/limeplay/blocks/video-player/ui` | `SHADCN-CONSOLIDATION-LIMEPLAY.md` | 局部播放器 toggle，归入 limeplay 报告 |
| `src/components/extend/components/ui` | `SHADCN-CONSOLIDATION-EXTEND.md` | 最复杂增强 shadcn 体系，最后处理 |
| `src/components/sabraman/components/ui` | `SHADCN-CONSOLIDATION-SABRAMAN.md` | 单点 Dialog wrapper |
| `src/components/evilcharts/components/evilcharts/ui` | `SHADCN-CONSOLIDATION-EVILCHARTS.md` | 图表领域深模块，不按 shadcn 副本处理 |

结论：当前扫描到的 UI-like 目录均已有报告或归入对应报告。

## 3. 当前外部 UI import 热点

以下只统计 `src/**/*.ts(x)`，不把 `.mdx` / `llm.txt` 文档文本当运行时代码。

| import 路径 | 命中数 | 归属 | 处理方向 |
|---|---:|---|---|
| `@/components/manifest/components/ui/button` | 27 | manifest | 标准 Button 副本，收主线 |
| `@/components/limeplay/ui/media-provider` | 25 | limeplay | 播放器 runtime，保留领域层 |
| `@/components/extend/components/ui/button` | 16 | extend | 主线先加 `loading`，再迁 |
| `@/components/extend/components/ui/scroll-area` | 15 | extend | Radix 基础件，extend 后段迁 |
| `@/components/limeplay/ui/button` | 14 | limeplay | 普通按钮迁主线，`glass`/播放器按钮留业务层 |
| `@/components/extend/components/ui/input` | 12 | extend | 不吸收双 DOM，必要时只评估主线 `Input size` |
| `@/components/dice/ui/button` | 12 | dice | Dice 深组件内部依赖，分批迁 |
| `@/components/extend/components/ui/tooltip` | 10 | extend | Radix 基础件，后段迁 |
| `@/components/extend/components/ui/select` | 9 | extend | 命名差异大，单独迁 |
| `@/components/extend/components/ui/spinner` | 9 | extend | 可收口到主线 spinner |
| `@/components/extend/components/ui/separator` | 9 | extend | 可收口 |
| `@/components/gooseui/components/ui/button` | 8 | gooseui | 标准 Button 副本，收主线 |
| `@/components/extend/components/ui/pdf-viewer` | 8 | extend | 业务大组件，不进主线基础件 |
| `@/components/extend/components/ui/dropdown-menu` | 8 | extend | Radix 基础件，后段迁 |

这张表说明：高频项不全是“要迁到主线的基础件”。例如 `limeplay/media-provider`、`extend/pdf-viewer` 是领域/业务组件，应保留。

## 4. 运行时代码中的相对 import 补充

当前发现的相对路径外部 UI import：

```txt
src/components/limeplay/stream-panel/content-overview-overlay.tsx -> ../ui/separator
src/components/limeplay/stream-panel/overlay-shell.tsx -> ../ui/button
src/components/limeplay/stream-panel/saved-overlay.tsx -> ../ui/button
src/components/limeplay/stream-panel/saved-overlay.tsx -> ../ui/separator
```

这些已归入 `limeplay` 报告的“stream panel 普通基础件”第一批。

## 5. Base UI 状态

当前没有 `@base-ui/react`、`useRender` 命中。

`mergeProps` 仍有命中，但它们是本地 slot/helper 实现，不是 Base UI 依赖：

```txt
src/components/gooseui/components/animate-ui/primitives/animate/slot.tsx
src/components/dice/_shared/components/slot.tsx
src/primitives/animate/slot.tsx
src/components/dice/listbox/slot.tsx
```

结论：Base UI 作为外部底层依赖已归零；后续迁移重点是外部 shadcn 副本/增强副本收口，而不是 Base UI 到 Radix 的底层迁移。

## 6. 交叉审阅检查点

审阅这些报告时建议按以下顺序看：

1. 先看 `SHADCN-CONSOLIDATION-COVERAGE-AUDIT.md`，确认覆盖面。
2. 再看 `SHADCN-CONSOLIDATION-EXECUTION-PLAN.md`，确认迁移顺序和主线增强策略。
3. 再按库看具体报告。
4. 对每个库只问两个问题：
   - 这是基础件副本，还是领域组件？
   - 如果要增强主线，这个能力是否多库通用？

## 7. 当前未处理事项

本审计文件仍是迁移前准备，不代表可以直接删目录。真正执行前，每批仍要重新跑对应 `rg` 清零命令和 `pnpm typecheck/lint/build`。

## 8. 本次扫描方法的边界

本文件第 1 节的扫描命令按目录名匹配（`*/components/ui`、`*/_shared/ui`、`*/ui`、`*/components/*/ui`），只能发现"外部库自建的 shadcn 基础件副本目录"，不能发现"目录名不叫 ui、但和其他库实现了同一领域能力"的重复。

已确认存在但不叫 `ui` 目录、因此不在本文件覆盖范围内的重复实现：

- **图表**：`bklit/charts`（100+ 文件，独立的 chart-context/chart-config-context/legend/tooltip 体系）、`src/components/tool/chart`，与 `evilcharts/components/evilcharts/ui`、主线 `chart.tsx` 并存，至少四套。
- **Combobox/Autocomplete**：`dice/combobox`（18 个文件）、`extend/components/ui/autocomplete.tsx`，与主线 `combobox.tsx`/`auto-complete.tsx`/`inline-combobox.tsx` 并存，至少三套。

这两项属于"领域能力跨库重叠"，和本文件要审计的"shadcn 基础件副本"不是同一类问题，明确不在本轮收口范围内。处理方式和排期见 `SHADCN-CONSOLIDATION-EXECUTION-PLAN.md` 第 7 节：待本轮全部批次完成后再单独评估。
