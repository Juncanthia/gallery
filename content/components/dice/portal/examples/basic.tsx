import { Portal } from "@/components/ui/portal"

export default function Demo() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          下方内容通过 Portal 被传送到 <code className="rounded bg-muted px-1 text-xs">document.body</code> 末尾渲染，
          但逻辑上仍属于当前 React 组件树。打开浏览器 DevTools 检查 DOM 结构可以看到实际渲染位置。
        </p>
      </div>
      <Portal>
        <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background px-4 py-3 text-sm shadow">
          Portal 内容 &mdash; 已传送至 document.body
        </div>
      </Portal>
    </div>
  )
}
