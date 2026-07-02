import { FloatButtonBackTop } from "@/components/core/float-button"

export default function FloatButtonBackTopExample() {
  return (
    <div className="relative h-48 overflow-auto rounded border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            第 {i + 1} 行：滚动长内容以触发回到顶部按钮。
          </p>
        ))}
      </div>
      <FloatButtonBackTop className="sticky bottom-4 ml-auto" visibilityHeight={100} />
    </div>
  )
}
