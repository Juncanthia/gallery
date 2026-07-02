# 执行任务清单（下）：Phase 2 功能域迁移 + Phase 3 清理封板

> 前置条件：Phase 1 已通过审计点 1。规则同 `04-execution-tasks-phase0-1.md`。

---

## Phase 2：功能域私有代码迁移（预计 5-8 天）

> 原则：**Tier 3（单一功能域使用）的 hooks/lib 迁入 `_internals/domains/<domain>/`**；组件文件本身留在 `src/components/`（组件的重新分类是另一个独立工程，本次不做，见"范围外事项"）。

### T2.1 media 域（最大的一块）

- [ ] 迁移 hooks：`src/components/media/hooks/*`（约 10 个：use-player/use-playback/use-playback-rate/use-playback-source/use-asset/use-captions/use-picture-in-picture/use-media/use-idle/use-interval 等）→ `src/_internals/domains/media/hooks/`
- [ ] 迁移 lib：`src/components/media/lib/*`（stream-presets/stream-support/time/utils）→ `src/_internals/domains/media/utils/`
- [ ] 子域私有 lib：`media/blocks/audio-player/{hooks,lib}` 与 `media/blocks/video-player/lib`（两份 `media-kit.ts`）
  - 先 diff 两份 media-kit.ts：等价 → 合并到 `domains/media/utils/media-kit.ts`；不等价 → 分别命名 `media-kit-audio.ts`/`media-kit-video.ts` 迁入
- [ ] `media/internal/`、`media/stream-panel/` 内的工具函数逐个 `rg` 判断归属
- [ ] codemod 更新 media 域内所有 import
- [ ] **越界检查**：`rg "domains/media" src --type ts -l | grep -v "components/media\|_internals/domains/media\|app/"` 应为空（media hooks 只允许 media 组件和 gallery 展示层引用；若 gallery 引用了，记录到审计材料，由审计方判断是否合理）

### T2.2 charts 域

- [ ] `src/components/charts/chart-kit/hooks/*`（use-chart-interaction/use-animated-y-domains/use-chart-phase-orchestrator/use-enter-complete/use-grid-shimmer/use-scheduled-tooltip 等 6-8 个）→ `_internals/domains/charts/hooks/`
- [ ] `charts/chart-kit/lib/utils.ts`、`charts/evil-charts/lib/utils.ts` → 先 diff，处理方式同 T2.1 的 media-kit；归入 `_internals/domains/charts/utils/`
- [ ] codemod + 越界检查（同 T2.1 模式）

### T2.3 data-table 域

- [ ] `data-display/data-table-filters/hooks/*`（use-debounce※/use-hot-key/use-local-storage/use-media-query※ —— ※号的两个若 T1.2.5/T1.2.6 已判定与主线等价并删除，则此处只迁移剩余的）→ `_internals/domains/data-table/hooks/`
- [ ] `data-table-filters/lib/*`（colors/date-preset/constants/store）→ `_internals/domains/data-table/utils/` 与 `_internals/domains/data-table/store/`
- [ ] `data-table-filters/types/*` → `_internals/domains/data-table/types/`
- [ ] **注意**：`use-local-storage` 在 03 文档被列为 Tier 1 候选。执行时先 `rg` 其当前引用范围：若确实只有 data-table 使用 → 本任务迁入 domains，同时在审计材料记录"Tier 1 候选但暂放 Tier 3"；将来要公开时再提升
- [ ] codemod + 越界检查

### T2.4 editor / document / 其余散点

