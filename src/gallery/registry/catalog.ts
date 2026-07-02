import type { GalleryNavGroup, GalleryNavItem, GalleryDocMeta, GalleryTocItem } from "./nav-types"

export type { GalleryNavItem, GalleryNavGroup, GalleryTocItem, GalleryDocMeta } from "./nav-types"

import { COMPONENT_REGISTRY } from "./index"
import { mergeNavItemFromRegistry, mergeRegistryNavItems } from "./derive-catalog"
import { getCatalogId } from "./registry-utils"

function applyRegistryNavPatch(groups: GalleryNavGroup[]): GalleryNavGroup[] {
  const byCatalogId = new Map(COMPONENT_REGISTRY.map((item) => [getCatalogId(item), item]))
  const byDocsSlug = new Map(COMPONENT_REGISTRY.map((item) => [item.docsSlug, item]))

  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const registryItem =
        byCatalogId.get(item.id) ?? byDocsSlug.get(item.to.replace(/^\/components\//, ""))
      if (!registryItem) {
        return item
      }
      return mergeNavItemFromRegistry(item, registryItem)
    }),
  }))
}

type ComponentSeed = {
  id: string
  en: string
  label: string
  summary?: string
  keywords?: string[]
  /** 是否有 Ant Design 对应组件。默认根据 id 自动判断 */
  antd?: boolean
  /** Ant Design API 迁移覆盖率 (0-100)。有 antd 映射时默认 90 */
  migration?: number
  /** 是否具有单入口 props 驱动的 API（非 compound/composition 模式） */
  api?: boolean
}

/** 无 Ant Design 对应组件的 id 列表 */
const NON_ANTD_IDS = new Set([
  "accordion", "alert-dialog", "blocks/announcement", "aspect-ratio", "attachment",
  "blocks/avatar-stack", "blocks/avatar-tooltip-group", "blocks/banner", "button-group", "blocks/calculator",
  "chart", "chat-bubble", "blocks/choicebox", "blocks/code-block", "blocks/code-panel", "blocks/code-tabs",
  "combobox", "command", "blocks/comparison", "context-menu", "blocks/contribution-graph",
  "copy-button", "blocks/credit-card", "blocks/cursor-follow", "blocks/data-table", "blocks/deck",
  "blocks/dialog-stack", "direction", "blocks/dropzone", "editor", "blocks/feature-calendar",
  "file-tree", "blocks/file-upload", "blocks/gantt", "blocks/github-stars-wheel", "blocks/glimpse", "hover-card",
  "blocks/image-crop", "blocks/image-zoom", "input-group", "blocks/kanban", "kbd", "label",
  "link-preview", "list-item", "marker", "blocks/marquee",
  "message-scroller", "blocks/mini-calendar", "native-select", "references/notification-api",
  "blocks/pill", "plate-editors-showcase", "blocks/presence-cursor", "blocks/rating", "blocks/reel",
  "blocks/relative-time", "resizable", "blocks/sandbox", "scroll-area", "separator",
  "sheet", "sidebar", "blocks/snippet", "blocks/spinner", "blocks/status", "blocks/stories",
  "blocks/tabs-motion", "blocks/tags", "blocks/theme-switcher", "blocks/ticker", "toaster", "toggle",
  "toggle-group", "blocks/tooltip-motion", "blocks/video-player",
  "mdx-test",
])

/** 复杂组件的迁移覆盖率略低 */
const MIGRATION_OVERRIDES: Record<string, number> = {
  "date-picker": 85,
  dialog: 85,
  "form-field": 85,
  menubar: 85,
  "navigation-menu": 85,
  table: 85,
  transfer: 80,
  tree: 85,
  "tree-select": 85,
  cascader: 85,
  mentions: 85,
  "color-picker": 90,
  calendar: 90,
  carousel: 90,
  "dropdown-menu": 90,
  "float-button": 90,
  pagination: 90,
  select: 90,
  slider: 90,
  tabs: 90,
}

function resolveAntd(id: string): { antd: boolean; migration: number } {
  if (NON_ANTD_IDS.has(id)) return { antd: false, migration: 0 }
  const migration = MIGRATION_OVERRIDES[id] ?? 95
  return { antd: true, migration }
}

