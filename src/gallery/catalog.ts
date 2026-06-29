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
      componentItem({
        id: "smartisan-showcase",
        en: "SmartisanShowcase",
        label: "锤子拟物化设计展示",
        summary:
          "探索向物理世界学习的视觉美学，复刻 Smartisan OS 经典的微渐变、内高光、多层漫反射阴影与情感化细节。",
        keywords: [
          "smartisan",
          "skeuomorphic",
          "button",
          "card",
          "tag",
          "note",
          "niwu",
        ],
      }),
      componentItem({
        id: "smartisan-web-ui-port",
        en: "SmartisanWebUiPort",
        label: "锤子 Web UI 迁移展示",
        summary:
          "吸收 smartisan-web-ui-master 的 Vue 2 实现，迁移 Button、Card、Tag、Divider 和 DOM 标题样式到当前 React/MDX gallery。",
        keywords: [
          "smartisan",
          "web-ui",
          "vue",
          "button",
          "card",
          "tag",
          "divider",
          "锤子",
          "迁移",
        ],
      }),
      componentItem({
        id: "smartisan-settings",
        en: "SmartisanSettings",
        label: "锤子系统设置原型",
        summary:
          "基于 Smartisan OS 实机设置截图复刻的系统设置原型，覆盖设置首页、应用管理、应用信息、电量与优化和设备管理器搜索流程。",
        keywords: [
          "smartisan",
          "settings",
          "system",
          "设置",
          "锤子",
          "系统设置",
        ],
      }),
      componentItem({
        id: "smartisan-phone",
        en: "SmartisanPhone",
        label: "锤子拟物电话原型",
        summary:
          "复刻 Smartisan OS 经典的拟物化电话与拨号盘应用，包含拨号盘、通话记录、联系人列表、通话中界面与便签记录功能。",
        keywords: [
          "smartisan",
          "phone",
          "dialer",
          "电话",
          "拨号",
          "便签",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-mail",
        en: "SmartisanMail",
        label: "锤子邮件应用原型",
        summary:
          "复刻 Smartisan OS 邮件应用的写邮件、阅读邮件和附件邮件界面，包含浅灰工具栏、联系人胶囊、引用正文、附件列表与底部操作栏。",
        keywords: [
          "smartisan",
          "mail",
          "email",
          "邮件",
          "锤子",
          "附件",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-music",
        en: "SmartisanMusic",
        label: "锤子音乐应用原型",
        summary:
          "复刻 Smartisan OS 音乐应用的搜索、歌曲列表和专辑详情界面，包含唱片按钮、评分分组、专辑信息区与深色底部导航。",
        keywords: [
          "smartisan",
          "music",
          "player",
          "音乐",
          "锤子",
          "歌曲",
          "专辑",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-messages",
        en: "SmartisanMessages",
        label: "锤子短信应用原型",
        summary:
          "复刻 Smartisan OS 短信应用的会话列表界面，包含深灰标题栏、搜索栏、头像列、时间线圆点和会话摘要。",
        keywords: [
          "smartisan",
          "messages",
          "sms",
          "短信",
          "锤子",
          "会话",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-calendar",
        en: "SmartisanCalendar",
        label: "锤子日历应用原型",
        summary:
          "复刻 Smartisan OS 日历应用的月视图界面，包含浅灰工具栏、月历网格、选中日期、天气与日程列表。",
        keywords: [
          "smartisan",
          "calendar",
          "schedule",
          "日历",
          "锤子",
          "日程",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-photos",
        en: "SmartisanPhotos",
        label: "锤子照片应用原型",
        summary:
          "复刻 Smartisan 风格照片应用的桌面窗口界面，包含深色工具栏、相册侧栏、排序按钮、照片墙与底部窗口控制区。",
        keywords: [
          "smartisan",
          "photos",
          "gallery",
          "照片",
          "相册",
          "锤子",
          "桌面",
        ],
      }),
      componentItem({
        id: "smartisan-cloud-music",
        en: "SmartisanCloudMusic",
        label: "锤子云音乐应用原型",
        summary:
          "复刻 Smartisan 风格桌面云音乐应用，包含云音乐内容流、黑胶唱机播放器、唱针、播放控制与底部窗口控制区。",
        keywords: [
          "smartisan",
          "music",
          "cloud-music",
          "音乐",
          "云音乐",
          "黑胶",
          "锤子",
          "桌面",
        ],
      }),
      componentItem({
        id: "smartisan-im",
        en: "SmartisanIM",
        label: "锤子即时通讯应用原型",
        summary:
          "复刻 Smartisan 风格即时通讯消息列表界面，包含消息分段、全局搜索、会话列表、语音快捷列、底部导航与提示浮层。",
        keywords: [
          "smartisan",
          "im",
          "chat",
          "message",
          "即时通讯",
          "消息",
          "锤子",
        ],
      }),
      componentItem({
        id: "smartisan-im-chat",
        en: "SmartisanIMChat",
        label: "锤子即时通讯对话原型",
        summary:
          "复刻 Smartisan 风格即时通讯对话回复界面，包含蓝色标题栏、消息气泡、引用回复条、输入栏、候选词栏与九宫格键盘。",
        keywords: [
          "smartisan",
          "im",
          "chat",
          "keyboard",
          "即时通讯",
          "对话",
          "键盘",
          "锤子",
        ],
      }),
      componentItem({
        id: "smartisan-life-suite",
        en: "SmartisanLifeSuite",
        label: "锤子生活服务套件原型",
        summary:
          "复刻 Smartisan 风格生活服务界面组，包含卡片首页、资讯列表和向商家付钱付款码页面。",
        keywords: [
          "smartisan",
          "life",
          "news",
          "pay",
          "生活服务",
          "资讯",
          "付款码",
          "锤子",
        ],
      }),
      componentItem({
        id: "smartisan-compass",
        en: "SmartisanCompass",
        label: "锤子指南针应用原型",
        summary:
          "复刻 Smartisan OS 指南针应用界面，包含浅色状态栏、信息按钮、红色指示箭头、实体罗盘盘面和底部方向坐标。",
        keywords: [
          "smartisan",
          "compass",
          "指南针",
          "罗盘",
          "方向",
          "锤子",
          "拟物",
        ],
      }),
      componentItem({
        id: "smartisan-note-input-suite",
        en: "SmartisanNoteInputSuite",
        label: "锤子输入与便签套件原型",
        summary:
          "复刻 Smartisan 风格词库与语音设置、便签编辑器和 QWERTY 键盘输入界面。",
        keywords: [
          "smartisan",
          "note",
          "input",
          "keyboard",
          "便签",
          "输入法",
          "词库",
          "锤子",
        ],
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
      "用于触发即时操作，保持 Ant Design 风格 API，同时保留当前动画能力。",
    toc: [
      { id: "when-to-use", title: "何时使用", depth: 2 },
      { id: "examples", title: "代码演示", depth: 2 },
      { id: "button", title: "基础按钮", depth: 3 },
      { id: "variants", title: "颜色与变体", depth: 3 },
      { id: "loading", title: "加载中状态", depth: 3 },
      { id: "api", title: "API", depth: 2 },
      {
        id: "antd-differences",
        title: "与 Ant Design Button 的取舍",
        depth: 2,
      },
      { id: "semantic-dom", title: "Semantic DOM", depth: 2 },
      { id: "styling-model", title: "样式模型", depth: 2 },
      { id: "design-token", title: "主题变量", depth: 2 },
      { id: "accessibility", title: "可访问性", depth: 2 },
      { id: "implementation-notes", title: "实现说明", depth: 2 },
      { id: "faq", title: "FAQ", depth: 2 },
      { id: "llm-rules", title: "LLM 使用规则", depth: 2 },
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
  "smartisan-showcase": {
    title: "锤子拟物化设计展示",
    en: "SmartisanShowcase",
    description:
      "探索向物理世界学习的视觉美学，复刻 Smartisan OS 经典的微渐变、内高光、多层漫反射阴影与情感化细节。",
    toc: [
      { id: "introduction", title: "一、 拟物化设计宣言", depth: 2 },
      { id: "button", title: "二、 拟物化精密按钮 (Button)", depth: 2 },
      { id: "card", title: "三、 浮雕面板卡片 (Card)", depth: 2 },
      { id: "tag", title: "四、 胶囊饱满标签 (Tag)", depth: 2 },
      { id: "switch", title: "五、 金属拨动开关 (Switch)", depth: 2 },
      { id: "checkbox", title: "六、 饱满复选框 (Checkbox)", depth: 2 },
      { id: "radio", title: "七、 3D 玻璃单选框 (Radio)", depth: 2 },
      { id: "progress", title: "八、 糖果进度条 (Progress)", depth: 2 },
      { id: "slider", title: "九、 蚀刻滑动条 (Slider)", depth: 2 },
      { id: "note", title: "十、 经典便签信纸 (Note)", depth: 2 },
      { id: "input", title: "十一、 雕刻凹槽输入框 (Input)", depth: 2 },
      { id: "select", title: "十二、 实体下拉选择器 (Select)", depth: 2 },
      { id: "tabs", title: "十三、 凸起滑块分段控制器 (Tabs)", depth: 2 },
      { id: "badge", title: "十四、 晶莹剔透指示徽标 (Badge)", depth: 2 },
      { id: "kbd", title: "十五、 物理机械键盘键帽 (Kbd)", depth: 2 },
      { id: "alert", title: "十六、 浮雕警示牌 (Alert)", depth: 2 },
      { id: "rate", title: "十七、 黄金浮雕评分星星 (Rate)", depth: 2 },
      { id: "dialog", title: "十八、 重金属安全箱弹窗 (Dialog)", depth: 2 },
      { id: "avatar", title: "十九、 物理相框头像 (Avatar)", depth: 2 },
      {
        id: "accordion",
        title: "二十、 物理风琴折叠面板 (Accordion)",
        depth: 2,
      },
      {
        id: "calculator",
        title: "二十一、 经典拟物化计算器 (Calculator)",
        depth: 2,
      },
    ],
  },
  "smartisan-web-ui-port": {
    title: "锤子 Web UI 迁移展示",
    en: "SmartisanWebUiPort",
    description:
      "吸收 smartisan-web-ui-master 的 Vue 2 实现，迁移 Button、Card、Tag、Divider 和 DOM 标题样式到当前 React/MDX gallery。",
    toc: [
      { id: "source", title: "一、 来源", depth: 2 },
      { id: "dom-demo", title: "二、 系统样式 DOM", depth: 2 },
      { id: "button-demo", title: "三、 按钮 Button", depth: 2 },
      { id: "card-demo", title: "四、 卡片 Card", depth: 2 },
      { id: "tag-demo", title: "五、 标签 Tag", depth: 2 },
      { id: "divider-demo", title: "六、 分割线 Divider", depth: 2 },
      { id: "breadcrumb-demo", title: "七、 面包屑 Breadcrumb", depth: 2 },
      { id: "implementation-notes", title: "八、 实现说明", depth: 2 },
      { id: "ported-components", title: "迁移组件", depth: 3 },
      { id: "adaptation-rules", title: "适配规则", depth: 3 },
    ],
  },
  "smartisan-settings": {
    title: "锤子系统设置原型",
    en: "SmartisanSettings",
    description:
      "基于 Smartisan OS 实机设置截图复刻的系统设置原型，覆盖设置首页、应用管理、应用信息、电量与优化和设备管理器搜索流程。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "settings-prototype", title: "二、 系统设置原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "correct-reference", title: "正确参考", depth: 3 },
      { id: "interface-rules", title: "界面规则", depth: 3 },
      { id: "next-step", title: "四、 下一步判断", depth: 2 },
    ],
  },
  "smartisan-phone": {
    title: "锤子拟物电话原型",
    en: "SmartisanPhone",
    description:
      "复刻 Smartisan OS 经典的拟物化电话与拨号盘应用，包含拨号盘、通话记录、联系人列表、通话中界面与便签记录功能。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "phone-prototype", title: "二、 电话应用原型", depth: 2 },
      { id: "design-details", title: "三、 拟物设计细节", depth: 2 },
      { id: "dialer-pad", title: "拨号盘按键与质感", depth: 3 },
      { id: "call-interface", title: "通话中界面与便签", depth: 3 },
      { id: "contact-list", title: "联系人与来电小纸条", depth: 3 },
    ],
  },
  "smartisan-mail": {
    title: "锤子邮件应用原型",
    en: "SmartisanMail",
    description:
      "复刻 Smartisan OS 邮件应用的写邮件、阅读邮件和附件邮件界面，包含浅灰工具栏、联系人胶囊、引用正文、附件列表与底部操作栏。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "mail-prototype", title: "二、 邮件应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-music": {
    title: "锤子音乐应用原型",
    en: "SmartisanMusic",
    description:
      "复刻 Smartisan OS 音乐应用的搜索、歌曲列表和专辑详情界面，包含唱片按钮、评分分组、专辑信息区与深色底部导航。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "music-prototype", title: "二、 音乐应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-messages": {
    title: "锤子短信应用原型",
    en: "SmartisanMessages",
    description:
      "复刻 Smartisan OS 短信应用的会话列表界面，包含深灰标题栏、搜索栏、头像列、时间线圆点和会话摘要。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "messages-prototype", title: "二、 短信应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-calendar": {
    title: "锤子日历应用原型",
    en: "SmartisanCalendar",
    description:
      "复刻 Smartisan OS 日历应用的月视图界面，包含浅灰工具栏、月历网格、选中日期、天气与日程列表。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "calendar-prototype", title: "二、 日历应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-photos": {
    title: "锤子照片应用原型",
    en: "SmartisanPhotos",
    description:
      "复刻 Smartisan 风格照片应用的桌面窗口界面，包含深色工具栏、相册侧栏、排序按钮、照片墙与底部窗口控制区。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "photos-prototype", title: "二、 照片应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-cloud-music": {
    title: "锤子云音乐应用原型",
    en: "SmartisanCloudMusic",
    description:
      "复刻 Smartisan 风格桌面云音乐应用，包含云音乐内容流、黑胶唱机播放器、唱针、播放控制与底部窗口控制区。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "cloud-music-prototype", title: "二、 云音乐应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-im": {
    title: "锤子即时通讯应用原型",
    en: "SmartisanIM",
    description:
      "复刻 Smartisan 风格即时通讯消息列表界面，包含消息分段、全局搜索、会话列表、语音快捷列、底部导航与提示浮层。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "im-prototype", title: "二、 即时通讯应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-im-chat": {
    title: "锤子即时通讯对话原型",
    en: "SmartisanIMChat",
    description:
      "复刻 Smartisan 风格即时通讯对话回复界面，包含蓝色标题栏、消息气泡、引用回复条、输入栏、候选词栏与九宫格键盘。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "im-chat-prototype", title: "二、 即时通讯对话原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-life-suite": {
    title: "锤子生活服务套件原型",
    en: "SmartisanLifeSuite",
    description:
      "复刻 Smartisan 风格生活服务界面组，包含卡片首页、资讯列表和向商家付钱付款码页面。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "life-suite-prototype", title: "二、 生活服务套件原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-compass": {
    title: "锤子指南针应用原型",
    en: "SmartisanCompass",
    description:
      "复刻 Smartisan OS 指南针应用界面，包含浅色状态栏、信息按钮、红色指示箭头、实体罗盘盘面和底部方向坐标。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "compass-prototype", title: "二、 指南针应用原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
    ],
  },
  "smartisan-note-input-suite": {
    title: "锤子输入与便签套件原型",
    en: "SmartisanNoteInputSuite",
    description:
      "复刻 Smartisan 风格词库与语音设置、便签编辑器和 QWERTY 键盘输入界面。",
    toc: [
      { id: "prototype-goal", title: "一、 原型目标", depth: 2 },
      { id: "note-input-prototype", title: "二、 输入与便签套件原型", depth: 2 },
      { id: "design-breakdown", title: "三、 设计拆解", depth: 2 },
      { id: "screen-structure", title: "屏幕结构", depth: 3 },
      { id: "visual-rules", title: "视觉规则", depth: 3 },
      { id: "interaction-scope", title: "交互范围", depth: 3 },
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
