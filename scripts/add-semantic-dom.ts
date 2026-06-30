/**
 * 批量为 MDX 文件添加 Semantic DOM 章节。
 * 在 <h2 id="source"> 之前插入，使用之前提取的 data-slot 值。
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const COMPONENTS_DIR = join(import.meta.dirname, "..", "content", "components")

// 从源码提取的所有 data-slot 值（之前 bash 脚本的输出）
const SLOTS: Record<string, string[]> = {
  accordion: [],
  affix: ["affix", "affix-content"],
  alert: ["alert", "alert-action", "alert-description", "alert-title"],
  "alert-dialog": [],
  anchor: ["anchor"],
  "aspect-ratio": ["aspect-ratio"],
  attachment: ["attachment", "attachment-action", "attachment-actions", "attachment-content", "attachment-description", "attachment-group", "attachment-media", "attachment-title", "attachment-trigger", "attachment-upload", "attachment-upload-trigger"],
  "auto-complete": [],
  avatar: ["avatar", "avatar-badge", "avatar-fallback", "avatar-group", "avatar-group-count", "avatar-image"],
  badge: ["badge", "badge-indicator", "badge-ribbon", "badge-ribbon-corner", "badge-ribbon-wrapper", "badge-status", "badge-status-dot", "badge-text", "badge-wrapper"],
  "border-beam": ["border-beam"],
  breadcrumb: ["breadcrumb", "breadcrumb-ellipsis", "breadcrumb-item", "breadcrumb-link", "breadcrumb-list", "breadcrumb-page", "breadcrumb-separator"],
  button: ["button"],
  "button-group": ["button-group", "button-group-separator"],
  calendar: ["calendar", "calendar-cell-extra", "calendar-wrapper"],
  card: ["card", "card-action", "card-content", "card-cover", "card-description", "card-footer", "card-grid", "card-header", "card-meta", "card-meta-avatar", "card-meta-description", "card-meta-title", "card-tabs", "card-title"],
  carousel: ["carousel", "carousel-content", "carousel-dot", "carousel-dots", "carousel-item", "carousel-next", "carousel-previous"],
  cascader: [],
  chart: ["chart"],
  "chat-bubble": ["bubble", "bubble-content", "bubble-group", "bubble-reactions"],
  checkbox: ["checkbox", "checkbox-group", "checkbox-indicator"],
  collapsible: [],
  "color-picker": [],
  combobox: ["combobox-chip", "combobox-chip-input", "combobox-chip-remove", "combobox-chips", "combobox-clear", "combobox-collection", "combobox-content", "combobox-empty", "combobox-group", "combobox-item", "combobox-label", "combobox-list", "combobox-separator", "combobox-trigger", "combobox-value", "input-group-button"],
  command: ["command", "command-empty", "command-group", "command-input", "command-input-wrapper", "command-item", "command-list", "command-separator", "command-shortcut"],
  "context-menu": ["context-menu", "context-menu-checkbox-item", "context-menu-content", "context-menu-group", "context-menu-item", "context-menu-label", "context-menu-portal", "context-menu-radio-group", "context-menu-radio-item", "context-menu-separator", "context-menu-shortcut", "context-menu-sub", "context-menu-sub-content", "context-menu-sub-trigger", "context-menu-trigger"],
  "copy-button": ["copy-button", "copy-button-icon"],
  "date-picker": ["date-picker-trigger"],
  descriptions: ["descriptions"],
  dialog: [],
  direction: [],
  drawer: ["drawer", "drawer-close", "drawer-content", "drawer-description", "drawer-footer", "drawer-header", "drawer-overlay", "drawer-portal", "drawer-title", "drawer-trigger"],
  "dropdown-menu": ["chevron"],
  "empty-state": ["empty", "empty-content", "empty-description", "empty-header", "empty-icon", "empty-title"],
  "file-tree": [],
  flex: ["flex"],
  "float-button": ["float-button", "float-button-content", "float-button-group", "float-button-group-list", "float-button-icon"],
  "form-field": ["field", "field-content", "field-description", "field-error", "field-group", "field-label", "field-legend", "field-separator", "field-separator-content", "field-set", "form"],
  "hover-card": [],
  image: ["image"],
  input: ["input", "input-addon-wrapper", "input-count", "input-number", "input-number-control", "input-otp", "input-otp-group", "input-otp-separator", "input-otp-slot", "input-prefix", "input-suffix", "input-wrapper", "textarea"],
  "input-group": ["input-group", "input-group-addon", "input-group-control"],
  kbd: ["kbd", "kbd-group"],
  label: ["label"],
  "link-preview": [],
  list: ["list"],
  "list-item": ["item", "item-actions", "item-content", "item-description", "item-footer", "item-group", "item-header", "item-media", "item-separator", "item-title"],
  marker: ["marker", "marker-content", "marker-icon"],
  mentions: [],
  menubar: ["menubar", "menubar-checkbox-item", "menubar-content", "menubar-group", "menubar-item", "menubar-label", "menubar-menu", "menubar-portal", "menubar-radio-group", "menubar-radio-item", "menubar-separator", "menubar-shortcut", "menubar-sub", "menubar-sub-content", "menubar-sub-trigger", "menubar-trigger"],
  message: ["message", "message-avatar", "message-content", "message-footer", "message-group", "message-header"],
  "message-scroller": ["message-scroller", "message-scroller-button", "message-scroller-content", "message-scroller-item", "message-scroller-viewport"],
  "native-select": ["native-select", "native-select-icon", "native-select-optgroup", "native-select-option", "native-select-wrapper"],
  "navigation-menu": ["navigation-menu", "navigation-menu-content", "navigation-menu-indicator", "navigation-menu-item", "navigation-menu-link", "navigation-menu-list", "navigation-menu-trigger", "navigation-menu-viewport"],
  notification: [],
  "notification-api": [],
  pagination: ["pagination", "pagination-content", "pagination-ellipsis", "pagination-item", "pagination-link", "pagination-quick-jumper", "pagination-size-changer", "pagination-total"],
  popconfirm: [],
  popover: [],
  progress: ["progress-circle", "progress-steps"],
  "qr-code": ["qrcode"],
  "radio-group": ["radio-group", "radio-group-item", "radio-group-indicator"],
  rate: ["rate"],
  resizable: ["resizable-handle", "resizable-panel", "resizable-panel-group"],
  result: ["result", "result-content", "result-extra", "result-icon", "result-subtitle", "result-title"],
  "scroll-area": ["scroll-area", "scroll-area-scrollbar", "scroll-area-thumb", "scroll-area-viewport"],
  select: ["select", "select-chip-remove", "select-content", "select-group", "select-item", "select-label", "select-scroll-down-button", "select-scroll-up-button", "select-separator", "select-trigger", "select-value"],
  separator: ["separator"],
  sheet: [],
  sidebar: ["sidebar", "sidebar-container", "sidebar-content", "sidebar-footer", "sidebar-gap", "sidebar-group", "sidebar-group-action", "sidebar-group-content", "sidebar-group-label", "sidebar-header", "sidebar-inner", "sidebar-input", "sidebar-inset", "sidebar-menu", "sidebar-menu-action", "sidebar-menu-badge", "sidebar-menu-button", "sidebar-menu-item", "sidebar-menu-skeleton", "sidebar-menu-sub", "sidebar-menu-sub-button", "sidebar-menu-sub-item", "sidebar-rail", "sidebar-separator", "sidebar-trigger", "sidebar-wrapper"],
  skeleton: ["skeleton", "skeleton-root"],
  slider: ["slider", "slider-dot", "slider-mark", "slider-marks", "slider-range", "slider-thumb", "slider-track", "slider-wrapper"],
  space: ["space", "space-item", "space-separator"],
  spin: ["spin"],
  statistic: ["statistic", "statistic-content", "statistic-diff", "statistic-prefix", "statistic-suffix", "statistic-title", "statistic-value"],
  steps: ["steps"],
  switch: ["switch", "switch-thumb", "switch-icon"],
  table: ["table", "table-body", "table-caption", "table-cell", "table-container", "table-expanded-row", "table-footer", "table-head", "table-header", "table-row", "table-title"],
  tabs: [],
  tag: ["tag"],
  "time-picker": [],
  timeline: ["timeline"],
  toaster: [],
  toggle: [],
  "toggle-group": [],
  tooltip: [],
  transfer: [],
  tree: [],
  "tree-select": [],
  typography: ["link", "paragraph", "paragraph-copyable", "text", "text-copyable", "title", "title-copyable"],
  watermark: ["watermark", "watermark-overlay"],
}

// 修复 tooltip 和 dialog 的 data-slot（从源码）
SLOTS.tooltip = ["tooltip", "tooltip-trigger", "tooltip-content"]
SLOTS.dialog = ["dialog", "dialog-content", "dialog-header", "dialog-title", "dialog-description", "dialog-footer", "dialog-overlay", "dialog-portal", "dialog-trigger"]
SLOTS.tabs = ["tabs", "tabs-list", "tabs-trigger", "tabs-content"]

function buildSemanticDomSection(name: string): string {
  const slots = SLOTS[name]
  if (!slots || slots.length === 0) {
    return `\n<h2 id="semantic-dom">Semantic DOM</h2>\n\n组件使用原生元素语义，未声明额外的 \`data-slot\` 属性。通过标签名和 ARIA 属性定位。\n`
  }

  const rows = slots.map((s) => `| \`${s}\` | - |`).join("\n")

  return `\n<h2 id="semantic-dom">Semantic DOM</h2>\n\n组件通过 \`data-slot\` 属性暴露稳定的语义结构，可用于测试定位和样式覆写：\n\n| data-slot | 说明 |\n| --- | --- |\n${rows}\n`
}

function enhanceMdx(filePath: string, name: string) {
  let content = readFileSync(filePath, "utf-8")

  // Check if already has semantic-dom section
  if (content.includes('id="semantic-dom"')) {
    return false
  }

  const section = buildSemanticDomSection(name)

  // Insert before <h2 id="source"> or <h2 id="llm-rules"> (whichever comes first, but after faq)
  if (content.includes('<h2 id="source">')) {
    content = content.replace('<h2 id="source">', `${section}\n<h2 id="source">`)
  } else if (content.includes('<h2 id="llm-rules">')) {
    content = content.replace('<h2 id="llm-rules">', `${section}\n<h2 id="llm-rules">`)
  } else {
    // Fallback: insert before SourceViewer
    content = content.replace('<SourceViewer', `${section}\n\n<SourceViewer`)
  }

  writeFileSync(filePath, content, "utf-8")
  return true
}

const dirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let done = 0
let skipped = 0

for (const name of dirs) {
  const mdxPath = join(COMPONENTS_DIR, name, "index.mdx")
  if (!existsSync(mdxPath)) continue

  try {
    if (enhanceMdx(mdxPath, name)) {
      console.log(`  ✅ ${name}: ${(SLOTS[name] || []).length} slots`)
      done++
    } else {
      console.log(`  ⏭️  ${name}: already has semantic-dom`)
      skipped++
    }
  } catch (err) {
    console.log(`  ❌ ${name}: ${err}`)
  }
}

console.log(`\nDone. Added: ${done}, Skipped: ${skipped}`)
