# dice shadcn 副本收口评估

> 范围：`src/components/dice/ui/*` 以及当前 `src/components/ui/dice-*.tsx` wrapper。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`dice/ui` 有 80 个文件，不能整体视为 shadcn 副本。它混合了：

1. 标准 Radix/shadcn 基础件副本：`button`、`input`、`textarea`、`badge`、`card`、`checkbox`、`slider`、`switch`、`skeleton`、`progress`、`avatar`、`dialog`、`dropdown-menu`、`popover`、`select`、`tabs`、`tooltip`、`scroll-area`、`separator`、`calendar`、`form`、`label`、`button-group` 等。
2. Dice 自己的深组件：`angle-slider`、`color-picker`、`cropper`、`file-upload`、`kanban`、`masonry`、`media-player`、`phone-input`、`rating`、`time-picker`、`tour` 等。
3. 当前主线 wrapper 暴露的 Dice 组件：`dice-avatar-group`、`dice-badge-overflow`、`dice-checkbox`、`dice-progress`、`dice-slider`、`dice-switch`、`dice-textarea` 等。

现有 `src/components/ui/dice-*.tsx` wrapper 共 20 个，其中直接导向 `dice/ui` 的有：

```txt
dice-avatar-group -> dice/ui/avatar-group
dice-badge-overflow -> dice/ui/badge-overflow
dice-checkbox -> dice/ui/checkbox
dice-color-swatch -> dice/ui/color-swatch
dice-fps -> dice/ui/fps
dice-progress -> dice/ui/progress
dice-relative-time-card -> dice/ui/relative-time-card
dice-scroller -> dice/ui/scroller
dice-skeleton -> dice/ui/skeleton
dice-slider -> dice/ui/slider
dice-sonner -> dice/ui/sonner
dice-switch -> dice/ui/switch
dice-textarea -> dice/ui/textarea
```

## 2. 旧基础件引用分布

`dice/ui` 内部仍直接依赖本目录基础件副本：

| 旧基础件 | import 数 | 主要调用者 |
|---|---:|---|
| `button` | 12 | `media-player`、`tour`、`alert-dialog`、`banner`、`input-group`、`action-bar`、`speed-dial`、`calendar`、`key-value`、`dialog`、`color-picker`、`selection-toolbar` |
| `input` | 5 | `segmented-input`、`input-group`、`key-value`、`phone-input`、`color-picker` |
| `popover` | 4 | `time-picker`、`phone-input`、`color-picker`、`faceted` |
| `textarea` | 3 | `input-group`、`key-value`、`dice-textarea` wrapper |
| `badge` | 2 | `media-player`、`faceted` |
| `command` | 2 | `phone-input`、`faceted` |
| `dialog` | 2 | `responsive-dialog`、`command` |
| `separator` | 2 | `button-group`、`stat` |
| `dropdown-menu` | 1 | `media-player` |
| `hover-card` | 1 | `relative-time-card` |
| `label` | 1 | `form` |
| `select` | 1 | `color-picker` |
| `tooltip` | 1 | `media-player` |

## 3. 主线对照与收口判断

### 3.1 可直接对齐主线的基础件

这些文件与主线能力高度重叠，差异主要是视觉 class 或局部默认尺寸：

```txt
button
input
textarea
badge
card
checkbox
slider
switch
skeleton
progress
avatar
alert-dialog
alert
dialog
drawer
dropdown-menu
hover-card
popover
select
tabs
tooltip
scroll-area
separator
calendar
form
label
button-group
command
collapsible
radio-group
table
```

主线已有对应文件，且主线能力通常更深。例如：

- 主线 `Button` 已覆盖 `default/outline/secondary/ghost/destructive/link` 和 `xs/sm/lg/icon/icon-sm` 等尺寸。
- 主线 `Badge` 已额外支持 `count/dot/status/color/text/BadgeRibbon`。
- 主线 `Card` 已支持 API-first 的 `title/description/extra/actions/tabList/loading`。
- 主线 `Slider` 比 Dice 基础 slider 更完整，已有 range、marks、dots、tooltip、vertical。
- 主线 `Calendar`、`Select`、`Command` 已是项目维护的主线版本。

**决策：这些基础件副本不应长期保留。**

但不建议一次性替换 30 多个文件。Dice 的复杂组件大量依赖这些基础件，应该分批推进。

### 3.2 不应收进主线基础件的 Dice 深组件

以下是 Dice 的核心价值，不是 shadcn 基础件副本：

