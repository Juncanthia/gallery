# sabraman shadcn 副本收口评估

> 范围：`src/components/sabraman/components/ui/*`。本报告只做迁移前调研和决策，不直接修改实现代码。

## 1. 当前事实

`sabraman` 目前只有 1 个局部 `components/ui` 文件：

| 文件 | 行数 | 性质 | 主线对应 | 当前判断 |
|---|---:|---|---|---|
| `dialog.tsx` | 146 | Radix Dialog wrapper，视觉被调成透明容器 | `src/components/ui/dialog.tsx` | 可收口，但要先确认 legacy 弹窗外观 |

真实旧路径引用只有 1 处：

```txt
src/components/sabraman/components/legacy-alert-dialog.tsx
```

`sabraman` 的公开入口仍是主线 wrapper：

```txt
src/components/ui/sabraman-alert-dialog.tsx
src/components/ui/sabraman-bar-button.tsx
src/components/ui/sabraman-clock.tsx
src/components/ui/sabraman-code-block.tsx
src/components/ui/sabraman-notification.tsx
src/components/ui/sabraman-roundbit.tsx
src/components/ui/sabraman-segmented-control.tsx
src/components/ui/sabraman-slider.tsx
src/components/ui/sabraman-switch.tsx
```

这些 wrapper 是 gallery 文档公开 seam，不属于本批删除对象。

## 2. 主线能力对照

`sabraman/components/ui/dialog.tsx` 与主线 `src/components/ui/dialog.tsx` 的导出基本一致：

```txt
Dialog
DialogTrigger
DialogPortal
DialogClose
DialogOverlay
DialogContent
DialogHeader
DialogFooter
DialogTitle
DialogDescription
```

两者都支持：

```tsx
showCloseButton?: boolean
```

关键差异是默认视觉：

| 项 | sabraman 局部 Dialog | 主线 Dialog |
|---|---|---|
| Overlay | `bg-black/60` | `bg-black/10` + `backdrop-blur-xs` |
| Content | `border-none bg-transparent p-0 shadow-none` | `rounded-xl bg-popover p-6 ring-1` |
| Header | `text-center sm:text-left` | 只设 `flex flex-col gap-2` |
| Close | 内部裸 close button | 主线使用 `Button variant="ghost" size="icon-sm"` |

`LegacyAlertDialogContent` 当前已经给 `DialogContent` 传入：

```tsx
className="w-[min(92vw,17.25rem)] max-w-none border-none bg-transparent p-0 shadow-none sm:max-w-none"
showCloseButton={false}
```

也就是说：主线 `DialogContent` 的默认背景、padding、shadow 基本会被调用点覆盖掉。真正需要复核的是 overlay 变浅和 header 默认对齐差异。

## 3. 是否需要增强主线

本批不建议增强主线。

| sabraman 差异 | 是否吸收 | 理由 |
|---|---|---|
| `bg-black/60` overlay | 否 | legacy 弹窗视觉，不应成为全局 Dialog 默认 |
| transparent DialogContent 默认值 | 否 | 这是 LegacyAlertDialog 的局部外观，可通过调用点 className 表达 |
| Header `text-center sm:text-left` | 否 | 单组件视觉语义，调用点可覆盖 |
| close button 裸样式 | 否 | 主线已统一用主线 Button，符合收口目标 |

如果迁移后 LegacyAlertDialog 视觉需要更暗的遮罩，应在 `LegacyAlertDialogContent` 或 `LegacyAlertDialog` 局部传 `DialogOverlay`/class，而不是增强主线 Dialog 的 Interface。

## 4. 建议迁移方式

`sabraman` 可以作为一个独立低风险批次处理：

1. 将 `legacy-alert-dialog.tsx` 的 Dialog import 改到 `@/components/ui/dialog`。
2. 保留 `LegacyAlertDialogPanel`、`LegacyAlertDialogButton` 等 Smartisan/legacy 视觉实现。
3. 根据视觉 smoke 决定是否在 `LegacyAlertDialogContent` 局部补 `DialogContent` className；不改主线默认 Dialog。
4. 旧路径 `src/components/sabraman/components/ui/dialog.tsx` 清零后，再考虑删除。

## 5. 删除旧副本前检查命令

```bash
rg -n "@/components/sabraman/components/ui/dialog|src/components/sabraman/components/ui/dialog|components/sabraman/components/ui/dialog" src content
pnpm typecheck
pnpm lint
pnpm build
```

## 6. 本批结论

`sabraman` 不是一套完整 shadcn 副本，只剩一个局部 Dialog wrapper。它可以收口到主线 Dialog，但不需要为 sabraman 增强主线。迁移风险主要是 LegacyAlertDialog 的遮罩深度和弹窗边缘视觉，应通过局部 className 解决。
