export type BiLabel = {
  zh: string
  en: string
}

export function bi(label: BiLabel): string {
  return `${label.zh} ${label.en}`
}

export const PRIMARY_NAV = {
  components: { zh: "组件", en: "Components" },
  blocks: { zh: "区块", en: "Blocks" },
  patterns: { zh: "模式", en: "Patterns" },
} as const satisfies Record<string, BiLabel>

export const COMPONENT_CATEGORIES: Record<string, BiLabel> = {
  基础组件: { zh: "基础组件", en: "Base" },
  表单输入: { zh: "表单输入", en: "Forms" },
  反馈展示: { zh: "反馈展示", en: "Feedback" },
  覆盖层: { zh: "覆盖层", en: "Overlay" },
  数据展示: { zh: "数据展示", en: "Data Display" },
  图表: { zh: "图表", en: "Charts" },
  业务增强: { zh: "业务增强", en: "Business" },
}

export const STATUS_LABELS: Record<string, BiLabel> = {
  stable: { zh: "稳定", en: "Stable" },
  beta: { zh: "测试", en: "Beta" },
  experimental: { zh: "实验", en: "Experimental" },
}

export function componentCategoryLabel(zh: string): string {
  const found = COMPONENT_CATEGORIES[zh]
  return found ? bi(found) : zh
}

export function statusLabel(status: string | undefined): string {
  const found = status ? STATUS_LABELS[status] : undefined
  return found ? bi(found) : status ?? bi(STATUS_LABELS.stable)
}
