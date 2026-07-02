# 全项目架构重构方案

## 执行摘要

你的项目存在**全局性的架构混乱**，不只是 components 目录的问题。核心问题是：

### 🚨 致命问题

1. **Hooks 散落在 11 处**，43 个 hooks 分布在不同位置，其中 4 个同名 hook 存在 2-4 份重复定义
2. **Lib 散落在 15+ 处**，每个 vendor 库都保留自己的一套工具函数
3. **重复定义严重**：`use-mobile` 有 4 份、`use-as-ref` 有 3 份、`compose-refs` 有 3 份
4. **_internal 语义混乱**：既有"主线通用基础设施"，又有"vendor 库内部遗留物"
5. **无清晰的"全局 vs 局部"判断标准**：不知道新 hook 应该放在哪里

### 根本原因

项目由 11+ 个独立 vendor 库合并而成，每个库原本自带：
- 自己的 `hooks/`（大量重名）
- 自己的 `lib/`（工具函数）
- 自己的 `globals.css`

**Stage A 迁移时的决策失误**：为了"不破坏内聚性"，这些重复的 hooks/lib 被原封不动保留在 `_internal/<vendor>/`，形成了**"局部内聚、全局混乱"**的局面。

---

## 重复定义统计

| Hook/Lib | 位置 1 | 位置 2 | 位置 3 | 位置 4 | 状态 |
|---------|--------|--------|--------|--------|------|
| `use-mobile` | `_internal/hooks/` | `_internal/dice/hooks/` | `_internal/gooseui/hooks/` | `_internal/uselayouts/hooks/` | **4 份** |
| `use-as-ref` | `_internal/hooks/` | `_internal/dice/hooks/` | `_internal/gooseui/hooks/` | - | **3 份** |
| `use-isomorphic-layout-effect` | `_internal/hooks/` | `_internal/dice/hooks/` | `_internal/sabraman/lib/hooks/` | - | **3 份** |
| `use-lazy-ref` | `_internal/hooks/` | `_internal/dice/hooks/` | - | - | **2 份** |
| `compose-refs` | `_internal/lib/` | `_internal/dice/lib/` | `_internal/gooseui/lib/` | - | **3 份** |

**总计：43 个 hooks 散落在 11 处，15+ 处 lib 目录**

---

## 新架构设计：三层隔离 + 单一真相来源

### 核心原则

1. **Flat is better than nested**（扁平优于嵌套）
2. **Single Source of Truth**（单一真相来源）
3. **明确的全局 vs 局部边界**
4. **Vendor 库"解散"而非"隔离"**

### 新的顶层结构

```
src/
├── shared/                      # 🆕 全项目共享基础设施（新增）
│   ├── hooks/                   # 全局 hooks（唯一真相来源）
│   ├── utils/                   # 全局工具函数（唯一真相来源）
│   ├── types/                   # 全局类型定义（新增）
│   ├── constants/               # 全局常量（新增）
│   └── primitives/              # 全局原语（Radix 封装等）
│
├── components/                  # 组件库（新结构）
│   ├── primitives/              # 原子组件层
│   ├── compositions/            # 复合组件层（原 widgets）
│   ├── features/                # 功能块层（原 blocks）
│   ├── templates/               # 模板层
│   └── specialized/             # 专用领域（charts/editor/document/media/effects）
│
├── app/                         # Gallery 应用（保持不变）
├── lib/                         # App 专属工具（保持不变）
└── styles/                      # 全局样式（保持不变）
```

---

## 详细设计

### 1. `src/shared/` — 全项目共享基础设施

**职责：** 被多个功能域或 App 引用的**唯一真相来源**

