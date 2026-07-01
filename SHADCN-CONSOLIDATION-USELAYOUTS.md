# uselayouts shadcn 副本收口评估

> 范围：`src/components/uselayouts/_shared/ui/*`。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`uselayouts` 自带 9 个 `_shared/ui` 基础件副本：

| 文件 | 行数 | 性质 | 主线对应 |
|---|---:|---|---|
| `badge.tsx` | 8 | shadcn Badge 极简副本 | `src/components/ui/badge.tsx` |
| `button.tsx` | 8 | shadcn Button 极简副本 | `src/components/ui/button.tsx` |
| `calendar.tsx` | 16 | placeholder stub，只渲染文本 `Calendar` | `src/components/ui/calendar.tsx` |
| `card.tsx` | 23 | shadcn Card 极简副本 | `src/components/ui/card.tsx` |
| `field.tsx` | 30 | Field/Form 辅助副本 | `src/components/ui/form-field.tsx` |
| `input.tsx` | 20 | shadcn Input 极简副本 | `src/components/ui/input.tsx` |
| `popover.tsx` | 20 | fake Popover，非 Radix，仅 div 包装 | `src/components/ui/popover.tsx` |
| `select.tsx` | 61 | fake Select，非 Radix，`items/value/onValueChange` 基本无行为 | `src/components/ui/select.tsx` |
| `textarea.tsx` | 8 | shadcn Textarea 极简副本 | `src/components/ui/textarea.tsx` |

当前引用旧路径的文件：

| 调用文件 | 使用的 `_shared/ui` |
|---|---|
| `src/components/uselayouts/status-button.tsx` | `button` |
| `src/components/uselayouts/expandable-gallery.tsx` | `button` |
| `src/components/uselayouts/inline-edit.tsx` | `input` |
| `src/components/uselayouts/stacked-list.tsx` | `input`, `button` |
| `src/components/uselayouts/multi-step-form.tsx` | `field`, `card`, `button`, `input`, `textarea`, `select`, `badge`, `calendar`, `popover` |

总计：9 个副本文件，14 处 import。

## 2. 主线能力对照

### 2.1 Button

外部副本：

```tsx
React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
```

但实现忽略 `variant` / `size`，始终输出固定 class。

主线 `Button` 已支持：

```tsx
variant: default | outline | secondary | ghost | destructive | link
size: default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg
asChild?: boolean
```

`uselayouts` 当前真实调用：

- `variant="default"`
- `variant="outline"`
- `variant="secondary"`
- `size="icon"`
- 大量通过 `className` 覆盖高度、圆角、宽度

**决策：直接使用主线 `Button`。**

不需要增强主线。`uselayouts` 的 `variant?: string` / `size?: string` 是宽泛但无实际行为的旧接口，应放弃。

---

### 2.2 Input

外部副本是标准 input wrapper，主要差异是默认高度 `h-10`、padding `px-3`。

主线 `Input` 已支持：

- 原生 input props
- `className` 覆盖
- `aria-invalid` 样式
- file input 样式
- dark mode

`uselayouts` 当前真实调用：

- `inline-edit.tsx` 使用 `ref`
- `stacked-list.tsx` 使用 `value/onChange/placeholder/className`
- `multi-step-form.tsx` 使用 `react-hook-form register` 和 `onKeyDown`

**决策：直接使用主线 `Input`。**

注意：项目使用 React 19，主线函数组件接受 `React.ComponentProps<"input">`，`ref` 作为 prop 的类型路径可用。若 typecheck 发现 ref 兼容问题，再把主线 `Input` 调整为显式 ref 兼容；不提前增加复杂度。

---

### 2.3 Textarea

外部副本只是标准 textarea wrapper。

主线 `Textarea` 已支持：

- 原生 textarea props
- `className` 覆盖
- `aria-invalid` 样式
- disabled 样式
- dark mode

`multi-step-form.tsx` 只使用：

- `id`
- `placeholder`
- `className`
- `react-hook-form register`

