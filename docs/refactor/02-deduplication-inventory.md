## 重复定义清单（需合并的文件）

### Hooks 重复定义（需要去重）

#### use-mobile（4 份 → 合并为 1 份）
```
src/components/_internal/hooks/use-mobile.ts           # 主线版本
src/components/_internal/dice/hooks/use-mobile.ts      # Dice 版本
src/components/_internal/gooseui/hooks/use-mobile.ts   # Gooseui 版本
src/components/_internal/uselayouts/hooks/use-mobile.ts # Uselayouts 版本

→ 合并策略：
1. 比对 4 份实现，选最完整的版本
2. 迁移到 src/shared/hooks/use-mobile.ts
3. 其他 3 份改为 re-export + @deprecated
```

#### use-as-ref（3 份 → 合并为 1 份）
```
src/components/_internal/hooks/use-as-ref.ts
src/components/_internal/dice/hooks/use-as-ref.ts
src/components/_internal/gooseui/hooks/use-as-ref.ts

→ 合并策略同上
```

#### use-isomorphic-layout-effect（3 份 → 合并为 1 份）
```
src/components/_internal/hooks/use-isomorphic-layout-effect.ts
src/components/_internal/dice/hooks/use-isomorphic-layout-effect.ts
src/components/_internal/sabraman/lib/hooks/use-isomorphic-layout-effect.ts

→ 合并策略同上
```

#### use-lazy-ref（2 份 → 合并为 1 份）
```
src/components/_internal/hooks/use-lazy-ref.ts
src/components/_internal/dice/hooks/use-lazy-ref.ts

→ 合并策略同上
```

#### use-is-in-view（2 份 → 需确认是否功能相同）
```
src/components/_internal/hooks/use-is-in-view.tsx
src/components/_internal/gooseui/hooks/use-is-in-view.ts

→ 合并策略：
1. 先阅读代码确认功能是否相同
2. 如果相同，合并；如果不同，改名区分
```

#### use-click-outside（2 份 → 需确认）
```
src/components/_internal/gooseui/hooks/use-click-outside.ts
src/components/_internal/uselayouts/hooks/use-outside-click.ts

→ 合并策略：
1. 名字不同但可能功能相同
2. 阅读代码确认
3. 统一命名为 use-outside-click
```

---

### Utils 重复定义（需要去重）

#### compose-refs（3 份 → 合并为 1 份）
```
src/components/_internal/lib/compose-refs.ts
src/components/_internal/dice/lib/compose-refs.ts
src/components/_internal/gooseui/lib/compose-refs.ts

→ 合并策略同上
```

#### cn / classname 工具（3 份 → 合并为 1 份）
```
src/lib/utils.ts (export cn)
src/components/_internal/uselayouts/lib/cn.ts
(可能还有其他地方的类似实现)

→ 合并策略：
1. src/lib/utils.ts 的 cn 是全局使用的主版本
2. 其他版本改为 re-export
3. 统一迁移到 src/shared/utils/cn.ts
```

#### utils.ts（15+ 处 → 需审查）
```
src/components/_internal/dice/lib/utils.ts
src/components/_internal/gooseui/lib/utils.ts
src/components/_internal/uselayouts/lib/utils.ts
src/components/_internal/sabraman/lib/utils.ts
src/components/document/lib/utils.ts
src/components/templates/lib/utils.ts
src/components/media/lib/utils.ts
src/components/charts/chart-kit/lib/utils.ts
src/components/charts/evil-charts/lib/utils.ts
src/components/data-display/data-table-filters/lib/...

→ 合并策略：
1. 逐个审查每个 utils.ts 的函数
2. 如果是通用工具（如 clsx、format、等） → 提取到 shared/utils/
3. 如果是领域特定工具 → 保留在 <domain>/_private/utils/
4. 删除空的 utils.ts 文件
```

---

### Vendor 库内部结构（需彻底解散）

#### Dice 库内部
```
src/components/_internal/dice/
├── hooks/                    # → 合并到 shared/hooks/ 或删除
├── lib/                      # → 合并到 shared/utils/ 或删除
└── internal/                 # → 审查后分类处理
    ├── hooks/                # Base-UI 风格原语
    ├── lib/                  # 底层工具
    └── components/           # create-context/portal/presence/primitive/slot

→ 处理策略：
1. hooks/lib 中的重复定义 → 合并到 shared/
2. internal/ 中的 Base-UI 原语 → 评估是否应提升到 shared/primitives/
3. 剩余的 dice 特有代码 → 移到使用它的组件的 _private/ 下
```

