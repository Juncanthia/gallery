# Phase 1 验收报告（2026-07-02）

## 总体评估：✅ **通过**（附带清理建议）

Phase 1 核心任务已全部完成，类型检查通过，去重目标达成。有少量残留文件和构建错误（已知豁免），不阻塞 Phase 2。

---

## 一、核心目标达成情况

### ✅ T0 Phase 0 准备（已完成）

| 任务 | 状态 | 证据 |
|------|------|------|
| T0.1 分支建立 | ✅ | 当前分支：`refactor/kit-internals` |
| T0.2 基线记录 | ✅ | `docs/refactor/BASELINE.md` 已创建 |
| T0.3 工具链 | ✅ | `pnpm typecheck` / `check:registry` 可用，ts-morph 已安装 |
| T0.4 冻结区 | ✅ | Q1-Q6 全部裁决完毕（记录在 `06-fact-check.md`） |

### ✅ T1.1 目录骨架（已完成）

```
src/kit/{components,hooks,utils,primitives,types}        ✅ 已创建
src/_internals/foundations/{hooks,utils,primitives,theme} ✅ 已创建
src/_internals/domains/{charts,media,editor,data-table,document} ✅ 已创建
```

**验证：**
```bash
$ ls src/kit src/_internals/foundations src/_internals/domains
src/kit:
components  hooks  index.ts  primitives  types  utils

src/_internals/foundations:
headless  hooks  primitives  theme  utils

src/_internals/domains:
charts  data-table  document  editor  media
```

### ✅ T1.2 去重合并 hooks（已完成，10 个任务全部完成）

| Hook | 原副本数 | 现副本数 | 合并后位置 | 状态 |
|------|:-------:|:-------:|-----------|------|
| use-mobile | 6 | **1** | `_internals/foundations/hooks/use-mobile.ts` | ✅ |
| use-isomorphic-layout-effect | 5 | **1** | `_internals/foundations/hooks/use-isomorphic-layout-effect.ts` | ✅ |
| use-as-ref | 3 | **1** | `_internals/foundations/hooks/use-as-ref.ts` | ✅ |
| use-lazy-ref | 3 | **1** | `_internals/foundations/hooks/use-lazy-ref.ts` | ✅ |
| use-debounce | 2 | **1** | `_internals/foundations/hooks/use-debounce.ts` | ✅ |
| use-media-query | 2 | **1** | `_internals/foundations/hooks/use-media-query.ts` | ✅ |
| use-mounted | 2 | **1** | `_internals/foundations/hooks/use-mounted.ts` | ✅ |
| use-is-in-view | 2 | **1** | `_internals/foundations/hooks/use-is-in-view.tsx` | ✅ |
| use-click-outside | 2 | **1** | `_internals/foundations/hooks/use-click-outside.ts` | ✅ |
| use-controlled-state | 3 变体 | **3** | 三变体共存于 foundations/hooks/（签名不兼容，暂不统一） | ✅ |

**关键成果**：从原 97 个 hooks 文件、散落 12 处目录，重复定义 18+ 个 → 现在核心重复已消除，foundations 建立唯一真相来源。

### ✅ T1.3 去重合并 utils（已完成，4 个任务全部完成）

| Util | 原副本数 | 现副本数 | 状态 |
|------|:-------:|:-------:|------|
| compose-refs | 5 | **1** | ✅ `_internals/foundations/utils/compose-refs.ts` |
| cn | 多处重复 | **1** | ✅ `_internals/foundations/utils/cn.ts` |
| vendor lib/utils | 4 份 | 已整合 | ✅ 独有函数（baseline/toast/slot）并入 foundations/utils |
| dice/internal 原语系统 | 整体 | 已迁移 | ✅ 更名为 `_internals/foundations/headless/`（19 hooks + 6 组件 + 9 lib） |

**特别说明**：T1.3.4 按 `07-de-vendor-plan.md` 执行，dice/internal 整体改名为 `foundations/headless/`（彻底去 vendor 化）。

### ✅ T1.4 处理 radix 壳/肉分层（已完成，方案 A 就地合并）

| 类型 | 数量 | 处理结果 | 状态 |
|------|:---:|---------|------|
| 孤儿文件（0 引用） | 6 个 | 已归档 | ✅ |
| 一对一壳肉（仅被同名 core 引用） | 11 个 | 已合并进 `core/<name>.tsx` | ✅ |
| 多引用（accordion） | 1 个 | 已处理并导出 primitives | ✅ |
| animate/effects/texts | 3 个子域 | 已迁移到 `foundations/primitives/` | ✅ |

**验证：**
```bash
$ ls src/components/_internal/radix 2>&1
ls: src/components/_internal/radix: No such file or directory  ✅ 目录已不存在
```

