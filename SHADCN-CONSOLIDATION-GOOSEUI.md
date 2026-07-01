# gooseui shadcn 副本收口评估

> 范围：`src/components/gooseui/components/ui/*`。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`gooseui/components/ui` 不是纯 shadcn 副本目录，而是混放了三类东西：

1. 少量标准 shadcn 基础件副本：`button`、`card`、`input`、`label`、`textarea`、`badge`。
2. gooseui 自己的业务/视觉组件：主题、动画、滚动、toast、slider、checkbox 等。
3. 当前没有运行时入口的遗留实现：`carousel`、`github-stars`、`search-panel`、`sonner`、`typography`、`ui/glitch-text` 等。

总文件数：36 个。

| 文件 | 行数 | 性质 | 主线对应 | 当前判断 |
|---|---:|---|---|---|
| `button.tsx` | 66 | shadcn Button 副本，额外 `squircle` | `src/components/ui/button.tsx` | 可收口主线 |
| `card.tsx` | 109 | shadcn Card 副本，额外 `squircle` | `src/components/ui/card.tsx` | 可收口主线 |
| `input.tsx` | 21 | shadcn Input 副本 | `src/components/ui/input.tsx` | 可收口主线 |
| `label.tsx` | 18 | 裸 `<label>` wrapper | `src/components/ui/label.tsx` | 可收口主线 |
| `textarea.tsx` | 18 | shadcn Textarea 副本 | `src/components/ui/textarea.tsx` | 可收口主线 |
| `badge.tsx` | 53 | shadcn Badge 副本，额外状态 variant | `src/components/ui/badge.tsx` | 当前无引用，后续可删，不增强主线 |
| `checkbox.tsx` | 79 | SVG path 动画复选框 | `src/components/ui/checkbox.tsx` / `gooseui-checkbox` | 保留 gooseui 业务组件 |
| `slider.tsx` | 234 | 原生 range + SlidingNumber | `src/components/ui/slider.tsx` / `gooseui-slider` | 保留 gooseui 业务组件 |
| `custom-toast.tsx` | 122 | sonner 自定义 toast 内容 | `gooseui-custom-toast` | 保留，但内部 Button 可收主线 |
| `theme-toggle.tsx` | 148 | motion 主题切换按钮 | `gooseui-theme-toggle` | 保留业务组件 |
| `theme-customizer.tsx` | 476 | 主题色/模式组合控件 | `gooseui-theme-customizer` | 保留业务组件 |
| `adaptive-grid.tsx` | 97 | 自适应布局视觉组件 | `gooseui-adaptive-grid` | 保留业务组件 |
| `anchor-tooltip.tsx` | 208 | 锚点 tooltip 视觉组件 | `gooseui-anchor-tooltip` | 保留业务组件 |
| `animated-timer.tsx` | 158 | 动画计时器 | `gooseui-animated-timer` | 保留业务组件 |
| `balanced-text.tsx` | 104 | 文本排版组件 | `gooseui-balanced-text` | 保留业务组件 |
| `baseline-status.tsx` | 400 | browser baseline 状态组件 | `gooseui-baseline-status` | 保留业务组件 |
| `corner-shape.tsx` | 266 | squircle / superellipse 组件 | `gooseui-corner-shape` | 保留业务组件 |
| `css-theme-switcher.tsx` | 151 | CSS theme switcher | `gooseui-css-theme-switcher` | 保留业务组件 |
| `curved-text.tsx` | 180 | 曲线文字 | `gooseui-curved-text` | 保留业务组件 |
| `digital-clock.tsx` | 229 | 数字时钟 | `gooseui-digital-clock` | 保留业务组件 |
| `morphing-dialog.tsx` | 394 | motion morph dialog | `gooseui-morphing-dialog` | 保留业务组件 |
| `morphing-header.tsx` | 159 | morphing header | `gooseui-morphing-header` | 保留业务组件 |
| `promo-banner.tsx` | 369 | promo banner | `gooseui-promo-banner` | 保留业务组件 |
| `scroll-container.tsx` | 169 | scroll container | `gooseui-scroll-container` | 保留业务组件 |
| `scroll-progress.tsx` | 52 | scroll progress | `gooseui-scroll-progress` | 保留业务组件 |
| `scroll-to-top.tsx` | 428 | scroll-to-top 组件族 + hook | `gooseui-scroll-to-top` | 保留业务组件 |
| `sliding-number.tsx` | 97 | 数字滑动动画 | `slider` / `github-stars` 内部依赖 | 保留内部依赖 |
| `smart-form.tsx` | 82 | CSS-only 表单状态 | `gooseui-smart-form` | 保留业务组件 |
| `stacking-cards.tsx` | 139 | stacking cards 动画 | `gooseui-stacking-cards` | 保留业务组件 |
| `svg-drawable.tsx` | 418 | SVG draw animation | `gooseui-svg-drawable` | 保留业务组件 |
| `carousel.tsx` | 709 | 自写 carousel，非当前主线 Embla 接口 | `src/components/ui/carousel.tsx` | 当前无引用，后续可删或另评估 |
| `github-stars.tsx` | 110 | GitHub stars fetch + SlidingNumber | 无主线基础件 | 当前无引用，后续可删或另评估 |
| `glitch-text.tsx` | 117 | 文本特效 | `gooseui-glitch-text` 现指向 effects 目录 | 当前 `ui/glitch-text` 无引用 |
| `search-panel.tsx` | 740 | search panel 组合件 | 无主线基础件 | 当前无引用，后续可删或另评估 |
| `sonner.tsx` | 50 | Toaster wrapper | `src/components/ui/toaster.tsx` 或 sonner | 当前无引用，后续可删 |
| `typography.tsx` | 88 | Typography wrapper | 无主线基础件 | 当前无引用，后续可删 |