```txt
action-bar
angle-slider
avatar-group
badge-overflow
banner
checkbox-group
circular-progress
color-picker
color-swatch
combobox
compare-slider
cropper
editable
faceted
file-upload
fps
gauge
kanban
key-value
listbox
marquee
mask-input
masonry
media-player
mention
phone-input
qr-code
rating
relative-time-card
responsive-dialog
scroll-spy
scroller
segmented-input
selection-toolbar
sortable
speed-dial
stack
stat
status
stepper
swap
tags-input
time-picker
timeline
tour
```

这些应保留为 Dice 业务/复合组件。它们可以内部使用主线基础件，但不应被“吸收”为主线基础组件。

## 4. 主线需要增强什么

本批不建议先增强主线。

Dice 基础件没有明显“多库通用而主线缺失”的能力：

| Dice 能力 | 是否吸收 | 理由 |
|---|---|---|
| Button 默认更小高度 | 否 | 视觉差异，不是能力缺口 |
| Dice Slider 极简 range | 否 | 主线 Slider 已更完整 |
| Dice Progress 极简实现 | 否 | 主线 Progress 已覆盖 |
| Dice Switch 极简实现 | 否 | 主线 Switch 已覆盖 |
| Dice Textarea/Input padding 差异 | 否 | 视觉差异，不吸收 |
| Dice Form shadcn 模板 | 否 | 主线已有 `form-field.tsx`，需按主线命名对齐 |

真正要做的是减少 Dice 内部对本地基础件副本的依赖，而不是扩大主线 Interface。

## 5. 建议迁移分批

### 第一批：wrapper 级低风险替换

把这些 `src/components/ui/dice-*.tsx` wrapper 先改为主线导出或主线等价能力：

```txt
dice-checkbox -> @/components/ui/checkbox
dice-progress -> @/components/ui/progress
dice-skeleton -> @/components/ui/skeleton
dice-slider -> @/components/ui/slider
dice-switch -> @/components/ui/switch
dice-textarea -> @/components/ui/textarea
```

注意：这一步会让 `content/components/dice/*` 的示例视觉变成主线风格。若希望 Dice 文档继续展示 Dice 风格，则不要做 wrapper 替换，而只做内部依赖收口。

### 第二批：内部基础件 import 替换

优先替换被多处引用且主线接口兼容的：

```txt
@/components/dice/ui/button -> @/components/ui/button
@/components/dice/ui/input -> @/components/ui/input
@/components/dice/ui/textarea -> @/components/ui/textarea
@/components/dice/ui/badge -> @/components/ui/badge
@/components/dice/ui/separator -> @/components/ui/separator
@/components/dice/ui/popover -> @/components/ui/popover
@/components/dice/ui/tooltip -> @/components/ui/tooltip
```

这批会影响 `media-player`、`color-picker`、`phone-input`、`faceted`、`calendar` 等复杂组件，必须配合 smoke。

### 第三批：Radix 组合件替换

再处理：

```txt
dialog / alert-dialog / dropdown-menu / select / command / calendar / form / hover-card / drawer / tabs / scroll-area
```

这些更容易出现结构和导出名差异，不建议和第一批混在一起。

## 6. 不建议做的事

1. 不要把 `angle-slider`、`color-picker`、`media-player`、`tour` 这类 Dice 深组件拆进主线基础件。
2. 不要为了 Dice 的历史样式给主线 Button/Input 添加 Dice 专属 variant。
3. 不要同时删除 `dice/ui` 目录；其中大量文件是 Dice 组件本体。
4. 不要把 `dice-*` gallery wrapper 当作外部旧 import 一刀切删除；它们是当前文档公开入口，需要按文档是否保留 Dice 展示来决策。

## 7. 删除旧副本前检查命令

```bash
rg -n "@/components/dice/ui/(button|input|textarea|badge|card|checkbox|slider|switch|skeleton|progress|separator|popover|tooltip)" src content
rg -n "@/components/dice/ui/(dialog|alert-dialog|dropdown-menu|select|command|calendar|form|hover-card|drawer|tabs|scroll-area)" src content
pnpm typecheck
pnpm lint
pnpm build
```

## 8. 本批结论

Dice 有大量可收口的 shadcn 基础件副本，但它也是 80 个文件的大型组件包。建议不要按“删除 dice/ui”理解，而是按“保留 Dice 深组件，逐步拔掉 Dice 深组件内部的基础件副本依赖”推进。

交叉审阅重点：是否保留 `content/components/dice/*` 作为独立 Dice 展示。如果保留，`dice-*` wrapper 可以继续存在；如果不保留，则第一批可以直接让重复基础件 wrapper 指向主线组件。
