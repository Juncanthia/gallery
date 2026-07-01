import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"

export default function Demo() {
  return (
    <div className="h-96 overflow-y-auto rounded border">
      <div className="p-4 space-y-6">
        <p className="text-sm text-muted-foreground text-center py-8">
          向下滚动查看元素揭示动画效果 &darr;
        </p>
        <div className="h-16" />
        <RevealOnScroll direction="up">
          <div className="rounded bg-blue-500 p-6 text-white text-center font-medium">
            从下方滑入 (up)
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="down">
          <div className="rounded bg-green-500 p-6 text-white text-center font-medium">
            从上方滑入 (down)
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="left">
          <div className="rounded bg-purple-500 p-6 text-white text-center font-medium">
            从左侧滑入 (left)
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="right">
          <div className="rounded bg-orange-500 p-6 text-white text-center font-medium">
            从右侧滑入 (right)
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="fade">
          <div className="rounded bg-pink-500 p-6 text-white text-center font-medium">
            淡入 (fade)
          </div>
        </RevealOnScroll>
        <div className="h-16" />
        <p className="text-sm text-muted-foreground text-center py-4">
          所有元素均已展示
        </p>
      </div>
    </div>
  )
}
