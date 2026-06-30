import { DirectionProvider, useDirection } from "@/components/ui/direction"

function DirDisplay() {
  const dir = useDirection()
  return (
    <span className="rounded bg-muted px-2 py-1 font-mono text-sm">
      当前方向：{dir}
    </span>
  )
}

export default function DirectionBasicExample() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">LTR（默认）</p>
        <DirectionProvider dir="ltr">
          <div className="flex items-center gap-2 rounded border p-3">
            <span className="text-sm">→</span>
            <DirDisplay />
            <span className="text-sm">→</span>
          </div>
        </DirectionProvider>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">RTL</p>
        <DirectionProvider dir="rtl">
          <div className="flex items-center gap-2 rounded border p-3">
            <span className="text-sm">←</span>
            <DirDisplay />
            <span className="text-sm">←</span>
          </div>
        </DirectionProvider>
      </div>
    </div>
  )
}
