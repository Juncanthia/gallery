# 执行任务清单（上）：Phase 0 准备 + Phase 1 基础设施

> 执行者文档。每个任务包含：目标 / 前置条件 / 步骤 / 验证 / 回滚。
> 勾选规则：`[ ]` 未开始 → `[x]` 完成并通过验证。**验证不过不许勾选。**
> 目标架构定义见 `03-target-architecture.md`；**具体文件数量/副本位置以 `06-fact-check.md` 实测为准**（01/02 中的数字有误报）。

---

## Phase 0：准备与基线（预计 0.5-1 天）

### T0.1 建立重构分支

- [ ] 从 main 创建分支 `refactor/kit-internals`
- [ ] 确认工作区干净（当前 git status 有大量 staged 的 gallery→app 迁移，**必须先由用户决定提交或还原**，不得在脏工作区上开始）

**验证：**
```bash
git status --porcelain | wc -l   # 期望：0
git branch --show-current         # 期望：refactor/kit-internals
```

### T0.2 记录基线指标

- [ ] 记录当前指标到 `docs/refactor/BASELINE.md`（新建，仅数字，不写分析）：

```bash
# hooks 文件总数
find src -type f \( -name "use-*.ts" -o -name "use-*.tsx" \) | wc -l
# hooks 所在目录清单
find src -type f \( -name "use-*.ts" -o -name "use-*.tsx" \) -exec dirname {} \; | sort -u
# lib 目录数量
find src -type d -name "lib" | sort
# use-mobile 副本数
find src \( -name "use-mobile.ts" -o -name "use-mobile.tsx" \) | sort
# 类型检查基线（必须先是 0 错误，否则重构后无法归因）
pnpm type-check 2>&1 | tail -5
```

- [ ] 若 `pnpm type-check` 基线本身有错误 → **停止**，先修复或记录豁免清单，报告用户

### T0.3 确认验证工具链可用

- [ ] `pnpm type-check` 可运行
- [ ] `pnpm build` 可运行且通过（记录构建时长作基线）
- [ ] `pnpm check:registry` 可运行（registry 一致性检查）
- [ ] 确认 `ts-morph` 已安装（codemod 依赖）：`pnpm ls ts-morph`；未安装则 `pnpm add -D ts-morph`

### T0.4 冻结区确认（✅ 已裁决，见 06-fact-check.md 第三节）

- [x] Q1：工作区 → **先 commit + push**。注意除 53 个 staged rename 外还有 19 个 unstaged 修改 + 2 个 untracked 文件，提交拆分方式执行者与用户现场确认
- [x] Q2：`base/` 实测只有 1 个文件（`plate-editors-showcase.tsx`，零引用）→ 归档即可
- [x] Q3：包名 → 暂不定，内部别名用 `@/kit/*`
- [x] Q4：（作废）`ui/` 目录已不存在，Stage B 已完成。转发壳问题转化为 **Q6**
- [x] Q5：Tier 1 名单 → **通用 hooks 全部公开**（含 useUploadFile）；charts/media/data-table 领域 hooks 仍为 Tier 3 不进 kit
- [x] **Q6**：`_internal/radix/` 壳/肉分层 → **方案 A（就地合并进 core，消灭分层）**，见 `06-fact-check.md` 第二节 + `AGENT_BRIEFING.md`

### Phase 0 出口检查

- [ ] 分支就绪、基线记录完毕、4 个验证命令全部可用、Q1-Q5 全部有答复
- [ ] **审计点 0**：将 BASELINE.md 与 Q1-Q5 答复提交审计

---

## Phase 1：建立 kit/ 与 _internals/，完成去重（预计 4-6 天）

### T1.1 创建目录骨架

- [ ] 创建以下目录（空目录先放 `.gitkeep`）：

```
src/kit/{components,hooks,utils,primitives,types}
src/_internals/foundations/{hooks,utils,primitives,theme}
src/_internals/domains/{charts,media,editor,data-table,document}
```

- [ ] 在 `tsconfig.json` 确认 `@/*` 别名已覆盖 `src/_internals/*` 和 `src/kit/*`（现有 `"@/*": ["./src/*"]` 应已覆盖，只需确认，**不新增别名**）

**验证：** `ls src/kit src/_internals/foundations src/_internals/domains`

### T1.2 去重合并 hooks —— 逐个执行，一个 hook 一个 commit

> 通用流程（每个 hook 都走一遍）：
> 1. `diff` 所有副本，记录差异到 commit message
> 2. 选定基准版本（默认选 `src/components/_internal/hooks/` 主线版；若其他副本功能更全，说明理由）
> 3. `git mv` 基准版到 `src/_internals/foundations/hooks/`
> 4. 用 codemod 或手动把**所有副本的引用**改到新路径
> 5. 删除其余副本（此时它们应零引用）
> 6. `pnpm type-check` → commit

