# 外部 shadcn 副本收口调研报告索引

> 目的：迁移前先把事实、风险、主线增强点和放弃项落成 Markdown，方便交叉审阅后再动代码。

## 总原则

1. 主线基础组件 seam 以当前 `components.json` 为准：`@/components/ui/*`，即 `src/components/ui/*`。
2. 外部库的业务组件保留；外部库自带的 shadcn 基础件副本逐步归零。
3. 迁移不是降级替换：外部库中可复用的通用能力应收口回主线基础组件。
4. 不为历史路径或历史命名新增长期兼容层；最终旧 import 应该 `rg` 无命中。
5. 每批先形成评估报告，再统一审阅迁移计划，避免“改第一个影响第二个”的来回返工。

## 能力收口判定

| 判定 | 处理 |
|---|---|
| 多个外部库重复实现的通用能力 | 优先增强主线 |
| 主线已有但叫法不同 | 改调用点对齐主线命名 |
| 外部库历史命名 / 临时兼容 API | 不进入主线 |
| 业务组件专属状态或领域行为 | 保留在业务组件内 |
| 外部 stub / no-op API | 不吸收，迁移时删除或改调用点 |
| 纯视觉偏好 | 谨慎，除非已有明确复用需求 |

## 已生成报告

| 报告 | 范围 | 状态 |
|---|---|---|
| [`SHADCN-CONSOLIDATION-USELAYOUTS.md`](./SHADCN-CONSOLIDATION-USELAYOUTS.md) | `src/components/uselayouts/_shared/ui` 9 个基础件副本 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-MANIFEST.md`](./SHADCN-CONSOLIDATION-MANIFEST.md) | `src/components/manifest/components/ui` 15 个文件，区分基础件副本与 wave 业务组件 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-GOOSEUI.md`](./SHADCN-CONSOLIDATION-GOOSEUI.md) | `src/components/gooseui/components/ui` 36 个文件，区分基础件副本、业务视觉组件和无引用遗留实现 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-DICE.md`](./SHADCN-CONSOLIDATION-DICE.md) | `src/components/dice/ui` 80 个文件，区分基础件副本与 Dice 深组件 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-LIMEPLAY.md`](./SHADCN-CONSOLIDATION-LIMEPLAY.md) | `src/components/limeplay/ui` 44 个文件与播放器局部按钮，区分基础件和媒体领域组件 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-EXTEND.md`](./SHADCN-CONSOLIDATION-EXTEND.md) | `src/components/extend/components/ui` 44 个文件，确认 Base UI 已归零并评估增强收口 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-SABRAMAN.md`](./SHADCN-CONSOLIDATION-SABRAMAN.md) | `src/components/sabraman/components/ui/dialog.tsx` 单点 Dialog wrapper | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-EVILCHARTS.md`](./SHADCN-CONSOLIDATION-EVILCHARTS.md) | `src/components/evilcharts/components/evilcharts/ui` 6 个图表领域深模块文件 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-COVERAGE-AUDIT.md`](./SHADCN-CONSOLIDATION-COVERAGE-AUDIT.md) | 当前 worktree 的 UI-like 目录覆盖审计、import 热点、Base UI 残留判断 | 已完成初稿，待审阅 |
| [`SHADCN-CONSOLIDATION-EXECUTION-PLAN.md`](./SHADCN-CONSOLIDATION-EXECUTION-PLAN.md) | 汇总所有报告后的执行批次、主线增强点和清零标准 | 已完成初稿，待审阅 |

## 建议后续报告顺序

1. `uselayouts`：最小闭环，验证收口方法。
2. `manifest`：标准 shadcn 副本较多，Button/Input/Card 引用高。
3. `gooseui`：先基础件，保留动画/主题类业务组件。
4. `dice`：区分基础件副本和复杂复合组件。
5. `limeplay`：播放器领域组件多，基础件与 media primitive 分开评估。
6. `extend`：最后处理，内部依赖最深。
7. `sabraman`：补漏单点 Dialog wrapper。
8. `evilcharts`：补漏图表领域 `ui` 目录，确认不按 shadcn 副本处理。
9. `coverage-audit`：用当前 worktree 扫描结果证明报告覆盖面。
10. `execution-plan`：汇总所有报告后统一排序，避免分批互相打架。

## 每份报告必须回答的问题

1. 外部副本有哪些文件、多少引用、谁在用？
2. 主线是否已有对应基础组件？
3. 外部组件比主线多了哪些能力？
4. 哪些能力收口进主线，哪些放弃，哪些留在业务层？
5. 调用点是否需要改写，而不是只换 import？
6. 删除旧副本前需要哪些 `rg` 检查？
7. 验证命令是什么？