## 2. 旧路径引用分布

运行时代码中仍直接引用 `@/components/gooseui/components/ui/*` 的基础件如下：

| 旧路径 | import 数 | 调用文件 |
|---|---:|---|
| `button` | 8 | `example-form`、`footer-newsletter`、3 个 header、2 个 hero、`custom-toast` |
| `card` | 2 | `example-form`、`pokemon-card` |
| `input` | 2 | `example-form`、`footer-newsletter` |
| `label` | 1 | `example-form` |
| `textarea` | 1 | `example-form` |
| `custom-toast` | 1 | `src/components/gooseui/lib/toast.ts` |
| `curved-text` | 1 | `curved-text-marquee.tsx` |
| `sliding-number` | 2 | `github-stars.tsx`、`slider.tsx` |
| `theme-toggle` | 1 | `theme-customizer.tsx` |

另外，主线 wrapper 继续导出 gooseui 业务组件，例如：

```txt
src/components/ui/gooseui-checkbox.tsx
src/components/ui/gooseui-slider.tsx
src/components/ui/gooseui-theme-toggle.tsx
src/components/ui/gooseui-theme-customizer.tsx
src/components/ui/gooseui-custom-toast.tsx
...
```

这些 wrapper 是当前 gallery 文档和 preview 的公开 seam，不属于要删除的 shadcn 基础件副本。

## 3. 主线能力对照与决策

### 3.1 Button

`gooseui` Button 支持：

```tsx
variant: default | destructive | outline | secondary | ghost | link
size: default | sm | lg | icon
asChild?: boolean
squircle?: boolean
```

当前真实调用只使用：

```txt
variant: outline / ghost / default
size: sm / lg / icon / default
```

主线 `Button` 已覆盖这些标准 shadcn 值，并且已经有更多尺寸：

```tsx
size: default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg
```

**决策：运行时调用直接收口到主线 `Button`。**

不把 `squircle` 收进主线 Button。原因：

1. 当前 `gooseui` Button 没有真实调用 `squircle`。
2. squircle 是 gooseui 的视觉主题能力，已有专门的 `corner-shape.tsx` / `gooseui-corner-shape` 组件承载。
3. 如果把 `squircle` 放进主线 Button，会把浏览器兼容、CSS `corner-shape`、视觉风格选择带进基础按钮 Interface，降低主线 seam 的纯度。

需要注意：`gooseui` Button 有 `hover:scale` / `active:scale` 动效，主线 Button 没有完全相同的 hover scale。收口目标是统一基础件行为，这个视觉差异不建议作为兼容分支保留。

---

### 3.2 Card

`gooseui` Card 基本是 shadcn Card 副本，额外：

```tsx
squircle?: boolean
CardAction
```

主线 Card 已具备：

```tsx
Card
CardHeader
CardFooter
CardTitle
CardAction
CardDescription
CardContent
CardMeta
CardGrid
```

并且主线已经有更强的 API-first 能力：

```tsx
title / description / extra / cover / actions / tabList / loading / hoverable / size / variant / type
```

当前 `gooseui` 调用点只使用 slot 组件：

- `ExampleForm`：`Card`、`CardHeader`、`CardTitle`、`CardDescription`、`CardContent`、`CardFooter`
- `PokemonCard`：`Card`、`CardContent`

