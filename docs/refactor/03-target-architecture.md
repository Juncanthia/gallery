# 组件库公开 API 架构设计

## 核心理念

你的组件库会被**多个外部系统**使用，因此需要：

1. **清晰的公开 API Surface**：外部系统只能看到稳定的、有文档的接口
2. **隐藏实现细节**：内部 hooks/utils 不暴露，避免外部依赖不稳定代码
3. **语义分层**：不是按"引用计数"判断公开与否，而是按**复用语义**

---

## 问题根源：当前没有"公开 vs 内部"的边界

### 当前状态（❌ 混乱）

```typescript
// 外部系统导入时看到的是：
import { Button } from '@/components/core/button'
import { useMobile } from '@/components/_internal/hooks/use-mobile'          // ❌ 暴露了内部路径
import { useMobile } from '@/components/_internal/dice/hooks/use-mobile'     // ❌ 更糟：5个版本
import { cn } from '@/lib/utils'                                             // ❌ lib 是 app 的，不是组件库的
import { useTheme } from '@/app/theme-provider'                              // ❌ app 是 Gallery 应用，不是组件库
```

**核心问题：**
- 外部系统能看到所有内部路径（`_internal`、`dice/hooks`、`app`、`lib`）
- 没有统一的入口
- 5 个 `useMobile` 到底用哪个？外部开发者会困惑

---

## 解决方案：三层架构 + 统一出口

### 新架构

```
src/
├── kit/                         # 🆕 组件库公开 API（唯一对外入口）
│   ├── components/              # 公开组件
│   ├── hooks/                   # 公开 hooks
│   ├── utils/                   # 公开工具函数
│   ├── primitives/              # 公开原语
│   └── index.ts                 # 统一导出
│
├── _internals/                  # 🆕 组件库内部实现（私有）
│   ├── foundations/             # 基础设施（被 kit/ 使用）
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── primitives/
│   ├── domains/                 # 功能域私有代码
│   │   ├── charts/
│   │   ├── media/
│   │   ├── editor/
│   │   └── data-table/
│   └── vendors/                 # Vendor 库解散后的残留（临时）
│
├── components/                  # 组件实现（引用 _internals/）
│   ├── primitives/
│   ├── compositions/
│   ├── features/
│   ├── templates/
│   └── specialized/
│
├── app/                         # Gallery 应用（不是组件库的一部分）
├── lib/                         # Gallery 应用工具（不是组件库的一部分）
└── styles/                      # 全局样式
```

---

## 详细设计

### 1. `src/kit/` — 组件库的唯一对外 API

**职责：** 统一的、稳定的、有文档的公开接口

```
src/kit/
├── components/                  # 公开组件（精选）
│   ├── primitives/
│   │   ├── button.ts            # re-export from @/components/primitives/button
│   │   ├── input.ts
│   │   ├── checkbox.ts
│   │   └── index.ts
│   ├── compositions/
│   │   ├── date-picker.ts
│   │   ├── color-picker.ts
│   │   └── index.ts
│   ├── features/
│   │   ├── data-table.ts
│   │   └── index.ts
│   └── index.ts
│
├── hooks/                       # 公开 hooks（Tier 1）
│   ├── use-theme.ts             # re-export 并标准化
│   ├── use-mobile.ts            # 合并 5 个版本后的唯一真相
│   ├── use-debounce.ts
│   ├── use-controlled-state.ts
│   ├── use-local-storage.ts
│   ├── use-media-query.ts
│   ├── use-click-outside.ts
│   ├── use-mounted.ts
│   └── index.ts
│
├── utils/                       # 公开工具函数
│   ├── cn.ts                    # classname 工具
│   ├── compose-refs.ts
│   └── index.ts
│
├── primitives/                  # 公开原语（Radix 封装）
│   ├── dialog.ts
│   ├── tooltip.ts
│   ├── popover.ts
│   └── index.ts
│
├── types/                       # 公开类型定义
│   ├── component.ts
│   └── index.ts
│
├── index.ts                     # 🔑 统一导出入口
└── package.json                 # 组件库独立 package.json（可选）
```

**`src/kit/index.ts` 示例：**

```typescript
// ============ Components ============
export * from './components'

// ============ Hooks ============
export {
  useTheme,
  useMobile,
  useDebounce,
  useControlledState,
  useLocalStorage,
  useMediaQuery,
  useClickOutside,
  useMounted,
} from './hooks'

// ============ Utils ============
export { cn, composeRefs } from './utils'

// ============ Primitives ============
export * from './primitives'

// ============ Types ============
export type * from './types'
```