```
src/shared/
├── hooks/                       # 全局 hooks（扁平，无子目录）
│   ├── use-mobile.ts            # 唯一版本（合并 4 份）
│   ├── use-as-ref.ts            # 唯一版本（合并 3 份）
│   ├── use-isomorphic-layout-effect.ts  # 唯一版本（合并 3 份）
│   ├── use-lazy-ref.ts          # 唯一版本（合并 2 份）
│   ├── use-debounce.ts
│   ├── use-is-in-view.tsx
│   ├── use-is-touch-device.ts
│   ├── use-controlled-state.tsx
│   └── [其他 12 个主线 hooks]
│
├── utils/                       # 全局工具函数（扁平）
│   ├── compose-refs.ts          # 唯一版本（合并 3 份）
│   ├── cn.ts                    # 从 lib/utils.ts 迁移而来
│   ├── create-context.tsx       # 从 dice/internal 提升
│   ├── slot.tsx                 # 从 gooseui/lib 提升
│   └── [其他通用工具]
│
├── primitives/                  # 底层原语（Radix 封装）
│   ├── dialog.tsx               # 从 _internal/radix 迁移
│   ├── switch.tsx
│   ├── tooltip.tsx
│   ├── sheet.tsx
│   └── [其他 29 个 Radix 组件]
│
├── types/                       # 全局类型定义（新增）
│   ├── common.ts                # 通用类型
│   └── component.ts             # 组件通用类型
│
├── constants/                   # 全局常量（新增）
│   └── config.ts
│
└── animations/                  # 动效原语（从 _internal/animate 迁移）
    ├── button.tsx
    └── [其他动效]
```

**导入路径：** `@/shared/hooks/use-mobile`、`@/shared/utils/cn`

**规则：**
- ✅ 扁平结构，无子目录（hooks 不再按 vendor 分类）
- ✅ 每个 hook/util 只有一份（合并所有重复）
- ✅ 被 2+ 个功能域引用的必须在这里
- ❌ 禁止 vendor 子目录（dice/gooseui/sabraman 彻底解散）

---

### 2. `src/components/` — 新的组件库结构

```
src/components/
├── primitives/                  # 原子组件（不可再拆分）
│   ├── button.tsx
│   ├── input.tsx
│   ├── checkbox.tsx
│   ├── switch/                  # 同用途多实现用子目录
│   │   ├── index.tsx            # 默认推荐
│   │   ├── variant-a.tsx
│   │   └── legacy.tsx
│   └── [其他原子组件]
│
├── compositions/                # 复合组件（2-5 个 primitive 组合）
│   ├── forms/
│   │   ├── date-picker/
│   │   ├── color-picker/
│   │   └── file-uploader/
│   ├── data/
│   │   ├── table/
│   │   ├── carousel/
│   │   └── stats-card/
│   ├── navigation/
│   │   ├── sidebar/
│   │   ├── breadcrumb/
│   │   └── dock/
│   └── media/
│       ├── video-player/
│       └── audio-player/
│
├── features/                    # 功能块（完整业务功能）
│   ├── data-table/              # 允许有私有 hooks/utils（领域内聚）
│   │   ├── components/
│   │   ├── _private/            # 🆕 明确标记"私有"
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   └── index.ts
│   ├── code-panel/
│   └── comparison-tool/
│
├── templates/                   # 页面模板
│   ├── marketing/
│   ├── dashboard/
│   └── blog/
│
└── specialized/                 # 专用领域（独立子系统）
    ├── charts/                  # 允许有私有 hooks/utils（领域内聚）
    │   ├── chart-kit/
    │   ├── evil-charts/
    │   └── _private/            # 🆕 charts 专属工具
    │       ├── hooks/
    │       └── utils/
    ├── editor/
    │   ├── plugins/
    │   ├── toolbars/
    │   └── _private/
    ├── document/
    │   ├── components/
    │   └── _private/
    ├── media/
    │   ├── blocks/
    │   └── _private/
    └── effects/
        ├── backgrounds/
        ├── interactions/
        └── text/
```

**关键改变：**
- ✅ 删除 `_internal/` 目录（彻底废除）
- ✅ 全局共享的 hooks/utils 移到 `src/shared/`
- ✅ 功能域私有的 hooks/utils 移到 `<domain>/_private/`
- ✅ 明确标记 `_private/`，告知"这是领域内聚，不应跨域引用"

---

### 3. 导入路径规范

```typescript
// ✅ 全局共享（所有地方都可以用）
import { useMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/utils/cn'
import { Dialog } from '@/shared/primitives/dialog'

// ✅ 组件库公开 API
import { Button } from '@/components/primitives/button'
import { DatePicker } from '@/components/compositions/forms/date-picker'
import { DataTable } from '@/components/features/data-table'

// ✅ 领域内聚（只在该功能域内引用）
import { useDebounce } from '@/components/features/data-table/_private/hooks/use-debounce'
import { colors } from '@/components/specialized/charts/_private/utils/colors'

// ❌ 禁止跨域引用 _private
import { useDebounce } from '@/components/features/data-table/_private/hooks/use-debounce'  // 从 features/code-panel 引用 ❌

// ❌ 禁止引用已废除的 _internal
import { useMobile } from '@/components/_internal/hooks/use-mobile'  // ❌ 应该用 @/shared/hooks/use-mobile
```

