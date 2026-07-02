# 事实核查报告（2026-07-02 实测）

> 背景：`01`/`02`/`03` 号文档基于 Explore agent 的两次扫描，经用户质疑后由 Claude 直接实测核查，发现**多处过时/错误数据**。本文档为唯一可信的事实基线，与 01/02/03 冲突时**以本文档为准**。

## 一、重大更正

### ❌ 错误 1：`src/components/base/` 有 154 个文件
**实测**：只有 **1 个文件** `plate-editors-showcase.tsx`，全仓库零引用。
154 这个数字来源不明（可能是 Explore 混淆了历史状态）。处理成本极低：归档或删除这 1 个文件即可。

### ❌ 错误 2：`src/components/ui/` 有 196 个转发壳
**实测**：`src/components/ui/` 目录**已不存在**，`@/components/ui/` 在 src 下**零引用**。
根据 `docs/ARCHITECTURE.md` 和最近提交 `2b1c4d14 (restructure components into domain-aligned core layout)`：Stage B（487 个 ui/ 转发壳改名、220+ 纯转发壳删除）**已经完成**，主线组件已落位 `src/components/core/`（95 个文件，93 个 tsx）。
→ **原计划 Phase 0 的 Q4（ui/ 转发壳是否纳入）作废**。

### ❌ 错误 3：`src/components/patterns/` 空占位目录
**实测**：不存在，无需处理。

### ⚠️ 更正 4：重复 hooks 的副本数普遍偏少

| Hook | Explore 报告 | 实测 | 副本位置（实测） |
|------|:---:|:---:|------|
| use-mobile | 5 | **6** | `_internal/hooks`、`_internal/dice/hooks`、`_internal/gooseui/hooks`、`_internal/uselayouts/hooks`、`document/hooks`、**`media/hooks`（漏报）** |
| use-isomorphic-layout-effect | 3-4 | **5** | `_internal/hooks`、`_internal/dice/hooks`、**`_internal/dice/internal/hooks`（漏报）**、`_internal/gooseui/hooks`、`_internal/sabraman/lib/hooks` |
| compose-refs | 3 | **5** | `_internal/lib`、`_internal/dice/lib`、**`_internal/dice/internal/lib`（漏报）**、`_internal/gooseui/lib`、`data-table-filters/lib` |
| use-as-ref | 3 | 3 ✓ | 无误 |
| use-lazy-ref | 2 | 3 | `_internal/hooks`、`_internal/dice/hooks`、`_internal/gooseui/hooks` |
| use-debounce | 2 | 2 ✓ | `_internal/hooks`、`data-table-filters/hooks` |
| use-media-query | 2 | 2 ✓ | `document/hooks`、`data-table-filters/hooks` |

### ⚠️ 更正 5：hooks 总量
Explore 报告"43 个"，**实测 `use-*` 文件共 97 个**。43 大约只统计了 `_internal` 和主要域，遗漏了 charts/media 深层等位置。
hooks 目录共 **12 处**（新发现 `data-table-filters/lib/store/hooks`），lib 目录共 **16 处**（含 `src/lib`）。

## 二、转发壳的真实现状（回应用户"转发壳不合理"）

Stage B 已删掉大规模 ui/ 转发壳，**现存的"壳/肉分层"只剩一处模式**：

```
src/components/core/<name>.tsx        ← 壳：样式 + 变体 + 组装（如 switch.tsx 129 行）
        │ import
        ▼
src/components/_internal/radix/<name>.tsx   ← 肉：Radix 行为封装（如 switch.tsx 152 行）
```

`_internal/radix/` 共 18 个文件，实测引用分布：

| 状态 | 文件 | 结论 |
|------|------|------|
| **0 引用（孤儿）** | alert-dialog、checkbox、dialog、dropdown-menu、popover、tooltip（6 个） | 死代码，可归档 |
| **恰好 1 处引用**（仅被同名 core 壳引用） | collapsible、file-tree、hover-card、link-preview、progress、radio-group、sheet、switch、tabs、toggle、toggle-group（11 个） | 分层无收益：一壳一肉一对一，纯增加跳转成本 |
| **2 处引用** | accordion（2 个消费方） | 唯一有复用价值的 |

**结论：用户的直觉正确——这个分层对 17/18 的文件没有意义。**

### 对计划的修正建议（新增任务，替代原 T1.4 的"原样搬迁"）

**方案 A（推荐）：就地合并**
- 6 个孤儿 → 归档
- 11 个一对一文件 → 把 `_internal/radix/<name>.tsx` 的实现**合并进** `core/<name>.tsx`，删除 radix 文件（每个组件一个文件，零跳转）
- accordion（2 消费方）→ 视两个消费方关系决定：都在 core 域则也合并，跨域则保留为共享实现移入 foundations
- ⚠️ 合并涉及导出符号整理，风险高于纯搬迁，但一次性还清"壳/肉分层"的债

**方案 B（保守）：按原计划整体搬迁到 `_internals/foundations/primitives/`**
- 保留分层，只改位置。心智负担问题依旧存在

→ **待用户裁决 A 或 B**（这属于行为无关的结构决策，但改动面不同）。

## 三、Phase 0 冻结区问题的答复记录（用户已裁决）

| 问题 | 用户答复 | 对计划的影响 |
|------|---------|------------|
| Q1 工作区处理 | **先 commit + push** | 注意：当前除 53 个 staged rename 外，还有 **19 个未暂存修改 + 2 个未跟踪文件**（含本目录的重构文档），commit 时需一并处理或分开提交，由执行者与用户确认提交拆分方式 |
| Q2 base/ | （基于错误数据提问）实为 1 个文件 | 降级为琐碎任务：归档 `plate-editors-showcase.tsx` 即可 |
| Q3 包名 | 不管它 | 保留 `@your-org/ui-kit` 占位，tsconfig 继续用 `@/kit/*` 内部别名，发包时再定 |
| Q4 ui/ 转发壳 | （问题作废）ui/ 已不存在 | 转发壳问题转化为上文"radix 壳/肉分层"的 A/B 裁决 |
| Q5 Tier 1 名单 | **全部公开** | `kit/hooks` 导出全部通用 hooks（含 useUploadFile）；领域 hooks（charts/media/data-table 专用）仍按 Tier 3 不进 kit——如用户连领域 hooks 也要公开，需另行确认 |

## 四、修正后的关键数字（供 04/05 任务清单校准）

| 指标 | 数值 |
|------|------|
| `use-*` hooks 文件总数 | 97 |
| hooks 目录数 | 12 |
| lib 目录数 | 16（含 src/lib） |
| use-mobile 副本 | 6 |
| use-isomorphic-layout-effect 副本 | 5 |
| compose-refs 副本 | 5 |
| use-lazy-ref 副本 | 3 |
| `_internal/radix` 文件数 | 18（孤儿 6 个） |
| `core/` 文件数 | 95 |
| `base/` 文件数 | 1（零引用） |
| git 工作区 | 53 staged rename + 19 unstaged modified + 2 untracked |

## 五、对既有文档的影响

- `01-global-analysis.md`：问题定性正确（重复、散落），但具体数字以本文档为准
- `02-deduplication-inventory.md`：副本清单需按本文档第一节补全（media/hooks/use-mobile、dice/internal 两处等）
- `03-target-architecture.md`：架构方向不变；"Tier 1 只公开 14 个"改为"通用 hooks 全公开"；删除对 ui/ 转发壳的表述
- `04-execution-tasks-phase0-1.md`：已按本文档修订（见文内 ⚠️ 标记）