**外部系统使用：**

```typescript
// ✅ 清晰、稳定、文档化
import { Button, DatePicker, DataTable } from '@your-org/ui-kit'
import { useTheme, useMobile, useDebounce } from '@your-org/ui-kit'
import { cn } from '@your-org/ui-kit'

// ❌ 禁止直接访问内部路径（通过 tsconfig paths 限制）
import { useMobile } from '@your-org/ui-kit/_internals/hooks/use-mobile'  // TypeScript 报错
```

---

### 2. `src/_internals/` — 组件库内部实现

**职责：** 组件库内部共享的代码，不对外暴露

```
src/_internals/
├── foundations/                 # 基础设施层（Tier 1 的实现）
│   ├── hooks/
│   │   ├── use-isomorphic-layout-effect.ts
│   │   ├── use-as-ref.ts
│   │   ├── use-lazy-ref.ts
│   │   ├── use-mobile.ts        # 合并 5 个版本后的唯一实现
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   ├── use-controlled-state.ts  # 统一接口
│   │   ├── use-click-outside.ts
│   │   ├── use-mounted.ts
│   │   ├── use-auto-height.ts
│   │   ├── use-is-touch-device.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── compose-refs.ts
│   │   ├── create-context.tsx
│   │   ├── slot.tsx
│   │   └── index.ts
│   │
│   ├── primitives/              # Radix 封装
│   │   ├── dialog.tsx
│   │   ├── tooltip.tsx
│   │   ├── popover.tsx
│   │   └── index.ts
│   │
│   └── theme/                   # 主题系统实现
│       ├── theme-provider.tsx
│       ├── use-theme.ts
│       └── index.ts
│
├── domains/                     # 功能域私有代码（Tier 2/3）
│   ├── charts/
│   │   ├── hooks/
│   │   │   ├── use-chart-interaction.ts
│   │   │   ├── use-animated-y-domains.ts
│   │   │   └── [其他图表专用 hooks]
│   │   └── utils/
│   │       └── chart-utils.ts
│   │
│   ├── media/
│   │   ├── hooks/
│   │   │   ├── use-player.ts
│   │   │   ├── use-playback.ts
│   │   │   ├── use-asset.ts
│   │   │   └── [其他媒体专用 hooks]
│   │   └── utils/
│   │       ├── stream-presets.ts
│   │       └── time.ts
│   │
│   ├── editor/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── data-table/
│   │   ├── hooks/
│   │   │   ├── use-filter-state.ts
│   │   │   ├── use-filter-actions.ts
│   │   │   └── use-hot-key.ts
│   │   ├── utils/
│   │   │   ├── colors.ts
│   │   │   └── date-preset.ts
│   │   └── store/
│   │       └── filter-store.ts
│   │
│   └── document/
│       └── hooks/
│
└── vendors/                     # Vendor 库残留（待清理）
    ├── dice/
    │   └── internal/            # Base-UI 原语（如需保留）
    ├── gooseui/
    └── [其他 vendor 专属代码]
```

**导入规则：**

```typescript
// ✅ components/ 可以引用 _internals/
import { useMobile } from '@/_internals/foundations/hooks'
import { cn } from '@/_internals/foundations/utils'

// ✅ kit/ 从 _internals/ re-export
export { useMobile } from '@/_internals/foundations/hooks'

// ✅ 功能域可以引用自己的私有代码
import { useChartInteraction } from '@/_internals/domains/charts/hooks'

// ❌ 功能域不能跨域引用
import { usePlayer } from '@/_internals/domains/media/hooks'  // 从 charts 引用 ❌

// ❌ 外部系统不能引用 _internals（通过 tsconfig 限制）
import { useMobile } from '@your-org/ui-kit/_internals/foundations/hooks'  // TypeScript 报错
```

---

### 3. Tier 分级详解

#### **Tier 1 - 公开稳定 API**（在 `kit/` 中导出）

**判断标准：**
1. ✅ 与业务无关的基础技术工具（如 `useDebounce`、`useMobile`）
2. ✅ 跨多个系统复用的业务能力（如 `useTheme`）
3. ✅ 稳定、有文档、承诺向后兼容

**Tier 1 清单（14 个 hooks）：**

