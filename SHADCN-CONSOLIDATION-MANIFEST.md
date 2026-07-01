# manifest shadcn 副本收口评估

> 范围：`src/components/manifest/components/ui/*`。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`manifest` 自带 15 个 `components/ui` 文件：

| 文件 | 行数 | 性质 | 主线对应 | 当前状态 |
|---|---:|---|---|---|
| `badge.tsx` | 55 | shadcn Badge 副本，额外 `muted` variant | `src/components/ui/badge.tsx` | 被引用 |
| `button.tsx` | 64 | shadcn Button 副本 | `src/components/ui/button.tsx` | 被引用最多 |
| `card.tsx` | 84 | shadcn Card 副本 | `src/components/ui/card.tsx` | 被引用 |
| `checkbox.tsx` | 38 | 自写 button checkbox，非 Radix Root | `src/components/ui/checkbox.tsx` | 被引用 |
| `dropdown-menu.tsx` | 201 | Radix DropdownMenu 副本 | `src/components/ui/dropdown-menu.tsx` | 被引用 |
| `hover-card.tsx` | 42 | Radix HoverCard 副本 | `src/components/ui/hover-card.tsx` | 未被 manifest 运行时代码引用 |
| `input.tsx` | 27 | shadcn Input 副本 | `src/components/ui/input.tsx` | 被引用 |
| `label.tsx` | 24 | Radix Label 副本 | `src/components/ui/label.tsx` | 被引用 |
| `popover.tsx` | 48 | Radix Popover 副本 | `src/components/ui/popover.tsx` | 被引用 |
| `select.tsx` | 190 | Radix Select 副本 | `src/components/ui/select.tsx` | 被引用 |
| `separator.tsx` | 28 | Radix Separator 副本 | `src/components/ui/separator.tsx` | 被引用 |
| `tabs.tsx` | 55 | Radix Tabs 副本 | `src/components/ui/tabs.tsx` | 未被 manifest 运行时代码引用 |
| `tooltip.tsx` | 61 | Radix Tooltip 副本，`Tooltip` 内部包了一层 Provider | `src/components/ui/tooltip.tsx` | 被引用 |
| `wave-canvas.tsx` | 162 | 业务/视觉组件，canvas wave | 无基础件对应 | 保留 |
| `wavy-background.tsx` | 147 | 业务/视觉组件，canvas background | 无基础件对应 | 保留 |

运行时代码旧路径引用统计：

| 旧基础件 | import 数 | 调用范围 |
|---|---:|---|
| `button` | 27 | events / selection / list / map / blog / form / payment / status 等 |
| `input` | 6 | form / list / payment |
| `card` | 5 | payment / file-uploader |
| `label` | 5 | form / payment |
| `dropdown-menu` | 3 | messaging / social |
| `popover` | 3 | form / list |
| `separator` | 3 | form / payment |
| `checkbox` | 2 | events / map |
| `select` | 2 | form / list |
| `badge` | 1 | payment order summary |
| `tooltip` | 1 | blogging post detail |

非运行时代码/主线 wrapper 命中：

```txt
src/components/ui/manifest-wave-canvas.tsx
src/components/ui/manifest-wavy-background.tsx
```

这两个 wrapper 指向 `wave-canvas` 和 `wavy-background`，属于业务视觉组件导出，不属于本批基础件删除对象。

## 2. 主线能力对照与决策

### 2.1 Button

manifest Button 支持：

```tsx
variant: default | destructive | outline | secondary | ghost | link
size: default | sm | lg | icon
asChild?: boolean
```

manifest 当前真实使用值：

```txt
variant: outline / ghost / secondary / link
size: sm / icon / lg
```

主线 `Button` 已覆盖这些值，并额外有 `xs`、`icon-xs`、`icon-sm`、`icon-lg`。

**决策：直接使用主线 `Button`。**

不需要增强主线。manifest 的主要差异是视觉：`rounded-lg`、`px-4`、`hover:bg-primary/90` 等。收口目标本身就是统一视觉，这些不应保留为主线兼容分支。

注意：manifest 导出了 `ButtonProps` 和 `buttonVariants`，当前 manifest 运行时代码没有引用这些类型/变量。迁移时不需要为它们保留外部出口。

---

### 2.2 Input

manifest Input 是标准 input wrapper，主要差异：

- `rounded-lg`
- `px-3`
- `focus-visible:border-foreground`
- 没有主线的 ring 强化和 dark mode 细节

主线 `Input` 已支持原生 input props、`className`、`aria-invalid`、file input、dark mode。

**决策：直接使用主线 `Input`。**

不需要增强主线。

---

### 2.3 Card

manifest Card 提供：