**决策：直接使用主线 `Card`。**

不把 `squircle` 收进主线 Card；同 Button，squircle 应留在 `gooseui-corner-shape` 这类业务视觉组件里。

---

### 3.3 Input / Textarea

`gooseui` Input、Textarea 都是标准 shadcn wrapper。主线对应组件已经覆盖：

- 原生 input / textarea props
- `className` 覆盖
- `aria-invalid`
- disabled 样式
- dark mode 样式

当前调用点只使用常规表单能力：

```tsx
value / onChange / placeholder / defaultValue / disabled / aria-invalid / aria-errormessage / className
```

**决策：直接使用主线 `Input`、`Textarea`。**

不需要增强主线。

---

### 3.4 Label

`gooseui` Label 是裸 `<label>`；主线 Label 是 Radix Label Root，且样式语义一致。

**决策：直接使用主线 `Label`。**

这是正向增强：迁移后 Label 使用 Radix Label 的无障碍语义，不需要保留裸实现。

---

### 3.5 Badge

`gooseui` Badge 额外提供：

```tsx
variant: warning | beta | draft | experimental
```

但当前全仓库没有真实 import `@/components/gooseui/components/ui/badge`，也没有调用这些额外 variant。

主线 Badge 已有更完整的基础与 AntD-like 能力：

```tsx
variant: default | secondary | destructive | outline | ghost | link
count / dot / status / color / text / overflowCount / BadgeRibbon
```

**决策（更新）：吸收 `warning`，不吸收 `beta/draft/experimental` 作为独立枚举。**

与 `SHADCN-CONSOLIDATION-MANIFEST.md` 交叉对照后发现，manifest 的 Badge 副本独立提供了 `muted`，两个互不相关的外部库都在 shadcn 默认 variant 之外补了"语义状态"能力，这是跨库信号，已在 `SHADCN-CONSOLIDATION-EXECUTION-PLAN.md` 3.2 节设计为主线增强：

- `warning`：复用 gooseui 的 amber 色值，并与主线 Badge 已有的 `status="warning"` 点状态指示器色彩对齐。
- `beta/draft/experimental` 三者在 gooseui 源码里是同一视觉公式（outline + 10% 透明背景 + 同色文字 + uppercase 小号加粗），只是换了颜色，属于可组合的"预览态标签样式"而非独立能力，改用 `variant="outline"` + `className` 表达，不新增专属枚举。

当前仍无真实调用点，本次只是把 API 设计进主线，不倒推着造调用方。

---

### 3.6 Checkbox

`gooseui` Checkbox 不是 shadcn Checkbox 副本，而是一个业务视觉组件：

```tsx
variant: default | destructive | success
size: sm | default | lg
label?: string
```

实现是隐藏 `<input type="checkbox">` + SVG path 动画，不是 Radix Checkbox。

主线 `Checkbox` 是 Radix Checkbox Root，适合作为基础表单件；`gooseui` Checkbox 是展示/动效组件，并且已有公开 wrapper：

```txt
src/components/ui/gooseui-checkbox.tsx
```

**决策：保留 `gooseui-checkbox`，不收口到主线 Checkbox。**

不要为了它增强主线 `Checkbox` 的 `label`、`variant=success`、SVG 动效或尺寸 API。这些属于 gooseui 视觉组件自身的 Interface。

---

### 3.7 Slider

`gooseui` Slider 是原生 `input[type=range]` 实现，特点是：

```tsx
value?: number
defaultValue?: number
onValueChange?: (value: number) => void
showValue?: boolean
animateValue?: boolean
formatValue?: (value: number) => string
size?: "sm" | "md" | "lg"
```

主线 `Slider` 是 Radix Slider，已支持：

```tsx
range
marks
dots
included
vertical / orientation
reverse
tooltip
onChange / onChangeComplete
```

两者不是同一层级：主线更适合通用表单/范围选择，gooseui 更像带数值展示动画的视觉控件。

**决策：保留 `gooseui-slider`。**

暂不把 `showValue` / `animateValue` / `formatValue` 收进主线 Slider。若后续多个库都需要“滑块旁常驻数值展示”，可以单独设计主线 Slider 的 `valueLabel` 能力，但不在本批做。

---

### 3.8 CustomToast

`custom-toast.tsx` 是业务 toast 内容组件，当前内部依赖 gooseui Button：

```tsx
import { Button } from "@/components/gooseui/components/ui/button"
```

该按钮只用于关闭按钮：

