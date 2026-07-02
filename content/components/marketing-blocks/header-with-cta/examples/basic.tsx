import { HeaderWithCta } from "@/components/marketing-blocks/header-with-cta"

export default function Demo() {
  return (
    <div className="min-h-[200vh]">
      <HeaderWithCta />

      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">HeaderWithCta 粘性头部演示</h1>
        <p className="text-muted-foreground">
          Header 固定在页面顶部，滚动时保持可见。包含品牌 Logo、导航链接和两个 CTA 按钮（登录 + 开始使用），移动端以汉堡菜单折叠。
        </p>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 text-card-foreground"
            >
              <h3 className="font-semibold">Section {i + 1}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                这是用于演示粘性头部滚动效果的占位内容块。向下滚动查看 Header 的背景模糊和粘性效果。
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
