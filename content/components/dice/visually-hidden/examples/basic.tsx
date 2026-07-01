import { VisuallyHidden } from "@/components/ui/visually-hidden"

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          这段文字后面有一段屏幕阅读器专属内容：
          <VisuallyHidden>（已选中 3 项，共 12 项）</VisuallyHidden>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-sm hover:bg-muted"
          aria-label="搜索"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <VisuallyHidden asChild>
          <span>当前搜索关键词：按钮组件</span>
        </VisuallyHidden>
      </div>
    </div>
  )
}
