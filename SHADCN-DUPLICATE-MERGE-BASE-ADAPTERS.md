# 同名重复组件合并报告：Base Adapter 组

> 覆盖：`accordion/button/card/dialog/direction/dropdown-menu/input-group/select/sheet/tabs/toggle`。  
> 特征：这些重复项大多已经围绕主线 `src/components/ui`，外部文件要么是 re-export，要么是兼容旧调用的 adapter。

## 1. 组件清单

| 组件 | 当前实现 | 外部实现性质 | 主线处理判断 |
|---|---|---|---|
| `accordion` | `src/components/ui/accordion.tsx` | `extend/components/ui/accordion.tsx` 纯 re-export | 删除外部文件；调用点直接用主线 |
| `button` | `src/components/ui/button.tsx` | `extend/components/ui/button.tsx` 旧 shadcn variant/size 到主线 API 的 mapper | 主线已较强；保留 mapper 只作为迁移期，最终改调用点 |
| `card` | `src/components/ui/card.tsx` | `extend/components/ui/card.tsx` 纯 re-export | 删除外部文件；主线已经覆盖 |
| `dialog` | `src/components/ui/dialog.tsx` | `extend/components/ui/dialog.tsx` 纯 re-export + 旧别名 | 删除外部文件；旧别名是否进主线要谨慎 |
| `direction` | `src/components/ui/direction.tsx` | `dice/ui/direction.tsx` 与主线基本同构 | 保留主线；dice 内部统一导入主线 |
| `dropdown-menu` | `src/components/ui/dropdown-menu.tsx` | `extend/components/ui/dropdown-menu.tsx` 纯 re-export | 删除外部文件；调用点直接用主线 |
| `input-group` | `src/components/ui/input-group.tsx` | `dice/ui/input-group.tsx` 与主线几乎同构，且已引用主线 Button/Input/Textarea | 删除 dice 副本；示例补到主线 |
| `select` | `src/components/ui/select.tsx` | `extend/components/ui/select.tsx` 提供 `SelectButton/SelectPopup/SelectGroupLabel` 等命名层 | 需要改调用点；只吸收真正通用的 size/class 能力 |
| `sheet` | `src/components/ui/sheet.tsx` | `extend/components/ui/sheet.tsx` 纯 re-export + 旧别名 | 删除外部文件；旧别名不长期保留 |
| `tabs` | `src/components/ui/tabs.tsx` | `extend/components/ui/tabs.tsx` 提供 `TabsTab/TabsPanel`、`variant="underline"`、`keepMounted` | 部分吸收：`underline` 和 `keepMounted` 可考虑进入主线 |
| `toggle` | `src/components/ui/toggle.tsx` + `toggle-group.tsx` | `extend/components/ui/toggle.tsx` 把 Toggle 与 ToggleGroup 放在一个文件，并提供 `multiple` 布尔 API | 不保留合并文件；主线可评估 `spacing` 能力 |

## 2. 每组能力并集判断

### 2.1 Accordion

主线能力：

- Radix Accordion primitive；
- `items` 数据驱动；
- `size`、`collapsible`、`expandIcon`、`expandIconPlacement`；
- `AccordionPanel` 等导出已经由主线提供。

extend 能力：只有 re-export。

**结论：无新增能力。最终删除 `extend/components/ui/accordion.tsx`。**

### 2.2 Button

主线能力：

- `color + variant` API；
- `size`、`shape`、`block`、`ghost`；
- `loading/loadingText`；
- `icon/iconPlacement`；
- `href` 分支；
- `asChild`；
- `motion` hover/tap。

extend adapter 能力：

- 接受旧 shadcn 命名：`variant="default|destructive|destructive-outline|ghost|link|outline|secondary"`；
- 接受旧尺寸：`xs/sm/default/lg/xl/icon-*`；
- 把 `type` 映射为主线 `htmlType`。

**取舍：**

| 能力 | 是否进主线 | 理由 |
|---|---|---|
| `type` 作为 `htmlType` 别名 | 否 | 原生 button 已有 `type`，主线已明确用 `htmlType` 避免冲突 |
| `destructive-outline` | 否 | 可用 `color="danger" variant="outlined"` 表达 |
| `variant="default"` | 否 | 旧 shadcn 语义，主线 canonical 是 `color + variant` |
| `icon-xs/icon-xl` | 暂不 | 先用 `className`；多处真实需要再加 |
| `loading` | 已在主线 | 已完成吸收 |