**决策：直接使用主线 `Textarea`。**

不需要增强主线。

---

### 2.4 Badge

外部副本：

```tsx
React.HTMLAttributes<HTMLDivElement> & { variant?: string }
```

实现固定为 default 样式，`variant` 实际未参与样式计算。

主线 `Badge` 已支持：

- `variant="default" | "secondary" | "destructive" | "outline" | "ghost" | "link"`
- `asChild`
- `count/dot/status/color/text/overflowCount`
- `BadgeRibbon`

`multi-step-form.tsx` 使用：

```tsx
<Badge variant="secondary" className="gap-1">
```

**决策：直接使用主线 `Badge`。**

这是增强而不是降级：旧 `variant="secondary"` 被忽略，主线会真正生效。

需接受的变化：元素从 `div` 变为 `span`。当前用法只是 inline tag，不依赖 div 语义，风险低。

---

### 2.5 Card

外部副本提供：

```tsx
Card
CardHeader
CardTitle
CardDescription
CardContent
CardFooter
```

主线 `Card` 提供同名导出，并额外支持：

- `title`
- `description`
- `extra`
- `cover`
- `actions`
- `tabList`
- `loading`
- `hoverable`
- `size`
- `variant`
- `CardMeta`
- `CardGrid`

`multi-step-form.tsx` 使用同名 slot 组件，并用 `className` 控制布局。

**决策：直接使用主线 `Card`。**

注意：旧 `CardTitle` 是 `h3`，主线 `CardTitle` 是 `div`。当前是 demo/layout 语境，不依赖 heading 语义；如果交叉审阅认为必须保留 heading 语义，可以后续评估是否为主线 `CardTitle` 增加 `asChild`，但本批不建议为了单点迁移增加接口。

---

### 2.6 Field

外部副本提供：

```tsx
Field
FieldLabel
FieldDescription
FieldError
Label
Description
ErrorMessage
```

`multi-step-form.tsx` 实际只使用：

```tsx
Field
FieldLabel
FieldDescription
FieldError
```

主线没有 `src/components/ui/field.tsx`，但已有更完整的：

```tsx
src/components/ui/form-field.tsx
```

其导出包括：

```tsx
Form
FormItem
Field
FieldLabel
FieldDescription
FieldError
FieldGroup
FieldLegend
FieldSeparator
FieldSet
FieldContent
FieldTitle
```

**决策：改 import 到 `@/components/ui/form-field`。**

不新增 `src/components/ui/field.tsx` 兼容文件。原因：这会制造新的别名 seam，不利于后续统一。

---

### 2.7 Calendar

外部副本是 placeholder：

```tsx
function Calendar(...) {
  return <div className={className} {...props}>Calendar</div>
}
```

它接受：

```tsx
mode?: string
selected?: Date
onSelect?: (date: Date | undefined) => void
initialFocus?: boolean
```

但完全没有日历交互。

主线 `Calendar` 是真实日历组件，导出：

```tsx
Calendar
CalendarDayButton
```

**决策：替换为主线 `Calendar`。**

这是明确的能力增强。`multi-step-form` 中日期选择会从 placeholder 变成真实可选日期。

风险：视觉和高度会明显变化，需要页面 smoke。

---

### 2.8 Popover

外部副本是 fake Popover：

```tsx
Popover       -> div
PopoverTrigger -> div，支持 render?: React.ReactNode
PopoverContent -> div
```

`multi-step-form.tsx` 当前写法：

```tsx
<PopoverTrigger
  render={
    <Button>...</Button>
  }
/>
```

主线 `Popover` 是 Radix Popover，正确写法应为：

```tsx
<PopoverTrigger asChild>
  <Button>...</Button>
</PopoverTrigger>
```

**决策：不把 `render` prop 吸收到主线。**

原因：`render` 是 uselayouts fake component 的历史写法，不是通用基础能力。迁移时应改调用点。

---

### 2.9 Select

外部副本是 fake Select：