- [ ] **T1.2.1 use-mobile（6 副本 → 1，实测见 06 文档）**
  副本位置：
  - `src/components/_internal/hooks/use-mobile.ts`（基准候选）
  - `src/components/_internal/dice/hooks/use-mobile.ts`
  - `src/components/_internal/gooseui/hooks/use-mobile.ts`
  - `src/components/_internal/uselayouts/hooks/use-mobile.ts`
  - `src/components/document/hooks/use-mobile.ts`
  - `src/components/media/hooks/use-mobile.ts`
  注意：各副本导出名可能不同（`useIsMobile` vs `useMobile`），合并后统一导出名，codemod 需同时改 import 路径和导入符号名
- [ ] **T1.2.2 use-isomorphic-layout-effect（5 副本 → 1）**
  - `_internal/hooks/`、`_internal/dice/hooks/`、`_internal/dice/internal/hooks/`、`_internal/gooseui/hooks/`、`_internal/sabraman/lib/hooks/`
- [ ] **T1.2.3 use-as-ref（3 副本 → 1）**
  - `_internal/hooks/`、`_internal/dice/hooks/`、`_internal/gooseui/hooks/`
- [ ] **T1.2.4 use-lazy-ref（3 副本 → 1）**
  - `_internal/hooks/`、`_internal/dice/hooks/`、`_internal/gooseui/hooks/`
- [ ] **T1.2.5 use-debounce（2 副本 → 需先 diff 判断）**
  - `_internal/hooks/use-debounce.ts`、`data-display/data-table-filters/hooks/use-debounce.ts`
  - 若实现等价 → 合并；若 data-table 版有特化 → 保留其在 Tier 3（T2.3 迁走），仅主线版进 foundations
- [ ] **T1.2.6 use-media-query（2 副本 → 需先 diff 判断）**
  - `data-table-filters/hooks/`、`document/hooks/`，处理原则同上
- [ ] **T1.2.7 use-mounted（2 副本 → 1）**
  - `_internal/hooks/`、dice internal 内的副本
- [ ] **T1.2.8 use-is-in-view（2 副本 → 需先 diff）**
  - `_internal/hooks/use-is-in-view.tsx`、`_internal/gooseui/hooks/use-is-in-view.ts`
  - 签名可能不同，不等价则保留两份并改名区分，记录决策
- [ ] **T1.2.9 use-click-outside / use-outside-click（2 副本，名字不同）**
  - `_internal/gooseui/hooks/use-click-outside.ts`、`_internal/uselayouts/hooks/use-outside-click.ts`
  - diff 后统一命名为 `use-click-outside`
- [ ] **T1.2.10 use-controlled-state（3 个变体 —— ⚠️ 特殊处理，禁止盲合）**
  - `_internal/hooks/use-controlled-state.tsx`（元组返回）
  - dice internal 的 `use-controllable-state.ts`（Radix 风格）
  - `agent-tools` 的 `use-controllable-state.ts`（对象返回）
  - **三者签名互不兼容，本 Phase 只做物理迁移到 foundations/hooks/ 下共存（保留三个文件名），不做接口统一**。接口统一是行为变更，超出本次重构范围，单独立项

**每个子任务的验证（模板）：**
```bash
# 副本只剩 1 份
find src -name "<hook-file-name>*" | wc -l          # 期望：1
# 旧路径零引用
rg "<old-import-path>" src --type ts --type tsx      # 期望：无输出
pnpm type-check                                       # 期望：0 错误
```

### T1.3 去重合并 utils

- [ ] **T1.3.1 compose-refs（5 副本 → 1，实测见 06 文档）**
  - `_internal/lib/`、`_internal/dice/lib/`、`_internal/dice/internal/lib/`、`_internal/gooseui/lib/`、`data-table-filters/lib/` → `_internals/foundations/utils/compose-refs.ts`
- [ ] **T1.3.2 cn 工具**
  - 基准：`src/lib/utils.ts` 的 `cn`（296 处引用）
  - 复制实现到 `_internals/foundations/utils/cn.ts`；`src/lib/utils.ts` 改为 `export { cn } from '@/_internals/foundations/utils/cn'` 转发（**保留 `@/lib/utils` 旧入口不动**，296 处引用本 Phase 不批量改，留到 T3.2 用 codemod 一次性处理）
  - `_internal/uselayouts/lib/cn.ts` 副本按 T1.2 通用流程消灭
- [ ] **T1.3.3 各 vendor 的 `lib/utils.ts` 审查（dice/gooseui/uselayouts/sabraman 4 份）**
  - 逐份列出导出函数清单
  - 与 `cn`/`compose-refs` 重复的 → 删除并改引用
  - vendor 特有函数（如 gooseui 的 `baseline.ts`、`toast.ts`、sabraman 的 `roundbit.ts`）→ 移入 `_internals/foundations/utils/` 并逐文件确认命名不冲突；仅单一 vendor 组件使用且语义特化的 → 留待 T2.4 随组件走
- [ ] **T1.3.4 slot / create-context 等原语工具**
  - `_internal/gooseui/lib/slot.tsx`、dice internal 的 `create-context`/`portal`/`presence`/`primitive`/`slot` → diff 后决定：等价的合并进 `foundations/utils/`，Base-UI 风格的整套保留移入 `foundations/primitives/base/`