```tsx
<Button variant="ghost" size="icon" ... />
```

主线 Button 完全覆盖。

**决策：`CustomToast` 保留，内部 Button import 收口到主线。**

这一步可以减少 `button.tsx` 的最后一个内部依赖，同时不改变 `customToast` / `CustomToast` 的公开 Interface。

---

### 3.9 ThemeToggle / ThemeCustomizer

这两个组件依赖 `next-themes`、`motion/react`、本地 `useClickOutside`、主题色 localStorage 和 `data-theme-color`。

**决策：保留 gooseui 业务组件。**

`theme-customizer.tsx` 内部引用 `theme-toggle.tsx` 是业务组件之间的内部依赖，不属于 shadcn 基础件收口范围。

---

### 3.10 Carousel / Sonner / Typography / SearchPanel 等无引用文件

当前直接 import 命中为 0 的 `gooseui/components/ui` 文件包括：

```txt
badge.tsx
carousel.tsx
github-stars.tsx
glitch-text.tsx
search-panel.tsx
sonner.tsx
typography.tsx
```

其中：

- `carousel.tsx` 与主线 `src/components/ui/carousel.tsx` 接口不同，且当前无公开 wrapper / docs。
- `glitch-text.tsx` 当前无引用；公开 `gooseui-glitch-text` wrapper 指向的是 `components/effects/glitch-text`，不是这个 `ui/glitch-text.tsx`。
- `sonner.tsx` 当前无引用；主线已有 toaster/sonner 体系。
- `search-panel.tsx` 是大型组合件，不是基础件。

**决策：本批不把这些能力收进主线。**

后续若执行删除，必须先做全仓库 `rg`，并同步确认 source registry、docs、examples 没有动态依赖。

## 4. 本批建议迁移范围

### 4.1 应收口到主线的 import

建议只处理以下基础件副本：

```txt
@/components/gooseui/components/ui/button   -> @/components/ui/button
@/components/gooseui/components/ui/card     -> @/components/ui/card
@/components/gooseui/components/ui/input    -> @/components/ui/input
@/components/gooseui/components/ui/label    -> @/components/ui/label
@/components/gooseui/components/ui/textarea -> @/components/ui/textarea
```

涉及文件：

```txt
src/components/gooseui/components/blocks/example-form/example-form.tsx
src/components/gooseui/components/blocks/complex-component/components/pokemon-card.tsx
src/components/gooseui/components/blocks/footers/footer-newsletter.tsx
src/components/gooseui/components/blocks/headers/header-auth.tsx
src/components/gooseui/components/blocks/headers/header-simple.tsx
src/components/gooseui/components/blocks/headers/header-with-cta.tsx
src/components/gooseui/components/blocks/hero/hero-classic.tsx
src/components/gooseui/components/blocks/hero/hero-split.tsx
src/components/gooseui/components/ui/custom-toast.tsx
```

### 4.2 应保留在 gooseui 的业务组件

```txt
checkbox
slider
custom-toast
theme-toggle
theme-customizer
curved-text
scroll-to-top
corner-shape
morphing-dialog
morphing-header
promo-banner
scroll-container
scroll-progress
adaptive-grid
anchor-tooltip
animated-timer
balanced-text
baseline-status
css-theme-switcher
digital-clock
smart-form
stacking-cards
svg-drawable
sliding-number
```

这些组件的公开 seam 是 `src/components/ui/gooseui-*.tsx` wrapper 或 gooseui 内部业务调用，不应并入主线基础件。

### 4.3 可作为后续清理候选的无引用文件

```txt
src/components/gooseui/components/ui/badge.tsx
src/components/gooseui/components/ui/carousel.tsx
src/components/gooseui/components/ui/github-stars.tsx
src/components/gooseui/components/ui/glitch-text.tsx
src/components/gooseui/components/ui/search-panel.tsx
src/components/gooseui/components/ui/sonner.tsx
src/components/gooseui/components/ui/typography.tsx
```

这些不建议与基础件 import 收口混在同一个 PR/批次里删。原因：删除是全仓库结构清理，和“基础件 seam 收口”是两个风险面。

## 5. 主线需要增强什么

本批 **除 Badge 语义变体外，不建议增强主线基础组件**。

原因：