- [ ] `document/hooks/*`（use-media-query 若 T1.2.6 已合并则跳过；use-mobile 若 T1.2.1 已合并则跳过；剩余的迁入）→ `_internals/domains/document/hooks/`
- [ ] `document/lib/utils.ts` → diff 后归入 `domains/document/utils/` 或删除（若与 cn 等价）
- [ ] `templates/lib/utils.ts` → 同上，归入 `_internals/domains/templates/utils/`（目录不存在则创建）
- [ ] `marketing-blocks/complex-component/{hooks,lib}`（use-pokemon/pokemon.ts —— 演示性质代码）→ 就地保留（组件强绑定的演示数据不值得进 domains），在审计材料中记录此决策
- [ ] editor 域：扫描 `src/components/editor/` 下是否有独立 hooks/lib 目录（01 文档未详列），有则按同样规则迁移，没有则记录"无需处理"
- [ ] `_internal/dice/internal/`（Base-UI 原语：create-context/portal/presence/primitive/slot + hooks: use-controllable-state/use-escape-keydown/use-dismiss/use-form-control/use-collection）：
  - 若 T1.3.4 已定为保留 → `git mv` 整体到 `_internals/foundations/primitives/base/`
  - codemod 更新引用

### T2.5 解散 _internal/ 下的 vendor 目录

> 前置：T1.2/T1.3 已把 vendor 的 hooks/lib 去重完毕，T2.4 已迁走 dice/internal。此时 vendor 目录下应只剩**组件文件**。

- [ ] 逐个盘点 `_internal/{dice,gooseui,uselayouts,sabraman}` 剩余内容，输出文件清单
- [ ] 剩余组件文件的归属：它们是被 `src/components/<domain>/<vendor>/` 的组件引用的内部实现 → `git mv` 到引用它的组件目录旁（就近原则），或迁入 `_internals/domains/` 对应域
- [ ] 全部迁空后删除 `src/components/_internal/` 整个目录
- [ ] codemod 最终扫描：`rg "@/components/_internal" src` 必须零输出

### Phase 2 出口检查

```bash
# 1. _internal 彻底消失
find src/components -type d -name "_internal"                          # 空
rg "@/components/_internal" src                                        # 无输出
# 2. components/ 下不再有散装 hooks/lib 目录（除审计豁免的 complex-component）
find src/components -type d \( -name hooks -o -name lib \) | grep -v complex-component   # 空
# 3. 跨域引用检查（每个 domain 跑一遍）
rg "_internals/domains/charts" src --files-with-matches | grep -v "components/charts\|_internals/domains/charts\|app/"
rg "_internals/domains/media" src --files-with-matches | grep -v "components/media\|_internals/domains/media\|app/"
# ...（data-table/document/templates 同理）
# 4. 全量验证
pnpm type-check && pnpm build && pnpm check:registry
```

- [ ] **审计点 2**：提交出口检查输出、vendor 目录解散的文件清单、所有"就地保留/豁免"决策记录

---

## Phase 3：清理、封板与防回潮（预计 2-3 天）

### T3.1 死代码处理（依赖 Phase 0 Q2 的答复）

- [ ] `src/components/base/`（154 文件）：按用户裁决执行删除/归档；归档则 `git mv src/components/base archived/components-base/`
- [ ] `src/components/patterns/`（空占位）：确认为空后删除
- [ ] Phase 1 移入 `archived/` 的孤儿文件（radix 7 个 + animate/button.tsx）：在 `archived/README.md` 登记来源和归档日期

### T3.2 cn 引用统一（T1.3.2 的收尾）

- [ ] codemod 把 296 处 `import { cn } from '@/lib/utils'` 全量改为 `@/_internals/foundations/utils/cn`（组件库内）；`src/app/` 与 `src/lib/` 内的引用改为 `@/kit/utils`（应用侧走公开出口，验证 kit 出口真实可用）
- [ ] `src/lib/utils.ts` 删除 cn 转发，只剩 app 专属内容（若剩空则整文件删除并处理 uploadthing.ts 的去留）
- [ ] `rg "from '@/lib/utils'" src/components` 零输出

### T3.3 mdx 文档路径修复

- [ ] `rg "@/primitives/" content docs -l` 找出全部残留（01 文档记录为 4 处）
- [ ] 批量替换为新路径（`@/_internals/foundations/primitives/` 或对应 kit 出口，视文档语境——**面向用户的安装文档应写 kit 路径**）
- [ ] `rg "@/components/_internal" content docs` 零输出（文档里的旧路径一并修）

