# limeplay shadcn 副本收口评估

> 范围：`src/components/limeplay/ui/*`、`src/components/limeplay/blocks/*` 中的局部基础按钮/切换件。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`limeplay/ui` 有 44 个文件，其中大部分是播放器领域组件，不是普通 shadcn 副本。

| 类别 | 文件 |
|---|---|
| 标准基础件副本 | `button`、`badge`、`breadcrumb`、`card`、`collapsible`、`dropdown-menu`、`field`、`input`、`label`、`popover`、`select`、`separator`、`sheet`、`skeleton`、`tabs`、`textarea`、`toggle`、`toggle-group`、`tooltip` |
| 布局/展示组件 | `animated-gradient-background`、`animated-group`、`item`、`kbd`、`navigation-menu`、`orb`、`resizable`、`sidebar`、`text-effect` |
| 播放器领域组件 | `captions`、`error-screen`、`fallback-poster`、`limeplay-logo`、`media`、`media-provider`、`mute-control`、`picture-in-picture-control`、`playback-control`、`playback-rate`、`player-layout`、`root-container`、`seek-controls`、`timeline-control`、`timeline-labels`、`volume-control` |
| 局部副本 | `blocks/audio-player/components/button.tsx`、`blocks/video-player/components/button.tsx`、`blocks/video-player/ui/toggle.tsx` |

当前主线 `src/components/ui/limeplay-*.tsx` wrapper 大多指向播放器领域组件或 demo，不应被当作基础件副本删除。

## 2. 旧基础件引用分布

| 旧基础件 | import 数级别 | 主要调用者 |
|---|---:|---|
| `media-provider` | 高 | hooks、internal media、stream panel、audio/video blocks |
| `button` | 高 | playback/mute/captions/seek/pip 控件、stream panel、examples |
| `select` | 中 | `playback-rate`、playback-rate demo、video player playback-rate control |
| `separator` | 中 | `field`、`item`、`sidebar`、stream panel |
| `volume-control` / `timeline-control` | 中 | player blocks、docs、examples |
| `popover` | 低 | stream panel、player-root demo |
| `input` / `textarea` | 低 | stream panel custom overlay、sidebar |
| `toggle` / `toggle-group` | 低 | stream panel、audio action controls |
| `dropdown-menu` | 低 | playlists |

## 3. 主线能力对照与决策

### 3.1 可收口的标准基础件

这些可以逐步改为主线：

```txt
badge
breadcrumb
card
collapsible
dropdown-menu
input
label
popover
select
separator
sheet
skeleton
tabs
textarea
toggle
toggle-group
tooltip
```

主线已有对应能力。多数差异是 className、默认尺寸和导出命名。

### 3.2 Button 需要谨慎

`limeplay/ui/button` 比标准 shadcn Button 多一个播放器视觉 variant：

```tsx
variant="glass"
```

真实调用存在：

```txt
src/components/limeplay/examples/picture-in-picture-control-demo.tsx
src/components/limeplay/blocks/video-player/components/*
```

主线 Button 没有 `glass`，也不建议为了播放器场景把 `glass` 加进主线。`glass` 是播放器控制层的视觉语义，应留在播放器业务层。

**决策：**

- 普通表单/overlay 用法的 `Button` 可以迁主线。
- 播放器控制按钮的 `glass` 用法不进主线；应改为业务层 `className`，或保留/改名为播放器专用 `PlayerButton`。
- `blocks/audio-player/components/button.tsx` 和 `blocks/video-player/components/button.tsx` 是领域按钮，不纳入基础件收口第一批。

### 3.3 Field / Item / Sidebar 不直接收主线

`field.tsx` 类似 shadcn field 组合件，但它和 stream panel 结构、`FieldSeparator`、`FieldContent` 绑定较深。

`item.tsx`、`sidebar.tsx` 是布局组件，不是基础件副本。主线虽有 `sidebar.tsx`，但 limeplay sidebar 的语境和播放器 UI 绑定，不建议直接替换。

### 3.4 MediaProvider / Timeline / Volume 是领域核心

以下是 limeplay 的深模块，不应收进主线基础件：

```txt
media-provider
media
root-container
player-layout
playback-control
playback-rate
captions
mute-control
picture-in-picture-control
seek-controls
timeline-control
timeline-labels
volume-control
error-screen
fallback-poster
limeplay-logo
```

它们的 seam 是播放器运行时和 zustand media store，而不是 UI 基础件。

## 4. 主线需要增强什么

本批不建议增强主线基础件。

| limeplay 能力 | 是否吸收 | 理由 |
|---|---|---|
| Button `glass` | 否 | 播放器控制层视觉语义，应留在业务层 |
| audio player `size="xl"` | 否 | 局部播放器按钮，不是主线 Button 需求 |
| Field 组件族 | 暂不 | 主线已有 `form-field.tsx`，但命名/结构不同；先改调用而不是扩主线 |
| Volume/Timeline primitives | 否 | 媒体领域组件，依赖 player store |
| MediaProvider typed feature store | 否 | 非 UI 基础件，是播放器状态运行时 |

## 5. 建议迁移分批

### 第一批：stream panel 的普通基础件

优先处理：

```txt
stream-panel/custom-overlay.tsx: Button / Input / Textarea
stream-panel/saved-overlay.tsx: Button / Separator
stream-panel/content-overview-overlay.tsx: Separator
stream-panel/overlay-shell.tsx: Button
```

这些更接近普通表单/overlay，不涉及播放器核心 store。

### 第二批：Radix 基础件副本

处理 `select/popover/dropdown-menu/tabs/toggle/toggle-group/tooltip/sheet/skeleton` 等，但每次只改一组，避免影响播放器控制层。

### 第三批：播放器领域按钮收敛

将 `glass` 从通用 `Button` 概念中拆出：

- 方案 A：保留 `blocks/video-player/components/button.tsx` 作为 `PlayerButton`。
- 方案 B：改用主线 `Button variant="ghost"` + 播放器局部 className。

不建议把 `glass` 加入主线 Button。

## 6. 删除旧副本前检查命令

```bash
rg -n "@/components/limeplay/ui/(button|input|textarea|badge|breadcrumb|card|collapsible|dropdown-menu|popover|select|separator|sheet|skeleton|tabs|toggle|toggle-group|tooltip)" src content
rg -n "variant=\"glass\"|components/(audio-player|video-player)/components/button|blocks/video-player/ui/toggle" src/components/limeplay content/components/limeplay
pnpm typecheck
pnpm lint
pnpm build
```

## 7. 本批结论

limeplay 可以收口基础件，但播放器领域控件必须保留。关键不是“全部替换为主线 Button”，而是先把普通 overlay/form 的基础件收口，再把播放器专用 `glass` / `PlayerButton` 明确降到业务层。

交叉审阅重点：是否接受 `glass` 不进入主线 Button；是否接受播放器按钮作为业务组件保留。