#### Gooseui 库内部
```
src/components/_internal/gooseui/
├── hooks/                    # → 合并到 shared/hooks/ 或删除
└── lib/                      # → 合并到 shared/utils/ 或删除
    ├── baseline.ts           # gooseui 特有
    ├── compose-refs.ts       # 重复！
    ├── slot.tsx              # 可能应提升到 shared/
    ├── toast.ts              # gooseui 特有
    └── utils.ts              # 需审查

→ 处理策略同上
```

#### Uselayouts 库内部
```
src/components/_internal/uselayouts/
├── hooks/                    # → 合并到 shared/hooks/ 或删除
└── lib/                      # → 合并到 shared/utils/ 或删除

→ 处理策略同上
```

#### Sabraman 库内部
```
src/components/_internal/sabraman/
└── lib/
    ├── hooks/                # → 合并到 shared/hooks/ 或删除
    ├── roundbit.ts           # sabraman 特有
    └── utils.ts              # 需审查

→ 处理策略同上
```

---

### 执行优先级

#### P0（立即执行）— 去除最明显的重复
1. ✅ 合并 4 份 use-mobile
2. ✅ 合并 3 份 use-as-ref
3. ✅ 合并 3 份 use-isomorphic-layout-effect
4. ✅ 合并 2 份 use-lazy-ref
5. ✅ 合并 3 份 compose-refs
6. ✅ 统一 cn 工具

**预期收益：** 从 43 个 hooks 减少到 ~25 个（去除 18 个重复）

#### P1（Phase 1 范围）— 建立 shared/ 基础设施
1. ✅ 创建 src/shared/{hooks,utils,primitives}
2. ✅ 迁移所有合并后的 hooks
3. ✅ 迁移所有合并后的 utils
4. ✅ 迁移 Radix 原语
5. ✅ 更新所有 import 路径

**预期收益：** 全局 hooks/utils 只有一个真相来源

#### P2（Phase 2 范围）— 重组 components/
1. ✅ 创建新的目录结构（primitives/compositions/features/specialized）
2. ✅ 迁移组件到新位置
3. ✅ 处理领域内聚的 _private/
4. ✅ 删除 _internal/ 目录

**预期收益：** 组件库结构清晰，边界明确

#### P3（Phase 3 范围）— 清理和优化
1. ✅ 删除所有重复文件的旧版本
2. ✅ 审查并优化所有 utils.ts
3. ✅ 更新文档
4. ✅ 建立 CI 检查（防止未来再出现重复）

---

### 验证清单（每个 Phase 完成后）

```bash
# 1. 检查是否还有 use-mobile 的多份实现
find src -name "use-mobile.ts" -o -name "use-mobile.tsx"
# 预期结果：只有 src/shared/hooks/use-mobile.ts

# 2. 检查是否还有 compose-refs 的多份实现
find src -name "*compose-refs*"
# 预期结果：只有 src/shared/utils/compose-refs.ts

# 3. 检查是否还有 _internal 目录
find src/components -type d -name "_internal"
# 预期结果：空

# 4. 检查类型错误
pnpm type-check
# 预期结果：0 errors

# 5. 检查是否有孤儿文件（0 引用）
pnpm check:registry
# 预期结果：所有组件已注册

# 6. 检查是否有跨域引用 _private
rg "import.*from.*_private" src/components --type ts | \
  grep -v "from '\.\/" | \
  grep -v "from '@/components/[^/]*/_private"
# 预期结果：空（没有跨域引用）

# 7. 统计 hooks 数量（应该大幅减少）
find src -type f -name "use-*.ts*" | wc -l
# 预期结果：从 43 减少到 ~25

# 8. 统计 lib 目录数量（应该大幅减少）
find src -type d -name "lib" | wc -l
# 预期结果：从 15+ 减少到 ~5（只保留领域内聚的）
```

---

### 风险控制