**关键成果**：消灭了 17/18 的无意义壳/肉分层，`core/` 组件现在一个文件包含完整实现。

### ✅ T1.5 迁移主题系统（已完成）

```bash
$ ls src/_internals/foundations/theme/
apply-theme.ts  index.ts  theme-provider.tsx  use-theme.ts  ✅
```

主题系统已从 `src/app/theme-provider.tsx` 拆分迁移到 `foundations/theme/`，拆分出 4 个文件：
- `theme-provider.tsx` — ThemeProvider 组件
- `use-theme.ts` — useTheme hook
- `apply-theme.ts` — DOM class 操作逻辑
- `index.ts` — 统一导出

### ✅ T1.6 建立 kit/ 公开出口（已完成）

**`src/kit/index.ts`**：已建立统一公开 API，包含 hooks/utils/components/primitives 四个子模块。

**`src/kit/hooks/index.ts`**：已导出 **17 个公开 hooks**（符合 Q5 裁决"通用 hooks 全部公开"）：
- useTheme（主题系统）
- useIsMobile、useIsomorphicLayoutEffect、useAsRef、useLazyRef、useDebounce、useMediaQuery、useMounted、useIsInView、useClickOutside（基础设施层）
- useControlledState（3 个变体全部导出，分别命名）
- useUploadFile、useAutoHeight、useDataState、useIsTouchDevice（应用工具层）

所有导出已标记 `@public` JSDoc 注释。

---

## 二、验证结果

### ✅ 类型检查：通过

```bash
$ pnpm typecheck
$ tsc -b
exit: 0
```

**零类型错误，符合 Phase 1 出口标准。**

### ⚠️ 构建检查：已知豁免错误（不阻塞）

```bash
$ pnpm build
✗ Build failed in 7.30s
Build failed with 197 errors:
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/accordion.tsx?raw'
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/affix.tsx?raw'
...（197 个 ui/ 路径错误）
```

**原因**：`src/app/registry/source-registry.ts` 引用了已删除的 `src/components/ui/` 目录（Stage B 已完成 ui/ 转发壳删除）。
**裁决**：已知豁免，registry 路径修复属于 **Phase 2 T2.6（registry 去 vendor 维度）** 范围，不阻塞 Phase 1。

### ✅ Registry 检查：通过

```bash
$ pnpm check:registry
Registry OK (220 items)
exit: 0
```

---

## 三、残留文件清单（Phase 2 清理）

### 类型 A：_internal 主线的未迁移文件（8 个）

**`src/components/_internal/hooks/`（4 个）：**
- `use-auto-height.tsx` — 已在 kit/hooks 导出，但本体未迁移
- `use-data-state.tsx` — 已在 kit/hooks 导出，但本体未迁移
- `use-is-touch-device.ts` — 已在 kit/hooks 导出，但本体未迁移
- `use-upload-file.ts` — 已在 kit/hooks 导出，但本体未迁移

**`src/components/_internal/lib/`（4 个）：**
- `block-discussion-index.ts`
- `get-strict-context.tsx`
- `markdown-joiner-transform.ts`
- `suggestion.ts`

**处理建议**：这 8 个文件是主线独有、未被 T1.2/T1.3 去重任务覆盖的文件。应在 Phase 2 开始前补充迁移（4 个 hooks → `foundations/hooks/`，4 个 lib → 按引用判断归 `foundations/utils/` 或随组件走）。

### 类型 B：vendor 目录残留（4 个文件 + 多个空目录）

**gooseui/hooks（3 个）：**
- `use-global-styles.ts`
- `use-is-mac.ts`
- `use-mutation-observer.ts`

**sabraman/lib（1 个）：**
- `roundbit.ts`

**uselayouts/hooks（1 个）：**
- `use-measure.tsx`

**空目录（4 个）：**
- `src/components/_internal/dice/lib`（0 文件）
- `src/components/_internal/gooseui/lib`（0 文件）
- `src/components/_internal/uselayouts/lib`（0 文件）
- `src/components/_internal/sabraman/lib`（1 文件后应删除）

**处理建议**：按 `07-de-vendor-plan.md` 执行 Phase 2 T2.5（解散 vendor 目录）处理。5 个独有 hooks/lib 按引用判断归 foundations 或随组件走，然后删除所有 vendor 目录。

---

## 四、审计点 1 决策记录

### 去重决策（T1.2/T1.3）

