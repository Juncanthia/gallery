import { ScrollContainer } from "@/components/navigation/gooseui/scroll-container"

export default function Demo() {
  return (
    <div className="space-y-4">
      <ScrollContainer
        height={200}
        variant="default"
        className="rounded border p-4"
      >
        <div className="space-y-2">
          <h4 className="font-medium">默认滚动容器</h4>
          <p className="text-sm text-muted-foreground">
            ScrollContainer 使用现代 CSS scrollbar-color 属性定制滚动条样式，
            提供 default、minimal、primary 三种变体。支持 autoHide 悬停显隐和 forceVisible 强制显示。
          </p>
          <p className="text-sm text-muted-foreground">
            组件内部使用 scoped CSS 类名（React.useId），不会污染全局样式。
            滚动条在 hover 时颜色加深，提供清晰的交互反馈。
          </p>
          <p className="text-sm text-muted-foreground">
            向下滚动查看自定义滚动条效果。此组件适用于侧边栏、对话框内容区、
            代码面板等需要独立滚动区域的场景。
          </p>
        </div>
      </ScrollContainer>
    </div>
  )
}
