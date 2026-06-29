import type { GalleryApiDoc } from "./api-types"

const API_REGISTRY: Record<string, GalleryApiDoc> = {
  button: {
    props: [
      {
        name: "variant",
        type: "'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link'",
        defaultValue: "'outlined'",
        description: "按钮视觉形态；替代 antd type，按新主流拆成 variant + color。",
      },
      {
        name: "color",
        type: "'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info'",
        defaultValue: "'default'",
        description: "语义色，和 variant 组合得到最终样式。",
      },
      {
        name: "size",
        type: "'small' | 'middle' | 'large'",
        defaultValue: "'middle'",
        description: "按钮尺寸。",
      },
      {
        name: "shape",
        type: "'default' | 'round' | 'circle' | 'square'",
        defaultValue: "'default'",
        description: "按钮形状；仅图标按钮会自动使用 square。",
      },
      {
        name: "block",
        type: "boolean",
        defaultValue: "false",
        description: "是否撑满父容器宽度。",
      },
      {
        name: "ghost",
        type: "boolean",
        defaultValue: "false",
        description: "幽灵按钮，仅对 solid、outlined、dashed、filled 生效。",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "进入加载态，禁用点击并展示 loading 图标。",
      },
      {
        name: "loadingText",
        type: "React.ReactNode",
        description: "加载态替换文案。",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        description: "按钮图标。",
      },
      {
        name: "iconPlacement",
        type: "'start' | 'end'",
        defaultValue: "'start'",
        description: "图标位置。",
      },
      {
        name: "htmlType",
        type: "'button' | 'submit' | 'reset'",
        defaultValue: "'button'",
        description: "原生 button type。",
      },
      {
        name: "href",
        type: "string",
        description: "传入后渲染为链接按钮。",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "使用 Radix Slot，把按钮能力合成到子元素上。",
      },
    ],
    accessibility: [
      "loading 时会设置 aria-busy，并禁用交互。",
      "链接按钮禁用时会移除 href 并设置 aria-disabled。",
      "图标按钮需要调用侧传入可访问名称，例如 aria-label。",
    ],
  },
}

export function getGalleryApiDoc(id: string): GalleryApiDoc | null {
  return API_REGISTRY[id] ?? null
}
