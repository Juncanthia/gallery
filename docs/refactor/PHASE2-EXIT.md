# Phase 2 出口检查（2026-07-02）

> 覆盖 T2.0–T2.7，commits: `f7149182` … `c45bfb77`（Phase 2 主体）+ 本检查在 T3 开始前复核。

## 1. `_internal` 彻底消失

```bash
find src/components -name "_internal" -type d
```
```
(空)
```

```bash
rg "@/components/_internal" src
```
```
(无输出)
```

## 2. components/ 下散装 hooks/lib（豁免 complex-component）

```bash
find src/components -type d \( -name hooks -o -name lib \) | grep -v complex-component
```
```
(空)
```

## 3. 跨域引用检查

```bash
rg "_internals/domains/charts" src --files-with-matches | grep -Ev "components/charts|_internals/domains/charts|app/"
rg "_internals/domains/media" src --files-with-matches | grep -Ev "components/media|_internals/domains/media|app/"
rg "_internals/domains/data-table" src --files-with-matches | grep -Ev "data-table|_internals/domains/data-table|app/"
rg "_internals/domains/document" src --files-with-matches | grep -Ev "components/document|_internals/domains/document|app/"
rg "_internals/domains/templates" src --files-with-matches | grep -Ev "templates|_internals/domains/templates|app/"
```
```
(全部空)
```

## 4. 全量验证

```bash
pnpm typecheck
```
```
exit: 0
```

```bash
pnpm check:registry
```
```
Registry OK (220 items)
exit: 0
```

```bash
pnpm build
```
```
exit: 1 — 63 个 MDX 解析错误（如 masonry/fade-content/spin 等），为 content/ 既有问题，与 Phase 2 迁移无关；typecheck 已通过。
```

## 5. 关键交付物

| 任务 | commit | 说明 |
| --- | --- | --- |
| T2.5 解散 vendor | `f7149182` | `_internal/{dice,gooseui,uselayouts,sabraman}` 迁空并删除 |
| T2.6 registry 路径 | `7021c483` | source-registry ui/ 路径修复 |
| T2.7 vendor 去后缀 | `c45bfb77` | 组件路径 rename |

## 6. 就地保留/豁免决策

- `marketing-blocks/complex-component/{hooks,lib}` — 演示数据，就地保留（T2.4 记录）