| Hook | 分类 | 理由 |
|------|------|------|
| `useTheme` | 业务能力 | 全项目使用，跨系统必需 |
| `useMobile` | 基础设施 | 响应式设计通用工具，5 处重复定义说明高需求 |
| `useDebounce` | 基础设施 | 通用工具，2 处重复定义 |
| `useMediaQuery` | 基础设施 | 响应式设计基础 |
| `useControlledState` | UI 交互 | 7+ 组件依赖，组件库核心 |
| `useLocalStorage` | 基础设施 | 持久化存储通用 |
| `useClickOutside` | UI 交互 | 通用交互模式 |
| `useMounted` | 基础设施 | SSR hydration 标记 |
| `useIsomorphicLayoutEffect` | 基础设施 | SSR 友好，4 处重复定义 |
| `useAsRef` | 基础设施 | Ref 操作，3 处重复定义 |
| `useLazyRef` | 基础设施 | 延迟初始化 |
| `useAutoHeight` | UI 交互 | ResizeObserver 通用 |
| `useIsTouchDevice` | 基础设施 | 设备检测 |
| `useUploadFile` | 业务能力 | 文件上传（如果跨系统使用） |

#### **Tier 2 - 内部共享**（在 `_internals/foundations/` 中）

**判断标准：**
1. ✅ 组件库内部多个功能域共享
2. ❌ 但不推荐外部系统直接使用（不稳定或过于底层）

**Tier 2 清单（8 个 hooks）：**

| Hook | 理由 |
|------|------|
| `useIsInView` | IntersectionObserver 包装，稳定但较底层 |
| `useDataState` | data-* 属性同步，底层工具 |
| `useControllableState`（dice 版） | Base-UI 风格，内部使用 |
| `useEscapeKeydown` | 快捷键，较底层 |
| `useDismiss` | Dismissable layer，底层 |
| `useFormControl` | 表单检测，底层 |
| `useCollection` | 列表管理，底层 |
| `useGlobalStyles` | CSS 注入，底层 |

#### **Tier 3 - 功能域私有**（在 `_internals/domains/<domain>/` 中）

**判断标准：**
1. ✅ 只被单一功能域使用
2. ✅ 高度特化，不应跨域引用

**Tier 3 清单（20+ 个 hooks）：**

| 功能域 | Hooks |
|-------|-------|
| **charts** | `useChartInteraction`, `useAnimatedYDomains`, `useScheduledTooltip`, `useGridShimmer` 等 8 个 |
| **media** | `usePlayer`, `usePlayback`, `useAsset`, `useCaptions`, `usePictureInPicture` 等 10 个 |
| **data-table** | `useFilterState`, `useFilterActions`, `useHotKey`, `useReactTableSync` 等 7 个 |
| **editor** | （未统计，但应隔离） |
| **document** | （未统计，但应隔离） |

---

## 主题系统的标准化

### 当前问题

```typescript
// ❌ 当前：主题 hook 在 app/ 里，外部系统不知道从哪导入
import { useTheme } from '@/app/theme-provider'

// ❌ 当前：主题切换组件散落各处
import { ThemeToggle } from '@/components/general/theme-toggle'
import { ThemeCustomizer } from '@/components/general/theme-customizer'
```

### 标准化方案

**1. 迁移主题系统到 `_internals/foundations/theme/`**

```
src/_internals/foundations/theme/
├── theme-provider.tsx           # ThemeProvider 组件
├── use-theme.ts                 # useTheme hook
├── theme-storage.ts             # 抽象存储层
├── apply-theme.ts               # 主题应用逻辑
└── index.ts
```

**2. 在 `kit/hooks/` 中 re-export**

```typescript
// src/kit/hooks/use-theme.ts
export { useTheme, type Theme } from '@/_internals/foundations/theme'
```

**3. 主题切换组件保持在 `components/primitives/`**

```typescript
// src/components/primitives/theme-toggle.tsx
import { useTheme } from '@/_internals/foundations/theme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // ...
}
```

**4. 外部系统使用**

```typescript
// ✅ 统一从 kit 导入
import { useTheme } from '@your-org/ui-kit'
import { ThemeToggle } from '@your-org/ui-kit'

function App() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <ThemeToggle />
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

### 主题系统的可扩展性改进

**当前硬编码：**
```typescript
// ❌ localStorage 硬编码
const theme = localStorage.getItem('theme')
```

**改进方案：抽象存储层**

```typescript
// src/_internals/foundations/theme/theme-storage.ts
export interface ThemeStorage {
  getTheme(): Theme | null | Promise<Theme | null>
  setTheme(theme: Theme): void | Promise<void>
}

