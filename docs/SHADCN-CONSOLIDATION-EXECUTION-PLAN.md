# 外部 shadcn 副本收口总执行计划

> 范围：`SHADCN-CONSOLIDATION-*.md` 所覆盖的外部库。此文件是迁移前总计划，不直接修改运行时代码。

## 1. 总目标

把外部库里重复引入的 shadcn 基础件逐步收口到主线基础组件：

```txt
@/components/ui/*
src/components/ui/*
```

主线不是“最低公共分母”。迁移过程中允许增强主线，但增强必须满足：

1. 多库通用，而不是单个外部库的历史视觉偏好。
2. 不制造长期兼容层。
3. 不把业务领域组件塞进基础件。
4. 不改变主线组件的核心 DOM Interface，除非收益明确且调用面已评估。

## 2. 已覆盖报告

覆盖面入口：

| 报告 | 结论 |
|---|---|
| `SHADCN-CONSOLIDATION-COVERAGE-AUDIT.md` | 当前扫描到的 UI-like 目录均已有报告或归入对应报告；`mergeProps` 残留是本地 helper，不是 Base UI 依赖 |

分库报告：

| 报告 | 结论 |
|---|---|
| `SHADCN-CONSOLIDATION-USELAYOUTS.md` | 最小闭环；9 个 `_shared/ui` 基础件可收口，fake `Select/Popover` 需要改调用点，不增强主线 |
| `SHADCN-CONSOLIDATION-MANIFEST.md` | 标准 shadcn 副本较多；`WaveCanvas/WavyBackground` 保留业务层；`Badge muted` 与 gooseui 的 Badge 变体信号共同促成主线 Badge 增强（见 3.2） |
| `SHADCN-CONSOLIDATION-GOOSEUI.md` | 只收口 `button/card/input/label/textarea` 等基础件；动画、主题、toast、squircle 保留 gooseui；`Badge warning` 与 manifest 的 Badge 变体信号共同促成主线 Badge 增强（见 3.2） |
| `SHADCN-CONSOLIDATION-DICE.md` | 大型组件包；不能删除 `dice/ui`，只逐步拔掉内部基础件依赖 |
| `SHADCN-CONSOLIDATION-LIMEPLAY.md` | 播放器领域组件保留；普通 overlay/form 基础件可收口；`glass` 不进主线 Button |
| `SHADCN-CONSOLIDATION-EXTEND.md` | 最复杂；先吸收 `Button loading`，Dialog/Sheet/Sidebar 最后处理 |
| `SHADCN-CONSOLIDATION-SABRAMAN.md` | 只剩局部 Dialog wrapper；可收主线，不增强主线 |
| `SHADCN-CONSOLIDATION-EVILCHARTS.md` | 不是普通 shadcn 副本；保留为图表领域深模块 |

## 3. 主线增强总决策

### 3.1 第一优先级：Button loading

**建议吸收。**

来源：`extend/components/ui/button.tsx`。

理由：

- `loading` 是按钮通用交互状态，不是 extend 视觉专属。
- 能减少业务组件各自塞 spinner/disabled 的重复逻辑。
- 对 manifest/gooseui/dice/limeplay 后续迁移也有收益。

建议主线 Interface：

```tsx
loading?: boolean
```

行为建议：

- `loading` 时设置 `disabled` 或 `aria-disabled`，避免重复提交。
- 非 `asChild` 时内部渲染 spinner。
- `asChild` 时不强行注入复杂 DOM；最多给 `data-loading` / `aria-disabled`，避免破坏 child 结构。
- 不引入 extend 的 `data-loading:text-transparent` 视觉作为唯一方案；主线可以采用更克制的 spinner + disabled 表达。

### 3.2 第二优先级：Badge 语义变体（muted / warning）

**建议吸收。**

来源：`manifest/components/ui/badge.tsx` 的 `muted`，`gooseui/components/ui/badge.tsx` 的 `warning/beta/draft/experimental`。

跨库信号：manifest 和 gooseui 是两个互不相关的外部库，各自独立在 shadcn 默认的 6 个 Badge variant（`default/secondary/destructive/outline/ghost/link`）之外，补了一层"语义状态"能力。两个来源相互独立却指向同一缺口，符合本计划判定规则第一条"多个外部库重复实现的通用能力 → 优先增强主线"，属于跨库分析才能发现的信号——逐库单独评估时会各自因为"当前无真实调用"而被放弃。

决策：

