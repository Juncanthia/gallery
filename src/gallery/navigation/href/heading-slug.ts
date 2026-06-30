/**
 * 复现 fumadocs 对标题生成 id 的规则，用于把 TOC 锚点与渲染出的 heading id 对齐。
 */
export function slugifyHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_{}[\]()]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
}

/**
 * 从 ComponentShowcase 的 path 推导该组件区块的锚点前缀。
 */
export function showcaseAnchorBase(path: string): string {
  const last = path.split("/").pop() ?? path
  return last.replace(/-demo$/, "")
}
