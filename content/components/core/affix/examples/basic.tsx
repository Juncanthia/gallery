import { Affix } from "@/components/core/affix"
import { Button } from "@/components/core/button"

export default function AffixBasicExample() {
  return (
    <div className="relative h-48 overflow-auto rounded border p-4">
      <div className="space-y-2">
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">滚动内容第 {i + 1} 行</p>
        ))}
      </div>
      <Affix offsetTop={10} target={() => document.querySelector(".rounded") as HTMLElement}>
        <Button color="primary" variant="solid" size="small">固钉按钮</Button>
      </Affix>
    </div>
  )
}
