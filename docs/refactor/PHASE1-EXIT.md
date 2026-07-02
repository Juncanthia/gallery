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

```bash
pnpm type-check && pnpm build && pnpm check:registry
```
```
[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "type-check" not found

Did you mean "pnpm typecheck"?
exit: 1
```

```bash
pnpm typecheck
```
```
$ tsc -b
exit: 0
```

```bash
pnpm build
```
```
vite v8.1.0 building client environment for production...
✓ 11285 modules transformed.
✗ Build failed in 7.30s
Build failed with 197 errors:
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/accordion.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/affix.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/alert.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/alert-dialog.tsx?raw' in src/app/registry/source-registry.ts
[UNRESOLVED_IMPORT] Could not resolve '../../../src/components/ui/anchor.tsx?raw' in src/app/registry/source-registry.ts
... (197 total)
exit: 1
```

**已知豁免，不阻塞 Phase 2**（source-registry → ui/ 路径，Stage B 后 ui/ 目录不存在）

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