export class LocalStorageThemeStorage implements ThemeStorage {
  constructor(private key: string = 'theme') {}
  
  getTheme(): Theme | null {
    return localStorage.getItem(this.key) as Theme | null
  }
  
  setTheme(theme: Theme): void {
    localStorage.setItem(this.key, theme)
  }
}

export class CookieThemeStorage implements ThemeStorage {
  // 支持 SSR 的 cookie 存储
}

export class DatabaseThemeStorage implements ThemeStorage {
  // 用户偏好存储在数据库
}
```

**配置化 ThemeProvider：**

```typescript
// src/_internals/foundations/theme/theme-provider.tsx
interface ThemeProviderProps {
  children: React.ReactNode
  storage?: ThemeStorage
  defaultTheme?: Theme
  themes?: Theme[]
}

export function ThemeProvider({ 
  children, 
  storage = new LocalStorageThemeStorage(),
  defaultTheme = 'system',
  themes = ['light', 'dark', 'system']
}: ThemeProviderProps) {
  // ...
}
```

**外部系统自定义：**

```typescript
// ✅ 外部系统可以自定义存储
import { ThemeProvider, CookieThemeStorage } from '@your-org/ui-kit'

function App() {
  return (
    <ThemeProvider storage={new CookieThemeStorage()}>
      {/* ... */}
    </ThemeProvider>
  )
}
```

---

## tsconfig.json 路径配置

### 限制外部访问内部路径

```json
{
  "compilerOptions": {
    "paths": {
      // ✅ 对外公开
      "@your-org/ui-kit": ["./src/kit/index.ts"],
      "@your-org/ui-kit/*": ["./src/kit/*"],
      
      // ✅ 内部使用（仅限 src/ 内部引用）
      "@/_internals/*": ["./src/_internals/*"],
      "@/components/*": ["./src/components/*"],
      
      // ❌ 外部系统无法访问（不配置路径映射）
      // "@/_internals/..." 不对外暴露
    }
  },
  
  // 发布时只包含 kit/
  "include": ["src/kit/**/*"],
  "exclude": ["src/_internals/**/*", "src/app/**/*", "src/lib/**/*"]
}
```

---

## package.json 配置（组件库独立发布）

```json
{
  "name": "@your-org/ui-kit",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.mjs",
      "require": "./dist/hooks/index.js",
      "types": "./dist/hooks/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.mjs",
      "require": "./dist/utils/index.js",
      "types": "./dist/utils/index.d.ts"
    },
    // ❌ 不导出内部路径
    "./_internals/*": null
  },
  "files": [
    "dist"
  ],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

---

## 迁移执行计划

### Phase 1：建立 kit/ 和 _internals/ 结构（1 周）

#### Step 1.1：创建目录结构

```bash
mkdir -p src/kit/{components,hooks,utils,primitives,types}
mkdir -p src/_internals/foundations/{hooks,utils,primitives,theme}
mkdir -p src/_internals/domains/{charts,media,editor,data-table,document}
```

#### Step 1.2：合并重复 hooks 到 _internals/foundations/hooks/

```bash
# 合并 5 份 use-mobile
# 1. 比对实现，选最完整版本
code src/components/_internal/hooks/use-mobile.ts
code src/components/_internal/dice/hooks/use-mobile.ts
code src/components/_internal/gooseui/hooks/use-mobile.ts
code src/components/_internal/uselayouts/hooks/use-mobile.ts
code src/components/document/hooks/use-mobile.ts

# 2. 复制到新位置
cp src/components/_internal/hooks/use-mobile.ts \
   src/_internals/foundations/hooks/use-mobile.ts

# 3. 同样处理其他重复 hooks
```

#### Step 1.3：迁移主题系统

```bash
# 从 app/ 迁移到 _internals/foundations/theme/
mv src/app/theme-provider.tsx src/_internals/foundations/theme/
mv src/app/use-theme.ts src/_internals/foundations/theme/  # 如果存在

# 提取主题逻辑到独立文件
# 编辑 theme-provider.tsx，拆分出 apply-theme.ts、theme-storage.ts
```

#### Step 1.4：创建 kit/ 公开 API