---

## 判断标准：何时放 shared/ vs _private/

### 决策树

```
这个 hook/util 被几个功能域引用？
├─ 2+ 个功能域 → 放 src/shared/
├─ 1 个功能域
│  ├─ 该功能域是"专用领域"（charts/editor/document/media/effects）
│  │  └─> 放 components/specialized/<domain>/_private/
│  └─ 该功能域是"功能块"（data-table/code-panel）
│     └─> 放 components/features/<feature>/_private/
└─ 0 个功能域（只在 App 用）
   └─> 放 src/lib/
```

### 具体例子

| Hook/Util | 引用位置 | 决策 | 迁移目标 |
|----------|---------|------|---------|
| `use-mobile` | components 多处 + app | 全局 | `src/shared/hooks/` |
| `use-debounce` (主线) | components 多处 | 全局 | `src/shared/hooks/` |
| `use-debounce` (data-table) | 只在 data-table 内 | 私有 | `components/features/data-table/_private/hooks/` |
| `stream-presets` | 只在 media 内 | 私有 | `components/specialized/media/_private/utils/` |
| `cn` | 全项目 | 全局 | `src/shared/utils/` |
| `uploadthing` | 只在 app | App 级 | `src/lib/` 保持不变 |

---

## 迁移执行计划（分 3 个 Phase）

### Phase 1：建立 shared/ 基础设施（3-5 天）

#### Step 1.1：创建 shared/ 目录结构

```bash
mkdir -p src/shared/{hooks,utils,primitives,types,constants,animations}
```

#### Step 1.2：合并重复的 hooks（去重）

**合并策略：**
1. 对于 4 份 `use-mobile`：
   - 阅读 4 份实现，找出最完整的版本
   - 作为主版本迁入 `src/shared/hooks/use-mobile.ts`
   - 其他 3 份标记为 `@deprecated`

2. 对于 3 份 `use-as-ref`：
   - 同上策略

3. 对于 3 份 `compose-refs`：
   - 同上策略

**执行：**
```bash
# 1. 复制主线版本到 shared
cp src/components/_internal/hooks/use-mobile.ts src/shared/hooks/

# 2. 在旧位置添加 deprecation notice
# 编辑 src/components/_internal/dice/hooks/use-mobile.ts
```

```typescript
// src/components/_internal/dice/hooks/use-mobile.ts
/**
 * @deprecated 
 * This hook has been consolidated into @/shared/hooks/use-mobile
 * Please use that version instead.
 */
export { useMobile } from '@/shared/hooks/use-mobile'
```

#### Step 1.3：迁移全局工具函数

```bash
# 迁移 cn 工具
cp src/lib/utils.ts src/shared/utils/cn.ts

# 迁移 compose-refs（合并后的版本）
cp src/components/_internal/lib/compose-refs.ts src/shared/utils/

# 迁移其他全局工具
# ...
```

#### Step 1.4：迁移 Radix 原语

```bash
cp -r src/components/_internal/radix/* src/shared/primitives/
```

#### Step 1.5：更新所有 import 路径

使用 codemod：

```typescript
// scripts/migrate-to-shared.ts
import { Project } from 'ts-morph'

const project = new Project({ tsConfigFilePath: 'tsconfig.json' })

const mappings = {
  '@/components/_internal/hooks/use-mobile': '@/shared/hooks/use-mobile',
  '@/components/_internal/dice/hooks/use-mobile': '@/shared/hooks/use-mobile',
  '@/components/_internal/gooseui/hooks/use-mobile': '@/shared/hooks/use-mobile',
  '@/components/_internal/uselayouts/hooks/use-mobile': '@/shared/hooks/use-mobile',
  '@/components/_internal/lib/compose-refs': '@/shared/utils/compose-refs',
  '@/components/_internal/radix/dialog': '@/shared/primitives/dialog',
  '@/lib/utils': '@/shared/utils/cn',
  // ... 添加所有映射
}

for (const sourceFile of project.getSourceFiles()) {
  for (const [oldPath, newPath] of Object.entries(mappings)) {
    sourceFile.getImportDeclarations().forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue()
      if (moduleSpecifier === oldPath) {
        importDecl.setModuleSpecifier(newPath)
      }
    })
  }
  sourceFile.saveSync()
}

console.log('✅ 所有 import 路径已更新到 @/shared/*')
```

