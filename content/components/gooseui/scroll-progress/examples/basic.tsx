import { ScrollProgress } from "@/components/ui/scroll-progress"

export default function Demo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">默认（顶部，高度 3px）</p>
        <div className="h-24 overflow-y-auto rounded border p-4">
          <p className="text-sm">滚动此区域查看进度条...<br />（页面级滚动进度条在顶部）</p>
        </div>
      </div>
    </div>
  )
}