```typescript
// src/kit/hooks/index.ts
export { useTheme } from '@/_internals/foundations/theme'
export { useMobile } from '@/_internals/foundations/hooks/use-mobile'
export { useDebounce } from '@/_internals/foundations/hooks/use-debounce'
// ... 导出所有 Tier 1 hooks

// src/kit/utils/index.ts
export { cn } from '@/_internals/foundations/utils/cn'
export { composeRefs } from '@/_internals/foundations/utils/compose-refs'

// src/kit/index.ts
export * from './hooks'
export * from './utils'
export * from './components'
export * from './primitives'
```

#### Step 1.5：更新所有 import 路径

```bash
# 使用 codemod
pnpm tsx scripts/migrate-to-kit.ts
```

---

### Phase 2：迁移功能域私有代码（1 周）

#### Step 2.1：识别功能域私有 hooks

```bash
# 对每个 hook 运行引用检查
rg "import.*useChartInteraction" --type ts

# 如果只在 charts/ 内引用，迁移到 _internals/domains/charts/
mv src/components/charts/hooks/use-chart-interaction.ts \
   src/_internals/domains/charts/hooks/
```

#### Step 2.2：迁移媒体系统

```bash
mv src/components/media/hooks/* src/_internals/domains/media/hooks/
mv src/components/media/lib/* src/_internals/domains/media/utils/
```

#### Step 2.3：迁移数据表格系统

```bash
mv src/components/data-display/data-table-filters/hooks/* \
   src/_internals/domains/data-table/hooks/
mv src/components/data-display/data-table-filters/lib/* \
   src/_internals/domains/data-table/utils/
mv src/components/data-display/data-table-filters/store/* \
   src/_internals/domains/data-table/store/
```

---

### Phase 3：清理和文档化（3 天）

#### Step 3.1：删除旧的 _internal 目录

```bash
rm -rf src/components/_internal
```

#### Step 3.2：删除重复文件

```bash
# 删除 5 份 use-mobile 中的 4 份
# 保留 _internals/foundations/hooks/use-mobile.ts
```

#### Step 3.3：生成 API 文档

```bash
pnpm typedoc --entryPoints src/kit/index.ts
```

#### Step 3.4：更新 README

```markdown
# @your-org/ui-kit

## 安装

\`\`\`bash
pnpm add @your-org/ui-kit
\`\`\`

## 使用

\`\`\`typescript
import { Button, useTheme, cn } from '@your-org/ui-kit'

function App() {
  const { theme, setTheme } = useTheme()
  return <Button onClick={() => setTheme('dark')}>切换主题</Button>
}
\`\`\`

## API 参考

- [Hooks API](./docs/hooks.md)
- [Components API](./docs/components.md)
- [Utils API](./docs/utils.md)
\`\`\`
```

---

## 验证清单

```bash
# 1. 外部系统只能访问 kit/
pnpm build:kit
ls dist/  # 应该只包含 kit/ 的内容

# 2. 检查是否还有重复定义
find src/_internals -name "use-mobile.ts" | wc -l
# 预期结果：1

# 3. 检查功能域是否跨域引用
rg "import.*from.*domains/(charts|media)" src/components/specialized --type ts | \
  grep -v "from '@/_internals/domains/\1"
# 预期结果：空

# 4. 类型检查
pnpm type-check
# 预期结果：0 errors

# 5. 检查公开 API 数量
wc -l src/kit/hooks/index.ts
# 预期结果：~14 行（14 个公开 hooks）
```

---

## 总结

### 关键改进

| 方面 | 改进 |
|------|------|
| **公开 API** | 统一入口 `kit/`，外部系统只看到 14 个稳定 hooks |
| **内部实现** | `_internals/` 隐藏细节，支持重构而不破坏外部 |
| **功能域隔离** | `_internals/domains/` 防止跨域依赖 |
| **主题系统** | 从 `app/` 迁移到 `_internals/foundations/theme/`，支持自定义存储 |
| **重复定义** | 从 43 个 hooks 减少到 ~25 个，公开 14 个 |

### 预期收益

| 指标 | 当前 | Phase 3 后 |
|-----|------|-----------|
| 公开 hooks 数量 | 43（混乱） | 14（精选） |
| 外部可见路径 | 11+ 处 | 1 处（kit/） |
| 重复定义 | 18+ 个 | 0 个 |
| 主题系统位置 | app/（不合理） | _internals/foundations/theme/ |
| 找 hook 的时间 | 5 分钟 | 10 秒（看 kit/ 文档） |
| 外部系统困惑度 | 高（5 个 use-mobile） | 零（只有 1 个） |
