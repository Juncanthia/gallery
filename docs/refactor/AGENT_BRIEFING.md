# 给执行者/子 Agent 的 Prompt

你将接手一个**组件库架构重构**项目，重构文档体系已准备完毕。请按以下顺序阅读理解：

## 第一步：理解全局（必读 3 份文档）

1. **`docs/refactor/06-fact-check.md`**（最高优先级）
   - 这是实测事实基线，修正了早期报告的多处错误数据
   - 关键数字：97 个 hooks 文件、6 份 `use-mobile` 重复、80 个 vendor 目录文件
   - Q1-Q5 的用户裁决记录在此（含 **Q6=方案A** 已定）

2. **`docs/refactor/07-de-vendor-plan.md`**（用户核心要求）
   - 用户明确指示：组件库供多系统使用，**彻底废除 vendor 概念**
   - 目录按**用途**组织（`foundations/headless/`、`charts/gauge/`）
   - 文件按**特征**命名（`slider-fancy.tsx`），不出现 dice/gooseui 来源痕迹
   - 包含 vendor 痕迹的 5 类清单（90 处）及处理方式

3. **`docs/refactor/03-target-architecture.md`**（架构框架）
   - 最终目标结构：`src/kit/`（公开 API）+ `src/_internals/foundations/`（基础设施）+ `src/_internals/domains/`（功能域私有）
   - Tier 1/2/3 分级规则：按复用语义判断，不是按引用计数
   - ⚠️ 注意：文档中所有 vendor 相关表述已被 07 取代

## 第二步：执行任务（逐条勾选）

4. **`docs/refactor/04-execution-tasks-phase0-1.md`**（Phase 0 + Phase 1）
   - Phase 0：建立分支、记录基线、确认 Q1-Q6（已全部裁决完毕）
   - Phase 1：建立 kit/_internals 目录骨架 + 去重合并 hooks/utils（6/5/5/3 份）+ 处理 radix（方案A就地合并）+ 迁移主题系统 + 建立 kit 出口
   - 每个任务包含：文件路径、逐条步骤、验证命令（带期望输出）

5. **`docs/refactor/05-execution-tasks-phase2-3.md`**（Phase 2 + Phase 3）
   - Phase 2：功能域私有代码迁移（media/charts/data-table 等）+ **T2.6 registry 去 vendor 维度** + **T2.7 vendor 文件改名**
   - Phase 3：清理死代码、cn 引用统一、mdx 路径修复、防回潮机制（CI lint）

## 第三步：参考补充（选读）

6. **`docs/refactor/01-global-analysis.md`**
   - 问题诊断（hooks 散落、重复定义、根因分析）
   - 定性正确，具体数字以 06 为准

7. **`docs/refactor/02-deduplication-inventory.md`**
   - 重复定义的详细合并策略
   - 副本位置需对照 06 补全

## 关键约束（执行者必须遵守）

1. **每个 Phase 独立 git branch**，每个任务独立 commit
2. **验证不过不许开始下一任务**：`pnpm type-check` 必须 0 错误
3. **合并前必须先 diff**：不许盲删"看起来重复"的文件
4. **禁止修改组件运行时行为**：本次只动位置和 import 路径
5. **三个审计点**：Phase 0/1/2 结束时提交材料给 Claude 审计，通过后才能继续

## 冲突裁决优先级

- 事实数据 → **06** 为准
- Vendor 处理 → **07** 为准
- 架构方向 → **03** 为框架（vendor 部分除外）
- 执行细节 → **04/05** 为准

## 你的第一个任务

从 **`04-execution-tasks-phase0-1.md` 的 T0.1** 开始：建立 `refactor/kit-internals` 分支。Q1-Q6 已全部裁决（见 06 文档第三节），可直接执行。

---

**重要提醒**：用户强调"组件库集群将供多个系统使用，目录必须以**开发者视角、按用途**组织"。你的每个命名、分类决策都应符合这个原则——外部开发者看目录结构时，能立刻理解"这是什么"，而不是"这来自哪个库"。