```tsx
Select       -> div
SelectTrigger -> button
SelectValue   -> span
SelectContent -> div
SelectItem    -> div
```

它声明了：

```tsx
items?: { label: string; value: string | null }[]
value?: string | null
onValueChange?: (value: string) => void
```

但 `items/value/onValueChange` 在实现里基本没有行为。当前 `multi-step-form.tsx` 的 Select 实际上并不能完成 Radix Select 那种选择交互。

主线 `Select` 是 Radix Select。迁移时不能只换 import，需要改调用点：

当前：

```tsx
<Select
  items={TEAM_SIZE_OPTIONS}
  value={watchedValues["team-size"] ?? null}
  onValueChange={(val) => form.setValue("team-size", val)}
>
  <SelectTrigger id="team-size" className="w-full">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {TEAM_SIZE_OPTIONS.map((opt) => (
      <SelectItem key={opt.label} value={opt.value as any}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

建议迁移为：

```tsx
<Select
  value={watchedValues["team-size"] ?? undefined}
  onValueChange={(val) => form.setValue("team-size", val)}
>
  <SelectTrigger id="team-size" className="w-full">
    <SelectValue placeholder="Select team size" />
  </SelectTrigger>
  <SelectContent>
    {TEAM_SIZE_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

`priority` 同理。

**决策：不把 `items` API 吸收到主线。**

原因：这里的 `items` 是 fake Select 遗留 API，而且当前实现没真正使用它。主线保持 Radix/shadcn 组合接口更合理。

---

## 3. 主线需要增强什么？

本批 `uselayouts` 评估结论：**暂时不需要为了 uselayouts 增强主线基础组件。**

原因：

1. `button/input/textarea/card/badge/calendar/popover/select/form-field` 主线都已有。
2. 外部多出的 `variant?: string`、`size?: string`、`items`、`render` 都是 stub/no-op 或历史写法，不应进入主线。
3. 真正的能力增强来自“换成主线真实实现”：`Calendar` 和 `Select/Popover` 会从 fake 组件变成真实 Radix/DayPicker 组件。

本批应放弃吸收：

| 外部能力 | 放弃原因 |
|---|---|
| `Button variant?: string` | 过宽且旧实现未使用 |
| `Button size?: string` | 过宽且旧实现未使用；主线已有明确 size 集合 |
| `PopoverTrigger render` | fake Popover 历史写法；主线应用 `asChild` |
| `Select items` | fake Select 历史写法且无真实行为 |
| `Select value: string | null` | 主线 Radix Select 应使用 `undefined` 表示 placeholder |
| `SelectItem value: null` | Radix Select item value 应为有效 string；null option 应变成 placeholder |

---

## 4. 建议迁移任务拆分

### Task 1：替换简单基础件 import

涉及文件：

- `src/components/uselayouts/status-button.tsx`
- `src/components/uselayouts/expandable-gallery.tsx`
- `src/components/uselayouts/inline-edit.tsx`
- `src/components/uselayouts/stacked-list.tsx`
- `src/components/uselayouts/multi-step-form.tsx`

替换：

```tsx
@/components/uselayouts/_shared/ui/button   -> @/components/ui/button
@/components/uselayouts/_shared/ui/input    -> @/components/ui/input
@/components/uselayouts/_shared/ui/textarea -> @/components/ui/textarea
@/components/uselayouts/_shared/ui/card     -> @/components/ui/card
@/components/uselayouts/_shared/ui/badge    -> @/components/ui/badge
@/components/uselayouts/_shared/ui/calendar -> @/components/ui/calendar
@/components/uselayouts/_shared/ui/field    -> @/components/ui/form-field
```

### Task 2：改写 Popover 调用点

文件：`src/components/uselayouts/multi-step-form.tsx`

把：

```tsx
<PopoverTrigger render={<Button ... />} />
```

改成：

```tsx
<PopoverTrigger asChild>
  <Button ... />
</PopoverTrigger>
```

### Task 3：改写 Select 调用点

文件：`src/components/uselayouts/multi-step-form.tsx`

处理点：

1. 删除 `items={...}`。
2. `value={watchedValue ?? null}` 改为 `value={watchedValue ?? undefined}`。
3. `SelectValue` 增加 placeholder。
4. `SelectItem` 过滤 `value === null` 的 placeholder option。

### Task 4：删除旧副本

删除前必须确认：

```bash
rg "@/components/uselayouts/_shared/ui" src content
rg "components/uselayouts/_shared/ui" . -g'!node_modules'
```

无运行时代码引用后，删除：

```txt
src/components/uselayouts/_shared/ui/badge.tsx
src/components/uselayouts/_shared/ui/button.tsx
src/components/uselayouts/_shared/ui/calendar.tsx
src/components/uselayouts/_shared/ui/card.tsx
src/components/uselayouts/_shared/ui/field.tsx
src/components/uselayouts/_shared/ui/input.tsx
src/components/uselayouts/_shared/ui/popover.tsx
src/components/uselayouts/_shared/ui/select.tsx
src/components/uselayouts/_shared/ui/textarea.tsx
```

如果目录为空，再删除：

```txt
src/components/uselayouts/_shared/ui
```

是否删除空目录需执行前再次确认。

---

## 5. 风险清单

| 风险 | 等级 | 说明 | 处理 |
|---|---|---|---|
| Select 从 fake 变真实 | 中 | 当前可能本来不能选择；迁移后行为变化明显 | 手动 smoke multi-step-form |
| Calendar 从 placeholder 变真实 | 中 | UI 高度和交互会变化 | 页面 smoke，必要时调整 className |
| Popover 从 div 变 portal/floating | 中 | 布局层级、定位会变化 | 使用 `asChild`，检查弹层位置 |
| CardTitle 元素从 `h3` 到 `div` | 低 | 语义变化，但当前 demo 不依赖 heading | 暂不增强主线 |
| Input ref 类型 | 低 | React 19 下应可用；若 typecheck 报错再增强主线 ref 兼容 | 以 typecheck 为准 |
| 删除文件误伤文档/源码面板 | 低 | 需要全仓库 rg | 删除前执行 rg |

---

## 6. 验证命令

迁移实现后建议执行：

```bash
pnpm typecheck
pnpm exec eslint src/components/uselayouts/status-button.tsx \
  src/components/uselayouts/expandable-gallery.tsx \
  src/components/uselayouts/inline-edit.tsx \
  src/components/uselayouts/stacked-list.tsx \
  src/components/uselayouts/multi-step-form.tsx
```

旧路径归零检查：

```bash
rg "@/components/uselayouts/_shared/ui" src content
rg "components/uselayouts/_shared/ui" . -g'!node_modules'
```

建议 smoke 页面：

- `uselayouts/status-button`
- `uselayouts/expandable-gallery`
- `uselayouts/inline-edit`
- `uselayouts/stacked-list`
- `uselayouts/multi-step-form`

重点检查 `multi-step-form` 的：

1. 日期 Popover 是否打开。
2. Calendar 是否能选择日期。
3. Team Size Select 是否能选择。
4. Priority Select 是否能选择。
5. Tags Badge 是否正常显示和删除。
6. Back / Continue Button 样式是否可接受。

---

## 7. 本批结论

`uselayouts` 是适合第一批收口的对象，但不是纯 import 替换。

最终建议：

1. `Button/Input/Textarea/Card/Badge/Field` 直接收口到主线。
2. `Calendar` 用主线真实组件替换 placeholder。
3. `Popover` 改调用点，使用主线 `asChild` 模式，不吸收 `render`。
4. `Select` 改调用点，使用主线 Radix 组合接口，不吸收 `items/null value`。
5. 本批不需要增强主线基础组件；只是把旧 fake/no-op API 放弃，把主线能力用起来。

交叉审阅时重点看两个决策：

1. 是否接受 `CardTitle` 的元素语义变化。
2. 是否同意不为 Select 增加 `items` 数据驱动 API。
