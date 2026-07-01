import { MorphingHeader, MorphingLogo, MorphingNav } from "@/components/effects/interactions/gooseui/morphing-header"

export default function Demo() {
  return (
    <div className="min-h-[200vh]">
      <MorphingHeader compactThreshold={100}>
        {({ isCompact }: { isCompact: boolean }) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MorphingLogo
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Logo"
                compactSize={24}
                fullSize={36}
                isCompact={isCompact}
              />
              {!isCompact && (
                <span className="text-lg font-semibold">MorphingHeader</span>
              )}
            </div>
            <MorphingNav isCompact={isCompact}>
              <a href="#features" className="hover:text-foreground/80">
                Features
              </a>
              <a href="#docs" className="hover:text-foreground/80">
                Docs
              </a>
              <a href="#about" className="hover:text-foreground/80">
                About
              </a>
            </MorphingNav>
          </div>
        )}
      </MorphingHeader>

      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">向下滚动查看变形效果</h1>
        <p className="text-muted-foreground">
          当页面滚动超过 100px 时，Header 会从完整模式平滑过渡到紧凑模式。Logo
          缩小、导航间距收紧，标题文字隐藏。
        </p>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 text-card-foreground"
            >
              <h3 className="font-semibold">Section {i + 1}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                这是用于演示滚动效果的占位内容块。
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