- **吸收 `muted`**：直接复用 manifest 实现 `bg-muted text-muted-foreground`，作为比 `secondary` 更低强调级别的中性 Badge。
- **吸收 `warning`**：复用 gooseui 的 amber 色值，并与主线 Badge 已有的 `status="warning"` 点状态指示器（`badge.tsx` 内 `statusClasses.warning = bg-yellow-500`）对齐同一色彩语义，不另起一套颜色体系。
- **不吸收 `beta`/`draft`/`experimental` 作为独立 variant 枚举**。原因：这三者在 gooseui 源码里是同一视觉公式（`outline` 边框 + 10% 透明背景 + 同色文字 + `uppercase` 小号加粗），只是换了颜色，本质是一种可组合的"预览态标签样式"，不是三个独立能力。用 `variant="outline"` + `className` 已经能表达（例：`<Badge variant="outline" className="border-orange-500 bg-orange-500/10 text-orange-500 uppercase tracking-wider text-[10px] font-semibold">Draft</Badge>`），不需要为每个具体标签词新增专属枚举值，避免 Badge variant 枚举无限膨胀。

建议主线 `src/components/ui/badge-variants.ts` 的 `badgeVariants` 新增：

```ts
muted: "border-transparent bg-muted text-muted-foreground [a]:hover:bg-muted/80",
warning: "border-amber-500 bg-transparent text-amber-500 dark:border-amber-400 dark:text-amber-400 [a]:hover:bg-amber-500/10",
```

行为：只扩展纯 `variant` 分支，不影响 `count/dot/status/color/text` 等 antd 化的另一套 Badge 能力。

影响批次：批次 2（manifest）、批次 4（gooseui）迁移 Badge 时，`muted`/`warning` 不再是"放弃吸收"，而是"改调用点使用主线新 variant"；`beta/draft/experimental` 仍按"组合表达"处理，不迁移为专属枚举。当前两个来源都还没有真实调用点，本次只是把 API 设计进主线，具体页面接入仍要等真实业务场景出现再做，不倒推着造调用方。

### 3.3 第三优先级：Input size / Select size

**候选，但不作为第一批前置。**

主线已经有不少组件做过增强，且命名和外部库不完全一致。这里应该优先改调用点对齐主线，而不是复制外部命名。

| 能力 | 决策 |
|---|---|
| `Input size="sm/default/lg"` | 可候选，但必须保持单 `<input>` DOM，不引入 extend 的外层 `span[data-slot=input-control]` |
| `SelectTrigger size="lg"` | 可候选；当前主线已有 `sm/default`，如果 extend/limeplay 迁移中真实受阻再加 |

### 3.4 明确不吸收

| 外部能力 | 不吸收原因 |
|---|---|
| `render` prop 体系 | 与主线 Radix `asChild` 风格重复，扩大 Interface |
| `Button variant="glass"` | limeplay 播放器领域视觉语义 |
| `Button squircle` | gooseui 主题/视觉能力，已有专门组件承载 |
| `Button destructive-outline` | extend 单库视觉语义，未证明多库复用 |
| `Button xl/icon-xl` | 先用调用点 className 或业务按钮处理，不作为第一批主线尺寸 |
| `Input nativeInput/unstyled` | 外部历史结构，会改变主线 DOM Interface |
| `DialogViewport/DialogPopup/bottomStickOnMobile` | extend 结构语义，属于复杂业务/布局层 |
| EvilCharts `ChartConfig.colors` | 图表领域 Interface，不能混入 shadcn 基础件收口 |

## 4. 执行批次

### 批次 0：主线 Button loading + Badge 语义变体增强

**目标：** 先增强主线最通用能力，避免后续迁移每个库都局部处理 loading / 语义 Badge。

**改动范围：**

```txt
src/components/ui/button.tsx
src/components/ui/badge-variants.ts
```

如主线 spinner 能直接用：

```txt
src/components/ui/spinner.tsx
```

**Badge 部分改动内容**（见 3.2）：`badgeVariants` 新增 `muted`、`warning` 两个 variant；不新增 `beta/draft/experimental` 专属枚举。

**完成标准：**

```bash
rg -n "loading=" src/components/extend src/components/limeplay src/components/dice src/components/manifest src/components/gooseui src/components/uselayouts
rg -n "variant=\"muted\"|variant=\"warning\"" src/components/manifest src/components/gooseui
pnpm typecheck
pnpm lint
pnpm build
```

这一步不要求清零外部 import，只保证主线 Button / Badge 具备后续迁移所需能力。Badge 的 `muted`/`warning` 目前没有真实调用点，本批只落地 API，不倒推造调用方。

---

### 批次 1：uselayouts 最小闭环

**目标：** 用最小库验证迁移方法。

**处理：**

- `button/input/textarea/card/badge` 直接改到 `@/components/ui/*`。
- `field` 改到 `@/components/ui/form-field`。
- `calendar` 从 placeholder 换主线真实 Calendar。
- `select/popover` 不能只换 import：`select` 是 fake API，要改 `multi-step-form.tsx` 调用结构。

**不做：**

