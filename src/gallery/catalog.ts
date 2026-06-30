export type GalleryNavItem = {
  id: string
  label: string
  en: string
  to: string
  summary: string
  keywords: string[]
}

export type GalleryNavGroup = {
  group: string
  groupEn: string
  items: GalleryNavItem[]
}

export type GalleryTocItem = {
  id: string
  title: string
  depth: 2 | 3
}

export type GalleryDocMeta = {
  title: string
  en: string
  description: string
  toc: GalleryTocItem[]
}

type ComponentSeed = {
  id: string
  en: string
  label: string
  summary?: string
  keywords?: string[]
}

function componentItem({
  id,
  en,
  label,
  summary,
  keywords = [],
}: ComponentSeed): GalleryNavItem {
  return {
    id,
    label,
    en,
    to: `/components/${id}`,
    summary: summary ?? `${label}，对齐 Ant Design ${en} 的组件用法。`,
    keywords: [id, en, en.toLowerCase(), label, ...keywords],
  }
}

export const GALLERY_NAV_GROUPS: GalleryNavGroup[] = [
  {
    group: "通用",
    groupEn: "General",
    items: [
      componentItem({
        id: "button",
        en: "Button",
        label: "按钮",
        summary: "触发即时操作，支持颜色、形态、加载、图标与链接用法。",
        keywords: ["anniu", "操作", "loading", "icon"],
      }),
      componentItem({ id: "button-group", en: "ButtonGroup", label: "按钮组" }),
      componentItem({
        id: "float-button",
        en: "FloatButton",
        label: "悬浮按钮",
      }),
      componentItem({ id: "typography", en: "Typography", label: "排版" }),
      componentItem({ id: "copy-button", en: "CopyButton", label: "复制按钮" }),
      componentItem({ id: "kbd", en: "Kbd", label: "快捷键" }),
      componentItem({ id: "label", en: "Label", label: "标签文本" }),
      componentItem({ id: "marker", en: "Marker", label: "标记" }),
    ],
  },
  {
    group: "布局",
    groupEn: "Layout",
    items: [
      componentItem({ id: "aspect-ratio", en: "AspectRatio", label: "宽高比" }),
      componentItem({ id: "direction", en: "Direction", label: "方向" }),
      componentItem({ id: "flex", en: "Flex", label: "弹性布局" }),
      componentItem({ id: "resizable", en: "Resizable", label: "可调整面板" }),
      componentItem({ id: "scroll-area", en: "ScrollArea", label: "滚动区域" }),
      componentItem({ id: "separator", en: "Separator", label: "分隔线" }),
      componentItem({ id: "sidebar", en: "Sidebar", label: "侧边栏" }),
      componentItem({ id: "space", en: "Space", label: "间距" }),
    ],
  },
  {
    group: "导航",
    groupEn: "Navigation",
    items: [
      componentItem({ id: "anchor", en: "Anchor", label: "锚点" }),
      componentItem({ id: "breadcrumb", en: "Breadcrumb", label: "面包屑" }),
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
      componentItem({ id: "pagination", en: "Pagination", label: "分页" }),
      componentItem({ id: "steps", en: "Steps", label: "步骤条" }),
      componentItem({ id: "tabs", en: "Tabs", label: "标签页" }),
    ],
  },
  {
    group: "数据录入",
    groupEn: "Data Entry",
    items: [
      componentItem({
        id: "auto-complete",
        en: "AutoComplete",
        label: "自动完成",
      }),
      componentItem({ id: "cascader", en: "Cascader", label: "级联选择" }),
      componentItem({ id: "checkbox", en: "Checkbox", label: "多选框" }),
      componentItem({
        id: "color-picker",
        en: "ColorPicker",
        label: "颜色选择器",
      }),
      componentItem({ id: "combobox", en: "Combobox", label: "组合选择" }),
      componentItem({ id: "command", en: "Command", label: "命令面板" }),
      componentItem({
        id: "date-picker",
        en: "DatePicker",
        label: "日期选择框",
      }),
      componentItem({ id: "form-field", en: "FormField", label: "表单字段" }),
      componentItem({ id: "input", en: "Input", label: "输入框" }),
      componentItem({ id: "input-group", en: "InputGroup", label: "输入框组" }),
      componentItem({ id: "mentions", en: "Mentions", label: "提及" }),
      componentItem({
        id: "native-select",
        en: "NativeSelect",
        label: "原生选择",
      }),
      componentItem({ id: "radio-group", en: "RadioGroup", label: "单选组" }),
      componentItem({ id: "rate", en: "Rate", label: "评分" }),
      componentItem({ id: "select", en: "Select", label: "选择器" }),
      componentItem({ id: "slider", en: "Slider", label: "滑动输入条" }),
      componentItem({ id: "switch", en: "Switch", label: "开关" }),
      componentItem({
        id: "time-picker",
        en: "TimePicker",
        label: "时间选择框",
      }),
      componentItem({ id: "transfer", en: "Transfer", label: "穿梭框" }),
      componentItem({ id: "tree-select", en: "TreeSelect", label: "树选择" }),
    ],
  },
  {
    group: "数据展示",
    groupEn: "Data Display",
    items: [
      componentItem({ id: "accordion", en: "Accordion", label: "手风琴" }),
      componentItem({ id: "attachment", en: "Attachment", label: "附件" }),
      componentItem({ id: "avatar", en: "Avatar", label: "头像" }),
      componentItem({ id: "badge", en: "Badge", label: "徽标" }),
      componentItem({ id: "calendar", en: "Calendar", label: "日历" }),
      componentItem({ id: "card", en: "Card", label: "卡片" }),
      componentItem({ id: "carousel", en: "Carousel", label: "走马灯" }),
      componentItem({ id: "chart", en: "Chart", label: "图表" }),
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
      }),
      componentItem({ id: "empty-state", en: "EmptyState", label: "空状态" }),
      componentItem({ id: "file-tree", en: "FileTree", label: "文件树" }),
      componentItem({ id: "hover-card", en: "HoverCard", label: "悬浮卡片" }),
      componentItem({ id: "image", en: "Image", label: "图片" }),
      componentItem({
        id: "link-preview",
        en: "LinkPreview",
        label: "链接预览",
      }),
      componentItem({ id: "list", en: "List", label: "列表" }),
      componentItem({ id: "list-item", en: "ListItem", label: "列表项" }),
      componentItem({ id: "popover", en: "Popover", label: "气泡卡片" }),
      componentItem({ id: "qr-code", en: "QRCode", label: "二维码" }),
      componentItem({ id: "statistic", en: "Statistic", label: "统计数值" }),
      componentItem({ id: "table", en: "Table", label: "表格" }),
      componentItem({ id: "tag", en: "Tag", label: "标签" }),
      componentItem({ id: "timeline", en: "Timeline", label: "时间轴" }),
      componentItem({ id: "tooltip", en: "Tooltip", label: "文字提示" }),
      componentItem({ id: "tree", en: "Tree", label: "树形控件" }),
    ],
  },
  {
    group: "反馈",
    groupEn: "Feedback",
    items: [
      componentItem({ id: "alert", en: "Alert", label: "警告提示" }),
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
        id: "notification",
        en: "Notification",
        label: "通知提醒",
      }),
      componentItem({
        id: "popconfirm",
        en: "Popconfirm",
        label: "气泡确认框",
      }),
      componentItem({ id: "progress", en: "Progress", label: "进度条" }),
      componentItem({ id: "result", en: "Result", label: "结果" }),
      componentItem({ id: "skeleton", en: "Skeleton", label: "骨架屏" }),
      componentItem({ id: "spin", en: "Spin", label: "加载中" }),
      componentItem({ id: "toaster", en: "Toaster", label: "吐司容器" }),
      componentItem({ id: "watermark", en: "Watermark", label: "水印" }),
    ],
  },
  {
    group: "其他",
    groupEn: "Other",
    items: [
      componentItem({ id: "affix", en: "Affix", label: "固钉" }),
      componentItem({ id: "border-beam", en: "BorderBeam", label: "边框流光" }),
      componentItem({
        id: "context-menu",
        en: "ContextMenu",
        label: "右键菜单",
      }),
      componentItem({ id: "sheet", en: "Sheet", label: "工作表" }),
      componentItem({ id: "toggle", en: "Toggle", label: "切换按钮" }),
      componentItem({
        id: "toggle-group",
        en: "ToggleGroup",
        label: "切换按钮组",
      }),
    ],
  },
  {
    group: "测试",
    groupEn: "Test",
    items: [
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
]

const defaultDocs = Object.fromEntries(
  GALLERY_NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => [
      item.id,
      {
        title: item.label,
        en: item.en,
        description: item.summary,
        toc: [],
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
  "mdx-test": {
    title: "MDX 实验性测试页",
    en: "MdxTest",
    description:
      "用于测试排版、布局、数学公式、Markdown 内建代码块及高级 MDX 组件的渲染效果。",
    toc: [
      { id: "introduction", title: "一、 导言", depth: 2 },
      { id: "typography-and-layout", title: "二、 排版与布局测试", depth: 2 },
      { id: "math-formulas", title: "三、 数学公式渲染 (LaTeX)", depth: 2 },
      { id: "code-blocks", title: "四、 代码块展示", depth: 2 },
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