**结论：不要让主线变成 shadcn 旧 API 兼容层。迁移时改 extend 调用点。**

### 2.3 Card

主线能力：

- slot 组件：`CardHeader/CardContent/CardFooter/CardTitle/CardDescription/CardAction`；
- API-first 能力：`title/description/extra/actions/tabList/loading/hoverable/size/variant/type`；
- `CardGrid/CardMeta`。

extend 能力：只有 re-export。

**结论：无新增能力。最终删除 `extend/components/ui/card.tsx`。**

### 2.4 Dialog / Sheet / DropdownMenu

主线已经是 Radix 体系，并且提供扩展结构。extend 文件只做 re-export 和旧别名：

```txt
DialogBackdrop as DialogOverlay
DialogPopup as DialogContent
SheetBackdrop as SheetOverlay
SheetPopup as SheetContent
```

**取舍：**

- 旧别名可以作为迁移期映射，但不建议长期放入主线；
- 示例与调用点应该改成主线 canonical 命名；
- 不再保留 extend 同名文件。

### 2.5 Direction

base 与 dice 都是 Radix Direction Provider 轻封装。没有能力差异。

**结论：dice 版本删除，所有示例使用主线 `DirectionProvider`。**

### 2.6 InputGroup

主线和 dice 基本同构，dice 版本已反向依赖主线 `Button/Input/Textarea`。

**结论：主线是唯一实现，dice 文件删除前要补示例到主线。**

### 2.7 Select

主线能力：

- Radix Select；
- `SelectTrigger` size；
- `SelectContent` `position/alignItemWithTrigger/sticky`；
- scroll buttons、group、item、label、separator。

extend adapter 额外命名：

```txt
SelectButton
SelectPopup
SelectGroupLabel
selectTriggerVariants
selectTriggerIconClassName
```

**取舍：**

| 能力 | 决策 |
|---|---|
| `SelectPopup` | 不进主线；改为 `SelectContent` |
| `SelectGroupLabel` | 不单独进主线；主线 `SelectLabel` 足够 |
| `SelectButton` | 可作为业务按钮，不应污染 Select primitive |
| `size="lg"` | 可吸收进主线 `SelectTrigger`，如果真实 demo 需要 |
| trigger 更完整宽度样式 | 可以通过 `className` 或主线 variant 评估 |

### 2.8 Tabs

主线能力：

- items 数据驱动；
- `activeKey/defaultActiveKey/onChange`；
- `tabPlacement`；
- `type="line|card"`；
- `tabBarExtraContent`；
- highlight primitives。

extend 额外：

- `TabsTab` / `TabsPanel` 命名；
- `variant="underline"`；
- `TabsPanel keepMounted` 映射到 `forceMount`。

**取舍：**

| 能力 | 是否吸收 | 理由 |
|---|---|---|
| `TabsTab/TabsPanel` 命名 | 否 | 主线已有 `TabsTrigger/TabsContent` |
| `keepMounted` | 可吸收 | 比 Radix `forceMount` 更语义化，适合作为主线 convenience |
| `variant="underline"` | 可吸收 | 常见 Tabs 视觉，不是单库专属 |

### 2.9 Toggle

主线拆分：

```txt
src/components/ui/toggle.tsx
src/components/ui/toggle-group.tsx
```

extend 合并：

```txt
Toggle
ToggleGroup
ToggleGroupItem
multiple?: boolean
spacing?: default | none
```

**取舍：**

- 不把 Toggle 和 ToggleGroup 合回一个文件；
- `multiple` 布尔 API 不进入主线，主线继续用 Radix `type="single|multiple"`；
- `spacing="none"` 可以考虑进入主线 `ToggleGroup`，因为它表达分段控件常见样式。

## 3. 建议执行顺序

1. 先处理无新增能力的 re-export：`accordion/card/dialog/dropdown-menu/sheet/direction/input-group`。
2. 再处理 `tabs`：吸收 `keepMounted` / `underline` 或确认放弃。
3. 再处理 `toggle`：确认是否吸收 `spacing="none"`。
4. 最后处理 `button/select`：它们影响 extend 大组件最多。

## 4. 验证命令

```bash
rg -n "@/components/extend/components/ui/(accordion|button|card|dialog|dropdown-menu|select|sheet|tabs|toggle)" src content
rg -n "@/components/dice/ui/(direction|input-group)" src content
./node_modules/.bin/tsc --noEmit
```
