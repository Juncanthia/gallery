# 同名重复组件合并报告：GooseUI 组

> 覆盖：`carousel/checkbox/slider/typography`。  
> 特征：gooseui 不是单纯 shadcn 副本，这组组件里包含动画、原生控件和轻排版 DSL。不能按“无引用”删除，必须按能力并集评估。

## 1. 组件清单

| 组件 | base 实现 | gooseui 实现 | 主线合并判断 |
|---|---|---|---|
| `carousel` | `src/components/ui/carousel.tsx`，Embla，items/arrows/dots/autoplay | `src/components/gooseui/components/ui/carousel.tsx`，自写 scroll snap，loop/drag/pauseOnHover/dots/buttons | 主线吸收 gooseui 的 loop/pauseOnHover/组合式命名能力，保留 Embla 作为实现 |
| `checkbox` | Radix Checkbox，标准 a11y | SVG path 动画，label/variant/size，原生 input | 主线不替换 Radix；可增加 `label/size` 和 `animation="check-path"` 或拆成 `AnimatedCheckbox` |
| `slider` | Radix Slider，range/marks/dots/tooltip/vertical/reverse | 原生 input range，showValue/animateValue/formatValue/size | 主线吸收 value display 能力；不放弃 Radix range 能力 |
| `typography` | AntD-like Typography：Text/Title/Paragraph/Link/copyable/ellipsis | 单一 `Typography` wrapper，`variant=h1/h2/.../gradient/highlight` | 主线吸收 `gradient/highlight` 或作为 `Text` variant；不保留 gooseui 单组件 DSL |

## 2. Carousel 能力并集

### base 已有

- Embla 实现；
- `items` 数据驱动；
- `children` 组合式；
- `arrows`；
- `dots`；
- `dotPlacement`；
- `autoplay/autoplaySpeed`；
- `beforeChange/afterChange`；
- `orientation`；
- `setApi`。

### gooseui 额外

- 自写 scroll snap；
- `loop`；
- `draggable`；
- `pauseOnHover`；
- `CarouselButton` / `CarouselDots` 组合件；
- active index 由滚动位置计算；
- 不依赖 Embla。

### 主线建议

保留 Embla，不重写为 scroll snap。吸收 API：

```ts
loop?: boolean
pauseOnHover?: boolean
```

其中：

- `loop` 映射到 Embla `opts.loop`；
- `pauseOnHover` 只影响 autoplay timer；
- `draggable` 不需要新增，Embla 默认已支持拖拽；如要显式关闭，可映射 Embla `watchDrag: false`。

组合件方面，主线已有 `CarouselContent/CarouselItem/CarouselPrevious/CarouselNext` 一类导出时，不要引入 gooseui 的 `CarouselButton` 命名；如果主线缺 dots 组合件，可新增 `CarouselDots`。

## 3. Checkbox 能力并集

### base 已有

- Radix Checkbox；
- `checked/defaultChecked/onCheckedChange`；
- indeterminate 语义；
- keyboard/a11y；
- `aria-invalid` 样式。

### gooseui 额外

- `label?: string`；
- `variant: default | destructive | success`；
- `size: sm | default | lg`；
- SVG path 勾选动画；
- 原生 hidden input。

### 主线建议

不放弃 Radix Checkbox。可吸收：

```ts
label?: React.ReactNode
size?: "sm" | "default" | "lg"
intent?: "default" | "danger" | "success"
animation?: "default" | "path"
```

但建议第一阶段只吸收：

```ts
size?: "sm" | "default" | "lg"
label?: React.ReactNode
```

SVG path 动画可以作为第二阶段，或者单独命名为 `AnimatedCheckbox`，避免把主线 Checkbox DOM 搞复杂。

## 4. Slider 能力并集

### base 已有

- Radix Slider；
- 单值 / range；
- `marks`；
- `dots`；
- `tooltip`；
- `vertical` / `orientation`；
- `reverse`；
- `onChange/onChangeComplete`。

### gooseui 额外

- `showValue`；
- `animateValue`；
- `formatValue`；
- 原生 input range；
- `size: sm | md | lg`。

### 主线建议

保留 Radix。吸收：

```ts
showValue?: boolean
valueFormatter?: (value: number) => React.ReactNode
valuePlacement?: "start" | "end" | "top" | "bottom"
animateValue?: boolean
size?: "sm" | "default" | "lg"
```

命名上建议用 `valueFormatter`，不要照搬 gooseui 的 `formatValue`，因为主线已有 `tooltip.formatter`，两者需要区分。

## 5. Typography 能力并集

### base 已有

- `Typography.Text` 类 AntD API；
- `Typography.Title`；
- `Typography.Paragraph`；
- `Typography.Link`；
- `copyable`；
- `ellipsis`；
- `type/status/disabled/underline/italic/delete/mark/code/keyboard/strong`。

### gooseui 额外

- 单组件 `Typography`；
- `variant: h1/h2/h3/h4/p/lead/large/small/muted/blockquote/code/gradient/highlight`；
- `affects: removePMargin | withPMargin`；
- `as` 自定义标签。

### 主线建议

不保留 gooseui 的单组件 DSL。吸收视觉能力：

```ts
Typography.Text variant="gradient"
Typography.Text variant="highlight"
```

或者更符合现有主线命名：

```ts
<Typography.Text gradient>...</Typography.Text>
<Typography.Text mark>...</Typography.Text>
```

`h1/h2/h3/h4` 继续由 `Typography.Title level={1|2|3|4}` 表达。

## 6. 建议执行顺序

1. `typography`：最小，先把 `gradient/highlight` 能力收进主线或决定放弃。
2. `slider`：吸收 `showValue/valueFormatter/animateValue`。
3. `carousel`：吸收 `loop/pauseOnHover`，补 dots 组合件。 
4. `checkbox`：先吸收 `label/size`，动画另起小决策。

## 7. 验证命令

```bash
rg -n "@/components/gooseui/components/ui/(carousel|checkbox|slider|typography)" src content
./node_modules/.bin/tsc --noEmit
```