function componentItem({
  id,
  en,
  label,
  summary,
  keywords = [],
  antd,
  migration,
  api,
}: ComponentSeed): GalleryNavItem {
  const resolved = antd !== undefined
    ? { antd, migration: migration ?? (antd ? 90 : 0) }
    : resolveAntd(id)

  return {
    id,
    label,
    en,
    to: `/components/${id}`,
    summary: summary ?? `${label}，对齐 Ant Design ${en} 的组件用法。`,
    keywords: [id, en, en.toLowerCase(), label, ...keywords],
    antd: resolved.antd,
    migration: resolved.migration,
    api,
  }
}

const SEED_NAV_GROUPS: GalleryNavGroup[] = [
  {
    group: "通用",
    groupEn: "General",
    libraryId: "kibo-ui",
    items: [
      componentItem({
              id: "button",
              en: "Button",
              label: "按钮",
              summary: "触发即时操作，支持颜色、形态、加载、图标与链接用法。",
              keywords: ["anniu", "操作", "loading", "icon"],
              api: true,
            }),
      componentItem({ id: "button-group", en: "ButtonGroup", label: "按钮组" }),
      componentItem({
              id: "float-button",
              en: "FloatButton",
              label: "悬浮按钮",
              api: true,
            }),
      componentItem({ id: "typography", en: "Typography", label: "排版",
              api: true,
            }),
      componentItem({ id: "copy-button", en: "CopyButton", label: "复制按钮",
              api: true,
            }),
      componentItem({ id: "kbd", en: "Kbd", label: "快捷键",
              api: true,
            }),
      componentItem({ id: "label", en: "Label", label: "标签文本",
              api: true,
            }),
      componentItem({ id: "marker", en: "Marker", label: "标记",
              api: true,
            }),
      componentItem({ id: "affix", en: "Affix", label: "固钉",
              api: true,
            }),
      componentItem({ id: "border-beam", en: "BorderBeam", label: "边框流光",
              api: true,
            }),
      componentItem({
              id: "context-menu",
              en: "ContextMenu",
              label: "右键菜单",
            }),
      componentItem({ id: "sheet", en: "Sheet", label: "工作表" }),
      componentItem({ id: "toggle", en: "Toggle", label: "切换按钮",
              api: true,
            }),
      componentItem({
              id: "toggle-group",
              en: "ToggleGroup",
              label: "切换按钮组",
            }),
      componentItem({
              id: "mdx-test",
              en: "MdxTest",
              label: "MDX 实验性测试页",
              summary:
                "测试排版、布局、数学公式、Markdown 内建代码块及高级 MDX 组件的渲染效果。",
              keywords: ["test", "mdx", "math", "code", "table"],
            }),
    ],
  },
  {
    group: "布局",
    groupEn: "Layout",
    libraryId: "kibo-ui",
    items: [
      componentItem({ id: "aspect-ratio", en: "AspectRatio", label: "宽高比",
              api: true,
            }),
      componentItem({ id: "direction", en: "Direction", label: "方向",
              api: true,
            }),
      componentItem({ id: "flex", en: "Flex", label: "弹性布局",
              api: true,
            }),
      componentItem({ id: "resizable", en: "Resizable", label: "可调整面板" }),
      componentItem({ id: "scroll-area", en: "ScrollArea", label: "滚动区域" }),
      componentItem({ id: "separator", en: "Separator", label: "分隔线",
              api: true,
            }),
      componentItem({ id: "sidebar", en: "Sidebar", label: "侧边栏" }),
      componentItem({ id: "space", en: "Space", label: "间距",
              api: true,
            }),
    ],
  },
  {
    group: "导航",
    groupEn: "Navigation",
    libraryId: "kibo-ui",
    items: [
      componentItem({ id: "anchor", en: "Anchor", label: "锚点",
              api: true,
            }),
      componentItem({ id: "breadcrumb", en: "Breadcrumb", label: "面包屑",
              api: true,
            }),
      componentItem({
              id: "dropdown-menu",
              en: "DropdownMenu",
              label: "下拉菜单",
            }),
      componentItem({ id: "menubar", en: "Menubar", label: "菜单栏" }),
      componentItem({
              id: "navigation-menu",
              en: "NavigationMenu",
              label: "导航菜单",
            }),
      componentItem({ id: "pagination", en: "Pagination", label: "分页",
              api: true,
            }),
      componentItem({ id: "steps", en: "Steps", label: "步骤条",
              api: true,
            }),
      componentItem({ id: "tabs", en: "Tabs", label: "标签页" }),
    ],
  },
  {
    group: "数据录入",
    groupEn: "Data Entry",
    libraryId: "kibo-ui",
    items: [
      componentItem({
              id: "auto-complete",
              en: "AutoComplete",
              label: "自动完成",
              api: true,
            }),
      componentItem({ id: "cascader", en: "Cascader", label: "级联选择",
              api: true,
            }),
      componentItem({ id: "checkbox", en: "Checkbox", label: "多选框",
              api: true,
            }),
      componentItem({
              id: "color-picker",
              en: "ColorPicker",
              label: "颜色选择器",
              api: true,
            }),
      componentItem({ id: "combobox", en: "Combobox", label: "组合选择" }),
      componentItem({ id: "command", en: "Command", label: "命令面板" }),
      componentItem({
              id: "date-picker",
              en: "DatePicker",
              label: "日期选择框",
              api: true,
            }),
      componentItem({ id: "form-field", en: "FormField", label: "表单字段" }),
      componentItem({ id: "input", en: "Input", label: "输入框",
              api: true,
            }),
      componentItem({ id: "input-group", en: "InputGroup", label: "输入框组" }),
      componentItem({ id: "mentions", en: "Mentions", label: "提及",
              api: true,
            }),
      componentItem({
              id: "native-select",
              en: "NativeSelect",
              label: "原生选择",
              api: true,
            }),
      componentItem({ id: "radio-group", en: "RadioGroup", label: "单选组",
              api: true,
            }),
      componentItem({ id: "rate", en: "Rate", label: "评分",
              api: true,
            }),
      componentItem({ id: "select", en: "Select", label: "选择器" }),
      componentItem({ id: "slider", en: "Slider", label: "滑动输入条",
              api: true,
            }),
      componentItem({ id: "switch", en: "Switch", label: "开关",
              api: true,
            }),
      componentItem({
              id: "time-picker",
              en: "TimePicker",
              label: "时间选择框",
              api: true,
            }),
      componentItem({ id: "transfer", en: "Transfer", label: "穿梭框",
              api: true,
            }),
      componentItem({ id: "tree-select", en: "TreeSelect", label: "树选择",
              api: true,
            }),
    ],
  },
  {
    group: "数据展示",
    groupEn: "Data Display",
    libraryId: "kibo-ui",
    items: [
      componentItem({ id: "accordion", en: "Accordion", label: "手风琴" }),
      componentItem({ id: "attachment", en: "Attachment", label: "附件" }),
      componentItem({ id: "avatar", en: "Avatar", label: "头像",
              api: true,
            }),
      componentItem({ id: "badge", en: "Badge", label: "徽标",
              api: true,
            }),
      componentItem({ id: "calendar", en: "Calendar", label: "日历",
              api: true,
            }),
      componentItem({ id: "card", en: "Card", label: "卡片" }),
      componentItem({ id: "carousel", en: "Carousel", label: "走马灯",
              api: true,
            }),
      componentItem({ id: "chart", en: "Chart", label: "图表",
              api: true,
            }),
      componentItem({ id: "chat-bubble", en: "ChatBubble", label: "聊天气泡" }),
      componentItem({
              id: "collapsible",
              en: "Collapsible",
              label: "折叠容器",
            }),
      componentItem({
              id: "descriptions",
              en: "Descriptions",
              label: "描述列表",
              api: true,
            }),
      componentItem({ id: "empty-state", en: "EmptyState", label: "空状态",
              api: true,
            }),
      componentItem({ id: "file-tree", en: "FileTree", label: "文件树",
              api: true,
            }),
      componentItem({ id: "hover-card", en: "HoverCard", label: "悬浮卡片" }),
      componentItem({ id: "image", en: "Image", label: "图片",
              api: true,
            }),
      componentItem({
              id: "link-preview",
              en: "LinkPreview",
              label: "链接预览",
              api: true,
            }),
      componentItem({ id: "list", en: "List", label: "列表",
              api: true,
            }),
      componentItem({ id: "list-item", en: "ListItem", label: "列表项" }),
      componentItem({ id: "popover", en: "Popover", label: "气泡卡片" }),
      componentItem({ id: "qr-code", en: "QRCode", label: "二维码",
              api: true,
            }),
      componentItem({ id: "statistic", en: "Statistic", label: "统计数值",
              api: true,
            }),
      componentItem({ id: "table", en: "Table", label: "表格",
              api: true,
            }),
      componentItem({ id: "tag", en: "Tag", label: "标签",
              api: true,
            }),
      componentItem({ id: "timeline", en: "Timeline", label: "时间轴",
              api: true,
            }),
      componentItem({ id: "tooltip", en: "Tooltip", label: "文字提示" }),
      componentItem({ id: "tree", en: "Tree", label: "树形控件",
              api: true,
            }),
    ],
  },
  {
    group: "反馈",
    groupEn: "Feedback",
    libraryId: "kibo-ui",
    items: [
      componentItem({ id: "alert", en: "Alert", label: "警告提示",
              api: true,
            }),
      componentItem({
              id: "alert-dialog",
              en: "AlertDialog",
              label: "警告对话框",
            }),
      componentItem({ id: "dialog", en: "Dialog", label: "对话框" }),
      componentItem({ id: "drawer", en: "Drawer", label: "抽屉" }),
      componentItem({ id: "message", en: "Message", label: "全局提示" }),
      componentItem({
              id: "message-scroller",
              en: "MessageScroller",
              label: "消息滚动",
            }),
      componentItem({
              id: "references/notification",
              en: "Notification",
              label: "通知提醒",
              api: true,
            }),
      componentItem({
              id: "popconfirm",
              en: "Popconfirm",
              label: "气泡确认框",
            }),
      componentItem({ id: "progress", en: "Progress", label: "进度条",
              api: true,
            }),
      componentItem({ id: "result", en: "Result", label: "结果",
              api: true,
            }),
      componentItem({ id: "skeleton", en: "Skeleton", label: "骨架屏" }),
      componentItem({ id: "spin", en: "Spin", label: "加载中",
              api: true,
            }),
      componentItem({ id: "toaster", en: "Toaster", label: "吐司容器" }),
      componentItem({ id: "watermark", en: "Watermark", label: "水印",
              api: true,
            }),
    ],
  },
  {
    group: "复合组件",
    groupEn: "Blocks",
    libraryId: "kibo-ui",
    items: [
      componentItem({ id: "blocks/announcement", en: "Announcement", label: "公告条",
              api: true,
            }),
      componentItem({ id: "blocks/avatar-stack", en: "AvatarStack", label: "头像堆叠" }),
      componentItem({ id: "blocks/avatar-tooltip-group", en: "AvatarTooltipGroup", label: "头像提示组" }),
      componentItem({ id: "blocks/banner", en: "Banner", label: "横幅",
              api: true,
            }),
      componentItem({ id: "blocks/calculator", en: "Calculator", label: "计算器",
              api: true,
            }),
      componentItem({ id: "blocks/choicebox", en: "Choicebox", label: "选择框" }),
      componentItem({ id: "blocks/code-block", en: "CodeBlock", label: "代码块" }),
      componentItem({ id: "blocks/code-panel", en: "CodePanel", label: "代码面板" }),
      componentItem({ id: "blocks/code-tabs", en: "CodeTabs", label: "代码标签页" }),
      componentItem({ id: "blocks/comparison", en: "Comparison", label: "对比滑块",
              api: true,
            }),
      componentItem({ id: "blocks/contribution-graph", en: "ContributionGraph", label: "贡献图",
              api: true,
            }),
      componentItem({ id: "blocks/credit-card", en: "CreditCard", label: "信用卡" }),
      componentItem({ id: "blocks/cursor-follow", en: "CursorFollow", label: "光标跟随" }),
      componentItem({ id: "blocks/data-table", en: "DataTable", label: "数据表格",
              api: true,
            }),
      componentItem({ id: "blocks/deck", en: "Deck", label: "卡片堆叠" }),
      componentItem({ id: "blocks/dialog-stack", en: "DialogStack", label: "对话框堆叠" }),
      componentItem({ id: "blocks/dropzone", en: "Dropzone", label: "拖拽上传",
              api: true,
            }),
      componentItem({ id: "editor", en: "Editor", label: "富文本编辑器" }),
      componentItem({ id: "blocks/feature-calendar", en: "FeatureCalendar", label: "功能日历" }),
      componentItem({ id: "blocks/file-upload", en: "FileUpload", label: "文件上传",
              summary: "无样式的组合式文件上传原语，支持拖拽、校验、进度与可控状态。",
            }),
      componentItem({ id: "blocks/gantt", en: "Gantt", label: "甘特图",
              api: true,
            }),
      componentItem({ id: "blocks/github-stars-wheel", en: "GitHubStarsWheel", label: "GitHub 星标",
              api: true,
            }),
      componentItem({ id: "blocks/glimpse", en: "Glimpse", label: "一瞥效果" }),
      componentItem({ id: "blocks/image-crop", en: "ImageCrop", label: "图片裁剪",
              api: true,
            }),
      componentItem({ id: "blocks/image-zoom", en: "ImageZoom", label: "图片缩放",
              api: true,
            }),
      componentItem({ id: "blocks/kanban", en: "Kanban", label: "看板",
              api: true,
            }),
      componentItem({ id: "blocks/marquee", en: "Marquee", label: "跑马灯",
              api: true,
            }),
      componentItem({ id: "blocks/masonry", en: "Masonry", label: "瀑布流",
              api: true,
            }),
      componentItem({ id: "blocks/mini-calendar", en: "MiniCalendar", label: "迷你日历",
              api: true,
            }),
      componentItem({ id: "blocks/pill", en: "Pill", label: "药丸标签" }),
      componentItem({ id: "blocks/presence-cursor", en: "PresenceCursor", label: "协作光标" }),
      componentItem({ id: "blocks/rating", en: "Rating", label: "评分组件" }),
      componentItem({ id: "blocks/reel", en: "Reel", label: "卷轴滑动",
              api: true,
            }),
      componentItem({ id: "blocks/relative-time", en: "RelativeTime", label: "相对时间",
              api: true,
            }),
      componentItem({ id: "blocks/sandbox", en: "Sandbox", label: "沙箱预览",
              api: true,
            }),
      componentItem({ id: "blocks/snippet", en: "Snippet", label: "代码片段" }),
      componentItem({ id: "blocks/spinner", en: "Spinner", label: "加载旋转",
              api: true,
            }),
      componentItem({ id: "blocks/status", en: "Status", label: "状态指示",
              api: true,
            }),
      componentItem({ id: "blocks/stories", en: "Stories", label: "快拍轮播" }),
      componentItem({ id: "blocks/tabs-motion", en: "TabsMotion", label: "动效标签页" }),
      componentItem({ id: "blocks/tags", en: "Tags", label: "标签组" }),
      componentItem({ id: "blocks/theme-switcher", en: "ThemeSwitcher", label: "主题切换",
              api: true,
            }),
      componentItem({ id: "blocks/ticker", en: "Ticker", label: "滚动条",
              api: true,
            }),
      componentItem({ id: "blocks/tooltip-motion", en: "TooltipMotion", label: "动效提示" }),
      componentItem({ id: "blocks/tour", en: "Tour", label: "引导漫游" }),
      componentItem({ id: "blocks/video-player", en: "VideoPlayer", label: "视频播放器",
              api: true,
            }),
    ],
  },
  {
    group: "图表",
    groupEn: "Charts",
    items: [
    ],
  },
  {
    group: "媒体播放",
    groupEn: "Media",
    libraryId: "limeplay",
    items: [
    ],
  },
  {
    group: "编辑器",
    groupEn: "Editor",
    libraryId: "plate",
    items: [
      {
        id: "editors-showcase",
        label: "编辑器展示",
        en: "PlateEditorsShowcase",
        to: "/components/plate/editors-showcase",
        summary: "Plate 富文本编辑器展示组件。",
        keywords: ["plate", "editor", "showcase"],
        antd: false,
        migration: 0,
        api: true,
      },
    ],
  },
  {
    group: "文档",
    groupEn: "Document",
    libraryId: "extend",
    items: [
    ],
  },
  {
    group: "工具组件",
    groupEn: "Agent Tools",
    libraryId: "tool-ui",
    items: [
    ],
  },
  {
    group: "视觉效果",
    groupEn: "Effects",
    libraryId: "react-bits",
    items: [
    ],
  },
  {
    group: "营销区块",
    groupEn: "Marketing Blocks",
    items: [
    ],
  },
  {
    group: "页面模板",
    groupEn: "Templates",
    libraryId: "manifest",
    items: [
    ],
  },
]

