import { useState } from "react"
import { Presence } from "@/components/general/dice/headless/presence"

export default function Demo() {
  const [present, setPresent] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted"
          onClick={() => setPresent((p) => !p)}
        >
          {present ? "卸载" : "挂载"}内容
        </button>
        <span className="text-sm text-muted-foreground">
          当前状态：{present ? "已挂载" : "已卸载"}
        </span>
      </div>

      <div className="rounded-md border bg-muted/50 p-4">
        <Presence present={present}>
          <div className="rounded bg-background px-4 py-3 text-sm shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            Presence 控制的内容区域。
            <br />
            切换开关查看挂载 / 卸载效果。
          </div>
        </Presence>
      </div>
    </div>
  )
}
