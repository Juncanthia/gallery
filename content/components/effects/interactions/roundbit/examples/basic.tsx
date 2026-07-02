import { RoundbitFrame } from "@/components/legacy-ui"

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-4">
      <RoundbitFrame className="w-64">
        <div className="flex h-32 items-center justify-center bg-primary/10 text-sm text-primary">
          圆角框架示例
        </div>
      </RoundbitFrame>
      <RoundbitFrame className="w-64">
        <div className="flex flex-col gap-2 p-4 text-sm">
          <h3 className="font-semibold">标题</h3>
          <p className="text-muted-foreground">这是一段放在 RoundbitFrame 内的描述文字。</p>
        </div>
      </RoundbitFrame>
    </div>
  )
}
