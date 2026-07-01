# extend shadcn 副本收口评估

> 范围：`src/components/extend/components/ui/*` 及 `src/components/ui/extend-*.tsx` wrapper。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

当前仓库中已无 `@base-ui/react` / `useRender` / `mergeProps` 命中，`extend` 已经不是 Base UI 状态，底层也迁到了 Radix/原生组合。但 `extend/components/ui` 仍是独立的一套增强 shadcn 体系。

`extend/components/ui` 共有 44 个文件，分三层：

| 层级 | 文件 |
|---|---|
| 基础件/可对照主线 | `accordion`、`alert`、`aspect-ratio`、`badge`、`breadcrumb`、`button`、`card`、`collapsible`、`command`、`dialog`、`dropdown-menu`、`group`、`input`、`kbd`、`popover`、`resizable`、`scroll-area`、`select`、`separator`、`sheet`、`skeleton`、`sonner`、`spinner`、`tabs`、`toggle`、`tooltip` |
| extend 业务/复合组件 | `autocomplete`、`color-picker`、`file-upload`、`sidebar`、`document-viewer-sidebar`、`docx-annotation-card`、`file-thumbnail` |
| 文档/文件处理大组件 | `bounding-box-citations`、`csv-viewer`、`document-splits`、`docx-editor`、`docx-viewer`、`file-system`、`layout-blocks`、`pdf-viewer`、`schema-builder`、`xlsx-editor`、`xlsx-viewer` |

主线 wrapper `src/components/ui/extend-*.tsx` 很多只是文档公开入口，不能直接删；真正要收口的是 extend 内部对自己基础件的依赖。

## 2. 旧基础件引用分布

高频内部依赖：

| 旧基础件 | import 数 | 主要调用者 |
|---|---:|---|
| `button` | 16 | `docx-editor`、`sheet`、`xlsx-viewer`、`file-system`、`docx-viewer`、`dialog`、`schema-builder`、`color-picker`、`sidebar`、`pdf-viewer`、`csv-viewer` 等 |
| `scroll-area` | 15 | `docx-editor`、`sheet`、`xlsx-viewer`、`file-system`、`dialog`、`schema-builder`、`layout-blocks`、`autocomplete` 等 |
| `input` | 12 | 文档查看器/编辑器、`color-picker`、`sidebar`、`csv-viewer`、`autocomplete` 等 |
| `tooltip` | 10 | 文档查看器/编辑器、`color-picker`、`sidebar`、`csv-viewer`、`bounding-box-citations` |
| `select` | 9 | 文档查看器/编辑器、`color-picker`、`pdf-viewer`、`csv-viewer` |
| `separator` | 9 | `group`、文档查看器/编辑器、`sidebar`、`csv-viewer` |
| `spinner` | 9 | 文档查看器/编辑器、`button`、`csv-viewer` |
| `dropdown-menu` | 8 | 文档查看器/编辑器、`file-system`、`schema-builder`、`csv-viewer` |
| `popover` | 7 | 文档查看器/编辑器、`file-system`、`color-picker`、`csv-viewer` |
| `tabs` | 5 | `xlsx-viewer`、`file-system`、`schema-builder`、`bounding-box-citations` |

## 3. 主线对照与关键差异

### 3.1 Button 是最关键的主线增强候选

extend Button 比当前主线多：

```tsx
loading?: boolean
size: xs | sm | default | lg | xl | icon-xs | icon-sm | icon | icon-lg | icon-xl
variant: default | destructive | destructive-outline | ghost | link | outline | secondary
```

真实调用里有：

```tsx
loading={isPending}
size="icon-sm"
size="sm"
variant="outline" / "ghost" / "secondary"
```

主线 Button 已有 `icon-sm`、`xs/sm/lg`，但缺：

```txt
loading
xl
icon-xl
destructive-outline
```

**决策：`loading` 值得收口进主线 Button。**

理由：按钮 loading 是跨库通用能力，不是 extend 专属；主线若吸收，后续 manifest/limeplay/dice 也能受益。`xl/icon-xl/destructive-outline` 暂不吸收，除非真实迁移时仍有调用阻塞。

### 3.2 Input 是第二个增强候选，但要克制

extend Input 的核心差异：

```tsx
size?: "sm" | "default" | "lg" | number
unstyled?: boolean
nativeInput?: boolean
```

它渲染为外层 `span[data-slot=input-control]` + 内层 `input`，用于更复杂的视觉外框和组合控制。

主线 Input 当前是单 `<input>`。

**决策：暂不把 extend Input 整体收进主线。**

可考虑只给主线 Input 增加 `size="sm" | "default" | "lg"`，但不要引入 `unstyled/nativeInput` 和外层 `input-control`，否则会改变主线 Input 的 DOM Interface，影响所有调用。

### 3.3 Dialog / Sheet 不应简单替换

extend Dialog/Sheet 虽已是 Radix Dialog，但它的结构不是主线 Dialog/Sheet：

```txt
DialogBackdrop / DialogViewport / DialogPopup / DialogPanel
SheetBackdrop / SheetViewport / SheetPopup / SheetPanel
bottomStickOnMobile
variant="bare"
variant="inset"
```

这些被 `sidebar`、文档查看器、文件系统等复杂组件依赖。

**决策：Dialog/Sheet 最后处理，不作为第一批收口。**

### 3.4 Select 命名差异明显

extend Select 导出：

```txt
SelectButton
SelectTrigger
SelectValue
SelectPopup
SelectItem
SelectSeparator
SelectGroup
SelectLabel
```

主线 Select 导出：

