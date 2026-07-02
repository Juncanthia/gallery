# 去 Vendor 化专项方案（用户裁决：彻底废除 vendor 概念）

> 背景：用户明确表示——组件已被大幅改造，"来源库"已无标记价值；组件库集群将供多套系统使用，目录必须**以开发者视角、按用途组织**。本文档取代 03 文档中所有"按 vendor 保留/分组"的表述。

## 一、vendor 痕迹实测清单（2026-07-02）

好消息：功能域目录（data-entry/data-display 等）**已经扁平化**，无 vendor 子目录。残留集中在以下 5 类：

### 1. `_internal/` 下的 4 个 vendor 目录（核心债务，共 80 文件）

| 目录 | 文件数 | 实际内容 | 去 vendor 后的归宿 |
|------|:---:|------|------|
| `_internal/dice/internal/` | 45 | **一套完整的 headless 原语系统**：19 个行为 hooks（use-controllable-state/use-dismiss/use-typeahead/use-scroll-lock...）+ 6 个无头组件（portal/presence/slot/create-context...）+ 9 个底层 lib（compose-event-handlers/forward-ref...） | 整体更名为 `foundations/headless/`——这是有价值的基础设施，按**用途**命名，抹掉 dice 出身 |
| `_internal/dice/{hooks,lib}/` | 6 | use-as-ref/use-mobile 等，全部与主线重复 | 去重后消灭（Phase 1 T1.2/T1.3 已覆盖） |
| `_internal/gooseui/` | 15 | 8 个 hooks（半数重复；独有：use-click-outside/use-global-styles/use-is-mac/use-mutation-observer）+ 5 个 lib（独有：baseline/slot/toast） | 重复的去重消灭；独有的并入 `foundations/hooks/` 和 `foundations/utils/`，文件名不变（本来就无 vendor 痕迹） |
| `_internal/uselayouts/` | 6 | use-measure/use-mobile/use-outside-click + cn/utils | 同上 |
| `_internal/sabraman/` | 6 | roundbit.ts/utils + 1 个 hook | 同上（roundbit 若仅单组件使用则随组件走） |

### 2. vendor 命名的目录（2 处）

| 位置 | 处理 |
|------|------|
| `src/components/charts/gauge-chamaac/` | 更名。与 `charts/gauge-dice.tsx` 是同用途多实现 → 统一为 `charts/gauge/` 子目录，内部按**特征**命名（见第二节命名规则） |
| `src/components/media/dice/`（1 文件） | 文件按用途更名后移入 media 对应位置，目录删除 |

### 3. vendor 后缀的文件（2 处）

| 文件 | 处理 |
|------|------|
| `src/components/core/slider-gooseui.tsx` | 与 `core/slider.tsx` 是同用途双实现。执行者对比两者视觉/API 差异，按特征改名（如 `slider-fancy.tsx`/`slider-minimal.tsx`——具体名字执行者提案、审计确认），或者若功能重叠度高则由用户裁决保留哪个 |
| `src/components/charts/gauge-dice.tsx` | 并入统一的 `charts/gauge/`（同上） |

### 4. `legacy-*` 前缀文件（vendor 痕迹的变体，data-entry/data-display 内 4 处）

`legacy-slider.tsx`、`legacy-switch.tsx`、`legacy-segmented-control.tsx`、`legacy-clock.tsx`
—— "legacy" 本身就是"旧 vendor 版本"的委婉说法。处理：
- 逐个 `rg` 引用 + 与主线版对比
- 零引用且功能被主线覆盖 → 归档
- 仍有引用/有独特视觉价值 → 按特征改名（不叫 legacy），并入同用途多实现的组织方式
- 拿不准的列入审计材料由用户逐个裁决

### 5. registry / catalog / 文档中的 vendor 字段

