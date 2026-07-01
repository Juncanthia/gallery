# 同名重复组件合并报告索引

> 生成时间：2026-07-01。  
> 范围：当前 worktree 中 `src/components/ui`、`src/components/dice/ui`、`src/components/gooseui/components/ui`、`src/components/limeplay/ui`、`src/components/extend/components/ui`、`src/components/manifest/components/ui`、`src/components/uselayouts/_shared/ui`、`src/components/sabraman/components/ui` 下 `*.tsx` 的同名重复实现。  
> 目标：不再用“0 引用”判断价值，而是按“同名实现能力并集”决定主线 `src/components/ui` 应吸收什么、外部实现应如何下沉或删除。

## 1. 当前重复总览

当前发现 **30 组同名重复组件**。

| 组件 | 数量 | 来源 |
|---|---:|---|
| `accordion` | 2 | base, extend |
| `banner` | 2 | base, dice |
| `button` | 2 | base, extend |
| `card` | 2 | base, extend |
| `carousel` | 2 | base, gooseui |
| `checkbox` | 2 | base, gooseui |
| `color-picker` | 3 | base, dice, extend |
| `combobox` | 2 | base, dice |
| `dialog` | 2 | base, extend |
| `direction` | 2 | base, dice |
| `dropdown-menu` | 2 | base, extend |
| `file-upload` | 2 | dice, extend |
| `input-group` | 2 | base, dice |
| `kanban` | 2 | base, dice |
| `marquee` | 2 | base, dice |
| `masonry` | 2 | base, dice |
| `qr-code` | 2 | base, dice |
| `rating` | 2 | base, dice |
| `select` | 2 | base, extend |
| `sheet` | 2 | base, extend |
| `sidebar` | 3 | base, limeplay, extend |
| `slider` | 2 | base, gooseui |
| `sonner` | 3 | gooseui, dice, extend |
| `status` | 2 | base, dice |
| `tabs` | 2 | base, extend |
| `time-picker` | 2 | base, dice |
| `timeline` | 2 | base, dice |
| `toggle` | 2 | base, extend |
| `tour` | 2 | base, dice |
| `typography` | 2 | base, gooseui |

## 2. 本轮生成的分组报告

| 报告 | 覆盖组件 | 核心问题 |
|---|---|---|
| [`SHADCN-DUPLICATE-MERGE-BASE-ADAPTERS.md`](./SHADCN-DUPLICATE-MERGE-BASE-ADAPTERS.md) | `accordion/button/card/dialog/direction/dropdown-menu/input-group/select/sheet/tabs/toggle` | extend/dice 对主线的 adapter、别名或近重复，判断主线是否要吸收旧 API |
| [`SHADCN-DUPLICATE-MERGE-GOOSEUI.md`](./SHADCN-DUPLICATE-MERGE-GOOSEUI.md) | `carousel/checkbox/slider/typography` | gooseui 的动画、原生控件和排版能力是否并入主线 |
| [`SHADCN-DUPLICATE-MERGE-DICE-COMPOSITES.md`](./SHADCN-DUPLICATE-MERGE-DICE-COMPOSITES.md) | `banner/combobox/kanban/marquee/masonry/qr-code/rating/status/time-picker/timeline/tour` | base 多为 block re-export，dice 多为深实现，需要决定谁是主线深模块 |
| [`SHADCN-DUPLICATE-MERGE-CROSS-DOMAIN.md`](./SHADCN-DUPLICATE-MERGE-CROSS-DOMAIN.md) | `color-picker/file-upload/sidebar/sonner` | 三方或多方领域组件，不能按普通基础件处理 |

## 3. 总判断

### 3.1 可以直接收口为主线的重复

这类重复的外部版本本质是主线 re-export、命名别名或轻 adapter：

```txt
accordion
card
dialog
direction
dropdown-menu
sheet
```

处理原则：主线已经是最终 seam；外部文件不应长期存在。真正要做的是迁移示例和调用点，而不是保留副本。

### 3.2 需要主线吸收能力后再收口

```txt
button
select
tabs
toggle
carousel
checkbox
slider
typography
```

处理原则：先列能力并集，把通用能力做进 `src/components/ui/*`，再删外部实现。不能只因为暂时没引用就删。

### 3.3 base 当前只是 block re-export，需要重新判断主线归属

```txt
banner
kanban
marquee
masonry
qr-code
rating
status
time-picker
tour
```

这些组件名在 base 存在，但很多 base 文件只是导出 `src/components/blocks/*`。这说明它们已经被主线接纳为“复合组件”，但仍需要和 dice 深实现对比，决定：

1. base block 是否已经吸收 dice 深实现；
2. 是否应该把 dice 能力补进 base block；
3. 是否保留 dice 版本作为参考实现直到 demo 补齐。

### 3.4 不能当普通基础件合并

```txt
color-picker
file-upload
sidebar
sonner
```

这些已经是领域组件或服务入口，不适合简单做“能力并集”。它们需要单独设计主线 seam，否则容易把 uploader、toast、sidebar store、播放器 sidebar 之类的业务状态塞进基础件。

## 4. 建议执行顺序

1. **Carousel / Typography**：最适合作为第一组能力并集试点，数量少、差异明确。
2. **Checkbox / Slider**：主线 Radix 与 gooseui 原生/动画版本合并，适合验证“variant/preset 而不是保留副本”。
3. **Button / Select / Tabs / Toggle**：处理 extend 旧 API adapter，把必要别名变成主线能力或一次性改调用点。
4. **Dice composites**：逐个对比 base block 和 dice 深实现，补 demo、补能力，再删除冗余实现。
5. **Cross-domain heavy**：最后处理 `color-picker/file-upload/sidebar/sonner`，每个都要单独方案。

## 5. 完成标准

每个组件族完成时必须满足：

```bash
rg -n "@/components/(dice/ui|gooseui/components/ui|limeplay/ui|extend/components/ui)/<component>" src content
./node_modules/.bin/tsc --noEmit
```

并额外确认：

1. 主线 `src/components/ui/<component>.tsx` 覆盖报告中决定保留的通用能力。
2. 对应 examples / mdx 不再因为漏接而让组件看起来“0 引用”。
3. 外部实现如果仍保留，必须是业务/领域组件，不再是同名基础件副本。
