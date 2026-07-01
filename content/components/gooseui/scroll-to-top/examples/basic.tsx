import { ScrollToTop } from "@/components/navigation/gooseui/scroll-to-top"

export default function Demo() {
  return (
    <div className="space-y-8">
      <ScrollToTop />
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          向下滚动页面，右下角会出现返回顶部的圆形按钮。
        </p>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="rounded border p-6">
            <h3 className="text-lg font-semibold mb-2">区块 {i + 1}</h3>
            <p className="text-sm text-muted-foreground">
              继续向下滚动以触发"返回顶部"按钮的显示。
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