```tsx
Card
CardHeader
CardTitle
CardDescription
CardContent
CardFooter
```

主线 `Card` 同名导出齐全，并有额外 API：

```tsx
title / description / extra / cover / actions / tabList / loading / hoverable / size / variant / CardMeta / CardGrid
```

manifest 当前只使用 slot 组件和 `className`。

**决策：直接使用主线 `Card`。**

注意：manifest Card 默认 `p-4`，主线默认 spacing 更完整；多数调用点已有自己的 `className`，视觉变化可接受，但 payment card 类页面需要 smoke。

---

### 2.4 Badge

manifest Badge 多了一个：

```tsx
variant="muted"
```

但当前 manifest 运行时代码只用：

```tsx
<Badge variant="secondary" />
```

主线 `Badge` 支持 `secondary`，并且能力更强：`count/dot/status/color/text/BadgeRibbon`。

**决策：直接使用主线 `Badge`。**

**吸收 `muted`（更新）**：与 `SHADCN-CONSOLIDATION-GOOSEUI.md` 交叉对照后发现，gooseui 的 Badge 副本独立提供了 `warning/beta/draft/experimental`，两个互不相关的外部库都在 shadcn 默认 6 个 variant 之外补了"语义状态"能力。这是跨库信号，符合"多个外部库重复实现的通用能力 → 优先增强主线"的判定规则，已在 `SHADCN-CONSOLIDATION-EXECUTION-PLAN.md` 3.2 节设计为主线 Badge 新 variant（`muted`、`warning`）。manifest 当前虽无真实调用 `muted`，但迁移时不再是"放弃吸收"，而是直接对应主线新 variant，无需额外调用点改造。

---

### 2.5 Label

manifest Label 与主线 Label 都是 Radix Label wrapper。

**决策：直接使用主线 `Label`。**

不需要增强主线。

---

### 2.6 Separator

manifest Separator 与主线 Separator 结构一致：

```tsx
orientation = "horizontal"
decorative = true
```

**决策：直接使用主线 `Separator`。**

不需要增强主线。

---

### 2.7 Checkbox

manifest Checkbox 是手写 button：

```tsx
checked?: boolean
onCheckedChange?: (checked: boolean) => void
```

主线 Checkbox 是 Radix Checkbox Root，支持：

```tsx
checked?: boolean | "indeterminate"
onCheckedChange?: (checked: boolean | "indeterminate") => void
```

manifest 当前调用点：

```tsx
<Checkbox
  checked={selected.includes(option)}
  onCheckedChange={() => toggleOption(option)}
  className="h-4 w-4"
/>
```

调用点没有使用回调参数，所以主线 `CheckedState` 的类型扩大不会影响实际逻辑。

**决策：直接使用主线 `Checkbox`。**

不需要增强主线。迁移后会获得 Radix Checkbox 的无障碍和状态属性。

---

### 2.8 Popover

manifest Popover 与主线 Popover 都是 Radix Popover wrapper，导出一致：

```tsx
Popover
PopoverTrigger
PopoverContent
PopoverAnchor
```

manifest 当前调用点使用：

```tsx
<Popover open={...} onOpenChange={...}>
<PopoverTrigger asChild>
<PopoverContent align="start|end" className="...">
```

主线 Popover 支持同名能力，并额外有：

```tsx
PopoverHeader
PopoverTitle
PopoverDescription
```

**决策：直接使用主线 `Popover`。**

不需要增强主线。

---

### 2.9 Select

manifest Select 与主线 Select 都是 Radix Select wrapper，导出基本一致：

```tsx
Select
SelectGroup
SelectValue
SelectTrigger
SelectContent
SelectLabel
SelectItem
SelectSeparator
SelectScrollUpButton
SelectScrollDownButton
```

manifest 当前调用点使用标准 Radix 组合写法，没有 `items` 这类 fake API。

主线 Select 支持同名组合。需要注意视觉差异：主线 `SelectTrigger` padding 更紧，`SelectContent` 默认 `min-w-36`，manifest 是 `min-w-[8rem]`。

**决策：直接使用主线 `Select`。**

不需要增强主线。迁移后重点 smoke list/table filter 与 issue-report-form。

---

### 2.10 DropdownMenu

manifest DropdownMenu 与主线 DropdownMenu 都是 Radix DropdownMenu wrapper，导出基本一致：

```tsx
DropdownMenu
DropdownMenuTrigger
DropdownMenuContent
DropdownMenuItem
DropdownMenuCheckboxItem
DropdownMenuRadioItem
DropdownMenuLabel
DropdownMenuSeparator
DropdownMenuShortcut
DropdownMenuGroup
DropdownMenuPortal
DropdownMenuSub
DropdownMenuSubContent
DropdownMenuSubTrigger
DropdownMenuRadioGroup
```

