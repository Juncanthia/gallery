# Phase 1 出口检查（2026-07-02）

## 1. 重复消灭确认

```bash
find src -name "use-mobile*" | wc -l
```
```
       1
```

```bash
find src -name "use-as-ref*" | wc -l
```
```
       1
```

```bash
find src -name "use-isomorphic-layout-effect*" | wc -l
```
```
       1
```

```bash
find src -name "use-lazy-ref*" | wc -l
```
```
       1
```

```bash
find src -name "*compose-refs*" | wc -l
```
```
       1
```

## 2. 旧 _internal hooks/lib 目录

```bash
ls src/components/_internal/hooks src/components/_internal/lib 2>/dev/null
```
```
src/components/_internal/hooks:
use-auto-height.tsx
use-data-state.tsx
use-is-touch-device.ts
use-upload-file.ts

src/components/_internal/lib:
block-discussion-index.ts
get-strict-context.tsx
markdown-joiner-transform.ts
suggestion.ts
```

## 3. 全量验证

### 3.1 typecheck

```bash
pnpm typecheck
```
```
$ tsc -b
exit: 0
```

### 3.2 build

> **豁免**：`source-registry.ts` 仍引用已删除的 `src/components/ui/*.tsx?raw`（Stage B 后 ui/ 目录不存在）。197 个 UNRESOLVED_IMPORT，非 Phase 1 重构引入。

```bash
pnpm build
```
```
✗ Build failed in 6.24s
Build failed with 197 errors:
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/accordion.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/affix.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/alert.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/alert-dialog.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/anchor.tsx?raw' in src/app/registry/source-registry.ts
... (197 total)
exit: 1
```

### 3.3 check:registry

```bash
pnpm check:registry
```
```
Registry OK (220 items)
exit: 0
```

## 4. vendor hooks/lib 子目录

```bash
find src/components/_internal -type d \( -name hooks -o -name lib \)
```
```
src/components/_internal/dice/lib
src/components/_internal/gooseui/hooks
src/components/_internal/gooseui/lib
src/components/_internal/hooks
src/components/_internal/lib
src/components/_internal/sabraman/lib
src/components/_internal/uselayouts/hooks
src/components/_internal/uselayouts/lib
```

## T1.5 补充

```bash
rg "theme-provider" src
```
```
src/_internals/foundations/theme/index.ts:export { ThemeProvider } from "./theme-provider"
```

## T1.6 补充

```bash
rg "from '@/_internals/domains" src/kit
```
```
(no matches)
```

```bash
npx tsc --noEmit src/kit/index.ts 2>&1 | head
```
```
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

```bash
pnpm typecheck  # kit 含于 src/，已通过
```
```
exit: 0
```