- 不给主线 Select 增加 `items` fake API。
- 不保留 `_shared/ui` 兼容层。

**清零目标：**

```bash
rg -n "@/components/uselayouts/_shared/ui|\.\/_shared/ui|\.\./_shared/ui" src content
```

---

### 批次 2：manifest 标准副本收口

**目标：** 收口标准 shadcn 副本，保留 wave 业务视觉组件。

**处理：**

```txt
button input card badge label separator checkbox popover select dropdown-menu tooltip
```

**保留：**

```txt
wave-canvas
wavy-background
src/components/ui/manifest-wave-canvas.tsx
src/components/ui/manifest-wavy-background.tsx
```

**Badge 特别说明：** `manifest/components/ui/badge.tsx` 当前无真实调用，不需要改调用点；`variant="muted"` 已在批次 0 收口为主线新 variant（见 3.2），删除 manifest 副本前不需要额外迁移动作。

**不做：**

- 不保留 manifest 的 button/card 视觉差异。

**清零目标：**

```bash
rg -n "@/components/manifest/components/ui/(badge|button|card|checkbox|dropdown-menu|hover-card|input|label|popover|select|separator|tabs|tooltip)" src content
```

---

### 批次 3：sabraman 单点 Dialog

**目标：** 快速清掉一个孤立局部 Dialog wrapper。

**处理：**

- `legacy-alert-dialog.tsx` 改用主线 `@/components/ui/dialog`。
- 保留所有 legacy 视觉面板和按钮。
- 如遮罩变浅，只在 legacy 组件局部补 className，不改主线 Dialog 默认值。

**清零目标：**

```bash
rg -n "@/components/sabraman/components/ui/dialog" src content
```

---

### 批次 4：gooseui 基础件收口

**目标：** 收口 gooseui 中少量标准基础件。

**处理：**

```txt
button card input label textarea
```

`custom-toast` 保留，但内部 `Button` 可以改主线。

**保留：**

```txt
checkbox slider custom-toast theme-toggle theme-customizer corner-shape morphing-dialog scroll-* svg-drawable ...
```

**Badge 特别说明：** `gooseui/components/ui/badge.tsx` 当前无真实调用。`warning` 已在批次 0 收口为主线新 variant（见 3.2）；`beta/draft/experimental` 不新增专属枚举，改用 `variant="outline"` + `className` 组合表达。删除 gooseui 副本前不需要额外迁移动作。

**不做：**

- 不吸收 `squircle`。
- 不吸收 gooseui Button hover scale。
- 不吸收 gooseui Checkbox/Slider 动效 API。

**清零目标：**

```bash
rg -n "@/components/gooseui/components/ui/(button|card|input|label|textarea)" src content
```

---

### 批次 5：limeplay 普通 overlay/form 基础件

**目标：** 先处理非播放器核心的普通基础件。

**优先处理：**

```txt
stream-panel/custom-overlay.tsx
stream-panel/saved-overlay.tsx
stream-panel/content-overview-overlay.tsx
stream-panel/overlay-shell.tsx
```

**可收口基础件：**

```txt
input textarea separator popover select tabs toggle toggle-group dropdown-menu tooltip skeleton sheet card badge breadcrumb collapsible label
```

**保留：**

```txt
media-provider media root-container player-layout playback-control timeline-control volume-control captions mute-control picture-in-picture-control seek-controls
```

**不做：**

- 不把 `variant="glass"` 加进主线 Button。
- 不把播放器局部 `blocks/*/components/button.tsx` 当作普通 Button 删除。

**清零目标：**

```bash
rg -n "@/components/limeplay/ui/(input|textarea|separator|popover|select|tabs|toggle|toggle-group|dropdown-menu|tooltip|skeleton|sheet|card|badge|breadcrumb|collapsible|label)" src content
```

---

### 批次 6：dice 低风险基础件收口

**目标：** 不删除 Dice 深组件，只减少内部基础件副本依赖。

**先处理低风险：**

```txt
checkbox progress skeleton slider switch textarea input badge separator popover tooltip
```

**再处理中高风险：**

```txt
button card dropdown-menu select command dialog alert-dialog calendar form hover-card drawer tabs scroll-area
```

**保留：**

```txt
color-picker cropper media-player tour time-picker kanban phone-input angle-slider 等 Dice 深组件
```

**关键决策：**

`src/components/ui/dice-*.tsx` wrapper 是否改成主线，取决于是否还要保留 Dice 文档作为独立风格展示。默认先不改 wrapper，只改 Dice 深组件内部依赖。

**清零目标：**

```bash
rg -n "@/components/dice/ui/(button|input|textarea|badge|card|checkbox|slider|switch|skeleton|progress|separator|popover|tooltip)" src content
```

---

### 批次 7：extend 简单基础件