### T1.4 处理 radix 壳/肉分层（⚠️ 依赖 Q6 裁决，方案见 06-fact-check.md 第二节）

实测：`_internal/radix/` 共 18 个文件 —— 6 个孤儿（0 引用）、11 个仅被同名 core 壳一对一引用、1 个（accordion）被 2 处引用。

**若 Q6 = 方案 A（就地合并，推荐）：**
- [ ] 6 个孤儿（alert-dialog/checkbox/dialog/dropdown-menu/popover/tooltip）→ 逐个 `rg` 复核零引用后移入 `archived/`
- [ ] 11 个一对一文件 → 逐个把 `_internal/radix/<name>.tsx` 实现合并进 `core/<name>.tsx`（保持导出符号不变），删除 radix 文件；**一个组件一个 commit**
- [ ] accordion → 查明 2 个消费方，同域则合并，跨域则移入 `foundations/primitives/`
- [ ] 每个合并后跑 `pnpm type-check` + 在 gallery 中目视验证该组件渲染正常

**若 Q6 = 方案 B（原样搬迁）：**
- [ ] `git mv src/components/_internal/radix/* → src/_internals/foundations/primitives/`（孤儿仍归档）
- [ ] codemod 更新引用

**两方案共同部分：**
- [ ] `_internal/animate/`（内含孤儿 `button.tsx` 归档）、`_internal/effects/`、`_internal/texts/` → `foundations/primitives/` 下对应子目录

**验证：**
```bash
rg "@/components/_internal/(radix|animate|effects|texts)" src   # 期望：无输出
pnpm type-check && pnpm build
```

### T1.5 迁移主题系统

- [ ] `git mv src/app/theme-provider.tsx → src/_internals/foundations/theme/theme-provider.tsx`
- [ ] 从 theme-provider 中拆出（**仅拆文件，不改逻辑**）：
  - `use-theme.ts`（hook + Context）
  - `apply-theme.ts`（DOM class 操作）
  - 保留 localStorage 逻辑原样 —— **抽象存储层（ThemeStorage 接口）是 03 文档中的增强项，标记为 Phase 3 之后的独立任务，本次不做**
- [ ] 建 `foundations/theme/index.ts` 导出 `ThemeProvider`、`useTheme`、`type Theme`
- [ ] 更新 `src/app/` 内所有引用（`App.tsx`、`general/theme-toggle.tsx`、`theme-customizer.tsx`、`css-theme-switcher.tsx` 等）
- [ ] `rg "theme-provider" src` 确认无旧路径残留

### T1.6 建立 kit/ 公开出口

- [ ] `src/kit/hooks/index.ts`：**通用 hooks 全部公开**（Q5 已裁决）——foundations/hooks 下所有去重后的 hooks 逐个 re-export（含 useUploadFile）；charts/media/data-table 领域专用 hooks 不进 kit
- [ ] `src/kit/utils/index.ts`：`cn`、`composeRefs`
- [ ] `src/kit/primitives/index.ts`：re-export `foundations/primitives/` 中被 `ui/` 壳依赖的 Radix 封装
- [ ] `src/kit/index.ts`：聚合导出 + 每个导出加一行 JSDoc（`@public` 标记）
- [ ] `src/kit/components/` 本 Phase 只建目录和空 index，组件出口在 Phase 2 之后补

**验证：**
```bash
# kit 入口可被独立编译
npx tsc --noEmit src/kit/index.ts 2>&1 | head
# kit 不得引用 domains（只能引用 foundations）
rg "from '@/_internals/domains" src/kit    # 期望：无输出
```

### Phase 1 出口检查（全部通过才算完成）

```bash
# 1. 重复消灭确认（逐个跑）
find src -name "use-mobile*" | wc -l                      # 1
find src -name "use-as-ref*" | wc -l                      # 1
find src -name "use-isomorphic-layout-effect*" | wc -l    # 1
find src -name "use-lazy-ref*" | wc -l                    # 1
find src -name "*compose-refs*" | wc -l                   # 1
# 2. 旧 _internal 的 hooks/lib/radix 目录应已清空或删除
ls src/components/_internal/hooks src/components/_internal/lib 2>/dev/null  # 期望：不存在
# 3. 全量验证
pnpm type-check && pnpm build && pnpm check:registry
# 4. vendor 目录里不应再有 hooks/lib 子目录（dice/internal 的 Base-UI 除外，若 T1.3.4 决定保留）
find src/components/_internal -type d \( -name hooks -o -name lib \)
```

- [ ] **审计点 1**：提交以下材料给 Claude 审计：
  1. 每个去重任务的 diff 结论（哪些副本等价、哪些不等价、如何裁决）
  2. Phase 1 出口检查全部命令的输出
  3. `git log --oneline` 的任务级 commit 列表
  4. 未决事项清单（如 use-is-in-view 不等价保留两份之类的决策记录）

> 审计通过后进入 `05-execution-tasks-phase2-3.md`。