```txt
Select
SelectTrigger
SelectValue
SelectContent
SelectItem
SelectSeparator
SelectGroup
SelectLabel
```

`SelectButton` 是按钮外观触发器；`SelectPopup` 对应主线 `SelectContent`。迁移需要改调用点，不是只换 import。

### 3.5 Badge / Card / Breadcrumb / Group 的 render/asChild 能力

extend 很多纯包装组件支持 `render` 或 `asChild`：

```tsx
Badge render
Card render
BreadcrumbLink render/asChild
Group asChild
```

主线已经有不少 `asChild`，但没有统一支持 `render` prop。

**决策：不把 `render` prop 体系收进主线。**

项目主线应统一 Radix `asChild` 风格；`render` 是外部库历史 API，迁移时改调用点或局部保留在 extend 业务组件，不扩大主线 Interface。

### 3.6 Autocomplete / ColorPicker / FileUpload / Sidebar 是复合组件

这些不应被拆成基础件：

- `autocomplete`：主线虽有 `auto-complete.tsx` / `combobox.tsx`，但接口不同，需单独评估。
- `color-picker`：领域组件，内部可收口 Button/Input/Popover/Select/Tooltip。
- `file-upload`：业务上传组件，内部可收口 Card/FileThumbnail。
- `sidebar`：虽可对照主线 Sidebar，但实现绑定 cookie、mobile sheet、sidebar token，迁移成本高，应最后处理。

## 4. 主线需要增强什么

建议吸收：

| 能力 | 进入主线？ | 理由 |
|---|---|---|
| `Button loading` | 是 | 多库通用，能减少业务里重复 spinner/disabled 逻辑 |
| `Button size="xl"` / `icon-xl` | 暂不 | 当前主要在 extend/局部播放器场景；先改调用或 className |
| `Button variant="destructive-outline"` | 暂不 | 单库视觉语义，未证明多库复用 |
| `Input size` | 候选 | 可用 `size="sm/default/lg"` 小幅增强，但不要改 DOM 结构 |
| `Select size="lg"` | 候选 | extend Select 有 `lg/sm`；主线现在只有 `sm/default` |
| `Dialog bottomStickOnMobile` | 否 | 更像 Sheet/Drawer 行为，先留业务层 |
| `render` prop | 否 | 与主线 Radix `asChild` 风格重复，增加 Interface 负担 |
| `CardFrame` 组件族 | 否 | extend 视觉容器，不是基础 Card 通用能力 |

## 5. 建议迁移分批

### 第一批：主线 Button 增强 + 少量直接替换

1. 给主线 `Button` 增加 `loading`，使用主线已有/新增 Spinner。
2. 替换只用标准 `variant/size/asChild` 的调用点。
3. 保留 `size="xl"`、`icon-xl`、`destructive-outline` 调用点不动或用 className 显式处理。

### 第二批：Input / Separator / Skeleton / Kbd / Spinner

这些相对简单：

```txt
input
separator
skeleton
kbd
spinner
```

`Input` 要先决定是否增强主线 `size`。

### 第三批：Popover / Tooltip / DropdownMenu / Tabs / Toggle / ScrollArea

这些都是 Radix 组件，但导出名和 class 结构可能不同。按组件逐个替换，避免一次影响文档编辑器和文件系统。

### 第四批：Select

因为 `SelectButton` / `SelectPopup` 命名不同，必须单独处理。迁移时要把：

```txt
SelectPopup -> SelectContent
SelectButton -> SelectTrigger 或 Button + asChild 组合
```

### 第五批：Dialog / Sheet / Sidebar

这批风险最高。`sidebar` 依赖 `sheet/button/input/scroll-area/separator/skeleton/tooltip`，应在前面基础件稳定后再处理。

### 第六批：业务大组件内部依赖收口

最后处理：

```txt
pdf-viewer
docx-viewer
docx-editor
xlsx-viewer
xlsx-editor
file-system
schema-builder
bounding-box-citations
csv-viewer
layout-blocks
```

这些不应并入主线基础件，只需要内部 import 使用主线基础件。

## 6. 不建议做的事

1. 不要把整个 `extend/components/ui` 直接删除；里面有大量业务大组件。
2. 不要把 `render` prop 全面带进主线。
3. 不要为了 extend 视觉把主线组件变成双 DOM 结构，例如 Input 外包 `span`。
4. 不要先碰 Dialog/Sheet/Sidebar；这会把风险放大到所有文档/文件处理组件。
5. 不要把 `extend-*` wrapper 当作旧 import 一刀切删除；它们当前是文档公开入口。

## 7. 删除旧副本前检查命令

```bash
rg -n "@/components/extend/components/ui/(button|input|separator|skeleton|kbd|spinner)" src content
rg -n "@/components/extend/components/ui/(popover|tooltip|dropdown-menu|tabs|toggle|scroll-area)" src content
rg -n "@/components/extend/components/ui/(select|dialog|sheet|sidebar)" src content
rg -n "render=|loading=|size=\"(xl|icon-xl)\"|variant=\"destructive-outline\"" src/components/extend
pnpm typecheck
pnpm lint
pnpm build
```

## 8. 本批结论

extend 已经完成 Base UI 到 Radix 的底层迁移，但它仍是最复杂的独立 shadcn 增强副本。它不能像 uselayouts/manifest 一样直接替换；正确路线是先把 `Button loading` 这类通用能力增强回主线，再分批拔掉 extend 大组件内部对本地基础件的依赖。

交叉审阅重点：是否接受把 `Button loading` 收进主线；是否同意不吸收 `render` prop、`CardFrame`、`DialogViewport/Popup` 等 extend 专属结构。