manifest 当前使用：

```tsx
<DropdownMenuContent align="start|end" className="p-2">
<DropdownMenuItem>
```

主线支持这些能力。

**决策：直接使用主线 `DropdownMenu`。**

不需要增强主线。

---

### 2.11 Tooltip

manifest Tooltip 特点：

```tsx
function Tooltip(props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}
```

也就是说它在 `Tooltip` 内部包了一层 Provider。

实际调用点 `post-detail.tsx` 已经显式包了：

```tsx
<TooltipProvider delayDuration={0}>
  <Tooltip>
    ...
  </Tooltip>
</TooltipProvider>
```

主线 Tooltip 不在 Root 内隐式包 Provider，但调用点已有 Provider，因此可直接替换。

**决策：直接使用主线 `Tooltip`。**

不吸收“Tooltip 内部自动 Provider”。原因：主线已经有显式 `TooltipProvider`，隐式 Provider 会让 Provider 层级不透明。

---

### 2.12 HoverCard / Tabs

manifest 的 `hover-card.tsx` 和 `tabs.tsx` 当前没有 manifest 运行时代码 import。

主线已有：

```txt
src/components/ui/hover-card.tsx
src/components/ui/tabs.tsx
```

**决策：本批可删除 manifest 副本，但删除前必须全仓库 rg。**

不需要迁移调用点。

---

### 2.13 WaveCanvas / WavyBackground

这两个不是 shadcn 基础件副本，而是 manifest 的业务视觉组件。

当前主线 wrapper：

```txt
src/components/ui/manifest-wave-canvas.tsx
src/components/ui/manifest-wavy-background.tsx
```

仍然指向：

```txt
src/components/manifest/components/ui/wave-canvas.tsx
src/components/manifest/components/ui/wavy-background.tsx
```

**决策：保留。**

本轮不迁移、不删除、不改名。后续如果要收口业务组件目录，再单独评估。

## 3. 主线需要增强什么？

本批 `manifest` 评估结论：**除 Badge 语义变体外，暂不需要为了 manifest 单独增强主线基础组件。**

原因：

1. manifest 的 Button/Input/Card/Label/Separator/Popover/Select/DropdownMenu/Tooltip API 都被主线覆盖。
2. Checkbox 从手写 button 替换为主线 Radix Checkbox 是能力增强。
3. Badge 的 `muted` variant 与 gooseui 报告的 Badge 变体属于跨库信号，已促成主线 Badge 增强（见 `SHADCN-CONSOLIDATION-EXECUTION-PLAN.md` 3.2），不再是"放弃吸收"。
4. Tooltip 的隐式 Provider 不应吸收到主线。
5. HoverCard/Tabs 当前无调用点，直接删除副本即可。

本批应放弃吸收：

| 外部能力 | 放弃原因 |
|---|---|
| `Tooltip` 内部自动包 Provider | 主线已有显式 `TooltipProvider`，隐式 Provider 不利于调用方理解层级 |
| manifest Button 的 `rounded-lg` / `px-4` 视觉偏好 | 属于外部视觉风格，不是通用能力 |
| manifest Card 默认 `p-4` spacing | 属于外部视觉风格，主线 Card 已有更完整 API |

## 4. 建议迁移任务拆分

### Task 1：替换基础件 import

把 manifest 运行时代码中的旧 import 替换为主线：

```tsx
@/components/manifest/components/ui/button        -> @/components/ui/button
@/components/manifest/components/ui/input         -> @/components/ui/input
@/components/manifest/components/ui/card          -> @/components/ui/card
@/components/manifest/components/ui/label         -> @/components/ui/label
@/components/manifest/components/ui/badge         -> @/components/ui/badge
@/components/manifest/components/ui/checkbox      -> @/components/ui/checkbox
@/components/manifest/components/ui/separator     -> @/components/ui/separator
@/components/manifest/components/ui/popover       -> @/components/ui/popover
@/components/manifest/components/ui/select        -> @/components/ui/select
@/components/manifest/components/ui/dropdown-menu -> @/components/ui/dropdown-menu
@/components/manifest/components/ui/tooltip       -> @/components/ui/tooltip
```

### Task 2：保留业务视觉组件 wrapper

保持以下文件不动：

```txt
src/components/ui/manifest-wave-canvas.tsx
src/components/ui/manifest-wavy-background.tsx
src/components/manifest/components/ui/wave-canvas.tsx
src/components/manifest/components/ui/wavy-background.tsx
```

### Task 3：删除无运行时引用副本

删除前执行：