| gooseui 额外能力 | 是否收口 | 理由 |
|---|---|---|
| Button/Card `squircle` | 否 | 属于 gooseui 视觉语言，已有 `gooseui-corner-shape` 承载 |
| Button hover scale | 否 | 纯视觉偏好，收口目标是统一主线 Button 行为 |
| Badge `warning` | 是 | 与 manifest 的 `Badge muted` 构成跨库信号，已促成主线 Badge 增强（见执行计划 3.2） |
| Badge `beta/draft/experimental` | 组合表达 | 是同一视觉公式换色，不新增专属枚举，用 `variant="outline"` + `className` 表达 |
| Checkbox `label/size/success/SVG path` | 否 | 这是 gooseui 业务视觉组件，不是基础 Checkbox |
| Slider `showValue/animateValue/formatValue` | 暂不 | 单库需求；主线 Slider 已有 tooltip/marks/range 等更通用能力 |
| ThemeToggle/ThemeCustomizer | 否 | 主题业务能力，不是 shadcn 基础件 |

这里的核心判断是：主线基础组件已经比 gooseui 的基础件副本更深；gooseui 额外能力大多要么未使用，要么属于业务视觉组件。Badge 语义变体是例外——它被两个独立外部库分别验证过，属于本计划判定规则里"多库通用能力"的真实案例。

## 6. 迁移时的具体注意点

1. `Button` 的 `variant="outline"`、`variant="ghost"`、`size="sm"`、`size="lg"`、`size="icon"` 可以直接对齐主线。
2. `custom-toast.tsx` 的关闭按钮可直接用主线 `Button`，无需保留 gooseui Button。
3. `CardTitle` 在 gooseui 与主线都渲染为 `div`，没有 uselayouts 那种 `h3 -> div` 语义变化。
4. `Label` 从裸 `<label>` 变为 Radix Label Root，调用点没有使用特殊 props，风险低。
5. `footer-newsletter.tsx` / header 文件中存在 `<Link ...>` 却以 `</a>` 闭合的历史问题；这不是本批 Button/Input 收口引入的问题，不应混在本批修复。若 typecheck 因这些文件失败，应单独立项处理。
6. 删除 `button.tsx` / `card.tsx` 等旧副本前，必须保证 `rg "@/components/gooseui/components/ui/(button|card|input|label|textarea)"` 无命中。

## 7. 建议执行顺序

1. 只替换 9 个文件里的基础件 import：`button/card/input/label/textarea`。
2. 跑 typecheck；若失败，只处理由 import 替换造成的类型问题。
3. 跑 gooseui 相关页面 smoke，至少覆盖：
   - `gooseui/example-form`
   - `gooseui/footer-newsletter`
   - `gooseui/header-auth`
   - `gooseui/header-simple`
   - `gooseui/header-with-cta`
   - `gooseui/hero-classic`
   - `gooseui/hero-split`
   - `gooseui/custom-toast`
4. 再决定是否删除基础件副本文件。
5. 最后另开“gooseui orphan ui 清理”批次，处理无引用文件。

## 8. 删除旧副本前的检查命令

```bash
rg -n "@/components/gooseui/components/ui/(button|card|input|label|textarea)" src content
rg -n "@/components/gooseui/components/ui/badge|@/components/gooseui/components/ui/carousel|@/components/gooseui/components/ui/github-stars|@/components/gooseui/components/ui/search-panel|@/components/gooseui/components/ui/sonner|@/components/gooseui/components/ui/typography" src content
rg -n "squircle" src/components/gooseui src/components/ui content
pnpm typecheck
pnpm lint
pnpm build
```

## 9. 本批结论

`gooseui` 可以先做一轮小而稳的基础件收口：

- 收口：`button`、`card`、`input`、`label`、`textarea`。
- 保留：`checkbox`、`slider`、`custom-toast`、主题/动画/滚动/文本类业务组件。
- 促成主线增强：Badge `warning`（与 manifest 的 `muted` 共同构成跨库信号，见执行计划 3.2）。
- 放弃吸收：`squircle`、Badge 的 `beta/draft/experimental` 专属枚举（改用组合表达）、Checkbox 动效 API、Slider 常驻数值动画 API。
- 无引用文件可后续清理，但应与本批基础件收口分离。

## 10. 交叉审阅问题

1. 是否接受不把 `squircle` 纳入主线 Button/Card，而继续由 `gooseui-corner-shape` 承载？
2. 是否接受 `gooseui-slider` 作为业务视觉组件保留，而不是尝试并入主线 Radix Slider？
3. 是否接受主线 Badge 新增 `warning` variant，且 `beta/draft/experimental` 不新增专属枚举（见执行计划 3.2）？
4. 是否同意把 `badge/carousel/github-stars/search-panel/sonner/typography/ui-glitch-text` 的删除放到后续 orphan 清理批次？