运行：
```bash
pnpm tsx scripts/migrate-to-shared.ts
pnpm type-check  # 验证零错误
```

#### Step 1.6：更新 tsconfig paths

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],  // 新增
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

---

### Phase 2：重组 components/ 结构（1-2 周）

#### Step 2.1：创建新的目录结构

```bash
mkdir -p src/components/{primitives,compositions,features,templates,specialized}
```

#### Step 2.2：迁移组件（按抽象层级）

参考之前的 `REFACTOR_PHASE2_PHASE3.md`，但导入路径改为：
- 全局 hooks → `@/shared/hooks/*`
- 全局 utils → `@/shared/utils/*`
- Radix 原语 → `@/shared/primitives/*`

#### Step 2.3：处理领域内聚的 hooks/utils

**对于 data-table-filters：**
```bash
# 1. 创建 _private 目录
mkdir -p src/components/features/data-table/_private/{hooks,utils,types}

# 2. 迁移私有代码
mv src/components/data-display/data-table-filters/hooks/* \
   src/components/features/data-table/_private/hooks/

mv src/components/data-display/data-table-filters/lib/* \
   src/components/features/data-table/_private/utils/

mv src/components/data-display/data-table-filters/types/* \
   src/components/features/data-table/_private/types/
```

**对于 specialized 领域：**
```bash
# Charts
mkdir -p src/components/specialized/charts/_private/{hooks,utils}
mv src/components/charts/*/lib/* src/components/specialized/charts/_private/utils/

# Media
mkdir -p src/components/specialized/media/_private/{hooks,utils}
mv src/components/media/hooks/* src/components/specialized/media/_private/hooks/
mv src/components/media/lib/* src/components/specialized/media/_private/utils/

# 同样处理 editor、document
```

#### Step 2.4：删除所有 _internal 目录

```bash
# 确认已全部迁移后
rm -rf src/components/_internal
```

---

### Phase 3：清理和优化（1 周）

#### Step 3.1：删除废弃的重复文件

```bash
# 删除 4 份 use-mobile 中的 3 份（保留 shared/ 的版本）
rm src/components/_internal/dice/hooks/use-mobile.ts
rm src/components/_internal/gooseui/hooks/use-mobile.ts
rm src/components/_internal/uselayouts/hooks/use-mobile.ts

# 同样处理其他重复文件
```

#### Step 3.2：更新文档

创建 `docs/ARCHITECTURE.md`：

```markdown
# 项目架构规范

## 目录结构

### src/shared/ — 全项目共享基础设施
- **hooks/**: 被 2+ 个功能域引用的 hooks
- **utils/**: 被 2+ 个功能域引用的工具函数
- **primitives/**: Radix 等底层原语封装
- **types/**: 全局类型定义
- **constants/**: 全局常量

### src/components/ — 组件库
- **primitives/**: 原子组件（button、input、checkbox）
- **compositions/**: 复合组件（date-picker、sidebar、table）
- **features/**: 功能块（data-table、code-panel）
- **templates/**: 页面模板
- **specialized/**: 专用领域（charts、editor、document、media、effects）

### 领域内聚 vs 全局共享

**何时放 src/shared/？**
- Hook/util 被 2+ 个功能域引用
- 判断方法：`rg "import.*from.*your-hook" --type ts | wc -l`

**何时放 <domain>/_private/？**
- Hook/util 只被单一功能域引用
- 明确标记 `_private/` 表示"不应跨域引用"

## 新增代码规范

### 新增 Hook

1. 判断引用范围：
   ```bash
   rg "import.*from.*use-your-hook" --type ts
   ```

2. 决策：
   - 2+ 个功能域 → `src/shared/hooks/`
   - 1 个功能域 → `<domain>/_private/hooks/`
   - 0 个功能域（仅测试） → 与组件同文件

3. 检查重复：
   ```bash
   find src -name "use-your-hook.ts"
   ```
   如果已存在同名 hook，优先复用

### 新增工具函数

同上规则，只是目录改为 `utils/`

## 禁止事项

❌ 禁止跨域引用 `_private/`：
```typescript
// ❌ 错误：从 code-panel 引用 data-table 的私有 hook
import { useDebounce } from '@/components/features/data-table/_private/hooks/use-debounce'
```

❌ 禁止创建新的 vendor 子目录（dice/gooseui/sabraman 已彻底解散）

❌ 禁止在 `src/shared/` 下创建子目录分类（必须扁平）
```