```bash
rg "@/components/manifest/components/ui/hover-card" . -g'!node_modules'
rg "@/components/manifest/components/ui/tabs" . -g'!node_modules'
rg "components/manifest/components/ui/hover-card" . -g'!node_modules'
rg "components/manifest/components/ui/tabs" . -g'!node_modules'
```

无命中后可删除：

```txt
src/components/manifest/components/ui/hover-card.tsx
src/components/manifest/components/ui/tabs.tsx
```

### Task 4：删除已收口基础件副本

等运行时代码 import 全部改到主线后，执行：

```bash
rg "@/components/manifest/components/ui/(badge|button|card|checkbox|dropdown-menu|input|label|popover|select|separator|tooltip)" src content
rg "components/manifest/components/ui/(badge|button|card|checkbox|dropdown-menu|input|label|popover|select|separator|tooltip)" . -g'!node_modules'
```

确认只剩 `wave-canvas` / `wavy-background` 后，删除这些基础件副本：

```txt
src/components/manifest/components/ui/badge.tsx
src/components/manifest/components/ui/button.tsx
src/components/manifest/components/ui/card.tsx
src/components/manifest/components/ui/checkbox.tsx
src/components/manifest/components/ui/dropdown-menu.tsx
src/components/manifest/components/ui/input.tsx
src/components/manifest/components/ui/label.tsx
src/components/manifest/components/ui/popover.tsx
src/components/manifest/components/ui/select.tsx
src/components/manifest/components/ui/separator.tsx
src/components/manifest/components/ui/tooltip.tsx
```

## 5. 风险清单

| 风险 | 等级 | 说明 | 处理 |
|---|---|---|---|
| Button 默认 spacing/圆角变化 | 中 | manifest Button 更宽、更圆；主线更紧凑 | smoke 主要 cards / hero / payment CTA |
| Checkbox DOM 从手写 button 变 Radix Root | 中 | 状态 data attr 和内部 indicator 变化 | smoke events filter / map carousel filter |
| Select content 宽度变化 | 中 | main `min-w-36`，manifest `min-w-[8rem]` | smoke list/table filter 和 issue report form |
| Tooltip Provider 层级变化 | 低 | 调用点已有外层 Provider，风险可控 | typecheck + post-detail smoke |
| Badge `muted` variant 不迁移 | 低 | 当前无调用 | 删除前 rg `variant="muted"` |
| HoverCard/Tabs 误删 | 低 | 当前无运行时 import，但要全仓库 rg | 删除前执行 rg |
| WaveCanvas/WavyBackground 被误删 | 高 | 它们是业务视觉组件且主线 wrapper 仍引用 | 明确排除本批删除 |

## 6. 验证命令

实现迁移后建议执行：

```bash
pnpm typecheck
pnpm exec eslint src/components/manifest \
  src/components/ui/manifest-wave-canvas.tsx \
  src/components/ui/manifest-wavy-background.tsx
```

旧路径归零检查：

```bash
rg "@/components/manifest/components/ui/" src content
rg "components/manifest/components/ui/" . -g'!node_modules'
```

预期最终只允许剩下：

```txt
src/components/ui/manifest-wave-canvas.tsx
src/components/ui/manifest-wavy-background.tsx
```

并且它们只引用：

```txt
wave-canvas
wavy-background
```

建议 smoke 范围：

- `manifest/form/contact-form`
- `manifest/form/issue-report-form`
- `manifest/list/table`
- `manifest/events/event-list`
- `manifest/map/map-carousel`
- `manifest/payment/card-form`
- `manifest/payment/order-summary`
- `manifest/blogging/post-detail`
- `manifest/social/instagram-post`
- `manifest/social/youtube-post`

## 7. 本批结论

`manifest` 是适合第二批收口的对象，甚至比 `uselayouts` 更接近标准 shadcn 体系。

最终建议：

1. `Button/Input/Card/Badge/Label/Separator/Popover/Select/DropdownMenu/Tooltip` 直接收口到主线。
2. `Checkbox` 直接换主线 Radix Checkbox，是能力增强。
3. `HoverCard/Tabs` 当前无运行时代码引用，删除前全仓库 rg 后可删。
4. `WaveCanvas/WavyBackground` 是业务视觉组件，保留，不纳入基础件去重。
5. `Badge muted` 已促成主线 Badge 增强（见执行计划 3.2），本批不需要为此单独改调用点。

交叉审阅时重点看三个决策：

1. 是否接受 Button/Card 的 manifest 视觉风格被主线统一。
2. 是否接受主线 Badge 新增 `muted` variant（见执行计划 3.2）。
3. 是否确认 `WaveCanvas/WavyBackground` 留在 manifest 目录，不参与本批基础件删除。