- `app/registry/data/libraries.ts`、catalog 的 `libraryId` 分组、docs 中的库来源介绍
- 处理：Phase 3 的 registry 同步任务扩展为——**删除 vendor/libraryId 维度**，分类只按功能域；`libraries.ts` 若被导航消费需同步改造 catalog（这部分工作量不小，见任务 T2.6）

## 二、去 vendor 后的命名规则（写入 ARCHITECTURE.md）

1. **目录 = 用途**：`charts/gauge/`、`data-entry/slider/`，永远不出现来源名
2. **同用途多实现 = 特征命名**：变体名描述**它是什么样/适合什么场景**，不描述它从哪来：
   - ✅ `gauge/radial.tsx`、`gauge/arc.tsx`、`slider/with-ticks.tsx`、`switch/spring.tsx`
   - ❌ `gauge-dice.tsx`、`slider-gooseui.tsx`、`legacy-switch.tsx`
3. **具体变体名由执行者根据组件实际外观/API 提案**，在审计点提交（含截图或特征描述），审计后定名
4. 新贡献代码**禁止**引入任何来源标记（CI 检查见 T3.5 扩展项）

## 三、对既有任务清单的修订

### 04 文档（Phase 1）修订项

- **T1.3.3 / T1.3.4 修订**：目标从"vendor 特有的移入 foundations 并保留" → "独有实现直接并入 foundations（文件名已无 vendor 痕迹，无需改名）；`dice/internal/` 整体更名迁移为 `foundations/headless/`"
- **T1.2.10 补充**：`use-controllable-state`（dice internal 版）随 headless 系统整体走，不单独处理

### 05 文档（Phase 2）修订项

- **T2.5 改写**（原"解散 vendor 目录"）：Phase 1 完成后 `_internal/{dice,gooseui,uselayouts,sabraman}` 应已只剩空壳或零散文件，本任务负责：清点残余 → 归位 → 删除 4 个目录 → `rg "gooseui|uselayouts|sabraman" src` 全局复查（dice 单词有误伤风险，用 `rg "_internal/dice|/dice/"` 精确匹配）
- **新增 T2.6：registry/catalog 去 vendor 维度**
  - [ ] `app/registry/data/libraries.ts`：查明消费方（导航/筛选 UI），移除 library 分组维度或改为功能域分组
  - [ ] registry entries 中的 vendor 相关字段清理
  - [ ] `pnpm sync:registry && pnpm check:registry` 通过
  - [ ] Gallery 导航目视验证：不再出现 dice/gooseui 等来源分类
- **新增 T2.7：vendor 命名文件/目录的更名**（对应本文档第一节 2/3/4 类）
  - [ ] `charts/gauge-chamaac/` + `charts/gauge-dice.tsx` → `charts/gauge/<特征名>.tsx`
  - [ ] `core/slider-gooseui.tsx` → 特征命名或裁决去留
  - [ ] `media/dice/` 解散
  - [ ] 4 个 `legacy-*` 文件逐个处置（归档/特征改名），决策记录进审计材料
  - [ ] registry/docs 中对应的 slug、路径同步更新

### T3.5 防回潮扩展项

- [ ] `scripts/check-no-vendor-names.ts`：扫描 `src/` 下文件/目录名及 import 路径中出现 `dice|gooseui|uselayouts|sabraman|chamaac|bklit`（`react-bits` 需精确匹配路径段避免误伤），发现即报错，挂入 CI

## 四、03 文档中被本方案取代的内容

| 03 原表述 | 取代为 |
|----------|--------|
| `_internals/vendors/` 目录（vendor 库残留暂存区） | **不设立**。没有"暂存"，Phase 1/2 内彻底消化 |
| registry schema 增加 `vendor?: string` 字段 | **不增加**。相反要删除现有 vendor 维度 |
| `_internals/domains/` 下按 vendor 分子目录的任何示例 | domains 下只按功能命名 |
| Tier 2 表格中"dice 组件库内部"等表述 | headless 原语系统统一位于 `foundations/headless/` |