**目标：** 在主线 Button loading 稳定后，收口 extend 简单基础件。

**先处理：**

```txt
button input separator skeleton kbd spinner badge breadcrumb card accordion alert aspect-ratio collapsible command dropdown-menu popover scroll-area tabs toggle tooltip
```

**注意：**

- `Input` 先不引入 extend 双 DOM 结构。
- `Badge/Card/Breadcrumb/Group` 的 `render` prop 不进主线，改调用点或局部保留。
- `Select` 单独一批，因为 `SelectButton/SelectPopup` 命名差异明显。

**清零目标：**

```bash
rg -n "@/components/extend/components/ui/(button|input|separator|skeleton|kbd|spinner|badge|breadcrumb|card|accordion|alert|aspect-ratio|collapsible|command|dropdown-menu|popover|scroll-area|tabs|toggle|tooltip)" src content
```

---

### 批次 8：extend Select / Dialog / Sheet / Sidebar / 大组件内部依赖

**目标：** 最后处理最深依赖，避免前面批次返工。

**顺序：**

1. `select`：`SelectPopup -> SelectContent`，`SelectButton -> SelectTrigger` 或局部 Button 组合。
2. `dialog` / `sheet`：评估 `DialogViewport/DialogPopup/DialogPanel` 与主线结构差异。
3. `sidebar`：等 sheet/button/input/scroll-area/separator/skeleton/tooltip 稳定后再碰。
4. 文档/文件大组件内部依赖：`pdf-viewer/docx-viewer/docx-editor/xlsx-viewer/xlsx-editor/file-system/schema-builder/csv-viewer/...`。

**清零目标：**

```bash
rg -n "@/components/extend/components/ui/(select|dialog|sheet|sidebar)" src content
rg -n "@/components/extend/components/ui" src/components/extend content/components/extend
```

---

### 批次 9：evilcharts 保留，不进入基础件收口

**目标：** 明确边界，避免误删。

**处理：**

- 当前不迁移。
- 当前不合并到主线 `chart.tsx`。
- 若后续要增强主线 Chart，单独开 Chart 专题报告。

**范围提示：** 图表领域目前不止 evilcharts 一家（`bklit/charts` 有 100+ 文件的独立图表体系，`src/components/tool/chart` 也是一套），combobox/autocomplete 也有主线、`dice/combobox`、`extend/.../autocomplete` 三套并行实现。这些是 shadcn 基础件收口之外的另一类问题（领域能力重叠，而非基础件副本），本轮 9 个批次明确不处理，待本轮全部收口完成后再单独评估，见第 7 节。

## 5. 全局验证门禁

每个批次至少运行：

```bash
pnpm typecheck
pnpm lint
pnpm build
```

如果某批只改 MD 报告，可不跑构建；一旦改 TS/TSX，必须跑。

每个库迁移完成后还要跑对应 `rg` 清零目标。标准是：

1. 旧基础件 import 清零。
2. 主线 wrapper 仍保留的业务组件不误删。
3. `src/components/ui/<library>-*.tsx` 公开文档入口按需保留。
4. 不出现新兼容层路径。

## 6. 整体建议

建议从 `批次 0 + 批次 1` 开始，但在真正改代码前先确认三件事：

1. 是否接受主线 `Button` 增加 `loading`。
2. 是否接受 Dice / EvilCharts / Limeplay 这类领域组件继续保留独立深模块，只收口其普通基础件依赖。
3. 是否接受主线 `Badge` 新增 `muted`/`warning` variant，且不为 `beta`/`draft`/`experimental` 新增专属枚举（见 3.2）。

如果这三个方向确认，后续迁移会比较稳定；如果一开始就追求“所有目录都删干净”，会把 chart/player/document/editor 这类领域能力误伤成基础件问题。

## 7. 本轮明确不处理的范围（留待下一阶段评估）

本计划的边界是"外部库自带的 shadcn 基础件副本收口"，不包含"领域能力跨库整合"。以下问题已确认存在，但明确排除在本轮 9 个批次之外，等本轮全部完成后再单独立项评估，不在当前计划里展开设计：

1. **图表领域重复实现**：主线 `chart.tsx`、`evilcharts` 深模块、`bklit/charts`（100+ 文件，独立的 chart-context/legend/tooltip 体系）、`tool/chart` 至少四套并行的图表能力。
2. **Combobox/Autocomplete 领域重复实现**：主线 `combobox.tsx`/`auto-complete.tsx`/`inline-combobox.tsx`、`dice/combobox`（18 个文件）、`extend/components/ui/autocomplete.tsx` 三套并行实现。

这两项都属于"多个独立实现同一领域能力"，性质上和本计划要解决的"shadcn 基础件副本"不是一回事，处理成本和风险也更高，不应该和当前 9 批混在一起执行。
