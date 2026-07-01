# 同名重复组件合并报告：Dice 复合组件组

> 覆盖：`banner/combobox/kanban/marquee/masonry/qr-code/rating/status/time-picker/timeline/tour`。  
> 特征：这些名字在 `src/components/ui` 已存在，但 base 多数是导出 `src/components/blocks/*`；dice 版本通常是更底层、更完整的交互 primitive。合并时要判断谁才是主线深模块。

## 1. 组件清单

| 组件 | base 当前形态 | dice 当前形态 | 合并判断 |
|---|---|---|---|
| `banner` | `src/components/ui/banner.tsx` re-export block | 707 行 store/context/portal/strategy 实现 | 应对比 block 能力，可能需要吸收 dice 队列/策略能力 |
| `combobox` | 主线命令面板 + popover 的 API-first Combobox | dice re-export 到 `components/dice/combobox` | 主线优先；dice 能力需从真实源继续读 |
| `kanban` | base re-export block | dice dnd-kit 深实现 | 必须逐项比对拖拽、列/卡片 API，不能直接删 |
| `marquee` | base re-export block | dice Radix context + edge/fade/方向/循环 | 主线 block 应吸收方向、边缘渐隐、速度等通用能力 |
| `masonry` | base re-export block | dice positioner/virtual layout 深实现 | 需要单独评估性能与虚拟化，不当普通 UI 基础件 |
| `qr-code` | base re-export block | dice canvas/svg/download/overlay/skeleton | 主线应吸收 format/download/overlay 能力 |
| `rating` | base re-export block | dice orientation/activation/step/hidden input | 主线应吸收 a11y、半星/step、keyboard 能力 |
| `status` | base re-export block | dice status primitive，variant/size/color | 主线 status 应统一语义，不保留两套颜色系统 |
| `time-picker` | base re-export block | dice 2214 行 segment/period/popover/columns | 高价值候选；需单独深评估 |
| `timeline` | 主线 212 行 motion/AntD-like timeline | dice 713 行 Radix context/status/orientation | 主线应吸收 dice 的 item state/connector 思路，但保留现有 API |
| `tour` | base re-export block | dice Floating UI + portal + step store | 高价值候选；应并入主线 block，不能删掉参考实现 |

## 2. 关键事实

这组不等同于“外部 shadcn 基础件副本”。它们多半已经是 composite：

- base 文件存在，说明主线已经认可这些组件名；
- dice 文件行数大，说明外部实现可能比当前 base block 更深；
- 示例漏接会造成“0 引用”假象，所以不能以引用数判断删除。

## 3. 逐组件合并策略

### 3.1 Banner

Dice 能力信号：

- `BannerVariant`；
- `BannerSide`；
- `BannerStrategy`；
- store/context；
- portal；
- close element；
- render props；
- 多 banner 数据队列。

主线应检查 `src/components/blocks/banner` 是否已有：

- 多实例队列；
- dismiss；
- fixed/inline；
- top/bottom/left/right；
- priority/strategy。

如果没有，dice 的 store/strategy 是应吸收的核心能力。

### 3.2 Kanban

Dice 能力信号：

- dnd-kit；
- column/card sortable；
- drag overlay；
- keyboard coordinate；
- collision detection；
- orientation。

主线如果只是 demo block，应把 dice 当成主线候选实现，而不是保留两个 Kanban。

### 3.3 Marquee

Dice 能力信号：

- `orientation`；
- `direction`；
- `Side`；
- edge/fade；
- loop；
- root/content/context。

主线建议 API：

```ts
orientation?: "horizontal" | "vertical"
direction?: "normal" | "reverse"
speed?: number
pauseOnHover?: boolean
fade?: boolean | { size?: number }
repeat?: number
```

### 3.4 Masonry

Dice 是完整 positioner 实现，包含缓存、interval tree、positioner item。不能直接并入轻量 block。

建议：

- 如果主线只负责静态 masonry，保留轻量 API；
- 如果 gallery 需要大列表瀑布流，吸收 dice 的 positioner 作为内部实现；
- 不把 positioner 细节暴露到主线 props。

### 3.5 QR Code

Dice 能力信号：

- canvas/svg；
- image；
- download；
- overlay；
- skeleton；
- level；
- color。

主线建议 API：

```ts
value: string
level?: "L" | "M" | "Q" | "H"
renderAs?: "svg" | "canvas"
downloadable?: boolean
overlay?: React.ReactNode
size?: number
```

### 3.6 Rating

Dice 能力信号：

- hidden input；
- keyboard；
- orientation；
- activation mode；
- step；
- item context。

主线应优先吸收 a11y/step，而不是只复制视觉星星。

### 3.7 Status

主线应统一：

```ts
status?: "success" | "processing" | "warning" | "error" | "default"
variant?: "dot" | "badge" | "text"
```

dice 的 `variant/size/color` 可以映射到主线语义，不建议保留另一套颜色 API。

### 3.8 TimePicker

Dice 是高价值深实现。合并要单独开报告，重点看：

- value 类型；
- 12/24 小时；
- segment 输入；
- popover 列选择；
- hidden input；
- keyboard；
- timezone 是否存在；
- 与主线 form 控件配合。

### 3.9 Timeline

主线已有 AntD-like Timeline，dice 更偏 primitive/context。建议：

- 保留主线 `items` API；
- 吸收 dice 的 connector/status/active state；
- 不暴露 dice store/context 到调用方。

### 3.10 Tour

Dice 使用 Floating UI + portal + step store，是高价值实现。主线 Tour 应吸收：

- steps；
- current；
- target 定位；
- next/prev/close；
- mask；
- placement；
- scroll offset；
- controlled/uncontrolled。

## 4. 建议执行顺序

1. `timeline/status/rating`：中等复杂，适合先统一语义。
2. `qr-code/marquee`：能力明确，适合补主线 API。
3. `banner/tour/time-picker`：深实现，单独细化报告。
4. `kanban/masonry`：涉及 dnd/positioner，最后做。

## 5. 删除外部实现前的最低要求

每个组件都必须先补齐主线 demo，否则“示例漏了”会再次造成误判。

```bash
rg -n "@/components/dice/ui/(banner|combobox|kanban|marquee|masonry|qr-code|rating|status|time-picker|timeline|tour)" src content
rg -n "src/components/ui/(banner|combobox|kanban|marquee|masonry|qr-code|rating|status|time-picker|timeline|tour).tsx" content src/gallery
./node_modules/.bin/tsc --noEmit
```