#### 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 合并 hooks 时选错版本 | 功能丢失 | 1. 每个重复 hook 都要阅读 4 份代码<br>2. 写单元测试验证功能一致<br>3. 先用 git branch 隔离 |
| Import 路径更新不完整 | 编译失败 | 1. 使用 ts-morph 自动化<br>2. 每步验证 pnpm type-check<br>3. 使用 ripgrep 查找遗漏 |
| 误删领域内聚的 hooks | 功能破坏 | 1. 先用 rg 检查引用范围<br>2. 只有 0 引用才删除<br>3. 先 git mv 到 archived/ 观察 1 周 |
| _private 被跨域引用 | 边界破坏 | 1. Phase 3 添加 CI 检查<br>2. 定期 lint 扫描 |

#### 回滚策略

```bash
# 每个 Phase 独立 branch
git checkout -b refactor/phase1-shared-infrastructure
# 如果出问题
git checkout main
git branch -D refactor/phase1-shared-infrastructure
```

---

### 时间估算

| Phase | 任务 | 时间 |
|-------|------|------|
| P0 | 去除最明显的重复（6 个 hooks/utils） | 1-2 天 |
| Phase 1 | 建立 shared/ 基础设施 + 迁移全局代码 | 3-5 天 |
| Phase 2 | 重组 components/ 结构 | 1-2 周 |
| Phase 3 | 清理和优化 | 1 周 |
| **总计** | | **3-4 周** |

---

### 预期收益（完成后）

#### 量化指标

| 指标 | 当前 | Phase 1 后 | Phase 2 后 |
|-----|------|-----------|-----------|
| Hooks 总数 | 43 | ~25 | ~25 |
| Hooks 存放位置 | 11 处 | 2 处（shared + _private） | 2 处 |
| Lib 目录数量 | 15+ | ~8 | ~5 |
| 重复定义数量 | 18+ | 0 | 0 |
| 找 hook 的时间 | 5 分钟 | 30 秒 | 30 秒 |
| 新增 hook 的决策时间 | 10 分钟（不知道放哪） | 1 分钟（按规则） | 1 分钟 |

#### 质量提升

| 方面 | 改善 |
|------|------|
| **可维护性** | ✅ 单一真相来源，修改 hook 只需改一处 |
| **可发现性** | ✅ 全局 hooks 都在 shared/hooks/，不再分散 |
| **一致性** | ✅ 不再有 4 份实现略有差异的 use-mobile |
| **边界清晰** | ✅ shared/ vs _private/ 规则明确 |
| **新人友好** | ✅ 新增代码有清晰的决策树 |

#### 开发体验

| 场景 | 当前 | Phase 2 后 |
|------|------|-----------|
| 找一个通用 hook | 要在 11 个目录里找 | 只看 shared/hooks/ |
| 新增一个 hook | 不知道放哪里，容易重复 | 按决策树，2 分钟决定 |
| 修改一个 hook | 不确定是否有重复，可能改漏 | 只有一份，改一处即可 |
| Code Review | 不知道为什么又加了一个 use-mobile | 清晰的规则，容易判断对错 |

---

## 立即行动建议

### 现在就可以开始（低风险）

1. **阅读重复的 hooks 代码**
   ```bash
   # 比对 4 份 use-mobile
   code src/components/_internal/hooks/use-mobile.ts
   code src/components/_internal/dice/hooks/use-mobile.ts
   code src/components/_internal/gooseui/hooks/use-mobile.ts
   code src/components/_internal/uselayouts/hooks/use-mobile.ts
   ```

2. **选择最完整的版本**
   - 功能最全
   - 类型定义最准确
   - 兼容性最好（SSR/客户端都能用）

3. **创建 shared/ 目录**
   ```bash
   mkdir -p src/shared/{hooks,utils,primitives}
   ```

4. **迁移第一个 hook（试水）**
   ```bash
   cp src/components/_internal/hooks/use-mobile.ts src/shared/hooks/
   ```

5. **更新少量文件的 import 验证可行性**
   ```bash
   # 手动改 3-5 个文件的 import
   # 运行 pnpm type-check 验证
   ```

6. **如果验证通过，继续迁移其他 hooks**

需要我帮你开始执行吗？我可以：
1. 生成完整的 codemod 脚本
2. 逐步执行每个任务并验证
3. 处理遇到的问题
