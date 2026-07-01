# 同名重复组件合并报告：跨领域重组件组

> 覆盖：`color-picker/file-upload/sidebar/sonner`。  
> 特征：这些不是普通 shadcn 基础件，而是带领域状态、外部服务、布局 store 或复合交互的深模块。合并目标是确定主线 seam，而不是把所有 props 拼在一起。

## 1. 组件清单

| 组件 | 数量 | 来源 | 主要风险 |
|---|---:|---|---|
| `color-picker` | 3 | base, dice, extend | 色彩模型、输入格式、Popover/Select/Button 依赖、EyeDropper |
| `file-upload` | 2 | dice, extend | 上传状态、拖拽、列表、预览、业务文件类型 |
| `sidebar` | 3 | base, limeplay, extend | layout store、cookie、mobile sheet、播放器/文档业务侧栏 |
| `sonner` | 3 | gooseui, dice, extend | toast provider 主题、图标、项目级 Toaster seam |

## 2. ColorPicker

### 当前实现

- base：`src/components/ui/color-picker.tsx`，导出 `src/components/blocks/color-picker`；
- dice：1686 行深实现，包含 color format、HSV、方向、Popover、Select、EyeDropper、hidden input；
- extend：494 行应用型实现，导出 `ColorPicker` 和 `ColorPickerPanel`，依赖主线 `Input/Popover`、extend `Button/Select`。

### 能力并集

| 能力 | base | dice | extend | 是否主线吸收 |
|---|---|---|---|---|
| 多格式颜色 | 需要确认 | 有 | 有 `hex/rgb/hsl/hsv` 相关类型 | 是 |
| HSV/HSL 输入 | 需要确认 | 有 | 有 | 是 |
| Alpha | 需要确认 | 有 | 需要确认 | 是 |
| EyeDropper | base type 有 | 有 | 未明显看到 | 是，作为可选能力 |
| Popover trigger | 需要确认 | 有 | 有 | 是 |
| Panel 独立使用 | 需要确认 | 有子组件 | `ColorPickerPanel` | 是 |
| Select/Button 旧 adapter | 不需要 | dice 内部 | extend 依赖旧 adapter | 不吸收，迁移到主线基础件 |

### 建议主线 seam

```ts
type ColorFormat = "hex" | "rgb" | "hsl" | "hsv"

type ColorPickerProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: { format: ColorFormat }) => void
  format?: ColorFormat
  alpha?: boolean
  eyeDropper?: boolean
  presets?: string[]
  panel?: boolean
}
```

实现上优先保留一个主线 `ColorPicker`，内部吸收 dice 的色彩数学和 extend 的 panel 组合能力。

## 3. FileUpload

### 当前实现

- dice：1415 行，dropzone、trigger、list、item、store、file state；
- extend：337 行，偏业务文档上传，含 `AcceptedFileType`、文件卡片、边框动效、缩略图。

### 能力并集

| 能力 | dice | extend | 主线处理 |
|---|---|---|---|
| dropzone | 有 | 有 | 吸收 |
| trigger | 有 | 有 | 吸收 |
| file list/item | 有 | 有 | 吸收基础形态 |
| drag 状态 | 有 | 有 | 吸收 |
| accepted file type | 通用 accept | 文档业务类型 | 通用 `accept/maxSize/multiple` 进主线；业务类型留业务层 |
| thumbnail / file preview | 基础 item | 文档缩略图 | 主线只提供 slot，具体缩略图留业务层 |
| upload transport | 未见强绑定 | 未见强绑定 | 不进主线；主线只管选择和状态 |

### 建议主线 seam

```ts
type FileUploadProps = {
  value?: File[]
  defaultValue?: File[]
  onChange?: (files: File[]) => void
  accept?: string | string[]
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  renderItem?: (file: File, state: FileUploadItemState) => React.ReactNode
}
```

不要把 extend 的文档业务枚举塞进主线。

## 4. Sidebar

### 当前实现

- base：799 行，已经是主线 Sidebar，含 mobile sheet、cookie、motion、tooltip、provider；
- limeplay：848 行，播放器/stream panel 侧栏变体，已依赖主线 Button/Input/Separator/Sheet/Skeleton/Tooltip；
- extend：27 行，主线 re-export。

### 判断

extend sidebar 无需保留，最终删。limeplay sidebar 不能直接并入主线，它是播放器 UI 的领域侧栏。

### 主线可吸收能力

需要对比后决定：

- `reserveSpace`；
- `variant="floating|inset|sidebar"` 的差异；
- icon collapsed width；
- mobile width；
- keyboard shortcut；
- cookie name 是否可配置。

### 不应吸收

- 播放器专属布局；
- stream panel 状态；
- 文档编辑器侧栏业务结构。

## 5. Sonner

### 当前实现

- gooseui：lucide 图标 + next-themes + sonner；
- dice：next-themes + sonner，较薄；
- extend：Hugeicons 图标 + next-themes + sonner。

### 判断

项目只应该有一个主线 Toaster seam。建议新增或确认主线：

```txt
src/components/ui/sonner.tsx 或 src/components/ui/toaster.tsx
```

能力吸收：

- theme 跟随 `next-themes`；
- toast classNames 统一；
- 默认图标可配置，但不绑定 gooseui 或 extend 的图标库；
- 不保留三套 Toaster wrapper。

### 建议 API

```ts
type ToasterProps = React.ComponentProps<typeof SonnerToaster> & {
  icons?: Partial<Record<"success" | "info" | "warning" | "error" | "loading", React.ReactNode>>
}
```

## 6. 建议执行顺序

1. `sonner`：最小，先确立唯一 Toaster seam。
2. `sidebar`：先删除 extend re-export，limeplay 保留为领域侧栏。
3. `color-picker`：单独深评估后合并，是高价值主线组件。
4. `file-upload`：最后做，涉及业务文件预览和状态模型。

## 7. 验证命令

```bash
rg -n "@/components/(dice/ui|extend/components/ui)/(color-picker|file-upload)" src content
rg -n "@/components/(limeplay/ui|extend/components/ui)/sidebar" src content
rg -n "@/components/(gooseui/components/ui|dice/ui|extend/components/ui)/sonner" src content
./node_modules/.bin/tsc --noEmit
```
