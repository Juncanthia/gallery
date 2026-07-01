# evilcharts ui 副本收口评估

> 范围：`src/components/evilcharts/components/evilcharts/ui/*` 及其 re-export。该目录名叫 `ui`，但不是普通 shadcn 基础件副本。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`evilcharts/components/evilcharts/ui` 有 6 个文件：

| 文件 | 行数 | 性质 | 主线对应 | 当前判断 |
|---|---:|---|---|---|
| `chart.tsx` | 261 | EvilCharts 的 ChartContainer/ChartConfig 深模块 | `src/components/ui/chart.tsx` | 不直接替换；可中长期反向吸收能力 |
| `tooltip.tsx` | 193 | Recharts Tooltip 内容增强 | `src/components/ui/chart.tsx` 的 `ChartTooltipContent` | 保留 evilcharts 领域组件 |
| `legend.tsx` | 204 | Recharts Legend 内容增强 | `src/components/ui/chart.tsx` 的 `ChartLegendContent` | 保留 evilcharts 领域组件 |
| `background.tsx` | 229 | SVG pattern 背景库 | 无普通基础件对应 | 保留 evilcharts 领域组件 |
| `dot.tsx` | 175 | Recharts dot 渐变/描边渲染器 | 无普通基础件对应 | 保留 evilcharts 领域组件 |
| `evil-brush.tsx` | 687 | motion + Recharts 自定义 brush | 无普通基础件对应 | 保留 evilcharts 领域组件 |

这些文件通过浅层 re-export 暴露：

```txt
src/components/evilcharts/components/chart.ts
src/components/evilcharts/components/tooltip.ts
src/components/evilcharts/components/legend.ts
src/components/evilcharts/components/background.ts
src/components/evilcharts/components/dot.ts
src/components/evilcharts/components/evil-brush.ts
```

同时 `src/components/evilcharts/index.ts` 和 `src/components/ui/evilcharts-*.tsx` wrapper 是当前 gallery 公开入口，不能当作基础件副本直接删除。

## 2. 为什么不能按普通 shadcn 副本处理

主线 `src/components/ui/chart.tsx` 是标准 shadcn/Recharts chart helper，Interface 大致是：

```tsx
ChartConfig = Record<string, { label?: React.ReactNode; icon?: React.ComponentType } & ({ color?: string } | { theme: ... })>
ChartContainer
ChartTooltip
ChartTooltipContent
ChartLegend
ChartLegendContent
```

EvilCharts 的 `ChartConfig` 已经偏离主线：

```tsx
colors?: {
  light?: string[]
  dark?: string[]
}
```

它支持一组颜色分布到多个 series/segment，并且 `getColorsCount`、`getPayloadConfigFromPayload`、`ChartStyle` 都围绕这个多颜色模型服务。

此外，EvilCharts 的 `tooltip/legend/dot/background/brush` 都依赖这个 chart context 和 CSS var 体系。直接替换为主线 `chart.tsx` 会丢失：

- 多主题多颜色数组 `colors.light/colors.dark`。
- Tooltip `roundness`、`frosted-glass`、`selected` 淡化。
- Legend `square/circle/outline/bar` 多种指示器。
- ChartDot 渐变点、描边点。
- ChartBackground 多种 pattern。
- EvilBrush 受控/非受控范围选择、motion handle、mini chart。

这些不是普通 UI 基础件能力，而是 EvilCharts 的图表领域能力。

## 3. 主线可以吸收什么

短期不建议改主线。中长期可单独开“Chart 能力增强”议题，反向吸收其中明确通用的部分：

| EvilCharts 能力 | 是否现在吸收 | 理由 |
|---|---|---|
| `ChartConfig.colors` 多色数组 | 否 | 会改变主线 ChartConfig Interface，影响现有文档和示例 |
| `ChartContainer footer` | 候选 | 可用于 brush/footer，但需要先确认主线 chart 用户是否需要 |
| `LoadingIndicator/getLoadingData` | 候选 | 图表 loading 是通用能力，但应按主线 API 重新设计 |
| Tooltip `roundness/variant` | 否 | 视觉选项，不宜先扩大 Interface |
| Legend 多 indicator 形状 | 候选 | 有复用价值，但应作为 chart 专题增强，不混入 shadcn 收口批次 |
| `EvilBrush` | 否 | 深领域组件，保留在 evilcharts |
| SVG `ChartBackground` | 否 | 图表主题能力，保留在 evilcharts |

## 4. 建议迁移方式

`evilcharts` 不进入“基础件 import 替换”执行批。正确处理是：

1. 保留 `src/components/evilcharts/components/evilcharts/ui/*`。
2. 保留 `src/components/evilcharts/components/*.ts` re-export，作为 EvilCharts 内部 seam。
3. 保留 `src/components/ui/evilcharts-*.tsx` wrapper，作为 gallery 文档公开 seam。
4. 不尝试把 EvilCharts 的 `ChartConfig` 合并到主线 `ChartConfig`。
5. 后续若要增强主线 Chart，应单独设计一份 `SHADCN-CHART-ENHANCEMENT.md`，不要和 shadcn 副本删除混在一起。

## 5. 删除/清理前检查命令

当前不建议删除。若未来要重构，至少先检查：

```bash
rg -n "@/components/evilcharts/components/(chart|tooltip|legend|background|dot|evil-brush)" src content
rg -n "ChartConfig|ChartContainer|ChartTooltipContent|ChartLegendContent|EvilBrush|ChartBackground|ChartDot" src/components/evilcharts content/components/evilcharts
pnpm typecheck
pnpm lint
pnpm build
```

## 6. 本批结论

`evilcharts` 的 `ui` 目录是图表深模块内部实现，不是需要收口的 shadcn 基础件副本。它可以作为“保留领域组件”的典型案例：主线不吸收它的领域 Interface，后续只在 chart 专题中挑选通用能力重新设计。