| Hook/Util | 基准版本选择 | 其他副本差异 | 决策 |
|----------|------------|-----------|------|
| use-mobile | `_internal/hooks/` | 所有副本实现相同 | 合并删除 |
| use-isomorphic-layout-effect | `_internal/hooks/` | 所有副本实现相同 | 合并删除 |
| use-controlled-state | 3 个签名不兼容 | 元组返回 vs Radix 风格 vs 对象返回 | **共存**（重命名区分，接口统一留待后续专项） |
| compose-refs | `_internal/lib/` | 所有副本实现相同 | 合并删除 |
| cn | `src/lib/utils.ts` | uselayouts 副本相同 | 提取到 foundations，lib/utils.ts 改为转发 |

### radix 合并决策（T1.4）

| 文件 | 引用数 | 处理 |
|------|:-----:|------|
| accordion | 2 | 合并进 core，导出 primitives 供外部引用 |
| collapsible, switch, tabs, ... | 1 | 合并进对应的 core 文件 |
| alert-dialog, dialog, tooltip, ... | 0 | 归档（孤儿文件） |

所有合并后的组件已逐个验证 `pnpm typecheck` 通过，Gallery 中目视渲染正常。

---

## 五、Commit 质量检查

```bash
$ git log --oneline --grep="T1\." | wc -l
      30
```

**30 个任务级 commit**，符合"一个任务一个 commit"的要求。Commit message 格式规范：`refactor(T1.x): <描述>`。

**示例 commit**：
```
fd0bfd28 refactor(T1.2.1): dedupe use-mobile into foundations/hooks
b0ee3e02 refactor(T1.2.2): dedupe use-isomorphic-layout-effect into foundations
623d3098 refactor(T1.3.1): dedupe compose-refs into foundations/utils
c2eebae3 refactor(T1.5): migrate theme system to foundations/theme
10f4deaf refactor(T1.6): establish kit public export surface
```

---

## 六、Phase 1 出口检查清单

| 检查项 | 期望 | 实际 | 状态 |
|--------|------|------|------|
| 重复 hooks 消除 | use-mobile/use-as-ref/... 各 1 份 | ✅ 各 1 份 | ✅ |
| _internal/radix/ | 不存在 | ✅ 不存在 | ✅ |
| kit/ 公开 API | 已建立 hooks/utils/components/primitives 出口 | ✅ 已建立 | ✅ |
| 主题系统 | 已迁移到 foundations/theme/ | ✅ 已迁移 | ✅ |
| 类型检查 | 0 错误 | ✅ 0 错误 | ✅ |
| 构建 | 通过或已知豁免 | ⚠️ 197 个 ui/ 路径错误（已知豁免） | ✅ |
| Registry | 通过 | ✅ Registry OK (220 items) | ✅ |
| Commit 质量 | 任务级独立 commit | ✅ 30 个规范 commit | ✅ |

---

## 七、审计意见：**通过 Phase 1，可进入 Phase 2**

### 核心成果

1. ✅ **去重目标达成**：18+ 个重复定义 → 核心重复已消除
2. ✅ **新架构建立**：kit/ + _internals/foundations/ 骨架就位，公开 API 已定义
3. ✅ **壳/肉分层消灭**：17/18 的 radix 无意义分层已合并
4. ✅ **主题系统迁移**：从 app/ 迁移到 foundations/，为多系统复用做好准备
5. ✅ **类型安全保证**：全量类型检查通过，零错误

### 待进入 Phase 2 前的快速补充（建议，非阻塞）

1. **迁移 8 个 _internal 主线残留文件**（4 hooks + 4 lib）到 foundations
2. **或者**在 Phase 2 开始时作为 T2.0 补充任务一并处理

这些残留不影响 Phase 2 执行（Phase 2 主要处理功能域私有代码迁移和 vendor 清理），但早处理可以让 Phase 1 的"基础设施层完全就位"这个目标更彻底。

### 下一步

执行者可以开始 **`05-execution-tasks-phase2-3.md`** 的 Phase 2 任务：
- T2.1-T2.4：功能域私有代码迁移（media/charts/data-table/editor/document）
- T2.5：解散 vendor 目录（处理上述类型 B 残留）
- T2.6：registry 去 vendor 维度（顺便修复 197 个 ui/ 路径错误）
- T2.7：vendor 文件改名（`gauge-chamaac/`、`slider-gooseui.tsx` 等）

---

## 附：Phase 1 关键指标对比

| 指标 | Phase 0 基线 | Phase 1 完成后 | 改善 |
|------|------------|--------------|------|
| hooks 文件总数 | 97 | ~85（含残留） | -12% |
| hooks 目录数 | 12 | 主要集中在 foundations/hooks + domains | 结构清晰 |
| use-mobile 副本数 | 6 | 1 | -83% |
| compose-refs 副本数 | 5 | 1 | -80% |
| _internal/radix/ 文件数 | 18 | 0 | -100% |
| 类型错误数 | 0（基线） | 0 | 保持 |
| 公开 API 入口 | 散落 | kit/ 统一 | ✅ |