export const GALLERY_NAV_GROUPS: GalleryNavGroup[] = applyRegistryNavPatch(
  mergeRegistryNavItems(SEED_NAV_GROUPS, COMPONENT_REGISTRY)
)

const genericComponentToc = [
  { id: "when-to-use", title: "何时使用", depth: 2 },
  { id: "examples", title: "代码演示", depth: 2 },
  { id: "api", title: "API", depth: 2 },
  { id: "faq", title: "常见问题", depth: 2 },
  { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
  { id: "source", title: "源码", depth: 2 },
] satisfies GalleryTocItem[]

const defaultDocs = Object.fromEntries(
  GALLERY_NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => [
      item.id,
      {
        title: item.label,
        en: item.en,
        description: item.summary,
        toc: genericComponentToc,
      } satisfies GalleryDocMeta,
    ])
  )
)

export const GALLERY_DOCS: Record<string, GalleryDocMeta> = {
  ...defaultDocs,
  button: {
    title: "按钮",
    en: "Button",
    description:
      "用于触发即时操作，支持颜色、变体、尺寸、形状、图标、加载与链接用法。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "button", title: "基础按钮", depth: 3 },
      { id: "variants", title: "颜色与变体", depth: 3 },
      { id: "icon", title: "图标按钮", depth: 3 },
      { id: "size", title: "按钮尺寸", depth: 3 },
      { id: "shape", title: "按钮形状", depth: 3 },
      { id: "disabled", title: "不可用状态", depth: 3 },
      { id: "loading", title: "加载中状态", depth: 3 },
      { id: "ghost", title: "幽灵按钮", depth: 3 },
      { id: "block", title: "Block 按钮", depth: 3 },
      { id: "link", title: "链接与路由", depth: 3 },
      { id: "group", title: "按钮组合", depth: 3 },
      { id: "motion", title: "动效控制", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  breadcrumb: {
    title: "面包屑",
    en: "Breadcrumb",
    description: "显示当前页面在系统层级结构中的位置。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "breadcrumb", title: "基础用法", depth: 3 },
      { id: "routes", title: "路由生成", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  "button-group": {
    title: "按钮组",
    en: "ButtonGroup",
    description: "将多个按钮紧凑排列为一个视觉整体。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "button-group", title: "基础组合", depth: 3 },
      { id: "form", title: "表单与方向", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  "float-button": {
    title: "悬浮按钮",
    en: "FloatButton",
    description: "悬浮于页面内容上方，提供快捷操作入口。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "float-button", title: "基础用法", depth: 3 },
      { id: "badge", title: "角标", depth: 3 },
      { id: "group", title: "按钮组", depth: 3 },
      { id: "back-top", title: "回到顶部", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  kbd: {
    title: "键盘按键",
    en: "Kbd",
    description: "展示键盘按键或快捷键组合。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "kbd", title: "基础用法", depth: 3 },
      { id: "group", title: "按键组合", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  typography: {
    title: "排版",
    en: "Typography",
    description: "提供文本排版能力：Text、Title、Paragraph 和 Link。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "typography-text", title: "行内文本", depth: 3 },
      { id: "typography-title", title: "标题", depth: 3 },
      { id: "typography-paragraph", title: "段落与链接", depth: 3 },
      { id: "typography-copyable", title: "可复制", depth: 3 },
      { id: "typography-ellipsis", title: "溢出省略", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  input: {
    title: "输入框",
    en: "Input",
    description: "基础表单控件，支持前后缀、清除、校验、尺寸和 TextArea。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "input", title: "基础用法", depth: 3 },
      { id: "sizes", title: "尺寸与变体", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  table: {
    title: "表格",
    en: "Table",
    description: "展示结构化行列数据，支持表头、表体和状态单元格。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "table", title: "基础用法", depth: 3 },
      { id: "states", title: "完整数据展示", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  select: {
    title: "选择器",
    en: "Select",
    description: "下拉选择器，支持单选、多选、标签、搜索和分组。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "select", title: "基础用法", depth: 3 },
      { id: "groups", title: "分组与尺寸", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  "citation-list": {
    title: "引用列表",
    en: "CitationList",
    description:
      "用于展示 AI 引用的来源列表，支持三种展示变体（默认、内联、堆叠）。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "citation-list", title: "基础用法", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      { id: "faq", title: "常见问题", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
      { id: "source", title: "源码", depth: 2 },
    ],
  },
  "mdx-test": {
    title: "MDX 实验性测试页",
    en: "MdxTest",
    description:
      "用于测试排版、布局、数学公式、Markdown 内建代码块及高级 MDX 组件的渲染效果。",
    toc: [
      { id: "introduction", title: "一、 导言", depth: 2 },
      { id: "typography-and-layout", title: "二、 排版与布局测试", depth: 2 },
      { id: "math-formulas", title: "三、 数学公式渲染 (LaTeX)", depth: 2 },
      { id: "blocks/code-blocks", title: "四、 代码块展示", depth: 2 },
      { id: "tables-and-diagrams", title: "五、 学术三线表与图表", depth: 2 },
      { id: "conclusion", title: "六、 结论", depth: 2 },
    ],
  },
}

export const gallerySearchEntries = GALLERY_NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    group: group.group,
    groupEn: group.groupEn,
  }))
)

export const galleryItemCount = GALLERY_NAV_GROUPS.reduce(
  (total, group) => total + group.items.length,
  0
)
