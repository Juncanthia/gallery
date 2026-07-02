# 架构重构文档索引

> ✅ **已完成**（2026-07-02，分支 `refactor/kit-internals`）
> Phase 0–3 全部落地：kit/_internals 分层、功能域迁移、去 vendor 化、防回潮封板。
> 详见 [PHASE3-EXIT.md](./PHASE3-EXIT.md)。

> 本目录是整个重构工作的**唯一入口**。按编号顺序阅读。
> 分工：**执行者**负责按 `04`/`05` 的任务清单落地；**Claude（审计方）**只负责阶段性审计，不执行修改。

## 阅读顺序

| 顺序 | 文档 | 内容 | 读者 |
|------|------|------|------|
| 1 | [06-fact-check.md](./06-fact-check.md) | **事实核查报告（实测数据，最高优先级）**：更正 01/02 的误报数字、radix 壳/肉分层实测、冻结区裁决记录 | 所有人，**先读这个** |
| 2 | [07-de-vendor-plan.md](./07-de-vendor-plan.md) | **去 Vendor 化专项方案**（用户裁决：彻底废除 vendor 概念）：vendor 痕迹实测清单、特征命名规则、对 04/05 的任务修订 | 所有人 |
| 3 | [01-global-analysis.md](./01-global-analysis.md) | 全项目问题诊断（定性正确，具体数字以 06 为准） | 所有人，理解"为什么改" |
| 4 | [03-target-architecture.md](./03-target-architecture.md) | 目标架构（kit/ + _internals/ + Tier 分级；**其中 vendor 相关表述已被 07 取代**） | 所有人，理解"改成什么样" |
| 5 | [02-deduplication-inventory.md](./02-deduplication-inventory.md) | 重复定义清单（副本位置需对照 06 补全） | 执行者，Phase 1 工作底稿 |
| 6 | [04-execution-tasks-phase0-1.md](./04-execution-tasks-phase0-1.md) | **执行任务清单（上）**：Phase 0 准备 + Phase 1 建立 kit/_internals 与去重 | 执行者 |
| 7 | [05-execution-tasks-phase2-3.md](./05-execution-tasks-phase2-3.md) | **执行任务清单（下）**：Phase 2 功能域迁移 + Phase 3 清理与封板（**含 07 新增的 T2.6/T2.7**） | 执行者 |

## 方案演进说明

重构方案经历了三轮讨论，**只有最终版（06+07）是执行依据**：

1. **第一轮**（已删除）：只针对 `src/components/` 的重组，未解决全局 hooks/lib 散落问题
2. **第二轮**（01 诊断部分保留）：问题定性正确，但具体数字有误报，已由 06 实测更正
3. **第三轮（✅ 最终方案）**：06（事实基线）+ 07（去 vendor 化）+ 03（架构框架）
   - 关键洞察：组件库供多套外部系统使用，判断"公开 vs 私有"的标准是**复用语义**（Tier 1/2/3），而非引用计数
   - 目标结构：`src/kit/`（唯一对外）+ `src/_internals/foundations/`（基础设施）+ `src/_internals/domains/`（功能域私有）
   - 去 vendor 化：目录按用途（`headless/`、`gauge/`），文件按特征（`slider-fancy.tsx`），彻底消灭来源标记

## 冲突裁决规则

- **事实数据**（文件数、副本位置、引用数）：以 **06** 实测为准（01/02 有误报）
- **架构方向**：以 **03** 为框架，其中 vendor 相关表述被 **07** 取代
- **执行细节**：以 **04/05** 任务清单为准，其中已整合 06/07 的修订

## 执行与审计流程

```
执行者按 04/05 逐任务执行
  → 每个任务完成后运行任务内的"验证"命令
  → 每个 Phase 结束时跑"Phase 出口检查"
  → 提交给 Claude 审计（审计点见 04/05 各 Phase 末尾）
  → 审计通过后才能进入下一 Phase
```

## 全局硬性约束（执行者必须遵守）

1. 每个 Phase 独立 git branch，每个任务独立 commit（commit 由执行者自行操作）。
2. 任何删除前先用 `rg` 确认全仓库零引用；不确定就移入 `archived/` 而不是删除。
3. 每个任务结束必须 `pnpm type-check` 零错误，否则不许开始下一任务。
4. 合并重复 hook 前必须逐份 diff 实现，不许只看文件名就认定"相同"。
5. 禁止在迁移过程中"顺手改进"任何组件逻辑——本次重构只动**位置和导入路径**，不动行为。
6. mv 优先使用 `git mv` 保留历史。
