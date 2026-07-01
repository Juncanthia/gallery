import type { GalleryApiDoc } from "./api-types"

const API_REGISTRY: Record<string, GalleryApiDoc> = {
  "accordion": {
    props: [
      { name: "type", type: "'single' | 'multiple'", description: "手风琴展开模式", defaultValue: "'single'" },
      { name: "collapsible", type: "boolean", description: "是否可全部折叠", defaultValue: "false" },
      { name: "className", type: "string", description: "自定义样式类名" },
    ],
  },
  "affix": {
    props: [
      { name: "offsetTop", type: "number", description: "距离顶部偏移量", defaultValue: "0" },
      { name: "onChange", type: "(affixed: boolean) => void", description: "固钉状态变化回调" },
    ],
  },
  "alert": {
    props: [
      { name: "type", type: "'success' | 'info' | 'warning' | 'error'", description: "提示类型", defaultValue: "'info'" },
      { name: "message", type: "ReactNode", description: "提示标题" },
      { name: "description", type: "ReactNode", description: "提示内容" },
      { name: "closable", type: "boolean", description: "是否可关闭", defaultValue: "false" },
    ],
  },
  "alert-dialog": {
    props: [
      { name: "open", type: "boolean", description: "受控打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开状态变化回调" },
    ],
  },
  "anchor": {
    props: [
      { name: "items", type: "{ href: string; title: string }[]", description: "锚点数据" },
      { name: "offsetTop", type: "number", description: "偏移量", defaultValue: "0" },
    ],
  },
  "announcement": {
    props: [
      { name: "themed", type: "boolean", description: "主题感知", defaultValue: "false" },
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "aspect-ratio": {
    props: [
      { name: "ratio", type: "number", description: "宽高比", defaultValue: "1" },
    ],
  },
  "attachment": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "auto-complete": {
    props: [
      { name: "options", type: "{ label: string; value: string }[]", description: "选项数组" },
      { name: "placeholder", type: "string", description: "占位文本" },
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "avatar": {
    props: [
      { name: "src", type: "string", description: "图片地址" },
      { name: "alt", type: "string", description: "替代文本" },
      { name: "size", type: "number | string", description: "尺寸" },
      { name: "fallback", type: "string", description: "回退文本" },
    ],
  },
  "avatar-stack": {
    props: [
      { name: "size", type: "number", description: "头像尺寸", defaultValue: "40" },
      { name: "animate", type: "boolean", description: "hover动画", defaultValue: "false" },
    ],
  },
  "avatar-tooltip-group": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "badge": {
    props: [
      { name: "variant", type: "string", description: "变体", defaultValue: "'default'" },
      { name: "children", type: "ReactNode", description: "内容" },
    ],
  },
  "banner": {
    props: [
      { name: "open", type: "boolean", description: "受控可见性" },
      { name: "defaultOpen", type: "boolean", description: "默认可见", defaultValue: "true" },
      { name: "variant", type: "'default' | 'info' | 'success' | 'warning' | 'destructive'", description: "视觉类型", defaultValue: "'default'" },
      { name: "inset", type: "boolean", description: "内嵌模式", defaultValue: "false" },
      { name: "dismissible", type: "boolean", description: "允许关闭", defaultValue: "true" },
      { name: "duration", type: "number", description: "队列模式下自动关闭时间" },
      { name: "priority", type: "number", description: "队列模式下优先级", defaultValue: "0" },
    ],
  },
  "border-beam": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
      { name: "duration", type: "number", description: "动画时长" },
    ],
  },
  "breadcrumb": {
    props: [
      { name: "items", type: "{ title: string; href?: string }[]", description: "面包屑数据" },
    ],
  },
  "button": {
    props: [
      { name: "variant", type: "string", description: "按钮变体", defaultValue: "'outlined'" },
      { name: "color", type: "string", description: "语义颜色", defaultValue: "'default'" },
      { name: "size", type: "string", description: "按钮尺寸", defaultValue: "'middle'" },
      { name: "loading", type: "boolean", description: "加载中", defaultValue: "false" },
    ],
  },
  "button-group": {
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical'", description: "排列方向", defaultValue: "'horizontal'" },
    ],
  },
  "calendar": {
    props: [
      { name: "mode", type: "string", description: "日历模式", defaultValue: "'single'" },
      { name: "selected", type: "Date", description: "选中日期" },
    ],
  },
  "card": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "carousel": {
    props: [
      { name: "opts", type: "CarouselOptions", description: "轮播配置" },
    ],
  },
  "cascader": {
    props: [
      { name: "options", type: "CascaderOption[]", description: "级联选项数据" },
      { name: "placeholder", type: "string", description: "占位文本" },
    ],
  },
  "chart": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "chat-bubble": {
    props: [
      { name: "variant", type: "'sent' | 'received'", description: "气泡方向" },
    ],
  },
  "checkbox": {
    props: [
      { name: "checked", type: "boolean", description: "选中状态" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "状态变化回调" },
    ],
  },
  "choicebox": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "code-block": {
    props: [
      { name: "code", type: "string", description: "代码内容" },
    ],
  },
  "code-panel": {
    props: [
      { name: "code", type: "string", description: "代码内容" },
    ],
  },
  "code-tabs": {
    props: [
      { name: "codes", type: "Record<string, string>", description: "代码标签映射" },
    ],
  },
  "collapsible": {
    props: [
      { name: "open", type: "boolean", description: "受控展开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "展开变化回调" },
    ],
  },
  "color-picker": {
    props: [
      { name: "value", type: "Parameters<typeof Color>[0]", description: "受控颜色值" },
      { name: "defaultValue", type: "Parameters<typeof Color>[0]", description: "默认颜色值", defaultValue: "'#000000'" },
      { name: "format", type: "'hex' | 'rgb' | 'css' | 'hsl' | 'hsb'", description: "受控输出格式" },
      { name: "defaultFormat", type: "'hex' | 'rgb' | 'css' | 'hsl' | 'hsb'", description: "默认输出格式", defaultValue: "'hex'" },
      { name: "onChange", type: "([r, g, b, a]: [number, number, number, number]) => void", description: "结构化颜色变化回调，alpha 为 0-1" },
      { name: "onValueChange", type: "(color: string) => void", description: "当前格式字符串变化回调" },
      { name: "disabled", type: "boolean", description: "禁用交互", defaultValue: "false" },
      { name: "readOnly", type: "boolean", description: "只读展示", defaultValue: "false" },
    ],
  },
  "combobox": {
    props: [
      { name: "options", type: "ComboboxOptionItem[]", description: "选项数组，支持分组" },
      { name: "value", type: "string", description: "受控选中值" },
      { name: "onValueChange", type: "(value: string | undefined) => void", description: "选中值变化回调" },
      { name: "inputValue", type: "string", description: "受控搜索输入值" },
      { name: "onInputValueChange", type: "(value: string) => void", description: "搜索输入变化回调" },
      { name: "filterOption", type: "boolean | ((input, option) => boolean)", description: "本地过滤逻辑", defaultValue: "true" },
      { name: "loading", type: "boolean", description: "显示加载状态", defaultValue: "false" },
      { name: "allowClear", type: "boolean", description: "允许清除当前选中值", defaultValue: "false" },
      { name: "readOnly", type: "boolean", description: "只读展示", defaultValue: "false" },
      { name: "name", type: "string", description: "原生表单字段名" },
    ],
  },
  "command": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "comparison": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "context-menu": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "contribution-graph": {
    props: [
      { name: "data", type: "Activity[]", description: "活动数据数组" },
    ],
  },
  "copy-button": {
    props: [
      { name: "content", type: "string", description: "复制内容" },
      { name: "delay", type: "number", description: "提示延迟", defaultValue: "2000" },
    ],
  },
  "credit-card": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "cursor-follow": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "data-table": {
    props: [
      { name: "columns", type: "ColumnDef[]", description: "列定义" },
      { name: "data", type: "any[]", description: "数据数组" },
    ],
  },
  "date-picker": {
    props: [
      { name: "value", type: "Date", description: "选中日期" },
      { name: "onChange", type: "(date: Date) => void", description: "日期变化回调" },
      { name: "placeholder", type: "string", description: "占位文本" },
    ],
  },
  "deck": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "descriptions": {
    props: [
      { name: "items", type: "DescriptionsItemConfig[]", description: "描述项数组" },
      { name: "column", type: "number", description: "列数", defaultValue: "3" },
      { name: "bordered", type: "boolean", description: "边框模式", defaultValue: "false" },
    ],
  },
  "dialog": {
    props: [
      { name: "open", type: "boolean", description: "受控打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开变化回调" },
    ],
  },
  "dialog-stack": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "direction": {
    props: [
      { name: "dir", type: "'ltr' | 'rtl'", description: "文本方向" },
    ],
  },
  "drawer": {
    props: [
      { name: "open", type: "boolean", description: "受控打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开变化回调" },
    ],
  },
  "dropdown-menu": {
    props: [
      { name: "open", type: "boolean", description: "受控打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开变化回调" },
    ],
  },
  "dropzone": {
    props: [
      { name: "onDrop", type: "(files: File[]) => void", description: "文件拖放回调" },
    ],
  },
  "editor": {
    props: [
      { name: "content", type: "string", description: "编辑器内容" },
      { name: "onUpdate", type: "(content: string) => void", description: "内容变化回调" },
    ],
  },
  "empty-state": {
    props: [
      { name: "description", type: "ReactNode", description: "空状态描述" },
    ],
  },
  "feature-calendar": {
    props: [
      { name: "features", type: "Feature[]", description: "功能特性数组" },
    ],
  },
  "file-tree": {
    props: [
      { name: "data", type: "TreeNode[]", description: "树数据" },
    ],
  },
  "file-upload": {
    props: [
      { name: "value", type: "File[]", description: "受控文件列表" },
      { name: "onValueChange", type: "(files: File[]) => void", description: "文件列表变化回调" },
      { name: "accept", type: "string", description: "接受的文件类型（MIME/扩展名/通配符，逗号分隔）" },
      { name: "maxFiles", type: "number", description: "最大文件数量" },
      { name: "maxSize", type: "number", description: "单文件最大体积（字节）" },
      { name: "multiple", type: "boolean", description: "是否允许多选", defaultValue: "false" },
      { name: "disabled", type: "boolean", description: "是否禁用", defaultValue: "false" },
      { name: "onFileReject", type: "(file: File, message: string) => void", description: "文件被拒绝时的回调" },
    ],
  },
  "flex": {
    props: [
      { name: "direction", type: "string", description: "排列方向" },
      { name: "gap", type: "number | string", description: "间距" },
      { name: "align", type: "string", description: "对齐方式" },
    ],
  },
  "float-button": {
    props: [
      { name: "onClick", type: "() => void", description: "点击回调" },
      { name: "icon", type: "ReactNode", description: "图标" },
    ],
  },
  "form-field": {
    props: [
      { name: "name", type: "string", description: "字段名" },
      { name: "label", type: "ReactNode", description: "标签文本" },
    ],
  },
  "gantt": {
    props: [
      { name: "range", type: "string", description: "时间粒度", defaultValue: "'monthly'" },
      { name: "zoom", type: "number", description: "缩放百分比", defaultValue: "100" },
    ],
  },
  "github-stars-wheel": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "glimpse": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "hover-card": {
    props: [
      { name: "openDelay", type: "number", description: "打开延迟", defaultValue: "700" },
      { name: "closeDelay", type: "number", description: "关闭延迟", defaultValue: "300" },
    ],
  },
  "image": {
    props: [
      { name: "src", type: "string", description: "图片地址" },
      { name: "alt", type: "string", description: "替代文本" },
      { name: "preview", type: "boolean", description: "启用预览", defaultValue: "true" },
    ],
  },
  "image-crop": {
    props: [
      { name: "src", type: "string", description: "图片地址" },
      { name: "aspect", type: "number", description: "裁剪比例" },
    ],
  },
  "image-zoom": {
    props: [
      { name: "src", type: "string", description: "图片地址" },
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "input": {
    props: [
      { name: "placeholder", type: "string", description: "占位文本" },
      { name: "value", type: "string", description: "输入值" },
      { name: "onChange", type: "(e) => void", description: "变化回调" },
    ],
  },
  "input-group": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "kanban": {
    props: [
      { name: "columns", type: "KanbanColumn[]", description: "列定义" },
      { name: "data", type: "KanbanItem[]", description: "卡片数据" },
    ],
  },
  "kbd": {
    props: [
      { name: "children", type: "ReactNode", description: "按键内容" },
    ],
  },
  "label": {
    props: [
      { name: "children", type: "ReactNode", description: "标签内容" },
    ],
  },
  "link-preview": {
    props: [
      { name: "url", type: "string", description: "链接地址" },
    ],
  },
  "list": {
    props: [
      { name: "dataSource", type: "any[]", description: "数据源" },
      { name: "renderItem", type: "(item) => ReactNode", description: "渲染函数" },
      { name: "bordered", type: "boolean", description: "边框", defaultValue: "false" },
    ],
  },
  "list-item": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "marker": {
    props: [
      { name: "variant", type: "string", description: "变体" },
      { name: "children", type: "ReactNode", description: "标记内容" },
    ],
  },
  "marquee": {
    props: [
      { name: "side", type: "'left' | 'right' | 'top' | 'bottom'", description: "滚动边向", defaultValue: "'left'" },
      { name: "pauseOnKeyboard", type: "boolean", description: "空格键暂停/恢复", defaultValue: "false" },
      { name: "gap", type: "number | string", description: "MarqueeContent 内部间距" },
      { name: "speed", type: "number", description: "滚动速度" },
      { name: "autoFill", type: "boolean", description: "自动填充内容", defaultValue: "true" },
      { name: "pauseOnHover", type: "boolean", description: "悬停暂停", defaultValue: "true" },
    ],
  },
  "masonry": {
    props: [
      { name: "columns", type: "number", description: "列数", defaultValue: "3" },
      { name: "gap", type: "number", description: "间距", defaultValue: "4" },
    ],
  },
  "mentions": {
    props: [
      { name: "options", type: "MentionsOption[]", description: "提及选项" },
      { name: "placeholder", type: "string", description: "占位文本" },
    ],
  },
  "menubar": {
    props: [
      { name: "value", type: "string", description: "激活菜单值" },
      { name: "onValueChange", type: "(val: string) => void", description: "值变化回调" },
    ],
  },
  "message": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "message-scroller": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "mini-calendar": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "native-select": {
    props: [
      { name: "options", type: "{ label: string; value: string }[]", description: "选项数组" },
      { name: "placeholder", type: "string", description: "占位文本" },
    ],
  },
  "navigation-menu": {
    props: [
      { name: "items", type: "MenuItem[]", description: "菜单项数组" },
    ],
  },
  "notification": {
    props: [
      { name: "title", type: "ReactNode", description: "通知标题" },
      { name: "description", type: "ReactNode", description: "通知内容" },
      { name: "type", type: "string", description: "通知类型", defaultValue: "'info'" },
    ],
  },
  "notification-api": {
    props: [
      { name: "title", type: "ReactNode", description: "通知标题" },
      { name: "description", type: "ReactNode", description: "通知内容" },
    ],
  },
  "pagination": {
    props: [
      { name: "total", type: "number", description: "总数" },
      { name: "pageSize", type: "number", description: "每页条数", defaultValue: "10" },
      { name: "current", type: "number", description: "当前页" },
    ],
  },
  "pill": {
    props: [
      { name: "variant", type: "string", description: "变体", defaultValue: "'secondary'" },
      { name: "themed", type: "boolean", description: "主题模式", defaultValue: "false" },
    ],
  },
  "popconfirm": {
    props: [
      { name: "title", type: "ReactNode", description: "确认标题" },
      { name: "onConfirm", type: "() => void", description: "确认回调" },
    ],
  },
  "popover": {
    props: [
      { name: "open", type: "boolean", description: "受控打开" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开变化回调" },
    ],
  },
  "presence-cursor": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "progress": {
    props: [
      { name: "value", type: "number", description: "进度值(0-100)" },
      { name: "showInfo", type: "boolean", description: "显示数值", defaultValue: "true" },
    ],
  },
  "qr-code": {
    props: [
      { name: "data", type: "string", description: "二维码数据" },
      { name: "value", type: "string", description: "二维码数据别名，优先级高于 data" },
      { name: "size", type: "number", description: "二维码像素尺寸", defaultValue: "200" },
      { name: "level", type: "'L' | 'M' | 'Q' | 'H'", description: "容错级别" },
      { name: "robustness", type: "'L' | 'M' | 'Q' | 'H'", description: "容错级别", defaultValue: "'M'" },
      { name: "overlay", type: "ReactNode", description: "中心覆盖内容" },
    ],
  },
  "radio-group": {
    props: [
      { name: "value", type: "string", description: "选中值" },
      { name: "onValueChange", type: "(val: string) => void", description: "值变化回调" },
    ],
  },
  "rate": {
    props: [
      { name: "value", type: "number", description: "评分数值" },
      { name: "onChange", type: "(val: number) => void", description: "评分变化" },
      { name: "count", type: "number", description: "星星数量", defaultValue: "5" },
    ],
  },
  "rating": {
    props: [
      { name: "defaultValue", type: "number", description: "默认评分", defaultValue: "0" },
      { name: "value", type: "number", description: "受控评分值" },
      { name: "onValueChange", type: "(value: number) => void", description: "评分变化回调" },
      { name: "count", type: "number", description: "自动生成的评分项数量", defaultValue: "5" },
      { name: "allowHalf", type: "boolean", description: "允许半星", defaultValue: "false" },
      { name: "clearable", type: "boolean", description: "再次点击当前值时清空", defaultValue: "false" },
      { name: "size", type: "'sm' | 'default' | 'lg'", description: "评分项尺寸", defaultValue: "'default'" },
      { name: "orientation", type: "'horizontal' | 'vertical'", description: "排列方向", defaultValue: "'horizontal'" },
    ],
  },
  "reel": {
    props: [
      { name: "data", type: "ReelItem[]", description: "卷轴数据" },
    ],
  },
  "relative-time": {
    props: [
      { name: "date", type: "Date | string", description: "日期时间" },
    ],
  },
  "resizable": {
    props: [
      { name: "-", type: "any", description: "" },
      { name: "-", type: "-", description: "-" },
    ],
  },
  "result": {
    props: [
      { name: "status", type: "'success' | 'error' | 'info' | 'warning'", description: "结果状态" },
      { name: "title", type: "ReactNode", description: "结果标题" },
    ],
  },
  "sandbox": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "scroll-area": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "select": {
    props: [
      { name: "options", type: "SelectOption[]", description: "选项数据" },
      { name: "placeholder", type: "string", description: "占位文本" },
      { name: "value", type: "string", description: "选中值" },
    ],
  },
  "separator": {
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical'", description: "方向", defaultValue: "'horizontal'" },
      { name: "decorative", type: "boolean", description: "纯装饰", defaultValue: "true" },
    ],
  },
  "sheet": {
    props: [
      { name: "open", type: "boolean", description: "打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "打开变化回调" },
    ],
  },
  "sidebar": {
    props: [
      { name: "side", type: "'left' | 'right'", description: "位置", defaultValue: "'left'" },
      { name: "variant", type: "'sidebar' | 'floating' | 'inset'", description: "变体", defaultValue: "'sidebar'" },
    ],
  },
  "skeleton": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "slider": {
    props: [
      { name: "value", type: "number[]", description: "滑块值" },
      { name: "min", type: "number", description: "最小值", defaultValue: "0" },
      { name: "max", type: "number", description: "最大值", defaultValue: "100" },
    ],
  },
  "snippet": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "space": {
    props: [
      { name: "direction", type: "'horizontal' | 'vertical'", description: "排列方向", defaultValue: "'horizontal'" },
      { name: "size", type: "number | string", description: "间距大小" },
    ],
  },
  "spin": {
    props: [
      { name: "spinning", type: "boolean", description: "加载中", defaultValue: "true" },
      { name: "children", type: "ReactNode", description: "包裹内容" },
    ],
  },
  "spinner": {
    props: [
      { name: "variant", type: "string", description: "动画变体", defaultValue: "'default'" },
      { name: "size", type: "number", description: "尺寸", defaultValue: "24" },
    ],
  },
  "statistic": {
    props: [
      { name: "value", type: "number | string", description: "数值" },
      { name: "title", type: "ReactNode", description: "标题" },
    ],
  },
  "status": {
    props: [
      { name: "status", type: "'online' | 'offline' | 'maintenance' | 'degraded' | 'default' | 'success' | 'error' | 'warning' | 'info'", description: "运行态或语义状态" },
      { name: "children", type: "ReactNode", description: "通常为 StatusIndicator + StatusLabel" },
    ],
  },
  "steps": {
    props: [
      { name: "current", type: "number", description: "当前步骤", defaultValue: "0" },
      { name: "items", type: "StepItem[]", description: "步骤项数组" },
    ],
  },
  "stories": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "switch": {
    props: [
      { name: "checked", type: "boolean", description: "开关状态" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "状态变化" },
    ],
  },
  "table": {
    props: [
      { name: "data", type: "any[]", description: "数据数组" },
      { name: "columns", type: "ColumnDef[]", description: "列定义" },
    ],
  },
  "tabs": {
    props: [
      { name: "defaultValue", type: "string", description: "默认激活标签" },
      { name: "value", type: "string", description: "受控标签值" },
    ],
  },
  "tabs-motion": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "tag": {
    props: [
      { name: "children", type: "ReactNode", description: "标签内容" },
      { name: "closable", type: "boolean", description: "可关闭", defaultValue: "false" },
    ],
  },
  "tags": {
    props: [
      { name: "value", type: "string", description: "已选值" },
      { name: "setValue", type: "(val: string) => void", description: "设置值" },
    ],
  },
  "theme-switcher": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "ticker": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "time-picker": {
    props: [
      { name: "value", type: "string", description: "受控时间值，如 09:30:00" },
      { name: "defaultValue", type: "string", description: "默认时间值" },
      { name: "onChange", type: "(value: string) => void", description: "时间变化回调" },
      { name: "format", type: "'HH:mm:ss' | 'HH:mm'", description: "时间格式", defaultValue: "'HH:mm:ss'" },
      { name: "use12Hours", type: "boolean", description: "启用 12 小时制和 AM/PM 时段列", defaultValue: "false" },
      { name: "open", type: "boolean", description: "受控弹层打开状态" },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "弹层状态变化回调" },
      { name: "name", type: "string", description: "原生表单字段名" },
      { name: "placeholder", type: "string", description: "占位文本" },
      { name: "allowClear", type: "boolean", description: "显示清空按钮", defaultValue: "true" },
    ],
  },
  "timeline": {
    props: [
      { name: "items", type: "TimelineItemConfig[]", description: "时间轴数据" },
      { name: "activeIndex", type: "number", description: "当前进度索引，自动派生 completed/active/pending 状态" },
      { name: "mode", type: "'left' | 'right' | 'start' | 'end' | 'alternate'", description: "布局模式", defaultValue: "'left'" },
      { name: "orientation", type: "'vertical' | 'horizontal'", description: "排列方向", defaultValue: "'vertical'" },
      { name: "pending", type: "ReactNode", description: "追加的待处理节点" },
      { name: "status", type: "'completed' | 'active' | 'pending'", description: "单个 item 的显式状态" },
      { name: "time", type: "ReactNode", description: "单个 item 的时间语义标签" },
      { name: "animated", type: "boolean", description: "启用入场动画", defaultValue: "true" },
    ],
  },
  "toaster": {
    props: [
      { name: "theme", type: "'light' | 'dark' | 'system'", description: "主题", defaultValue: "'system'" },
    ],
  },
  "toggle": {
    props: [
      { name: "pressed", type: "boolean", description: "按下状态" },
      { name: "onPressedChange", type: "(p: boolean) => void", description: "状态变化" },
    ],
  },
  "toggle-group": {
    props: [
      { name: "type", type: "'single' | 'multiple'", description: "选择模式", defaultValue: "'single'" },
      { name: "value", type: "string | string[]", description: "选中值" },
    ],
  },
  "tooltip": {
    props: [
      { name: "content", type: "ReactNode", description: "提示内容" },
      { name: "side", type: "string", description: "弹出方向", defaultValue: "'top'" },
    ],
  },
  "tooltip-motion": {
    props: [
      { name: "className", type: "string", description: "自定义样式" },
    ],
  },
  "tour": {
    props: [
      { name: "open", type: "boolean", description: "是否显示引导", defaultValue: "false" },
      { name: "steps", type: "TourStepConfig[]", description: "引导步骤" },
      { name: "current", type: "number", description: "受控步骤索引" },
      { name: "onChange", type: "(current: number) => void", description: "步骤变化回调" },
      { name: "onFinish", type: "() => void", description: "完成最后一步回调" },
      { name: "onSkip", type: "() => void", description: "跳过或提前关闭回调" },
      { name: "target", type: "string | HTMLElement | RefObject | (() => HTMLElement | null)", description: "步骤目标元素，配置在 steps 内" },
      { name: "placement", type: "TourPlacement", description: "步骤卡片位置，配置在 steps 内" },
      { name: "arrow", type: "boolean", description: "显示目标箭头", defaultValue: "false" },
      { name: "closeOnEscape", type: "boolean", description: "按 Escape 关闭", defaultValue: "true" },
    ],
  },
  "transfer": {
    props: [
      { name: "dataSource", type: "TransferItem[]", description: "数据源" },
      { name: "targetKeys", type: "string[]", description: "目标键值" },
      { name: "onChange", type: "(keys, direction, moveKeys) => void", description: "变化回调" },
    ],
  },
  "tree": {
    props: [
      { name: "defaultExpandedIds", type: "string[]", description: "默认展开节点" },
      { name: "multiSelect", type: "boolean", description: "多选模式", defaultValue: "false" },
    ],
  },
  "tree-select": {
    props: [
      { name: "treeData", type: "TreeNode[]", description: "树数据" },
      { name: "placeholder", type: "string", description: "占位文本" },
    ],
  },
  "typography": {
    props: [
      { name: "type", type: "string", description: "排版类型" },
    ],
  },
  "video-player": {
    props: [
      { name: "src", type: "string", description: "视频地址" },
    ],
  },
  "watermark": {
    props: [
      { name: "content", type: "string", description: "水印内容" },
    ],
  },
  "citation-list": {
    props: [
      { name: "id", type: "string", description: "唯一标识符，用于 data-tool-ui-id 属性", required: true },
      { name: "citations", type: "SerializableCitation[]", description: "引用数据数组", required: true },
      { name: "variant", type: "'default' | 'inline' | 'stacked'", description: "展示变体", defaultValue: "'default'" },
      { name: "maxVisible", type: "number", description: "最大可见引用数；超出部分折叠" },
      { name: "className", type: "string", description: "附加样式类名" },
      { name: "onNavigate", type: "(href: string, citation: SerializableCitation) => void", description: "点击引用的导航回调" },
    ],
  },
}

export function getGalleryApiDoc(id: string): GalleryApiDoc | null {
  return API_REGISTRY[id] ?? null
}