### T3.4 Registry 同步

- [ ] 运行 `pnpm sync:registry`，确认 registry 中所有 `files` 路径指向新位置
- [ ] `pnpm check:registry` 零错误
- [ ] registry schema 若有 `shellImportPath` 之类字段指向旧 `_internal` 路径，逐条修正

### T3.5 防回潮机制（CI/lint 层面固化规则）

- [ ] 新增 ESLint `no-restricted-imports` 规则（或 eslint-plugin-boundaries，二选一，取项目已有依赖优先）：
  1. `src/components/**` 禁止 import `@/app/*`（组件库不得反向依赖 Gallery）
  2. `src/_internals/domains/<A>/**` 禁止 import `_internals/domains/<B>`（域间隔离）
  3. `src/kit/**` 只允许 import `_internals/foundations/*` 与 `components/*`（kit 不得直通 domains）
  4. `src/app/**` 建议 import `@/kit/*` 而非 `_internals`（warn 级别，不阻断）
- [ ] 新增脚本 `scripts/check-duplicate-hooks.ts`：扫描 `src` 下同名 `use-*` 文件，发现同名即报错（防止重复回潮）
- [ ] 把 `type-check + check:registry + check-duplicate-hooks + lint` 挂入 CI（或至少写进 package.json 的 `verify` 聚合脚本）

### T3.6 文档封板

- [ ] 更新 `docs/ARCHITECTURE.md`：目标结构图、Tier 1/2/3 定义、新增 hook 的决策树（引用 03 文档内容，精简为可执行 checklist）
- [ ] 在 `docs/refactor/00-README.md` 顶部标记"✅ 已完成，完成日期"
- [ ] 更新 `BASELINE.md`：追加重构后同口径指标，形成前后对比

### Phase 3 出口检查（最终验收）

```bash
pnpm type-check && pnpm build && pnpm check:registry && pnpm lint
# 指标复查（与 BASELINE.md 对比）
find src -type f \( -name "use-*.ts" -o -name "use-*.tsx" \) -exec dirname {} \; | sort -u
# 期望：只剩 _internals/foundations/hooks、_internals/domains/*/hooks、kit/hooks 三类
find src -type d -name "lib"
# 期望：0 个（全部改为 utils 命名或已归入 domains）
rg "@/components/_internal" src content docs
# 期望：零输出
```

- [ ] **审计点 3（终审）**：提交最终指标对比、CI 规则配置、全部出口检查输出

---

## 范围外事项（本次明确不做，防止执行者扩大范围）

| 事项 | 原因 | 后续 |
|------|------|------|
| `src/components/` 组件本体的重新分类（primitives/compositions/features 分层） | 与 hooks/lib 治理正交，涉及 registry/catalog/文档全链路，工作量另计 | 独立立项，沿用 archive/A1-A3 的思路重评 |
| `useControlledState` 三变体的接口统一 | 行为变更，需要逐组件回归 | 独立立项 |
| ThemeStorage 抽象存储层 | 功能增强而非重构 | 独立立项 |
| `src/components/ui/`（196 转发壳）的裁撤 | Stage B 既有范围 | 沿用既有 Stage B 计划 |
| catalog.ts 从 vendor 分组改为功能分组 | Stage B 既有范围 | 同上 |
| 组件库独立发包（package.json exports/构建产物） | 依赖 kit/ 稳定后才有意义 | Phase 3 完成后评估 |

## 执行者禁止事项（重申）

1. 禁止修改任何组件的运行时行为
2. 禁止跳过 diff 直接删除"看起来重复"的文件
3. 禁止在未跑通 type-check 时开始下一任务
4. 禁止自行决定 Phase 0 冻结区（Q1-Q5）的答案
5. 遇到清单未覆盖的情况 → 记录到审计材料，不自行发挥
